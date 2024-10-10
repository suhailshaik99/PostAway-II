import express from "express";
import UserController from "./users-controller.js";
import { jwtAuth } from "../../middlewares/jwtAuthorizer.js";

const router = express.Router();

router.post("/logout-all-devices");
router.post("/signin", UserController.userSignIn);
router.post("/signup", UserController.userSignUp);
router.post("/logout", jwtAuth, UserController.logoutUser);
router.get("/get-all-details", jwtAuth, UserController.getAllUsers);
router.get("/get-details/:userId", jwtAuth, UserController.getUserById);
router.put("/update-details/:userId", jwtAuth, UserController.updateUser);

export { router };
