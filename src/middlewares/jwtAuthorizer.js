import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import { Logout } from "../resources/users/user-logout-model.js";
export const jwtAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    return next(
      new AppError("You are not logged In, Please login to continue...!", 401)
    );

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err)
      return next(
        new AppError(`Error while verifying the JWT: ${err.message}`, 401)
      );
    req.user = decode;
    const tokenStatus = await Logout.findOne({ userId: req.user.id, token });
    if (tokenStatus) {
      return next(
        new AppError("You were logged out, please login to continue..", 401)
      );
    } else {
      return next();
    }
  });
};
