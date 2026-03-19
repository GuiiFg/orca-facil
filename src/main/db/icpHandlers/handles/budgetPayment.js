import { ipcMain } from 'electron';
import db from '../../index.js';

export function createBudgetPayment(budgetPaymentData) {
  if (!budgetPaymentData.discount) budgetPaymentData.discount = 0;
  const stmt = db.prepare(`
  INSERT INTO budget_payment (budget_id, payment_id, installments, installment_value, discount)
  VALUES (@budget_id, @payment_id, @installments, @installment_value, @discount)`);
  const info = stmt.run(budgetPaymentData);
  return info.lastInsertRowid;
}

export function getBudgetPaymentById(id) {
  const stmt = db.prepare(`SELECT * FROM budget_payment WHERE id = ? AND active = 1`);
  return stmt.get(id);
}

export function updateBudgetPayment(budgetPaymentData) {
  const stmt = db.prepare(`
  UPDATE budget_payment SET
    budget_id = @budget_id,
    payment_id = @payment_id,
    installments = @installments,
    installment_value = @installment_value,
    discount = @discount
  WHERE id = @id`);
  const info = stmt.run({ ...budgetPaymentData });
  return info.changes > 0;
}

export function deleteBudgetPayment(id) {
  const stmt = db.prepare(`UPDATE budget_payment SET active = 0 WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

export function listBudgetPayments(filters = null, limit = 5, index = 1) {
  let stmt;
  const response = {
    data: [],
    total: 0,
    pages: 0,
    currentPage: index
  }

  if (!filters) filters = { };

  index = index > 0 ? index - 1 : 0;
  const query = `
    SELECT 
      bp.id, bp.budget_id,
      bp.payment_id,
      bp.installments,
      bp.installment_value,
      bp.discount,
      bp.created_at,
      p.name AS payment_name
    FROM budget_payment bp
    LEFT JOIN payment p ON bp.payment_id = p.id
    WHERE bp.active = 1 ` +
    (filters.search ? `AND (p.name LIKE ? ) ` : '') +
    (filters.budget_id ? `AND bp.budget_id = ? ` : '') +
    ` ORDER BY p.name LIMIT ? OFFSET ?`;
  
  if (filters.search) {
    const likeValue = `%${filters.search}%`;    stmt = db.prepare(query);
    response.data = filters.budget_id ? stmt.all(likeValue, filters.budget_id, limit, index * limit) : stmt.all(likeValue, limit, index * limit);
    const countQuery = `
      SELECT COUNT(*) as count
      FROM budget_payment bp
      LEFT JOIN payment p ON bp.payment_id = p.id
      WHERE bp.active = 1 AND (p.name LIKE ? )` +
      (filters.budget_id ? `AND bp.budget_id = ? ` : '');
    const countStmt = db.prepare(countQuery);
    const countResult = filters.budget_id ? countStmt.get(likeValue, filters.budget_id) : countStmt.get(likeValue);
    response.total = countResult.count;
    response.pages = Math.ceil(response.total / limit);
    return response;
  } else {
    stmt = db.prepare(query);
    response.data = filters.budget_id ? stmt.all(filters.budget_id, limit, index * limit) : stmt.all(limit, index * limit);
    const countQuery = `
      SELECT COUNT(*) as count
      FROM budget_payment bp
      LEFT JOIN payment p ON bp.payment_id = p.id
      WHERE bp.active = 1 ` +
      (filters.budget_id ? `AND bp.budget_id = ? ` : '');
    const countStmt = db.prepare(countQuery);
    const countResult = filters.budget_id ? countStmt.get(filters.budget_id) : countStmt.get();
    response.total = countResult.count;
    response.pages = Math.ceil(response.total / limit);
    return response;
  }
}

ipcMain.handle('db:createBudgetPayment', async (event, budgetPaymentData) => {
  const budgetPaymentId = createBudgetPayment(budgetPaymentData);
  return { id: budgetPaymentId };
});

ipcMain.handle('db:listBudgetPayments', async (event, searchValue, limit, index) => {
  const response = listBudgetPayments(searchValue, limit, index);
  return { ...response };
});

ipcMain.handle('db:getBudgetPaymentById', async (event, id) => {
  const budgetPayment = getBudgetPaymentById(id);
  return { budgetPayment };
});

ipcMain.handle('db:updateBudgetPayment', async (event, budgetPaymentData) => {
  const success = updateBudgetPayment(budgetPaymentData);
  return { success };
});

ipcMain.handle('db:deleteBudgetPayment', async (event, id) => {
  const success = deleteBudgetPayment(id);
  return { success };
});
