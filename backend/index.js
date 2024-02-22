import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userAuth from "./routes/authRoute.js";

const app = express();

//! for parsing json data
app.use(express.json());

//! for handling authorisation related routes
app.use("/api/auth", userAuth);

//! for error handling
app.use((err, req, res, next) => {
  console.log("Error ke andar");
  const statusCode = err.statusCode || 500;
  const msg = err.message || "Internal server error";
  res.status(statusCode).json({
    message: msg,
    status: statusCode,
    success: false,
  });
});

//! connecting to database
mongoose
  .connect(process.env.CON_STRING)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started at 3000");
    });
  })
  .catch((err) => console.log(err));
