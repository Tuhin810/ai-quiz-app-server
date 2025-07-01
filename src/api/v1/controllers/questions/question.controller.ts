import { Request, Response } from "express";
import QuestionModel from "../../../../models/question.model";
import OptionModel from "../../../../models/option.model";
import { MESSAGE } from "../../../../constants/message";

export const addQuestionToQuiz = async (req: Request, res: Response) => {
	try {
		const { quizId } = req.query; // ✅ Fixed: using route param
		const { text, options, correctOptionIndex } = req.body;
		console.log(req.body);

		// ✅ Basic validation
		if (!text || !Array.isArray(options) || options.length < 2) {
			return res.status(400).json({
				message: "Question and at least 2 options are required."
			});
		}

		if (typeof correctOptionIndex !== "number" || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
			return res.status(400).json({
				message: "Invalid correctOptionIndex."
			});
		}

		// ✅ Create the question
		const question = await new QuestionModel({
			quiz_id: quizId,
			text
		}).save();

		// ✅ Create all options
		const optionPromises = options.map((opt: string, idx: number) => {
			return new OptionModel({
				question_id: question._id,
				text: opt,
				is_correct: idx === correctOptionIndex
			}).save();
		});

		const createdOptions = await Promise.all(optionPromises);

		return res.status(200).json({
			message: MESSAGE.post.succ,
			question,
			options: createdOptions
		});
	} catch (error) {
		console.error("Error adding question:", error);
		return res.status(500).json({
			message: MESSAGE.post.fail,
			error
		});
	}
};

export const addMultipleQuestionsToQuiz = async (req: Request, res: Response) => {
	try {
		const { quizId } = req.query; // use params, not query
		const { questions } = req.body;

		if (!Array.isArray(questions) || questions.length === 0) {
			return res.status(400).json({ message: "At least one question is required." });
		}

		// ✅ Filter valid questions first
		const validQuestions = questions.filter(
			(q) =>
				q.text &&
				Array.isArray(q.options) &&
				q.options.length >= 2 &&
				typeof q.correctOptionIndex === "number" &&
				q.correctOptionIndex >= 0 &&
				q.correctOptionIndex < q.options.length
		);

		if (validQuestions.length === 0) {
			return res.status(400).json({ message: "No valid questions to insert." });
		}

		// ✅ Create question docs in memory
		const questionDocs = validQuestions.map((q) => ({
			quiz_id: quizId,
			text: q.text
		}));

		// ✅ Bulk insert questions
		const insertedQuestions = await QuestionModel.insertMany(questionDocs);

		// ✅ Prepare all options in memory
		const allOptionDocs: any = [];

		insertedQuestions.forEach((question, idx) => {
			const qOptions = validQuestions[idx].options;
			const correctIndex = validQuestions[idx].correctOptionIndex;

			qOptions.forEach((opt: string, optIdx: number) => {
				allOptionDocs.push({
					question_id: question._id,
					text: opt,
					is_correct: optIdx === correctIndex
				});
			});
		});

		// ✅ Bulk insert options
		const insertedOptions = await OptionModel.insertMany(allOptionDocs);

		return res.status(200).json({
			message: MESSAGE.post.succ,
			count: insertedQuestions.length,
			questions: insertedQuestions,
			optionsCount: insertedOptions.length
		});
	} catch (error) {
		console.error("Error adding questions:", error);
		return res.status(500).json({
			message: MESSAGE.post.fail,
			error
		});
	}
};
