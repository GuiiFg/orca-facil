// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  customer: {
    add: (data) => ipcRenderer.invoke('db:createCustomer', data),
    search: (value = null, limit = 5, index = 0) => ipcRenderer.invoke('db:listCustomers', value, limit, index),
    getById: (id) => ipcRenderer.invoke('db:getCustomerById', id),
    delete: (id) => ipcRenderer.invoke('db:deleteCustomer', id),
    update: (data) => ipcRenderer.invoke('db:updateCustomer', data),
  },
  product: {
    add: (data) => ipcRenderer.invoke('db:createProduct', data),
    search: (value = null, limit = 5, index = 0) => ipcRenderer.invoke('db:listProducts', value, limit, index),
    getById: (id) => ipcRenderer.invoke('db:getProductById', id),
    delete: (id) => ipcRenderer.invoke('db:deleteProduct', id),
    update: (data) => ipcRenderer.invoke('db:updateProduct', data),
  },
  payment: {
    add: (data) => ipcRenderer.invoke('db:createPayment', data),
    search: (value = null, limit = 5, index = 0) => ipcRenderer.invoke('db:listPayments', value, limit, index),
    getById: (id) => ipcRenderer.invoke('db:getPaymentById', id),
    delete: (id) => ipcRenderer.invoke('db:deletePayment', id),
    update: (data) => ipcRenderer.invoke('db:updatePayment', data),
  },
  budget: {
    add: (data) => ipcRenderer.invoke('db:createBudget', data),
    search: (value = null, limit = 5, index = 0) => ipcRenderer.invoke('db:listBudgets', value, limit, index),
    getById: (id) => ipcRenderer.invoke('db:getBudgetById', id),
    delete: (id) => ipcRenderer.invoke('db:deleteBudget', id),
    update: (data) => ipcRenderer.invoke('db:updateBudget', data),
    updateTotals: (budget_id) => ipcRenderer.invoke('db:updateBudgetTotals', budget_id)
  },
  budgetItem: {
    add: (data) => ipcRenderer.invoke('db:createBudgetItem', data),
    search: (value = null, limit = 5, index = 0) => ipcRenderer.invoke('db:listBudgetItems', value, limit, index),
    getById: (id) => ipcRenderer.invoke('db:getBudgetItemById', id),
    delete: (id) => ipcRenderer.invoke('db:deleteBudgetItem', id),
    update: (data) => ipcRenderer.invoke('db:updateBudgetItem', data)
  }
});