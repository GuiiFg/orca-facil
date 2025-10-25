import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

import { runMigrations } from '@/main/db/migrations.js';

const dbPath = path.join(app.getPath('userData'), 'orcarfacil.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

runMigrations();

export default db;