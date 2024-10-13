import express from "express";
import { jwtAuth } from "../../middlewares/jwtAuthorizer.js";
import PasswordResetController from "./password-controller.js";
const router = express.Router();

router.post("/send", PasswordResetController.sendOtp);
router.post("/verify", PasswordResetController.verifyOtp);
router.post("/reset-password", jwtAuth, PasswordResetController.passwordReset);

export { router };
