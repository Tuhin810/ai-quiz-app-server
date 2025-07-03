import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserModel from "../../../../models/user.model";
const JWT_SECRET = "HSIIJSN";

export const handleUserAuth = async (req: Request, res: Response) => {
	try {
		const { email, password, role } = req.body;

		if (!email || !password || role === undefined) {
			return res.status(400).json({
				message: "Missing required fields"
			});
		}

		const user = await UserModel.findOne({ email });

		if (user) {
			// 👉 Login Flow - plain password check
			if (user.password !== password) {
				return res.status(401).json({
					message: "Invalid credentials"
				});
			}

			const token = jwt.sign({ id: user._id }, JWT_SECRET, {
				expiresIn: "7d"
			});

			return res.status(200).json({
				message: "Login successful",
				token,
				result: user,
				isNewUser: false
			});
		} else {
			// 👉 Signup Flow
			const newUser = new UserModel({
				email,
				password,
				role
			});

			const savedUser = await newUser.save();

			const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
				expiresIn: "7d"
			});

			return res.status(201).json({
				message: "Signup successful",
				token,
				result: savedUser,
				isNewUser: true
			});
		}
	} catch (error) {
		console.error("Auth Error:", error);
		return res.status(500).json({
			message: "Authentication failed",
			error
		});
	}
};
