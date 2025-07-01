import { model } from "mongoose";
import quizSchema from "./schemaDefination/quiz.schema";
import { IQuiz } from "../types/interface/quize.interface";

const QuizModel = model<IQuiz>("quizzes", quizSchema);

export default QuizModel;
