const express = require("express");
const cors = require("cors");

require("dotenv-safe").config();
const db = require("./database/mongoConfig");

const userRoutes = require("./routes/userRoutes");
const postsRoutes = require("./routes/postsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/blogposts", userRoutes);
app.use("/blogposts", postsRoutes);

db.connect();

module.exports = app;
