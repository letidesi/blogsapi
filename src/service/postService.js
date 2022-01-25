const mongoose = require("mongoose");
const PostSchema = require("../models/Posts");
const BadRequestException = require("../exception/BadRequestException");
const PostNotFoundException = require("../exception/PostNotFoundException");
const UnauthorizedException = require("../exception/UnauthorizedExeption");

const isEmpty = (value) => !value || value.trim() === "";

const isRequireBody = (body) => {
  const { title, content } = body;
  if (isEmpty(title)) throw new BadRequestException('"title" is required.');

  if (isEmpty(content)) throw new BadRequestException('"content" is required.');
  return body;
};

const userUnauthorized = (authorizationId, userId) => {
  if (authorizationId != userId)
    throw new UnauthorizedException("Usuário não autorizado.");
};

const createPost = async (body) => {
  const { title, content, userId } = isRequireBody(body);
  const newPost = new PostSchema({
    _id: mongoose.Types.ObjectId(),
    userId,
    title,
    content,
  });

  const savedPost = await newPost.save();

  return {
    title,
    content,
    userId: savedPost.userId,
  };
};

const listPosts = async () => {
  const postsFound = await PostSchema.find().populate("userId");

  return postsFound.map((post) => {
    const { published, updated, title, content } = post;
    const { _id: id, displayName, email, image } = post.userId;

    return {
      id: post._id,
      published,
      updated,
      title,
      content,
      user: {
        id,
        displayName,
        email,
        image,
      },
    };
  });
};

const findById = async (postId) => {
  try {
    const postFound = await PostSchema.findById(postId).populate("userId");
    if (postFound == null) throw new PostNotFoundException();
    return postFound;
  } catch (error) {
    throw new PostNotFoundException("Post não existe.");
  }
};

const listPostById = async (postId) => {
  const postFound = await findById(postId);

  const { published, updated, title, content } = postFound;
  const { _id: userId, displayName, email, image } = postFound.userId;

  return {
    id: postId,
    published,
    updated,
    title,
    content,
    user: {
      id: userId,
      displayName,
      email,
      image,
    },
  };
};

const updatePost = async (body, postId, authorizationId) => {
  const { title, content } = isRequireBody(body);

  const postFound = await findById(postId);
  const { _id: userId } = postFound.userId;

  postFound.title = title;
  postFound.content = content;

  userUnauthorized(authorizationId, userId);

  await postFound.save();

  return {
    title,
    content,
    userId,
  };
};

const searchByTitleOrContent = async (query) => {
  const searchByProperty = (property) => new RegExp(query, "ig").test(property);
  const postsFound = await listPosts();
  return postsFound.filter(
    (post) => searchByProperty(post.title) || searchByProperty(post.content)
  );
};

const deletePost = async (postId, authorizationId) => {
  const postFound = await findById(postId);

  userUnauthorized(authorizationId, postFound.userId);

  await postFound.delete();
};

module.exports = {
  createPost,
  listPosts,
  listPostById,
  updatePost,
  searchByTitleOrContent,
  deletePost,
};
