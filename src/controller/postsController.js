const Posts = require("../models/Posts");
const mongoose = require("mongoose");

const createPosts = async (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({
      message: ' "title" is required.',
    });
  }

  if (!content) {
    return res.status(400).json({
      message: ' "content" is required.',
    });
  }

  try {
    const newPost = new Posts({
      _id: mongoose.Types.ObjectId(),
      userId: req.body.userId,
      title,
      content,
    });

    const savedPost = await newPost.save();

    return res.status(201).json({
      title,
      content,
      userId: savedPost.userId,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const listPosts = async (req, res) => {
  try {
    const postsFound = await Posts.find().populate("userId");

    const postsResponse = postsFound.map((post) => {
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
    return res.status(200).json(postsResponse);
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const listPostById = async (req, res) => {
  try {
    const idReq = req.params.id;
    const postFound = await Posts.findById(idReq).populate("userId");

    const { published, updated, title, content } = postFound;
    const { _id: id, displayName, email, image } = postFound.userId;

    return res.status(200).json({
      id: postFound._id,
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
    });
  } catch (e) {
    res.status(404).json({
      message: "Post não existe.",
    });
  }
};

const updatePost = async (req, res) => {
  const reqTitle = req.body.title;
  const reqContent = req.body.content;

  if (reqTitle === undefined) {
    return res.status(400).json({
      message: '"title" is required.',
    });
  }

  if (reqContent === undefined) {
    return res.status(400).json({
      message: '"content" is required.',
    });
  }
  try {
    const idReq = req.params.id;

    const postFound = await Posts.findById(idReq);

    if (postFound) {
      postFound.title = req.body.title || postFound.title;
      postFound.content = req.body.content || postFound.content;
    }

    if (req.locals.payload.id != postFound.userId) {
      return res.status(401).json({
        message: "Usuário não autorizado.",
      });
    }

    const postSaved = await postFound.save();
    const { title, content } = postSaved;
    const { _id: id } = postSaved.userId;
    return res.status(200).json({
      title,
      content,
      userId: id,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const searchPostByTitleOrContent = async (req, res) => {
  try {
    const query = req.query.q
    const searchByProperty = property =>  new RegExp(query, "ig").test(property)
    const postsFound = await Posts.find().populate("userId", "-password")
    const filterPosts = postsFound
    .filter(post => searchByProperty(post.title) || searchByProperty(post.content))

   res.status(200).json(filterPosts)
   
  } catch (e) {
    res.status(500).json({
      message: e.message
    })
  }
}


const deletePost = async (req, res) => {
  try {
    const postFound = await Posts.findById(req.params.id);

    if (req.locals.payload.id != postFound.userId) {
      return res.status(401).json({
        message: "Usuário não autorizado.",
      });
    }

    await postFound.delete();

    res.status(204).json();
  } catch (e) {
    res.status(500).json({
      message: "Usuário não existe",
    });
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
