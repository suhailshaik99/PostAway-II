import express from "express";
import UserController from "./users-controller.js";
import { jwtAuth } from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();
router.get("/get-all-details", jwtAuth, UserController.getAllUsers);
router.post("/signin", UserController.userSignIn);
router.post("/signup", UserController.userSignUp);
router.post("/logout", jwtAuth, UserController.logoutUser);
router.post("/logout-all-devices");
router.get("/get-details/:userId", jwtAuth, UserController.getUser);
router.put("/update-details/:userId", jwtAuth, UserController.updateUser);

export { router };
