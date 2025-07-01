import { model } from "mongoose";
import optionSchema from "./schemaDefination/option.schema";
import { IOption } from "../types/interface/option.interface";

const OptionModel = model<IOption>("options", optionSchema);

export default OptionModel;
