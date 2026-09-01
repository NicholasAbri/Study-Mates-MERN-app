const jwt = require("jsonwebtoken");

require("dotenv").config();

const Authorization = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "You are not authenticated",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = Authorization;
