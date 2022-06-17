import express from "express";
import { engine } from 'express-handlebars';
import morgan from "morgan";
import session from 'express-session';

import dbPromise from "./db/config.js";
import blogRoutes from "./routes/blogRoutes.js";

const app = express();

// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use("/", blogRoutes);

const setup = async () => {
  const db = await dbPromise;
  await db.migrate();
  app.listen(5000, () => {
    console.log("Listening on port 5000");
  });
};

setup();
