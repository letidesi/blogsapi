const Posts = require("../models/Posts");
const mongoose = require("mongoose");
const postService = require("../service/postService");

const createPosts = async (req, res, next) => {
  try {
    const savedPost = await postService.createPost(req.body);
    return res.status(201).json(savedPost);
  } catch (error) {
    return next(error);
  }
};

const listPosts = async (req, res, next) => {
  try {
    const postsFound = await postService.listPosts();

    return res.status(200).json(postsFound);
  } catch (error) {
    return next(error);
  }
};

const listPostById = async (req, res, next) => {
  try {
    const idReq = req.params.id;
    const postFound = await postService.listPostById(idReq);

    return res.status(200).json(postFound);
  } catch (error) {
    return next(error);
  }
};

const updatePost = async (req, res, next) => {
  const postId = req.params.id;
  const authorizationId = req.locals.payload.id;
  try {
    const postSaved = await postService.updatePost(
      req.body,
      postId,
      authorizationId
    );

    res.status(200).json(postSaved);
  } catch (error) {
    return next(error);
  }
};

const searchPostByTitleOrContent = async (req, res, next) => {
  try {
    const query = req.query.q;
    const postsFound = await postService.searchByTitleOrContent(query);

    res.status(200).json(postsFound);
  } catch (error) {
    return next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    await postService.deletePost(req.params.id);

    res.status(204).json();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPosts,
  listPosts,
  listPostById,
  updatePost,
  searchPostByTitleOrContent,
  deletePost,
};
