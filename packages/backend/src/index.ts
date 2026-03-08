import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import { authenticateUser, requireAuth, type AuthenticatedRequest } from "./auth.js";
import { getProfileByLoginId, initializeDatabase, updateProfile } from "./db.js";

dotenv.config();
initializeDatabase();

const app = express();
const port = Number(process.env.PORT ?? 3001);
const defaultUserId = process.env.ADMIN_ID ?? "admin";
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: frontendOrigin,
    credentials: false
  })
);
app.use(express.json());

const loginSchema = z.object({
  loginId: z.string().min(1),
  password: z.string().min(1)
});

const profileSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  education: z.string().min(1, "学歴は必須です"),
  workExperience: z.string().min(1, "職務経歴は必須です"),
  certifications: z.string().min(1, "資格は必須です"),
  selfPr: z.string().min(1, "自己PRは必須です")
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/profile", (_req, res) => {
  const profile = getProfileByLoginId(defaultUserId);

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  return res.json(profile);
});

app.post("/api/auth/login", (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const token = authenticateUser(result.data.loginId, result.data.password);

  if (!token) {
    return res.status(401).json({ message: "IDまたはパスワードが違います" });
  }

  return res.json({ token });
});

app.get("/api/admin/profile", requireAuth, (req: AuthenticatedRequest, res) => {
  const profile = getProfileByLoginId(req.user!.loginId);

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  return res.json(profile);
});

app.put("/api/admin/profile", requireAuth, (req: AuthenticatedRequest, res) => {
  const result = profileSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "入力内容を確認してください",
      issues: result.error.flatten()
    });
  }

  updateProfile(req.user!.loginId, result.data);
  const profile = getProfileByLoginId(req.user!.loginId);

  return res.json(profile);
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
