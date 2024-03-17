import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

import userAuth from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import listingRoute from "./routes/listingRoute.js";

const __dirname = path.resolve();
const app = express();

//! for parsing json data
app.use(express.json());

//! for handling cookies
app.use(cookieParser());

//! handling CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorisation");
  next();
});

//! for handling authorisation related routes
app.use("/api/auth", userAuth);

//! for handling user related routes
app.use("/api/user", userRoute);

//! for handling listing related routes
app.use("/api/listing", listingRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

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
