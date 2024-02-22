import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const postSignup = (req, res, next) => {
  const { username, password, email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error("User Already Exists");
      }
      const hashPwd = bcrypt.hashSync(password, 12);
      const newUser = new User({ username, password: hashPwd, email });
      return newUser.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!" });
    })
    .catch((err) => {
      next(errorHandler(550, err.message));
    });
};
