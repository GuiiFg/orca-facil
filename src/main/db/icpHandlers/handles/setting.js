import { ipcMain } from 'electron';
import db from '../../index.js';

export function createSetting(settingData) {
  const stmt = db.prepare(`
  INSERT INTO setting (budget_image)
  VALUES (@budget_image)`);
  console.log('creating setting', settingData)
  const info = stmt.run({
    budget_image: settingData.budget_image
  });
  return info.lastInsertRowid;
}

export function getSetting() {
  const stmt = db.prepare(`SELECT * FROM setting LIMIT 1`);
  return stmt.get();
}

export function updateSetting(settingData) {
  const stmt = db.prepare(`
  UPDATE setting SET
    budget_image = @budget_image
  WHERE id = @id
  `);
  const info = stmt.run({ 
    id: settingData.id,
    budget_image: settingData.budget_image
   });
  return info.changes > 0;
}

ipcMain.handle('db:createSetting', async (event, settingData) => {
  const settingId = createSetting(settingData);
  return { id: settingId };
});

ipcMain.handle('db:getSetting', async (event) => {
  const setting = getSetting();
  return { setting };
});

ipcMain.handle('db:updateSetting', async (event, settingData) => {
  const success = updateSetting(settingData);
  return { success };
});