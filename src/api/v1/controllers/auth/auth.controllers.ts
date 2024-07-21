import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../../../../models/user.model";
import { MESSAGE } from "../../../../constants/message";
import { JWT_SECRET } from "../../../../config/config";


export const signUpUser = async (req: Request, res: Response) => {
  try {
    const { full_name, age, phone, gender, address, password } = req.body;

    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        message: MESSAGE.post.sameEntry,
      });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({
          message: MESSAGE.post.fail,
          error: "Error hashing password",
        });
      } else {
        const newUser = await new UserModel({
          full_name,
          age,
          phone,
          gender,
          address,
          password: hash,
        }).save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '2 months' });

        return res.status(200).json({
          message: MESSAGE.post.succ,
          token,
          result: newUser,
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: MESSAGE.post.fail,
      error,
    });
  }
};


export const loginUser = async (req: Request, res: Response) => {
    try {
      const { phone, password } = req.body;
  
      // Check if user exists
      const userInstance = await UserModel.findOne({ phone });
      if (!userInstance) {
        return res.status(404).json({
          message: MESSAGE.post.fail,
        });
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, userInstance.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: MESSAGE.post.fail,
        });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: userInstance._id }, JWT_SECRET, { expiresIn: '2 months' });
  
      return res.status(200).json({
        message: MESSAGE.post.succ,
        token,
        result: userInstance,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: MESSAGE.post.fail,
        error,
      });
    }
  };