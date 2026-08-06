import jwt from "jsonwebtoken";

const fetchUser = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    //checking is token exist
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // removing beares if present
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

      //verfying token
      const decoded = jwt.verify(token,process.env.JWT_SECRET);

      //storing decoded payload in request
      req.user = decoded;

      //moving to the next middleware
      next();
  } catch (error) {
     return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
export default fetchUser;