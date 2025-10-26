const Database = require('better-sqlite3');
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

import { runMigrations } from '@/main/db/migrations.js';

const dbPath = path.join(app.getPath('userData'), 'orcarfacil.db');
console.log('Database path:', dbPath);

fs.mkdirSync(path.dirname(dbPath), { recursive: true });
console.log('Database directory created.');

const db = new Database(dbPath);
console.log('Database initialized.');

runMigrations();
console.log('Migrations executed.');

export default db;