import { model } from "mongoose";
import attemptAnswerSchema from "./schemaDefination/attemptAnswer.schema";
import { IAttemptAnswer } from "../types/interface/attemptAnswer.interface";

const AttemptAnswerModel = model<IAttemptAnswer>("attempt_answers", attemptAnswerSchema);

export default AttemptAnswerModel;
