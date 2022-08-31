import express, { Request, Response } from "express";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as dateFormat from "./date.js";
import mongoose from "mongoose";
import lodash from "lodash";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __password = process.env.MONGOPASS;
const database = "todoDB";

const app: express.Application = express();
const port: any = process.env.PORT || 8080;
mongoose.connect(
  `mongodb+srv://shushyy:${__password}@cluster0.szrpyuj.mongodb.net/${database}?retryWrites=true&w=majority`
);

// Task schema
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
});

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [taskSchema]
})

const Task = mongoose.model("Task", taskSchema);
const List = mongoose.model("List", listSchema);


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../../public")));
app.listen(port);

app.get("/", (req: Request, res: Response) => {
  Task.find({}, (err: any, tasks: any) => {
    if (err) {
      console.log(err);
    } else {
      const date = dateFormat.getDate();
      const today = dateFormat.getDay();
      res.render("list", { jsDate: date, jsDay: today, list: tasks });
    }
  });
});

app.post("/", (req: Request, res: Response) => {
  const task: String = req.body.task;
  if (task !== null && task !== "") {
    const newTask = new Task({
      name: task,
    });
    newTask.save();
    res.redirect("/");
  }
});

app.post("/delete", (req: Request, res: Response) => {
  const checkedId: String = req.body.checkbox;
  Task.findByIdAndRemove(checkedId, (err: any) => {
    err ? console.log(err) : res.redirect("/");
  });
});

app.get("/:customURL", (req: Request, res: Response) => {
  const customURL = req.params.customURL;

  const list = new List({
    name: customURL,
    items: []
  })
});
