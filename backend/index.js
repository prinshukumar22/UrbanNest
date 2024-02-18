import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.CON_STRING)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started at 3000");
    });
  })
  .catch((err) => console.log(err));
