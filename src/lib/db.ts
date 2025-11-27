import * as betterSqlite3 from "better-sqlite3";
import fs from "fs";
import path from "path";

let dbInstance: betterSqlite3.Database;

// ==== ПУТИ К ПАПКАМ ====
const getDbPath = () =>
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), ".data", "database.sqlite");
const getAvatarsDir = () => process.env.AVATARS_PATH || "/data/avatars";

export default function getDb(): betterSqlite3.Database {
  if (dbInstance === null) {
    const dbPath = getDbPath();
    const dbDir = path.dirname(dbPath);
    fs.mkdirSync(dbDir, { recursive: true });

    const avatarsDir = getAvatarsDir();
    fs.mkdirSync(avatarsDir, { recursive: true });

    dbInstance = betterSqlite3.default(dbPath);

    // Создание таблицы users
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

    // Индексы
    dbInstance.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
    `);

    // Таблица pending_syncs
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

    // Добавление отсутствующих колонок (если нужно, иначе удалите блок)
    interface TableColumn {
      cid: number;
      name: string;
      type: string;
      notnull: number;
      dflt_value: string | null;
      pk: number;
    }
    const columns = dbInstance
      .prepare("PRAGMA table_info(users)")
      .all() as TableColumn[];

    interface RequiredColumn {
      name: string;
      type: string;
    }

    const requiredColumns: RequiredColumn[] = [
      // Если "previous_password_hash" не используется (вы используете plural 'hashes'), удалите это.
    ];

    requiredColumns.forEach((col) => {
      if (!columns.some((c) => c.name === col.name)) {
        dbInstance.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
      }
    });
  }
  return dbInstance;
}
