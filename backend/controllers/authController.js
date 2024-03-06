import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const postSignup = (req, res, next) => {
  const { username, password, email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error("Invalid Credentials");
      }
      const hashPwd = bcrypt.hashSync(password, 12);
      const newUser = new User({ username, password: hashPwd, email });
      return newUser.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", success: true });
    })
    .catch((err) => {
      next(errorHandler(550, err.message));
    });
};

export const postSignIn = (req, res, next) => {
  const { password, email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new Error("User doesn't exists");
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        throw new Error("Wrong Credentials!");
      }
      // Create token
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
      const { _id, username, avatar, email } = user;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 365 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          token,
          success: true,
          id: _id.toString(),
          username,
          avatar,
          email,
        });
    })
    .catch((err) => {
      next(errorHandler(550, err.message));
    });
};

export const googleSignIn = (req, res, next) => {
  const { email, name, photo } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const generatedPwd =
          Math.random().toString(36).slice(-8) +
          Math.random.toString(36).slice(-8);
        const hashPwd = bcrypt.hashSync(generatedPwd, 12);
        const newUser = new User({
          username:
            name.split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-4),
          email,
          password: hashPwd,
          avatar: photo,
        });
        return newUser.save();
      } else {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id.toString(),
          },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        const { _id, username, avatar, email } = user;
        res.cookie("access_token", token, { httpOnly: true }).status(201).json({
          token,
          success: true,
          id: _id.toString(),
          username,
          avatar,
          email,
        });
        return null;
      }
    })
    .then((user) => {
      if (user) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id.toString(),
          },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        const { _id, username, avatar, email } = user;
        res.cookie("access_token", token, { httpOnly: true }).status(201).json({
          token,
          success: true,
          id: _id.toString(),
          username,
          avatar,
          email,
        });
      }
    })
    .catch((err) => {
      next(errorHandler(550, err.message));
    });
};
