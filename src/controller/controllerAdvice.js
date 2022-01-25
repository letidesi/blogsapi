const BadRequestException = require("../exception/BadRequestException")
const PostNotFoundException = require("../exception/PostNotFoundException")

const controllerAdvice = (error, req, res, next) => {
    if(error instanceof BadRequestException) return res.status(400).json({ message: error.message })
    if(error instanceof PostNotFoundException) return res.status(404).json({message: error.message})
    res.status(500).json({message: error.message})
}

module.exports = controllerAdvice