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

export async function savePdf(buffer, filename = 'orcamento.pdf', onProgress) {
  if (!Capacitor.isNativePlatform()) {
    return await window.api.savePdf(buffer)
  }
  try {
    if(onProgress) onProgress('Preparando dados binários...')
    
    let base64 = ''
    if (typeof buffer === 'string') {
      base64 = buffer
    } else {
      if(onProgress) onProgress('Lendo nativamente como Base64...')
      const blob = buffer instanceof Blob ? buffer : new Blob([buffer], { type: 'application/pdf' })
      let dataUrl = await new Promise((resolve, reject) => {
         const reader = new FileReader()
         reader.onloadend = () => resolve(reader.result)
         reader.onerror = reject
         reader.readAsDataURL(blob)
      })
      // Strip 'data:application/pdf;base64,' prefix
      base64 = dataUrl.split(',')[1]
    }

    if(onProgress) onProgress('Gravando arquivo fisico no Cache...')
    const result = await Filesystem.writeFile({
      path: filename,
      data: base64,
      directory: Directory.Cache,
      recursive: true
    })

    if(onProgress) onProgress('Iniciando Dialog de Compartilhamento...')
    try {
      const { Share } = await import('@capacitor/share')
      await Share.share({
        title: 'Orçamento PDF',
        url: result.uri,
        dialogTitle: 'Compartilhar orçamento'
      })
      if(onProgress) onProgress('Compartilhamento concluído!')
    } catch (e) {
      console.error('Share error:', e)
      if(onProgress) onProgress('Erro no Share: ' + e.message)
      alert('Erro ao compartilhar PDF: ' + e.message)
    }

    return result.uri
  } catch (e) {
    console.error('savePdf write error:', e)
    if(onProgress) onProgress('Erro fatal na Gravação do Arquivo: ' + e.message)
    alert('Erro ao gerar PDF: ' + e.message)
    return null
  }
}

