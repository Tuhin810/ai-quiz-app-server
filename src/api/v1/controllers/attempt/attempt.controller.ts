import { Request, Response } from "express";
import QuizModel from "../../../../models/quiz.model";
import QuestionModel from "../../../../models/question.model";
import OptionModel from "../../../../models/option.model";
import { MESSAGE } from "../../../../constants/message";
import UserQuizAttemptModel from "../../../../models/userAttempt.model";

export const getQuizForAttempt = async (req: Request, res: Response) => {
	try {
		const { quizId, userId } = req.query;

		// Check if the user has already attempted the quiz
		const previousAttempt = await UserQuizAttemptModel.findOne({
			user_id: userId,
			quiz_id: quizId
		});

		if (previousAttempt) {
			return res.status(200).json({
				message: "You've already attempted this quiz.",
				attempted: true,
				score: previousAttempt.score
			});
		}

		// Fetch the quiz
		const quiz = await QuizModel.findById(quizId);
		if (!quiz) {
			return res.status(404).json({ message: "Quiz not found." });
		}

		// Fetch questions
		const questions = await QuestionModel.find({ quiz_id: quizId });

		// Fetch options for each question (but hide is_correct)
		const questionsWithOptions = await Promise.all(
			questions.map(async (q) => {
				const options = await OptionModel.find({ question_id: q._id }).select("-is_correct");
				return {
					question_id: q._id,
					text: q.text,
					options: options.map((opt) => ({
						option_id: opt._id,
						text: opt.text
					}))
				};
			})
		);

		return res.status(200).json({
			message: MESSAGE.get.succ,
			quiz: {
				_id: quiz._id,
				title: quiz.title,
				description: quiz.description
			},
			questions: questionsWithOptions
		});
	} catch (error) {
		console.error("Error fetching quiz attempt:", error);
		return res.status(500).json({
			message: MESSAGE.get.fail,
			error
		});
	}
};

export const submitQuiz = async (req: Request, res: Response) => {
	try {
		const { quizId, userId } = req.query;
		const { answers } = req.body;

		if (!Array.isArray(answers) || answers.length === 0) {
			return res.status(400).json({ message: "Answers are required." });
		}

		// 🚫 Check for existing submission
		const existing = await UserQuizAttemptModel.findOne({
			user_id: userId,
			quiz_id: quizId
		});

		if (existing) {
			return res.status(400).json({
				message: "You have already submitted this quiz.",
				score: existing.score
			});
		}

		// ✅ Fetch correct answers for each question
		const questionIds = answers.map((a) => a.question_id);
		const questions = await QuestionModel.find({ _id: { $in: questionIds }, quiz_id: quizId });

		if (questions.length !== answers.length) {
			return res.status(400).json({ message: "Some questions are invalid for this quiz." });
		}

		let score = 0;
		const answersWithCheck = [];

		for (const ans of answers) {
			const correctOption = await OptionModel.findOne({
				question_id: ans.question_id,
				is_correct: true
			});

			const isCorrect = correctOption?._id.toString() === ans.selected_option_id;

			if (isCorrect) score++;

			answersWithCheck.push({
				question_id: ans.question_id,
				selected_option_id: ans.selected_option_id,
				is_correct: isCorrect
			});
		}

		// ✅ Save the attempt
		await new UserQuizAttemptModel({
			user_id: userId,
			quiz_id: quizId,
			answers: answersWithCheck,
			score,
			attemptedAt: new Date()
		}).save();

		return res.status(200).json({
			message: "Quiz submitted successfully",
			score,
			total: answers.length
		});
	} catch (error) {
		console.error("Error submitting quiz:", error);
		return res.status(500).json({
			message: MESSAGE.post.fail,
			error
		});
	}
};

export const getAttemptedQuizzes = async (req: Request, res: Response) => {
	try {
		const { userId } = req.query;

		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}

		const attempts: any = await UserQuizAttemptModel.find({ user_id: userId })
			.populate({
				path: "quiz_id",
				model: QuizModel,
				select: "title description"
			})
			.sort({ attemptedAt: -1 });

		const attemptedQuizzes = attempts.map((attempt: any) => ({
			quizId: attempt.quiz_id._id,
			title: attempt.quiz_id.title,
			description: attempt.quiz_id.description,
			score: attempt.score,
			totalQuestions: attempt.answers.length,
			attemptedAt: attempt.attemptedAt
		}));

		return res.status(200).json({
			message: MESSAGE.get.succ,
			attemptedQuizzes
		});
	} catch (error) {
		console.error("Error fetching attempted quizzes:", error);
		return res.status(500).json({
			message: MESSAGE.get.fail,
			error
		});
	}
};
