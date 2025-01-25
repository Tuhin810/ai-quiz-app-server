import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

export const verifyPasswordMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const { password } = req.body;
  const userInstance = req.user; // Access user instance added by the previous middleware

  try {
    const isPasswordValid = await bcrypt.compare(password, userInstance.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    next(); // Proceed to the next middleware/handler
  } catch (err) {
    console.error("Error verifying password:", err);
    return res.status(500).json({
      message: "Failed to verify password",
      error: err,
    });
  }
};
