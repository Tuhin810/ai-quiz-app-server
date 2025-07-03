import { Request, Response } from "express";
import QuizModel from "../../../../models/quiz.model";
import { MESSAGE } from "../../../../constants/message";
import UserQuizAttemptModel from "../../../../models/userAttempt.model";
import QuestionModel from "../../../../models/question.model";

// Create a new quiz (Admin only)
export const createQuiz = async (req: Request, res: Response) => {
	try {
		const { userId, title, description, tags } = req.body;

		if (!title) {
			return res.status(400).json({
				message: "Title is required."
			});
		}

		const newQuiz = await new QuizModel({
			title,
			description,
			tags,
			created_by: userId
		}).save();

		return res.status(200).json({
			message: MESSAGE.post.succ,
			result: newQuiz
		});
	} catch (error) {
		console.error("Error while creating quiz:", error);
		return res.status(400).json({
			message: MESSAGE.post.fail,
			error
		});
	}
};

export const getUnattemptedQuizzes = async (req: Request, res: Response) => {
	try {
		const { userId } = req.query;

		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}

		// 🧠 Step 1: Get attempted quiz IDs
		const attempts = await UserQuizAttemptModel.find({ user_id: userId }).select("quiz_id");
		const attemptedQuizIds = attempts.map((a) => a.quiz_id.toString());

		// 📦 Step 2: Get quizzes NOT attempted
		const unattemptedQuizzes = await QuizModel.find({
			_id: { $nin: attemptedQuizIds }
		}).select("title description tags createdAt");

		// 📚 Step 3: For each unattempted quiz, count the questions
		const quizzesWithQuestionCount = await Promise.all(
			unattemptedQuizzes.map(async (quiz) => {
				const questionCount = await QuestionModel.countDocuments({ quiz_id: quiz._id });
				return {
					quiz,
					questionCount
				};
			})
		);

		return res.status(200).json({
			message: MESSAGE.get.succ,
			result: quizzesWithQuestionCount
		});
	} catch (error) {
		console.error("Error fetching unattempted quizzes:", error);
		return res.status(500).json({
			message: MESSAGE.get.fail,
			error
		});
	}
};

export const getQuizzesWithAttemptCount = async (req: Request, res: Response) => {
	try {
		const { userId } = req.query;

		const quizzes = await QuizModel.find({ created_by: userId }).lean();

		if (!quizzes.length) {
			return res.status(200).json({
				message: "No quizzes created by this admin yet.",
				data: []
			});
		}

		// Step 2: Get attempt count for each quiz
		const attemptStats = await UserQuizAttemptModel.aggregate([
			{
				$match: {
					quiz_id: { $in: quizzes.map((q) => q._id) }
				}
			},
			{
				$group: {
					_id: "$quiz_id",
					attemptCount: { $sum: 1 }
				}
			}
		]);

		// Step 3: Map quiz + count
		const result = quizzes.map((quiz) => {
			const stat = attemptStats.find((s) => s._id.toString() === quiz._id.toString());
			return {
				quizId: quiz._id,
				title: quiz.title,
				description: quiz.description,
				tags: quiz.tags,
				attemptCount: stat?.attemptCount || 0
			};
		});

		return res.status(200).json({
			message: MESSAGE.get.succ,
			data: result
		});
	} catch (error) {
		console.error("Error fetching quiz stats:", error);
		return res.status(500).json({
			message: MESSAGE.get.fail,
			error
		});
	}
};
