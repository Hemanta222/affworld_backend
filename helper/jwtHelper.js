const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const JWT_SECRET = process.env.TOKEN_KEY;

module.exports = {
  generateToken: (id) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { userId: id }, //payload
        JWT_SECRET,
        {
          // options
          expiresIn: "24h",
          issuer: "localhost",
          audience: id.toString(),
        },
        function (err, token) {
          if (!err) {
            return resolve(token);
          } else {
            return reject(false);
          }
        }
      );
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (req.method === "OPTIONS") {
      return next();
    }
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" "); // Bearer Token
    const token = bearerToken[1];
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      req.userId = payload.userId;
      next();
    });
  },
};
