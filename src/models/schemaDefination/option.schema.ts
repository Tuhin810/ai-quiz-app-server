import { Schema, Types } from "mongoose";
import { IOption } from "../../types/interface/option.interface";
import { GENERAL_SCHEMA_OPTIONS } from "../../constants/model/schemaOption";
import SCHEMA_DEFINITION_PROPERTY from "../../constants/model/model.constant";

const optionSchema: Schema<IOption> = new Schema<IOption>(
	{
		question_id: { type: Types.ObjectId, ref: "questions", required: true },
		text: SCHEMA_DEFINITION_PROPERTY.requiredString,
		is_correct: { type: Boolean, required: true }
	},
	GENERAL_SCHEMA_OPTIONS
);

export default optionSchema;
