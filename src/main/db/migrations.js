import db from './index.js';

export function runMigrations() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT NULL,
      email TEXT NULL UNIQUE,
      phone TEXT NULL,
      cellphone TEXT NULL,
      document TEXT NULL UNIQUE,
      zipcode TEXT NULL,
      state TEXT NULL,
      city TEXT NULL,
      district TEXT NULL,
      street TEXT NULL,
      number TEXT NULL,
      complement TEXT NULL,
      notes TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      active INTEGER DEFAULT 1
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NULL,
      amount REAL NULL,
      type INTEGER NULL,
      cost REAL NULL,
      description TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      active INTEGER DEFAULT 1
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS payment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      active INTEGER DEFAULT 1
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS budget (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      customer_id INTEGER NULL,
      payment_id INTEGER NULL,
      notes TEXT NULL,
      discount REAL NULL,
      total_cost REAL NULL,
      total_price REAL NULL,
      installments INTEGER NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      active INTEGER DEFAULT 1
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS budget_item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      budget_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      unit_cost REAL NOT NULL,
      discount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      active INTEGER DEFAULT 1
    );
  `).run();

  // drop table setting if exists to recreate it
  // db.prepare(`DROP TABLE IF EXISTS setting;`).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS budget_payment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      budget_id INTEGER NOT NULL,
      payment_id INTEGER NOT NULL,
      installments INTEGER NOT NULL,
      installment_value REAL NOT NULL,
      discount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      active INTEGER DEFAULT 1
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS setting (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      budget_image TEXT NULL
    );
  `).run();
}
