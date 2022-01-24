const jwt = require("jsonwebtoken");

exports.checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token não encontrado!",
    });
  }

  const SECRET = process.env.SECRET;

  jwt.verify(token, SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({
        message: "Token expirado ou inválido!",
      });
    }
    req.locals = {
      payload,
    };
    next();
  });
};
