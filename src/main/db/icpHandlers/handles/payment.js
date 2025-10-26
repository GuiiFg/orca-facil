import { ipcMain } from 'electron';
import db from '../../index.js';

export function createPayment(paymentData) {
    const stmt = db.prepare(`
    INSERT INTO payment (name, description)
    VALUES (@name, @description)
  `);
    const info = stmt.run(paymentData);
    return info.lastInsertRowid;
}

export function getPaymentById(id) {
    const stmt = db.prepare(`SELECT * FROM payment WHERE id = ? AND active = 1`);
    return stmt.get(id);
}

export function updatePayment(paymentData) {
    const stmt = db.prepare(`
    UPDATE payment SET
      name = @name,
      description = @description,
    WHERE id = @id
  `);
    const info = stmt.run({ ...paymentData });
    return info.changes > 0;
}

export function deletePayment(id) {
    const stmt = db.prepare(`UPDATE payment SET active = 0 WHERE id = ?`);
    const info = stmt.run(id);
    return info.changes > 0;
}

export function listPayments(searchValue = null, limit = 5, index = 1) {
    let stmt;

    const reponse = {
        data: [],
        total: 0,
        pages: 0,
        currentPage: index
    }

    index = index > 0 ? index - 1 : 0;
    const query = `SELECT * FROM payment
      WHERE active = 1 ` + (searchValue ? `AND (name LIKE ? OR description LIKE ? ) ` : '') + `
      ORDER BY name
      LIMIT ? OFFSET ?`;
    if (searchValue) {
        const likeValue = `%${searchValue}%`;
        stmt = db.prepare(query);
        reponse.data = stmt.all(likeValue, likeValue, likeValue, limit, index * limit);
        const countQuery = `SELECT COUNT(*) as count FROM payment
      WHERE active = 1 AND (code LIKE ? OR name LIKE )`;
        const countStmt = db.prepare(countQuery);
        const countResult = countStmt.get(likeValue, likeValue, likeValue);
        reponse.total = countResult.count;
        reponse.pages = Math.ceil(reponse.total / limit);

        return reponse;
    } else {

        stmt = db.prepare(query);
        reponse.data = stmt.all(limit, index * limit);
        const countQuery = `SELECT COUNT(*) as count FROM payment
      WHERE active = 1`;
        const countStmt = db.prepare(countQuery);
        const countResult = countStmt.get();
        reponse.total = countResult.count;
        reponse.pages = Math.ceil(reponse.total / limit);

        return reponse;
    }
}

ipcMain.handle('db:createPayment', async (event, paymentData) => {
    const paymentId = createPayment(paymentData);
    return { id: paymentId };
});

ipcMain.handle('db:listPayments', async (event, searchValue, limit, index) => {
    const response = listPayments(searchValue, limit, index);
    return { ...response };
});

ipcMain.handle('db:getPaymentById', async (event, id) => {
    const payment = getPaymentById(id);
    return { payment };
});

ipcMain.handle('db:updatePayment', async (event, paymentData) => {
    const success = updatePayment(paymentData);
    return { success };
});

ipcMain.handle('db:deletePayment', async (event, id) => {
    const success = deletePayment(id);
    return { success };
});