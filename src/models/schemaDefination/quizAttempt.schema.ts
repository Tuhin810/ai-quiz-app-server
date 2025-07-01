import { Schema, Types } from "mongoose";
import { IQuizAttempt } from "../../types/interface/quizAttempt.interface";
import { GENERAL_SCHEMA_OPTIONS } from "../../constants/model/schemaOption";

const quizAttemptSchema: Schema<IQuizAttempt> = new Schema<IQuizAttempt>(
	{
		user_id: { type: Types.ObjectId, ref: "users", required: true },
		quiz_id: { type: Types.ObjectId, ref: "quizzes", required: true },
		score: { type: Number, default: 0 },
		is_submitted: { type: Boolean, default: false }
	},
	GENERAL_SCHEMA_OPTIONS
);

export default quizAttemptSchema;
