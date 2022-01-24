const express = require("express");
const router = express.Router();
const { checkToken } = require("../middlewares/auth");
const postsController = require("../controller/postsController");


router.use(checkToken);
router.post("/post", postsController.createPosts);
router.get("/post", postsController.listPosts);
 router.get("/post/search?", postsController.searchPostByTitleOrContent); 
router.get("/post/:id", postsController.listPostById);
router.put("/post/:id", postsController.updatePost);
router.delete("/post/:id",  postsController.deletePost);


module.exports = router;
