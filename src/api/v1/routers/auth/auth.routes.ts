import express from "express";
import { loginUser, signUpUser } from "../../controllers/auth/auth.controllers";


const router = express.Router();


router.route("/signup-user").post(signUpUser);
router.route("/login-user").post(loginUser);

module.exports = router;
