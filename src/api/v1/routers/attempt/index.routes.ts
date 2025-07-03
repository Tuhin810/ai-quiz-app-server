import express from "express";
import { getAttemptedQuizzes, getQuizForAttempt, submitQuiz } from "../../controllers/attempt/attempt.controller";
import { getUnattemptedQuizzes } from "../../controllers/quize/quize.controller";

const router = express.Router();

router.route("/attempt-quiz").get(getQuizForAttempt);

router.route("/submit-quiz").post(submitQuiz);

router.route("/get-attempted-quizzes").get(getAttemptedQuizzes);

router.route("/get-unattempted-quiz").get(getUnattemptedQuizzes);

module.exports = router;
