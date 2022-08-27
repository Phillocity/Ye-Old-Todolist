import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 8080;
const taskList = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port);
app.get("/", (req, res) => {
    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const today = now.toLocaleDateString("en-US", options);
    res.render("list", { jsDay: today, list: taskList });
});
app.post("/", (req, res) => {
    const task = req.body.task;
    if (task !== null && task !== "") {
        console.log(taskList);
        taskList.push(task);
        res.redirect("/");
    }
});
