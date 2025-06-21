const express = require("express")
const app = express();
app.use(express.json());
const { UserModel, TodoModel } = require("Database/db.js");
app.post('/signup', async function(req, res) {

    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;

    await UserModel.insert({
        email: email,

        password: password,
        name: name
    })
});
app.post('/signin', function(req, res) {

});
app.post('/todo', function(req, res) {

});
app.post('/todos', function(req, res) {

});

app.listen(3000);