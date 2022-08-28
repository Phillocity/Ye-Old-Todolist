import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import * as dateFormat from "./date.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 8080;
const taskList = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.listen(port);
app.get("/", (req, res) => {
    const date = dateFormat.getDate();
    const today = dateFormat.getDay();
    res.render("list", { jsDate: date, jsDay: today, list: taskList });
});
app.post("/", (req, res) => {
    const task = req.body.task;
    if (task !== null && task !== "") {
        taskList.push(task);
        res.redirect("/");
    }
});
