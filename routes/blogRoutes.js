import express from "express";

import { allBlogs, createBlogForm, createBlog, deleteBlog, updateBlog, updateBlogForm, getBlog } from '../controllers/_blogs.js';

const router = express.Router();

router.get("/", allBlogs);
router.get("/blog/:id", getBlog);
// forms
router.get("/create", createBlogForm);
router.get("/blog/update/:id", updateBlogForm);

// actions
router.post("/blog/create", createBlog);
router.post("/blog/update/:id", updateBlog);
router.get("/blog/delete/:id", deleteBlog);

export default router;
