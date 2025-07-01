import express from "express";
import { getAttemptedQuizzes, getQuizForAttempt, submitQuiz } from "../../controllers/attempt/attempt.controller";

const router = express.Router();

router.route("/attempt-quiz").post(getQuizForAttempt);

router.route("/submit-quiz").post(submitQuiz);

router.route("/get-attempted-quizzes").get(getAttemptedQuizzes);

module.exports = router;
