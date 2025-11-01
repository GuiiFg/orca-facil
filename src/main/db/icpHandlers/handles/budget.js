import { ipcMain } from 'electron';
import db from '../../index.js';

export function createBudget(budgetData) {
  const stmt = db.prepare(`
  INSERT INTO budget (code, customer_id, payment_id, notes, discount, total_cost, total_price, installments)
  VALUES (@code, @customer_id, @payment_id, @notes, 0, 0, 0, 1)`);
  const info = stmt.run(budgetData);
  return info.lastInsertRowid;
}

export function getBudgetById(id) {
  const stmt = db.prepare(`SELECT * FROM budget WHERE id = ? AND active = 1`);
  return stmt.get(id);
}

export function updateBudget(budgetData) {
  const stmt = db.prepare(`
  UPDATE budget SET
    code = @code,
    customer_id = @customer_id,
    payment_id = @payment_id,
    notes = @notes
  WHERE id = @id`);
  const info = stmt.run({ ...budgetData });
  return info.changes > 0;
}

export function updateBudgetTotals(budget_id) {
  const budget = db.prepare(`
    SELECT COALESCE(discount, 0) AS general_discount
    FROM budget
    WHERE id = ?
  `).get(budget_id);

  const itemsTotals = db.prepare(`
    SELECT
      COALESCE(SUM(unit_cost * quantity), 0) AS total_cost,
      COALESCE(SUM((unit_price * quantity) * (1 - (discount / 100.0))), 0) AS total_items_price
    FROM budget_item
    WHERE budget_id = ? AND active = 1
  `).get(budget_id);

  const total_price =
    itemsTotals.total_items_price * (1 - (budget.general_discount / 100.0));

  db.prepare(`
    UPDATE budget
    SET total_cost = ?,
        total_price = ?
    WHERE id = ?
  `).run(itemsTotals.total_cost, total_price, budget_id);

  return {
    total_cost: itemsTotals.total_cost,
    total_items_price: itemsTotals.total_items_price,
    general_discount: budget.general_discount,
    total_price
  };
}

export function deleteBudget(id) {
  const stmt = db.prepare(`UPDATE budget SET active = 0 WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

export function listBudgets(searchValue = null, limit = 5, index = 1) {
  let stmt;
  const reponse = {
    data: [],
    total: 0,
    pages: 0,
    currentPage: index
  }

  index = index > 0 ? index - 1 : 0;
  const query = `
    SELECT 
      b.id, b.code,
      b.customer_id,
      b.payment_id,
      b.notes,
      b.created_at,
      b.total_cost,
      b.total_price,
      b.installments,
      b.active,
      c.name || ' ' || c.surname AS customer_name,
      p.name AS payment_name
    FROM budget b
    LEFT JOIN customer c ON b.customer_id = c.id
    LEFT JOIN payment p ON b.payment_id = p.id
    WHERE b.active = 1 ` +
    (searchValue ? `AND (b.code LIKE ? OR c.name LIKE ? OR p.name LIKE ? ) ` : '') +
    ` ORDER BY b.code LIMIT ? OFFSET ?`;
  if (searchValue) {
    const likeValue = `%${searchValue}%`;
    stmt = db.prepare(query);
    reponse.data = stmt.all(likeValue, likeValue, likeValue, limit, index * limit);
    const countQuery = `
      SELECT COUNT(*) as count
      FROM budget b
      LEFT JOIN customer c ON b.customer_id = c.id
      LEFT JOIN payment p ON b.payment_id = p.id
      WHERE b.active = 1 ` +
      (searchValue ? `AND (b.code LIKE ? OR c.name LIKE ? OR p.name LIKE ? ) ` : '');
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get(likeValue, likeValue, likeValue);
    reponse.total = countResult.count;
    reponse.pages = Math.ceil(reponse.total / limit);
    return reponse;
  } else {
    stmt = db.prepare(query);
    reponse.data = stmt.all(limit, index * limit);
    const countQuery = `
      SELECT COUNT(*) as count
      FROM budget b
      LEFT JOIN customer c ON b.customer_id = c.id
      LEFT JOIN payment p ON b.payment_id = p.id
      WHERE b.active = 1`;
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get();
    reponse.total = countResult.count;
    reponse.pages = Math.ceil(reponse.total / limit);
    return reponse;
  }
}

ipcMain.handle('db:createBudget', async (event, budgetData) => {
  const budgetId = createBudget(budgetData);
  return { id: budgetId };
});

ipcMain.handle('db:listBudgets', async (event, searchValue, limit, index) => {
  const response = listBudgets(searchValue, limit, index);
  return { ...response };
});

ipcMain.handle('db:getBudgetById', async (event, id) => {
  const budget = getBudgetById(id);
  return { budget };
});

ipcMain.handle('db:updateBudget', async (event, budgetData) => {
  const success = updateBudget(budgetData);
  return { success };
});

ipcMain.handle('db:updateBudgetTotals', async (event, budget_id) => {
  updateBudgetTotals(budget_id);
  return { success: true };
});

ipcMain.handle('db:deleteBudget', async (event, id) => {
  const success = deleteBudget(id);
  return { success };
});