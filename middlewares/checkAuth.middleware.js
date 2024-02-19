import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  console.log(req.headers);
  try {
    const token = req.headers.Authorization?.split(" ")[1] !== undefined ? req.headers.Authorization.split(" ")[1] : "";
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedToken);

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
      success: false,
    });
  }
};

export default checkAuth;
