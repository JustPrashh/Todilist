const express = require("express");
const BodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
const port = process.env.PORT || 3000 ;

app.set("view engine", "ejs");
app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
    .connect("mongodb+srv://admin-Prashant:admin-Prashant@cluster0.trqkrhz.mongodb.net/ToDoListDB", { useNewUrlParser: true })
    .then(() => console.log("Connected To DataBase..."))
    .catch((err) => console.log(err.message));

const List = mongoose.model(
    "List",
    new mongoose.Schema({
        Text: String,
    })
);

app.get("/", async (req, res) => {
    const Year = new Date().getFullYear();
    const Month = new Date().getMonth();
    const date = new Date().getDate();
    const DMY = `${date} - ${Month} - ${Year}`;

    try {
        const TodoList = await List.find();
        if (TodoList.length > 0) {
            res.render("index.ejs", {
                TodoList,
                DMY,
            });
        } else {
            res.render("index.ejs", {
                DMY,
            });
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/post",async (req, res) => {
    const NewItem = req.body.Activity;

    if (NewItem) {
        await List.create({
            Text: NewItem,
        }).catch((err) => console.log(err));
    }
    res.redirect("/");
});

app.post("/delete",async (req, res) => {
    const NewItem = req.body.checkbox;
    
    try{
        await List.findByIdAndRemove(NewItem)
        res.redirect("/");
    }
    catch(err){
        console.log(err);
        res.redirect("/");
    }

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
