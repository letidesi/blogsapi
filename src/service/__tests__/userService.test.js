require("dotenv-safe").config();
const mongoose = require("mongoose");
const db = require("../../database/mongoConfig");
const ConflictException = require("../../exception/ConflictException");
const User = require("../../models/Users");
const userService = require("../userService");

describe("User service", () => {
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
      userService.isRequireBody();
    }).toThrowErrorMatchingSnapshot();
  });

  test("should create user", async () => {
    const user = setupCreateUser();

    const result = await userService.createUser(user);

    expect(result).not.toBe(null);
  });

  test("should validate email and return ", () => {
    const email = "seil@gmail.com";

    const result = userService.isValidationEmail(email);

    expect(result).toBe(email);
  });

  test("should validate password and return ", () => {
    const password = "1245ghuy";

    const result = userService.isValidationPassword(password);

    expect(result).toBe(password);
  });

  test("should be conflit user ", async () => {
    const user = await setupCreateUser().save();

    async function result() {
      await userService.conflictUser(user.email);
    }

    expect().toBeAsyncThrow(result);
  });
  test('should found user by id', async () => {
      const user = await setupCreateUser().save()

      const result = await userService.listUserById(user._id)

      
      expect(result.email).toEqual(user.email)
      expect(result._id).toEqual(user._id)
  });
});

const setupCreateUser = () => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: "out@gmail.com",
    password: "123658",
    displayName: "Eduarda Dias",
    image: "iieep",
  });
  return user;
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
