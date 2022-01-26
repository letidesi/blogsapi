require("dotenv-safe").config();
const mongoose = require("mongoose");
const db = require("../../database/mongoConfig");
const User = require("../../models/Users");
const Post = require("../../models/Posts");
const postService = require("../postService");


describe("Post service", () => {
  beforeAll(async () => {
    await db.connect();
  });
  afterAll(async () => {
    await setupDbDisconnect();
  });
  afterEach(async () => {
    await setupCollectionClean();
  });

  test("should returns throw ", () => {
    expect(() => {
      postService.isRequireBody();
    }).toThrowErrorMatchingSnapshot();
  });

  test("should create post", async () => {
    const post = setupCreatePost();

    const result = await postService.createPost(post);

    expect(result).not.toBe(null);
  });

  test('should found post by id', async () => {
    const post = await setupCreatePost().save()

    const result = await postService.findById(post._id)

    expect(result._id).toEqual(post._id)
  });

  test('should user is not authorized ', async () => {
    const post = await setupCreatePost().save()
    
    expect(() => {
      postService.userUnauthorized(post);
    }).toThrowErrorMatchingSnapshot();
      
  });


});

const setupCreatePost = () => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    title: "O desafio",
    content: "Aprendendo testar ainda.",
    userId: new mongoose.Types.ObjectId(),
      displayName: "Eduarda Dias",
      email: "padrao@gmail.com",
      password: "123456",
      image: "iieep",
  });
  return post;
};

const setupDbDisconnect = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {}
};

const setupCollectionClean = async () => {
  try {
    await User.collection.drop();
  } catch (error) {}
};

expect.extend({
  toBeAsyncThrow(received) {
    try {
      received();
      return {
        message: () => `expected sucess`,
        pass: false,
      };
    } catch (error) {
      return {
        message: () => `expected sucess`,
        pass: true,
      };
    }
  },
});
