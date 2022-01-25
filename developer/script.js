const busca = require("../src/controller/postsController")
const db = require("../src/database/mongoConfig");

require('dotenv-safe').config()

const script = async () => {
    await db.connect()
    busca.searchPostByTitleOrContent()
}

script()