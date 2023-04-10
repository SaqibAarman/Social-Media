import express from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimeLinePosts,
} from "../Controllers/PostController.js";
const router = express.Router();

router.post("/create", createPost);
router.get("/:id", getPost);
router.put("/update/:id", updatePost);
router.delete("/delete/:id", deletePost);
router.put("/:id/like", likePost);

router.get("/:id/timeline", getTimeLinePosts);

export default router;
