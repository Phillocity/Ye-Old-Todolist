import express, { Request, Response } from 'express';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port)

app.get('/', (req: Request, res: Response) => {
  const now: Date = new Date();
  const hour: Number = now.getHours();
  const minute: Number = now.getMinutes();
  const second: Number = now.getSeconds();
  res.render("list", { jsHour:  hour, jsMinute: minute, jsSecond: second });
})
