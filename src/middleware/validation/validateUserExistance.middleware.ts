import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/user.model";

export const validateUserExistenceMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const { phone } = req.body;

  try {
    const userInstance = await UserModel.findOne({ phone });
    if (!userInstance) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    // Attach user instance to the request for further processing
    req.user = userInstance;
    next(); // Proceed to the next middleware/handler
  } catch (err) {
    console.error("Error checking user existence:", err);
    return res.status(500).json({
      message: "Failed to check user existence",
      error: err,
    });
  }
};
