import express from "express";
import { handleUserAuth } from "../../controllers/auth/auth.controllers";

const router = express.Router();

// router.route("/signup").post(checkUserExistenceMiddleware, hashPassword, signUpUser);
// router.route("/login").post(validateUserExistenceMiddleware, verifyPasswordMiddleware, loginUser);

router.route("/login-user").post(handleUserAuth);

module.exports = router;
