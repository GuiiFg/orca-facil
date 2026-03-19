/**
 * Capacitor SQLite Database Service
 * Replicates all Electron IPC handler SQL operations for mobile.
 * Uses @capacitor-community/sqlite plugin.
 */
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite'

const sqlite = new SQLiteConnection(CapacitorSQLite)
let db = null
const DB_NAME = 'orcafacil'

// ─── Init ──────────────────────────────────────────────────────────────
export async function initDatabase() {
  const ret = await sqlite.checkConnectionsConsistency()
  const isConn = (await sqlite.isConnection(DB_NAME, false)).result
  if (isConn) {
    db = await sqlite.retrieveConnection(DB_NAME, false)
  } else {
    db = await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false)
  }
  await db.open()
  await runMigrations()
  return db
}

async function runMigrations() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, surname TEXT NULL,
      email TEXT NULL UNIQUE, phone TEXT NULL, cellphone TEXT NULL, document TEXT NULL UNIQUE,
      zipcode TEXT NULL, state TEXT NULL, city TEXT NULL, district TEXT NULL,
      street TEXT NULL, number TEXT NULL, complement TEXT NULL, notes TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, active INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL UNIQUE, name TEXT NULL,
      amount REAL NULL, type INTEGER NULL, cost REAL NULL, description TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, active INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS payment (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, description TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, active INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS budget (
      id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, customer_id INTEGER NULL,
      payment_id INTEGER NULL, notes TEXT NULL, discount REAL NULL,
      total_cost REAL NULL, total_price REAL NULL, installments INTEGER NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, active INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS budget_item (
      id INTEGER PRIMARY KEY AUTOINCREMENT, budget_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL, unit_price REAL NOT NULL, unit_cost REAL NOT NULL, discount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, active INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS budget_payment (
      id INTEGER PRIMARY KEY AUTOINCREMENT, budget_id INTEGER NOT NULL, payment_id INTEGER NOT NULL,
      installments INTEGER NOT NULL, installment_value REAL NOT NULL, discount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP, active INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS setting (
      id INTEGER PRIMARY KEY AUTOINCREMENT, budget_image TEXT NULL
    )`
  ]
  for (const sql of tables) {
    await db.execute(sql)
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────
async function run(sql, params = []) {
  return await db.run(sql, params)
}

async function queryAll(sql, params = []) {
  const res = await db.query(sql, params)
  return res.values || []
}

async function queryOne(sql, params = []) {
  const res = await db.query(sql, params)
  return res.values && res.values.length > 0 ? res.values[0] : null
}

function buildListResponse(data, total, limit, index) {
  return { data, total, pages: Math.ceil(total / limit), currentPage: index }
}

// ─── Customer ──────────────────────────────────────────────────────────
const customerApi = {
  async add(data) {
    const res = await run(
      `INSERT INTO customer (name, surname, email, phone, cellphone, document, zipcode, state, city, district, street, number, complement, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.name, data.surname, data.email, data.phone, data.cellphone, data.document,
       data.zipcode, data.state, data.city, data.district, data.street, data.number, data.complement, data.notes]
    )
    return { id: res.changes?.lastId }
  },
  async search(value = null, limit = 5, index = 1) {
    const offset = (Math.max(index, 1) - 1) * limit
    let data, countRes
    if (value) {
      const like = `%${value}%`
      data = await queryAll(`SELECT * FROM customer WHERE active = 1 AND (name LIKE ? OR email LIKE ? OR document LIKE ?) ORDER BY name LIMIT ? OFFSET ?`, [like, like, like, limit, offset])
      countRes = await queryOne(`SELECT COUNT(*) as count FROM customer WHERE active = 1 AND (name LIKE ? OR email LIKE ? OR document LIKE ?)`, [like, like, like])
    } else {
      data = await queryAll(`SELECT * FROM customer WHERE active = 1 ORDER BY name LIMIT ? OFFSET ?`, [limit, offset])
      countRes = await queryOne(`SELECT COUNT(*) as count FROM customer WHERE active = 1`)
    }
    return buildListResponse(data, countRes?.count || 0, limit, index)
  },
  async getById(id) {
    const customer = await queryOne(`SELECT * FROM customer WHERE id = ? AND active = 1`, [id])
    return { customer }
  },
  async delete(id) {
    const res = await run(`UPDATE customer SET active = 0 WHERE id = ?`, [id])
    return { success: res.changes?.changes > 0 }
  },
  async update(data) {
    const res = await run(
      `UPDATE customer SET name=?, surname=?, email=?, phone=?, cellphone=?, document=?, zipcode=?, state=?, city=?, district=?, street=?, number=?, complement=?, notes=? WHERE id=?`,
      [data.name, data.surname, data.email, data.phone, data.cellphone, data.document,
       data.zipcode, data.state, data.city, data.district, data.street, data.number, data.complement, data.notes, data.id]
    )
    return { success: res.changes?.changes > 0 }
  }
}

// ─── Product ───────────────────────────────────────────────────────────
const productApi = {
  async add(data) {
    const res = await run(
      `INSERT INTO product (code, name, amount, type, cost, description) VALUES (?, ?, ?, ?, ?, ?)`,
      [data.code, data.name, data.amount, data.type, data.cost, data.description]
    )
    return { id: res.changes?.lastId }
  },
  async search(value = null, limit = 5, index = 1) {
    const offset = (Math.max(index, 1) - 1) * limit
    let data, countRes
    if (value) {
      const like = `%${value}%`
      data = await queryAll(`SELECT * FROM product WHERE active = 1 AND (code LIKE ? OR name LIKE ?) ORDER BY code LIMIT ? OFFSET ?`, [like, like, limit, offset])
      countRes = await queryOne(`SELECT COUNT(*) as count FROM product WHERE active = 1 AND (code LIKE ? OR name LIKE ?)`, [like, like])
    } else {
      data = await queryAll(`SELECT * FROM product WHERE active = 1 ORDER BY code LIMIT ? OFFSET ?`, [limit, offset])
      countRes = await queryOne(`SELECT COUNT(*) as count FROM product WHERE active = 1`)
    }
    return buildListResponse(data, countRes?.count || 0, limit, index)
  },
  async getById(id) {
    const product = await queryOne(`SELECT * FROM product WHERE id = ? AND active = 1`, [id])
    return { product }
  },
  async delete(id) {
    const res = await run(`UPDATE product SET active = 0 WHERE id = ?`, [id])
    return { success: res.changes?.changes > 0 }
  },
  async update(data) {
    const res = await run(`UPDATE product SET code=?, name=?, amount=?, type=?, cost=?, description=? WHERE id=?`,
      [data.code, data.name, data.amount, data.type, data.cost, data.description, data.id])
    return { success: res.changes?.changes > 0 }
  }
}

// ─── Payment ───────────────────────────────────────────────────────────
const paymentApi = {
  async add(data) {
    const res = await run(`INSERT INTO payment (name, description) VALUES (?, ?)`, [data.name, data.description])
    return { id: res.changes?.lastId }
  },
  async search(value = null, limit = 5, index = 1) {
    const offset = (Math.max(index, 1) - 1) * limit
    let data, countRes
    if (value) {
      const like = `%${value}%`
      data = await queryAll(`SELECT * FROM payment WHERE active = 1 AND (name LIKE ? OR description LIKE ?) ORDER BY name LIMIT ? OFFSET ?`, [like, like, limit, offset])
      countRes = await queryOne(`SELECT COUNT(*) as count FROM payment WHERE active = 1 AND (name LIKE ? OR description LIKE ?)`, [like, like])
    } else {
      data = await queryAll(`SELECT * FROM payment WHERE active = 1 ORDER BY name LIMIT ? OFFSET ?`, [limit, offset])
      countRes = await queryOne(`SELECT COUNT(*) as count FROM payment WHERE active = 1`)
    }
    return buildListResponse(data, countRes?.count || 0, limit, index)
  },
  async getById(id) {
    const payment = await queryOne(`SELECT * FROM payment WHERE id = ? AND active = 1`, [id])
    return { payment }
  },
  async delete(id) {
    const res = await run(`UPDATE payment SET active = 0 WHERE id = ?`, [id])
    return { success: res.changes?.changes > 0 }
  },
  async update(data) {
    const res = await run(`UPDATE payment SET name=?, description=? WHERE id=?`, [data.name, data.description, data.id])
    return { success: res.changes?.changes > 0 }
  }
}

// ─── Budget ────────────────────────────────────────────────────────────
const budgetApi = {
  async add(data) {
    const res = await run(
      `INSERT INTO budget (code, customer_id, notes, discount, total_cost, total_price, installments) VALUES (?, ?, ?, 0, 0, 0, 1)`,
      [data.code, data.customer_id, data.notes]
    )
    return { id: res.changes?.lastId }
  },
  async search(value = null, limit = 5, index = 1) {
    const offset = (Math.max(index, 1) - 1) * limit
    let data, countRes
    const baseQ = `SELECT b.id, b.code, b.customer_id, b.notes, b.created_at, b.total_cost, b.total_price, b.installments, b.active, c.name || ' ' || c.surname AS customer_name FROM budget b LEFT JOIN customer c ON b.customer_id = c.id WHERE b.active = 1`
    const baseC = `SELECT COUNT(*) as count FROM budget b LEFT JOIN customer c ON b.customer_id = c.id WHERE b.active = 1`
    if (value) {
      const like = `%${value}%`
      data = await queryAll(`${baseQ} AND (b.code LIKE ? OR c.name LIKE ?) ORDER BY b.code LIMIT ? OFFSET ?`, [like, like, limit, offset])
      countRes = await queryOne(`${baseC} AND (b.code LIKE ? OR c.name LIKE ?)`, [like, like])
    } else {
      data = await queryAll(`${baseQ} ORDER BY b.code LIMIT ? OFFSET ?`, [limit, offset])
      countRes = await queryOne(baseC)
    }
    return buildListResponse(data, countRes?.count || 0, limit, index)
  },
  async getById(id) {
    const budget = await queryOne(`SELECT * FROM budget WHERE id = ? AND active = 1`, [id])
    return { budget }
  },
  async delete(id) {
    const res = await run(`UPDATE budget SET active = 0 WHERE id = ?`, [id])
    return { success: res.changes?.changes > 0 }
  },
  async update(data) {
    const res = await run(`UPDATE budget SET code=?, customer_id=?, installments=?, notes=? WHERE id=?`,
      [data.code, data.customer_id, data.installments, data.notes, data.id])
    return { success: res.changes?.changes > 0 }
  },
  async updateTotals(budget_id) {
    const budget = await queryOne(`SELECT COALESCE(discount, 0) AS general_discount FROM budget WHERE id = ?`, [budget_id])
    const itemsTotals = await queryOne(
      `SELECT COALESCE(SUM(unit_cost * quantity), 0) AS total_cost, COALESCE(SUM((unit_price * quantity) * (1 - (discount / 100.0))), 0) AS total_items_price FROM budget_item WHERE budget_id = ? AND active = 1`,
      [budget_id]
    )
    let total_cost = itemsTotals?.total_cost || 0
    let total_items_price = itemsTotals?.total_items_price || 0
    if (total_cost <= 0) total_cost = 0
    if (total_items_price <= 0) total_items_price = 0
    const total_price = total_items_price * (1 - ((budget?.general_discount || 0) / 100.0))

    await run(`UPDATE budget SET total_cost = ?, total_price = ? WHERE id = ?`, [total_cost, total_price, budget_id])

    // Recalculate payments
    const payments = await queryAll(`SELECT * FROM budget_payment WHERE budget_id = ? AND active = 1`, [budget_id])
    for (const pay of payments) {
      let finalInstallment = 0
      if (pay.installments > 0) {
        const discountVal = (total_price * pay.discount) / 100.0
        finalInstallment = (total_price - discountVal) / pay.installments
      }
      await run(`UPDATE budget_payment SET installment_value = ? WHERE id = ?`, [finalInstallment, pay.id])
    }
    return { success: true }
  }
}

// ─── BudgetItem ────────────────────────────────────────────────────────
const budgetItemApi = {
  async add(data) {
    if (!data.discount) data.discount = 0
    if (!data.unit_cost) data.unit_cost = 0
    const res = await run(
      `INSERT INTO budget_item (budget_id, product_id, quantity, unit_price, unit_cost, discount) VALUES (?, ?, ?, ?, ?, ?)`,
      [data.budget_id, data.product_id, data.quantity, data.unit_price, data.unit_cost, data.discount]
    )
    return { id: res.changes?.lastId }
  },
  async search(filters = null, limit = 5, index = 1) {
    if (!filters) filters = {}
    const offset = (Math.max(index, 1) - 1) * limit
    const baseQ = `SELECT bi.id, bi.budget_id, bi.product_id, bi.quantity, bi.unit_price, bi.unit_cost, bi.discount, bi.created_at, p.code AS product_code, p.name AS product_name, (bi.unit_price * bi.quantity) * (1 - (bi.discount / 100)) AS total_price, (bi.unit_cost * bi.quantity) AS total_cost FROM budget_item bi LEFT JOIN product p ON bi.product_id = p.id WHERE bi.active = 1`
    const baseC = `SELECT COUNT(*) as count FROM budget_item bi LEFT JOIN product p ON bi.product_id = p.id WHERE bi.active = 1`
    let params = [], countParams = []
    let where = '', countWhere = ''
    if (filters.search) {
      const like = `%${filters.search}%`
      where += ` AND (p.code LIKE ? OR p.name LIKE ?)`; countWhere += where
      params.push(like, like); countParams.push(like, like)
    }
    if (filters.budget_id) {
      where += ` AND bi.budget_id = ?`; countWhere += ` AND bi.budget_id = ?`
      params.push(filters.budget_id); countParams.push(filters.budget_id)
    }
    params.push(limit, offset)
    const data = await queryAll(`${baseQ}${where} ORDER BY p.code LIMIT ? OFFSET ?`, params)
    const countRes = await queryOne(`${baseC}${countWhere}`, countParams)
    return buildListResponse(data, countRes?.count || 0, limit, index)
  },
  async getById(id) {
    const budgetItem = await queryOne(`SELECT * FROM budget_item WHERE id = ? AND active = 1`, [id])
    return { budgetItem }
  },
  async delete(id) {
    const res = await run(`UPDATE budget_item SET active = 0 WHERE id = ?`, [id])
    return { success: res.changes?.changes > 0 }
  },
  async update(data) {
    const res = await run(`UPDATE budget_item SET budget_id=?, product_id=?, quantity=?, unit_price=?, unit_cost=?, discount=? WHERE id=?`,
      [data.budget_id, data.product_id, data.quantity, data.unit_price, data.unit_cost, data.discount, data.id])
    return { success: res.changes?.changes > 0 }
  }
}

// ─── BudgetPayment ─────────────────────────────────────────────────────
const budgetPaymentApi = {
  async add(data) {
    if (!data.discount) data.discount = 0
    const res = await run(
      `INSERT INTO budget_payment (budget_id, payment_id, installments, installment_value, discount) VALUES (?, ?, ?, ?, ?)`,
      [data.budget_id, data.payment_id, data.installments, data.installment_value, data.discount]
    )
    return { id: res.changes?.lastId }
  },
  async search(filters = null, limit = 5, index = 1) {
    if (!filters) filters = {}
    const offset = (Math.max(index, 1) - 1) * limit
    const baseQ = `SELECT bp.id, bp.budget_id, bp.payment_id, bp.installments, bp.installment_value, bp.discount, bp.created_at, p.name AS payment_name FROM budget_payment bp LEFT JOIN payment p ON bp.payment_id = p.id WHERE bp.active = 1`
    const baseC = `SELECT COUNT(*) as count FROM budget_payment bp LEFT JOIN payment p ON bp.payment_id = p.id WHERE bp.active = 1`
    let params = [], countParams = []
    let where = '', countWhere = ''
    if (filters.search) {
      const like = `%${filters.search}%`
      where += ` AND (p.name LIKE ?)`; countWhere += where
      params.push(like); countParams.push(like)
    }
    if (filters.budget_id) {
      where += ` AND bp.budget_id = ?`; countWhere += ` AND bp.budget_id = ?`
      params.push(filters.budget_id); countParams.push(filters.budget_id)
    }
    params.push(limit, offset)
    const data = await queryAll(`${baseQ}${where} ORDER BY p.name LIMIT ? OFFSET ?`, params)
    const countRes = await queryOne(`${baseC}${countWhere}`, countParams)
    return buildListResponse(data, countRes?.count || 0, limit, index)
  },
  async getById(id) {
    const budgetPayment = await queryOne(`SELECT * FROM budget_payment WHERE id = ? AND active = 1`, [id])
    return { budgetPayment }
  },
  async delete(id) {
    const res = await run(`UPDATE budget_payment SET active = 0 WHERE id = ?`, [id])
    return { success: res.changes?.changes > 0 }
  },
  async update(data) {
    const res = await run(`UPDATE budget_payment SET budget_id=?, payment_id=?, installments=?, installment_value=?, discount=? WHERE id=?`,
      [data.budget_id, data.payment_id, data.installments, data.installment_value, data.discount, data.id])
    return { success: res.changes?.changes > 0 }
  }
}

// ─── Setting ───────────────────────────────────────────────────────────
const settingApi = {
  async create(data) {
    const res = await run(`INSERT INTO setting (budget_image) VALUES (?)`, [data.budget_image])
    return { id: res.changes?.lastId }
  },
  async get() {
    const setting = await queryOne(`SELECT * FROM setting LIMIT 1`)
    return { setting }
  },
  async update(data) {
    const res = await run(`UPDATE setting SET budget_image = ? WHERE id = ?`, [data.budget_image, data.id])
    return { success: res.changes?.changes > 0 }
  }
}

// ─── Export ────────────────────────────────────────────────────────────
export function createCapacitorApi() {
  return {
    customer: customerApi,
    product: productApi,
    payment: paymentApi,
    budget: budgetApi,
    budgetItem: budgetItemApi,
    budgetPayment: budgetPaymentApi,
    setting: settingApi,
    selectFile: null, // handled by fileService
    fileToBase64: null,
    savePdf: null
  }
}
