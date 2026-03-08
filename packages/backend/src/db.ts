import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const dbPath = path.join(dataDir, "self-introduction.sqlite");

fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login_id TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profile (
    user_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    education TEXT NOT NULL DEFAULT '',
    work_experience TEXT NOT NULL DEFAULT '',
    certifications TEXT NOT NULL DEFAULT '',
    self_pr TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

type UserRow = {
  id: number;
  login_id: string;
  password_hash: string;
};

const now = () => new Date().toISOString();

export function initializeDatabase() {
  const adminId = process.env.ADMIN_ID ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "change-this-password";

  const existingUser = db
    .prepare("SELECT id, login_id, password_hash FROM users WHERE login_id = ?")
    .get(adminId) as UserRow | undefined;

  let userId: number;

  if (!existingUser) {
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    const result = db
      .prepare("INSERT INTO users (login_id, password_hash) VALUES (?, ?)")
      .run(adminId, passwordHash);
    userId = Number(result.lastInsertRowid);
  } else {
    userId = existingUser.id;
  }

  db.prepare(
    `
      INSERT INTO profile (user_id, updated_at)
      VALUES (?, ?)
      ON CONFLICT(user_id) DO NOTHING
    `
  ).run(userId, now());
}

export type Profile = {
  name: string;
  education: string;
  workExperience: string;
  certifications: string;
  selfPr: string;
  updatedAt: string;
};

export function getProfileByLoginId(loginId: string): Profile | null {
  const row = db
    .prepare(
      `
        SELECT
          p.name,
          p.education,
          p.work_experience,
          p.certifications,
          p.self_pr,
          p.updated_at
        FROM profile p
        JOIN users u ON u.id = p.user_id
        WHERE u.login_id = ?
      `
    )
    .get(loginId) as
    | {
        name: string;
        education: string;
        work_experience: string;
        certifications: string;
        self_pr: string;
        updated_at: string;
      }
    | undefined;

  if (!row) {
    return null;
  }

  return {
    name: row.name,
    education: row.education,
    workExperience: row.work_experience,
    certifications: row.certifications,
    selfPr: row.self_pr,
    updatedAt: row.updated_at
  };
}

export function getUserByLoginId(loginId: string) {
  return db
    .prepare("SELECT id, login_id, password_hash FROM users WHERE login_id = ?")
    .get(loginId) as UserRow | undefined;
}

export function updateProfile(
  loginId: string,
  payload: Omit<Profile, "updatedAt">
) {
  const user = getUserByLoginId(loginId);

  if (!user) {
    throw new Error("User not found");
  }

  db.prepare(
    `
      UPDATE profile
      SET
        name = ?,
        education = ?,
        work_experience = ?,
        certifications = ?,
        self_pr = ?,
        updated_at = ?
      WHERE user_id = ?
    `
  ).run(
    payload.name,
    payload.education,
    payload.workExperience,
    payload.certifications,
    payload.selfPr,
    now(),
    user.id
  );
}
