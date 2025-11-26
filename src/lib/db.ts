import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// ==== ПУТИ К ПАПКАМ ====

// Путь к БД
const dbPath =
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), ".data", "database.sqlite");

// Папка БД
const dbDir = path.dirname(dbPath);

// Папка аватаров (только в /data на Railway!!!)
const avatarsDir = process.env.AVATARS_PATH || "/data/avatars";

// Создаём директории
fs.mkdirSync(dbDir, { recursive: true });
fs.mkdirSync(avatarsDir, { recursive: true });

// ==== ИНИЦИАЛИЗАЦИЯ БАЗЫ ====

const db = new Database(dbPath);

// Создание таблицы users
db.exec(`
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
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
`);

// Таблица pending_syncs
db.exec(`
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

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_pending_user_id ON pending_syncs(user_id);
  CREATE INDEX IF NOT EXISTS idx_pending_attempts ON pending_syncs(attempts);
`);

// Добавление отсутствующих колонок
interface TableColumn {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
}

const columns = db.prepare("PRAGMA table_info(users)").all() as TableColumn[];

const requiredColumns = [
  { name: "previous_password_hash", type: "TEXT DEFAULT NULL" },
];

requiredColumns.forEach((col) => {
  if (!columns.some((c) => c.name === col.name)) {
    db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
  }
});

export default db;
