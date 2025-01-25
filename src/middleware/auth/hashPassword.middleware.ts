import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    // Generate a random salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Hash the password with the salt using PBKDF2
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    // Store both the salt and hashed password in a single field
    req.body.password = `${salt}:${hashedPassword}`; // Pattern: `salt:hash`

    next(); // Proceed to the next middleware/controller
  } catch (err) {
    console.error("Error hashing password:", err);
    return res.status(500).json({
      message: "Failed to hash password",
      error: err,
    });
  }
};
