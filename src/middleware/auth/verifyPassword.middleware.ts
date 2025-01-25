import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const verifyPasswordMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const { password } = req.body;
  const userInstance = req.user; // Access user instance added by the previous middleware

  try {
    // Split stored password into salt and hash
    const [salt, storedHash] = userInstance.password.split(":");

    // Hash the provided password with the stored salt
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

    // Compare the hash from the request with the stored hash
    if (hashToVerify !== storedHash) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    next(); // Password is valid, proceed to the next middleware/handler
  } catch (err) {
    console.error("Error verifying password:", err);
    return res.status(500).json({
      message: "Failed to verify password",
      error: err,
    });
  }
};
