const jwt = require("jsonwebtoken");

function authMiddleware(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "super-secret-key");
    request.userId = payload.userId;
    return next();
  } catch (error) {
    return response.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
