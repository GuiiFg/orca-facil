import { ipcMain } from 'electron';
import db from '../../index.js';

export function createProduct(productData) {
  const stmt = db.prepare(`
  INSERT INTO product (code, name, amount, type, cost, description)
  VALUES (@code, @name, @amount, @type, @cost, @description)`);
  const info = stmt.run(productData);
  return info.lastInsertRowid;
}

export function getProductById(id) {
  const stmt = db.prepare(`SELECT * FROM product WHERE id = ? AND active = 1`);
  return stmt.get(id);
}

export function updateProduct(productData) {
  const stmt = db.prepare(`
  UPDATE product SET
    code = @code,
    name = @name,
    amount = @amount,
    type = @type,
    cost = @cost,
    description = @description
  WHERE id = @id`);
  const info = stmt.run({ ...productData });
  return info.changes > 0;
}

export function deleteProduct(id) {
  const stmt = db.prepare(`UPDATE product SET active = 0 WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

export function listProducts(searchValue = null, limit = 5, index = 1) {
  let stmt;
  const reponse = {
    data: [],
    total: 0,
    pages: 0,
    currentPage: index
  }

  index = index > 0 ? index - 1 : 0;
  const query = `SELECT * FROM product
    WHERE active = 1 ` +
    (searchValue ? `AND (code LIKE ? OR name LIKE ? ) ` : '') +
    ` ORDER BY code LIMIT ? OFFSET ?`;
  if (searchValue) {
    const likeValue = `%${searchValue}%`;
    stmt = db.prepare(query);
    reponse.data = stmt.all(likeValue, likeValue, limit, index * limit);
    const countQuery = `SELECT COUNT(*) as count FROM product WHERE active = 1 AND (code LIKE ? OR name LIKE ? )`;
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get(likeValue, likeValue);
    reponse.total = countResult.count;
    reponse.pages = Math.ceil(reponse.total / limit);

    return reponse;
  } else {
    stmt = db.prepare(query);
    reponse.data = stmt.all(limit, index * limit);
    const countQuery = `SELECT COUNT(*) as count FROM product WHERE active = 1`;
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get();
    reponse.total = countResult.count;
    reponse.pages = Math.ceil(reponse.total / limit);

    return reponse;
  }
}

ipcMain.handle('db:createProduct', async (event, productData) => {
  const productId = createProduct(productData);
  return { id: productId };
});

ipcMain.handle('db:listProducts', async (event, searchValue, limit, index) => {
  const response = listProducts(searchValue, limit, index);
  return { ...response };
});

ipcMain.handle('db:getProductById', async (event, id) => {
  const product = getProductById(id);
  return { product };
});

ipcMain.handle('db:updateProduct', async (event, productData) => {
  const success = updateProduct(productData);
  return { success };
});

ipcMain.handle('db:deleteProduct', async (event, id) => {
  const success = deleteProduct(id);
  return { success };
});