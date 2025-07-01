import { model } from "mongoose";
import questionSchema from "./schemaDefination/question.schema";
import { IQuestion } from "../types/interface/question.interface";

const QuestionModel = model<IQuestion>("questions", questionSchema);

export default QuestionModel;
