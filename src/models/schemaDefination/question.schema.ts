import { Schema, Types } from "mongoose";
import { IQuestion } from "../../types/interface/question.interface";
import { GENERAL_SCHEMA_OPTIONS } from "../../constants/model/schemaOption";
import SCHEMA_DEFINITION_PROPERTY from "../../constants/model/model.constant";

const questionSchema: Schema<IQuestion> = new Schema<IQuestion>(
	{
		quiz_id: { type: Types.ObjectId, ref: "quizzes", required: true },
		text: SCHEMA_DEFINITION_PROPERTY.optionalNullString
	},
	GENERAL_SCHEMA_OPTIONS
);

export default questionSchema;
