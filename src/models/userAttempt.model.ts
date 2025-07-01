import { Schema, model } from "mongoose";

const userQuizAttemptSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, required: true, ref: "users" },
	quiz_id: { type: Schema.Types.ObjectId, required: true, ref: "quizzes" },
	answers: [
		{
			question_id: { type: Schema.Types.ObjectId, required: true, ref: "questions" },
			selected_option_id: { type: Schema.Types.ObjectId, required: true, ref: "options" },
			is_correct: { type: Boolean, required: true }
		}
	],
	score: { type: Number, required: true },
	attemptedAt: { type: Date, default: Date.now }
});

const UserQuizAttemptModel = model("user_quiz_attempts", userQuizAttemptSchema);
export default UserQuizAttemptModel;
