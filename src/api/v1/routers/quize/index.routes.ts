import express from "express";
import {
	createQuiz,
	getQuizzesWithAttemptCount,
	getUnattemptedQuizzes
} from "../../controllers/quize/quize.controller";

const router = express.Router();

router.route("/create-quiz").post(createQuiz);

router.route("/get-created-quiz").get(getQuizzesWithAttemptCount);

module.exports = router;
