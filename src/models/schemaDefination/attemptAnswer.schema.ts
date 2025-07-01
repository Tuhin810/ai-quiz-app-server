import { Schema, Types } from "mongoose";
import { IAttemptAnswer } from "../../types/interface/attemptAnswer.interface";
import { GENERAL_SCHEMA_OPTIONS } from "../../constants/model/schemaOption";

const attemptAnswerSchema: Schema<IAttemptAnswer> = new Schema<IAttemptAnswer>(
	{
		attempt_id: { type: Types.ObjectId, ref: "quiz_attempts", required: true },
		question_id: { type: Types.ObjectId, ref: "questions", required: true },
		selected_option: { type: Types.ObjectId, ref: "options", required: true },
		is_correct: { type: Boolean, required: true }
	},
	GENERAL_SCHEMA_OPTIONS
);

export default attemptAnswerSchema;
