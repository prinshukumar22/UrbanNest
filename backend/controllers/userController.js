import User from "../model/user.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";

export const updateUser = (req, res, next) => {
  const { avatar, username, email, password } = req.body;
  if (req.user.userId !== req.params.userId)
    return next(errorHandler(401, "You can only update your profile"));

  let updatedUser;
  User.findOne({ _id: req.user.userId })
    .then((user) => {
      if (!user) {
        throw new Error("User Doesn't exists");
      }
      console.log(user);
      user.email = email.trim() === "" ? user.email : email;
      user.avatar = avatar.trim() === "" ? user.avatar : avatar;
      user.username =
        username.trim() === "" ? user.username : username.toLowerCase();
      if (password.trim() === "") {
        user.password = user.password;
      } else {
        const hashPwd = bcrypt.hashSync(password, 12);
        user.password = hashPwd;
      }
      updatedUser = user;
      return user.save();
    })
    .then((result) => {
      const { password, ...rest } = updatedUser._doc;
      res.status(201).json({
        message: "User updated successfully",
        success: true,
        ...rest,
      });
    })
    .catch((err) => {
      next(errorHandler(550, err.message));
    });
};
