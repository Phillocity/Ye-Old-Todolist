import express, { Request, Response } from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port);

app.get("/", (req: Request, res: Response) => {
  const now: Date = new Date();
  let day: any = now.getDay();
  const hour: number = now.getHours();
  const minute: number = now.getMinutes();
  const second: number = now.getSeconds();

  switch (day) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
    default:
      console.log(`There was an issue with the day: ${day}`);
  }

  res.render("list", { jsHour: hour, jsMinute: minute, jsSecond: second, jsDay: day});
});
