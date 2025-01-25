import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword; 
    next(); 
  } catch (err) {
    console.error("Error hashing password:", err);
    return res.status(500).json({
      message: "Failed to hash password",
      error: err,
    });
  }
};
