const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel, TodoModel } = require("/Users/anujdamani/Desktop/100xdevs/Database/db.js");

const app = express();
const JWT_SECRET = "shreehari";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

app.use(express.json());


app.post('/signup', async function(req, res) {
    const { name, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);

    try {
        await UserModel.create({ name, hashedPassword, email });
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
            const token = jwt.sign({ userId: user._id }, JWT_SECRET);

            res.json({ message: "You are signed in. Enjoy!", token });
        } else {
            res.status(403).json({ message: "Incorrect credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Signin failed" });
    }
});


app.post('/todo', auth, async function(req, res) {
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

app.delete('/todo/:id', auth, async function(req, res) {
    const todoId = req.params.id;

    try {
        const deleted = await TodoModel.findOneAndDelete({ _id: todoId, userId: req.userId });

        if (!deleted) {
            return res.status(404).json({ message: "Todo not found or unauthorized" });
        }

        res.json({ message: "Todo deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete todo" });
    }
});



function auth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.userId = decodedData.userId;
        next(); // important fix
    } catch (err) {
        console.error("Invalid token", err);
        res.status(401).json({ message: "Invalid token" });
    }
}


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});