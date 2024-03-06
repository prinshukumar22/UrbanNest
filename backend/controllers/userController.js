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
      //console.log(user);
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
      const { password, _id, ...rest } = updatedUser._doc;
      res.status(201).json({
        message: "User updated successfully",
        id: _id,
        success: true,
        ...rest,
      });
    })
    .catch((err) => {
      next(errorHandler(550, err.message));
    });
};

export const deleteUser = (req, res, next) => {
  if (req.user.userId !== req.params.userId)
    return next(errorHandler(401, "You can only update your profile"));

  User.deleteOne({ _id: req.user.userId })
    .then((result) => {
      if (result.deletedCount === 0) {
        throw new Error("User not found");
      }

      res.cookie("access_token", "", { maxAge: -1 }).status(200).json({
        message: "User deleted successfully",
        success: true,
      });
    })
    .catch((err) => {
      next(errorHandler(550, err.message));
    });
};
