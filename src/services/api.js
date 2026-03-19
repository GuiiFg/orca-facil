/**
 * API Service - Platform-agnostic API layer.
 * Routes calls to Electron (window.api) or Capacitor (SQLite plugin)
 * depending on the runtime environment.
 */
import { selectFile, fileToBase64, savePdf } from './fileService.js'

let _api = null
let _initialized = false

/**
 * Detects if running inside Capacitor native (Android/iOS)
 */
function isCapacitorNative() {
  try {
    // Capacitor injects this into window
    return window.Capacitor && window.Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

/**
 * Initialize the correct API backend.
 * Must be called once at app startup (in renderer.js / main.ts).
 */
export async function initApi() {
  if (_initialized) return _api

  if (isCapacitorNative()) {
    // Mobile: use Capacitor SQLite
    const { createCapacitorApi, initDatabase } = await import('./capacitorDb.js')
    await initDatabase()
    _api = createCapacitorApi()
  } else {
    // Desktop: use Electron IPC (window.api from preload.js)
    _api = window.api
  }

  // Override file operations with platform-aware versions
  _api.selectFile = selectFile
  _api.fileToBase64 = fileToBase64
  _api.savePdf = savePdf

  _initialized = true
  return _api
}

/**
 * Get the API instance. Throws if not initialized.
 */
export function getApi() {
  if (!_api) {
    // Fallback: if running in Electron and not explicitly initialized,
    // use window.api directly
    if (typeof window !== 'undefined' && window.api) {
      _api = { ...window.api, selectFile, fileToBase64, savePdf }
      _initialized = true
      return _api
    }
    throw new Error('API not initialized. Call initApi() first.')
  }
  return _api
}

/**
 * Convenience export — import { api } from '@/services/api.js'
 * Uses a Proxy so it lazily resolves on first access.
 */
export const api = new Proxy({}, {
  get(_, prop) {
    return getApi()[prop]
  }
})
