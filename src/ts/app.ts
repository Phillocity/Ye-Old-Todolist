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
  },
});

// List schema that contains one to many Tasks
const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [taskSchema],
});

const Task = mongoose.model("Task", taskSchema);
const List = mongoose.model("List", listSchema);

// Default Tasks made on new List
const defaultTask = [
  new Task({
    name: "Welcome to your new ToDo list!",
  }),
  new Task({
    name: "Hit the + button to add a new item.",
  }),
  new Task({
    name: "<-- Hit this to delete an item.",
  }),
];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../../public")));
app.listen(port);

//Homepage
app.get("/", (req: Request, res: Response) => {
  Task.find({}, (err: any, tasks: any) => {
    if (err) {
      console.log(err);
    } else {
      const date = dateFormat.getDate();
      const today = dateFormat.getDay();
      const passedData = {
        jsListName: "Normal",
        jsDate: date,
        jsDay: today,
        list: tasks,
      };
      //if there is no tasks use the defaultTask
      if (tasks.length === 0) {
        Task.insertMany(defaultTask).then(() => {
          res.render("list", passedData);
        });
      } else {
        res.render("list", passedData);
      }
    }
  });
});

app.post("/", (req: Request, res: Response) => {
  const task: String = req.body.task;
  const listName: String = req.body.list;
  if (task.length === 0) {
    res.redirect("/");
    return;
  }

  const newTask = new Task({
    name: task,
  });

  // if listName is Normal, append to Normal list
  if (listName === "Normal") {
    newTask.save().then(() => {
      res.redirect("/");
    });
  } else {
    List.findOne({ name: listName }, (err: any, foundList: any) => {
      if (!err) {
        foundList.items.push(newTask);
        foundList.save().then(() => {
          res.redirect("/" + listName);
        });
      } else {
        console.log(err);
      }
    });
  }
});

app.post("/delete", (req: Request, res: Response) => {
  const checkedId: String = req.body.checkbox;
  const listName: String = req.body.listname;

  if (listName === "Normal") {
    Task.findByIdAndRemove(checkedId, (err: any) => {
      err ? console.log(err) : res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedId } } },
      (err: any) => {
        err ? console.log(err) : res.redirect("/" + listName);
      }
    );
  }
});

app.get("/:customURL", (req: Request, res: Response) => {
  const customURL = lodash.kebabCase(lodash.lowerCase(req.params.customURL));
  const date = dateFormat.getDate();
  const today = dateFormat.getDay();

  List.findOne({ name: customURL }, (err: any, list: any) => {
    if (err) return console.log(err);
    if (!list) {
      const newList = new List({
        name: customURL,
        items: defaultTask,
      });
      newList.save().then(() => res.redirect("/" + customURL));
    } else {
      res.render("list", {
        jsListName: list.name,
        jsDate: date,
        jsDay: today,
        list: list.items,
      });
    }
  });
});
