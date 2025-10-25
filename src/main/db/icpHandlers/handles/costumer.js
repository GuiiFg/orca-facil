import { ipcMain } from 'electron';
import db from '../../index.js';

export function createCustomer(customerData) {
  const stmt = db.prepare(`
    INSERT INTO customer (name, surname, email, phone, cellphone, document, zipcode, state, city, district, street, number, complement, notes)
    VALUES (@name, @surname, @email, @phone, @cellphone, @document, @zipcode, @state, @city, @district, @street, @number, @complement, @notes)
  `);
  const info = stmt.run(customerData);
  return info.lastInsertRowid;
}

export function getCustomerById(id) {
  const stmt = db.prepare(`SELECT * FROM customer WHERE id = ? AND active = 1`);
  return stmt.get(id);
}

export function updateCustomer(customerData) {
  const stmt = db.prepare(`
    UPDATE customer SET
      name = @name,
      surname = @surname,
      email = @email,
      phone = @phone,
      cellphone = @cellphone,
      document = @document,
      zipcode = @zipcode,
      state = @state,
      city = @city,
      district = @district,
      street = @street,
      number = @number,
      complement = @complement,
      notes = @notes
    WHERE id = @id
  `);
  const info = stmt.run({ ...customerData });
  return info.changes > 0;
}

export function deleteCustomer(id) {
  const stmt = db.prepare(`UPDATE customer SET active = 0 WHERE id = ?`);
  const info = stmt.run(id);
  return info.changes > 0;
}

export function listCustomers(searchValue = null, limit = 5, index = 1) {
  let stmt;

  const reponse = {
    data: [],
    total: 0,
    pages: 0,
    currentPage: index
  }

  index = index > 0 ? index - 1 : 0;
  const query = `SELECT * FROM customer
      WHERE active = 1 ` + (searchValue ? `AND (name LIKE ? OR email LIKE ? OR document LIKE ? ) ` : '') + `
      ORDER BY name
      LIMIT ? OFFSET ?`;
  if (searchValue) {
    const likeValue = `%${searchValue}%`;
    stmt = db.prepare(query);
    reponse.data = stmt.all(likeValue, likeValue, likeValue, limit, index * limit);
    const countQuery = `SELECT COUNT(*) as count FROM customer
      WHERE active = 1 AND (name LIKE ? OR email LIKE ? OR document LIKE ?)`;
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get(likeValue, likeValue, likeValue);
    reponse.total = countResult.count;
    reponse.pages = Math.ceil(reponse.total / limit);

    return reponse;
  } else {

    stmt = db.prepare(query);
    reponse.data = stmt.all(limit, index * limit);
    const countQuery = `SELECT COUNT(*) as count FROM customer
      WHERE active = 1`;
    const countStmt = db.prepare(countQuery);
    const countResult = countStmt.get();
    reponse.total = countResult.count;
    reponse.pages = Math.ceil(reponse.total / limit);

    return reponse;
  }
}

ipcMain.handle('db:createCustomer', async (event, customerData) => {
  const customerId = createCustomer(customerData);
  return { id: customerId };
});

ipcMain.handle('db:listCustomers', async (event, searchValue, limit, index) => {
  const response = listCustomers(searchValue, limit, index);
  return { ...response };
});

ipcMain.handle('db:getCustomerById', async (event, id) => {
  const customer = getCustomerById(id);
  return { customer };
});

ipcMain.handle('db:updateCustomer', async (event, customerData) => {
  const success = updateCustomer(customerData);
  return { success };
});

ipcMain.handle('db:deleteCustomer', async (event, id) => {
  const success = deleteCustomer(id);
  return { success };
});