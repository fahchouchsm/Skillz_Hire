const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        msg: "Pas de token, autorisation refusée",
        success: false,
        data: null,
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;
    req.userId = decoded.user.id;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({
      msg: "Token invalide",
      success: false,
      data: null,
    });
  }
};

module.exports = authMiddleware;
