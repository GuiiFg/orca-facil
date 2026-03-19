/**
 * File Service - abstraction for file operations across Electron & Capacitor.
 */
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory } from '@capacitor/filesystem'

/**
 * Select a file (image) from the device
 * On Electron: uses dialog.showOpenDialog via IPC
 * On Native: uses a hidden input[type=file]
 */
export async function selectFile() {
  if (!Capacitor.isNativePlatform()) {
    return await window.api.selectFile()
  }
  // Native: use HTML file picker
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/webp'
    input.onchange = () => {
      if (input.files && input.files[0]) {
        resolve(input.files[0])
      } else {
        resolve(null)
      }
    }
    input.click()
  })
}

/**
 * Convert a file to base64 data URI
 * On Electron: uses fs.readFileSync via IPC
 * On Native: uses FileReader
 */
export async function fileToBase64(fileOrPath) {
  if (!Capacitor.isNativePlatform()) {
    return await window.api.fileToBase64(fileOrPath)
  }
  // If it's a File object (from selectFile on native)
  if (fileOrPath instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(fileOrPath)
    })
  }
  // If it's a path string, try reading via Filesystem
  try {
    const file = await Filesystem.readFile({ path: fileOrPath })
    const ext = fileOrPath.split('.').pop() || 'png'
    return `data:image/${ext};base64,${file.data}`
  } catch (e) {
    console.error('fileToBase64 error:', e)
    return null
  }
}

/**
 * Save a PDF buffer to the device
 * On Electron: uses dialog.showSaveDialog via IPC
 * On Native: saves to Documents and opens share
 */
export async function savePdf(buffer, filename = 'orcamento.pdf') {
  if (!Capacitor.isNativePlatform()) {
    return await window.api.savePdf(buffer)
  }
  try {
    // Convert Uint8Array to base64
    let base64
    if (buffer instanceof Uint8Array || buffer instanceof ArrayBuffer) {
      const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer
      let binary = ''
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      base64 = btoa(binary)
    } else {
      base64 = buffer
    }

    const result = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Documents,
      recursive: true
    })

    // Try to share the file
    try {
      const { Share } = await import('@capacitor/share')
      await Share.share({
        title: 'Orçamento PDF',
        url: result.uri,
        dialogTitle: 'Compartilhar orçamento'
      })
    } catch (e) {
      // Share not available, file is saved in Documents
      console.log('PDF saved to:', result.uri)
    }

    return result.uri
  } catch (e) {
    console.error('savePdf error:', e)
    return null
  }
}
