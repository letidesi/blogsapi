const BadRequestException = require("../exception/BadRequestException")
const ConflictException = require("../exception/ConflictException")
const PostNotFoundException = require("../exception/PostNotFoundException")
const UnauthorizedException = require("../exception/UnauthorizedExeption")


const controllerAdvice = (error, req, res, next) => {
    if(error instanceof BadRequestException) return res.status(400).json({ message: error.message })
    if(error instanceof PostNotFoundException) return res.status(404).json({message: error.message})
    if(error instanceof UnauthorizedException) return res.status(401).json({message: error.message})
    if(error instanceof ConflictException) return res.status(409).json({message: error.message})
    
    res.status(500).json({message: error.message})
}

module.exports = controllerAdvice