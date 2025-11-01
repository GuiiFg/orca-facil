import { ipcMain } from 'electron';
import db from '../../index.js';

export function createBudgetItem(budgetItemData) {
  if (!budgetItemData.discount)
    budgetItemData.discount = 0;
  if (!budgetItemData.unit_cost)
    budgetItemData.unit_cost = 0;
  const stmt = db.prepare(`
  INSERT INTO budget_item (budget_id, product_id, quantity, unit_price, unit_cost, discount)
  VALUES (@budget_id, @product_id, @quantity, @unit_price, @unit_cost, @discount)`);
  const info = stmt.run(budgetItemData);
  return info.lastInsertRowid;
}

export function getBudgetItemById(id) {
  const stmt = db.prepare(`SELECT * FROM budget_item WHERE id = ? AND active = 1`);
  return stmt.get(id);
}

export function updateBudgetItem(budgetItemData) {
  const stmt = db.prepare(`
  UPDATE budget_item SET
    budget_id = @budget_id,
    product_id = @product_id,
    quantity = @quantity,
    unit_price = @unit_price,
    unit_cost = @unit_cost,
    discount = @discount
  WHERE id = @id`);
  const info = stmt.run({ ...budgetItemData });
  return info.changes > 0;
}

export function deleteBudgetItem(id) {
  const stmt = db.prepare(`UPDATE budget_item SET active = 0 WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

export function listBudgetItems(filters = null, limit = 5, index = 1) {
  let stmt;
  const reponse = {
    data: [],
    total: 0,
    pages: 0,
    currentPage: index
  }

  if (!filters) filters = { };

  index = index > 0 ? index - 1 : 0;
  const query = `
    SELECT 
      bi.id, bi.budget_id,
      bi.product_id,
      bi.quantity,
      bi.unit_price,
      bi.unit_cost,
      bi.discount,
      bi.created_at,
      p.code AS product_code,
      p.name AS product_name,
      (bi.unit_price * bi.quantity) * (1 - (bi.discount / 100)) AS total_price,
      (bi.unit_cost * bi.quantity) AS total_cost
    FROM budget_item bi
    LEFT JOIN product p ON bi.product_id = p.id
    WHERE bi.active = 1 ` +
    (filters.search ? `AND (p.code LIKE ? OR p.name LIKE ? ) ` : '') +
    (filters.budget_id ? `AND bi.budget_id = ? ` : '') +
    ` ORDER BY p.code LIMIT ? OFFSET ?`;
  if (filters.search) {
    const likeValue = `%${filters.search}%`;
    stmt = db.prepare(query);
    reponse.data = filters.budget_id ? stmt.all(likeValue, likeValue, filters.budget_id, limit, index * limit) : stmt.all(likeValue, likeValue, limit, index * limit);
    const countQuery = `
      SELECT COUNT(*) as count
      FROM budget_item bi
      LEFT JOIN product p ON bi.product_id = p.id
      WHERE bi.active = 1 AND (p.code LIKE ? OR p.name LIKE ? )` +
      (filters.budget_id ? `AND bi.budget_id = ? ` : '');
    const countStmt = db.prepare(countQuery);
    const countResult = filters.budget_id ? countStmt.get(likeValue, likeValue, filters.budget_id) : countStmt.get(likeValue, likeValue);
    reponse.total = countResult.count;
    reponse.pages = Math.ceil(reponse.total / limit);
    return reponse;
  } else {
    stmt = db.prepare(query);
    reponse.data = filters.budget_id ? stmt.all(filters.budget_id, limit, index * limit) : stmt.all(limit, index * limit);
    const countQuery = `
      SELECT COUNT(*) as count
      FROM budget_item bi
      LEFT JOIN product p ON bi.product_id = p.id
      WHERE bi.active = 1 ` +
      (filters.budget_id ? `AND bi.budget_id = ? ` : '');
    const countStmt = db.prepare(countQuery);
    const countResult = filters.budget_id ? countStmt.get(filters.budget_id) : countStmt.get();
    reponse.total = countResult.count;
    reponse.pages = Math.ceil(reponse.total / limit);
    return reponse;
  }
}

ipcMain.handle('db:createBudgetItem', async (event, budgetItemData) => {
  const budgetItemId = createBudgetItem(budgetItemData);
  return { id: budgetItemId };
});

ipcMain.handle('db:listBudgetItems', async (event, searchValue, limit, index) => {
  const response = listBudgetItems(searchValue, limit, index);
  return { ...response };
});

ipcMain.handle('db:getBudgetItemById', async (event, id) => {
  const budgetItem = getBudgetItemById(id);
  return { budgetItem };
});

ipcMain.handle('db:updateBudgetItem', async (event, budgetItemData) => {
  const success = updateBudgetItem(budgetItemData);
  return { success };
});

ipcMain.handle('db:deleteBudgetItem', async (event, id) => {
  const success = deleteBudgetItem(id);
  return { success };
});