import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserByLoginId } from "./db.js";

const secret = process.env.JWT_SECRET ?? "change-this-secret";

export function authenticateUser(loginId: string, password: string) {
  const user = getUserByLoginId(loginId);

  if (!user) {
    return null;
  }

  const isValid = bcrypt.compareSync(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  return jwt.sign({ loginId: user.login_id }, secret, { expiresIn: "12h" });
}

export type AuthenticatedRequest = Request & {
  user?: {
    loginId: string;
  };
};

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, secret) as { loginId: string };
    req.user = { loginId: payload.loginId };
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
