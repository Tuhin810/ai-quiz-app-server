import { Model, FilterQuery } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

export const isDuplicateUserEmailService = async (userMOdel: Model<any>, email: string): Promise<boolean> => {
	try {
		const filter = { email };
		const emailInstance = await userMOdel.findOne(filter);

		if (emailInstance) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		throw err;
	}
};


export const hashPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	const encryptPassword = await bcrypt.hash(password, salt);

	return encryptPassword;
};

export const comparePassword = async (inputPassword: string, dbPassword: string): Promise<boolean> => {
	const compare = await bcrypt.compare(inputPassword, dbPassword);

	if (compare) return true;
	else return false;
};

export const generateJWT = async (jwtPayload: Record<string, unknown>): Promise<string> => {
	const jwtToken = jwt.sign(
		{
			...jwtPayload
		},
		process.env.JWT_KEY as Secret,
		{
			expiresIn: "1y"
		}
	);

	return jwtToken;
};

export const convertCaseInsensitiveForQuery = (value: string): Record<string, unknown> => {
	try {
		return { $regex: value, $options: "i" };
	} catch (error: any) {
		throw error;
	}
};

export const auth = {
	isDuplicateUserEmailService,
	hashPassword,
	comparePassword,
	generateJWT,
	convertCaseInsensitiveForQuery
};
