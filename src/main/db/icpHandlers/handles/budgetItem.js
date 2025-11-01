import { ipcMain } from 'electron';
import db from '../../index.js';

export function createBudgetItem(budgetItemData) {
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

export function listBudgetItems(searchValue = null, limit = 5, index = 1) {
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
    (searchValue ? `AND (p.code LIKE ? OR p.name LIKE ? ) ` : '') +
    ` ORDER BY p.code LIMIT ? OFFSET ?`;
  if (searchValue) {
    const likeValue = `%${searchValue}%`;
    stmt = db.prepare(query);
    reponse.data = stmt.all(likeValue, likeValue, limit, index * limit);
    const countQuery = `
      SELECT COUNT(*) as count
      FROM budget_item bi
      LEFT JOIN product p ON bi.product_id = p.id
      WHERE bi.active = 1 AND (p.code LIKE ? OR p.name LIKE ? )`;
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get(likeValue, likeValue);
    reponse.total = countResult.count;
    reponse.pages = Math.ceil(reponse.total / limit);
    return reponse;
  } else {
    stmt = db.prepare(query);
    reponse.data = stmt.all(limit, index * limit);
    const countQuery = `
      SELECT COUNT(*) as count
      FROM budget_item bi
      LEFT JOIN product p ON bi.product_id = p.id
      WHERE bi.active = 1`;
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get();
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