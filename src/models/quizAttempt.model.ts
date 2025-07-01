import { model } from "mongoose";
import quizAttemptSchema from "./schemaDefination/quizAttempt.schema";
import { IQuizAttempt } from "../types/interface/quizAttempt.interface";

const QuizAttemptModel = model<IQuizAttempt>("quiz_attempts", quizAttemptSchema);

export default QuizAttemptModel;
