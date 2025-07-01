import express from "express";
import { addMultipleQuestionsToQuiz, addQuestionToQuiz } from "../../controllers/questions/question.controller";

const router = express.Router();

router.route("/add-question").post(addQuestionToQuiz);

router.route("/add-question-bulk").post(addMultipleQuestionsToQuiz);

module.exports = router;
