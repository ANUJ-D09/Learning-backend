const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel, TodoModel } = require("/Users/anujdamani/Desktop/100xdevs/Database/db.js");

const app = express();
const JWT_SECRET = "shreehari";
const mongoose = require("mongoose");


app.use(express.json());


app.post('/signup', async function(req, res) {
    const { name, password, email } = req.body;

    try {
        await UserModel.create({ name, password, email });
        res.json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Signup failed" });
    }
});


app.post('/signin', async function(req, res) {
    const { password, email } = req.body;

    try {
        const user = await UserModel.findOne({ email, password });

        if (user) {
            const token = jwt.sign({ email: user.email }, JWT_SECRET);
            res.json({ message: "You are signed in. Enjoy!", token });
        } else {
            res.status(403).json({ message: "Incorrect credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Signin failed" });
    }
});


app.post('/todo', async function(req, res) {
    const { title, done } = req.body;
    try {
        await TodoModel.create({ title, done });
        res.json({ message: "todosucess" });
    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "creation failed" });
    }


});
app.get('/todo', async function(req, res) {
    const { title } = req.query;

    try {
        const foundtodo = await TodoModel.find({ title: new RegExp(title, 'i') });

        if (foundtodo.length > 0) {
            res.json({ todos: foundtodo });
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Search failed" });
    }
});

app.post('/updated', function(req, res) {
    res.json({ message: "TODO list retrieval not implemented yet" });
});
app.post('/delettodo', function(req, res) {

});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});