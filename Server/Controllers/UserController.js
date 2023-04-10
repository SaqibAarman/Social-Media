import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    let users = await UserModel.find();

    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get A User
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No Such User Found!!!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update User
export const updateUser = async (req, res) => {
  const id = req.params.id;

  const { _id, password } = req.body;

  console.log(_id, "UPDATE");

  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const token = jwt.sign(
        { userName: user.userName, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1hr" }
      );

      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied!!! You Can Only Update Your Profile...");
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);

      res.status(200).json("User Deleted SuccessFully.");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied!!! You Can Only Delete Your Profile...");
  }
};

// FOLLOW A USER
export const followUser = async (req, res) => {
  const id = req.params.id;

  const { _id } = req.body;
  //console.log(id, '===',_id);

  if (_id == id) {
    res.status(403).json("Action ForBidden.");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User Followed!");
      } else {
        res.status(403).json("User Is Already Followed By You");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// UN-FOLLOW USER
export const unFollowUser = async (req, res) => {
  const id = req.params.id;

  const { _id } = req.body;
  //console.log(id, '===',_id);

  if (_id === id) {
    res.status(403).json("Action ForBidden.");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (followUser.followers.includes(_id)) {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User UnFollowed!");
      } else {
        res.status(403).json("User Is Not Followed By You");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
