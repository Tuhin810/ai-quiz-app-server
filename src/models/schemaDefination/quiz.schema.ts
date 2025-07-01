import { Schema, Types } from "mongoose";
import { GENERAL_SCHEMA_OPTIONS } from "../../constants/model/schemaOption";
import SCHEMA_DEFINITION_PROPERTY from "../../constants/model/model.constant";
import { IQuiz } from "../../types/interface/quize.interface";

const quizSchema: Schema<IQuiz> = new Schema<IQuiz>(
	{
		title: SCHEMA_DEFINITION_PROPERTY.requiredString,
		description: SCHEMA_DEFINITION_PROPERTY.optionalNullString,
		created_by: { type: Types.ObjectId, ref: "users", required: true },
		tags: [{ type: String }],
		is_active: SCHEMA_DEFINITION_PROPERTY.optionalBoolean
	},
	GENERAL_SCHEMA_OPTIONS
);

export default quizSchema;
