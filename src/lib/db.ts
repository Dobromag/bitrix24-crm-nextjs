import BetterSqlite3 from "better-sqlite3";
import fs from "fs";
import path from "path";

let dbInstance: BetterSqlite3.Database | null = null;

const getDbPath = () =>
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), ".data", "database.sqlite");

const getAvatarsDir = () =>
  process.env.AVATARS_PATH || path.join(process.cwd(), "data", "avatars");

export default function getDb(): BetterSqlite3.Database {
  if (!dbInstance) {
    const dbPath = getDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.mkdirSync(getAvatarsDir(), { recursive: true });

    dbInstance = new BetterSqlite3(dbPath);

    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        bitrix_contact_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        phone TEXT DEFAULT NULL,
        address TEXT DEFAULT NULL,
        avatar TEXT DEFAULT NULL,
        previous_password_hashes TEXT DEFAULT '[]'
      );
    `);

    dbInstance.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
    `);

    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS pending_syncs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        payload TEXT NOT NULL,
        attempts INTEGER DEFAULT 0,
        last_attempt DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    dbInstance.exec(`
      CREATE INDEX IF NOT EXISTS idx_pending_user_id ON pending_syncs(user_id);
      CREATE INDEX IF NOT EXISTS idx_pending_attempts ON pending_syncs(attempts);
    `);
  }

  return dbInstance;
}
