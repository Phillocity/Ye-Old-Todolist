import express, { Request, Response } from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: express.Application = express();
const port: any = process.env.PORT || 8080;
const taskList: any[] = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port);

app.get("/", (req: Request, res: Response) => {
  const now: Date = new Date();
  const options: Object = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const today: String = now.toLocaleDateString("en-US", options);

  res.render("list", { jsDay: today, list: taskList });
});

app.post("/", (req: Request, res: Response) => {
  const task: String = req.body.task;
  if (task !== null && task !== "") {
    console.log(taskList);
    taskList.push(task);
    res.redirect("/");
  }
});
