import { PGliteWorker } from '@electric-sql/pglite/worker'
import { DB_NAME } from '@/utils'
import { live } from '@electric-sql/pglite/live'
import { queries } from '@/db/queries'
import type { PGliteWorkerWithLive } from '@/utils'
import * as XLSX from 'xlsx'

export function base64ToUint8Array(base64String: Base64URLString) {
  const base64Data = base64String.split(',')[1]

  const binaryString = atob(base64Data)

  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes
}

export function uint8ArrayToDataURL(bytes: Uint8Array, mime = 'image/jpg') {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  return `data:${mime};base64,${base64}`
}
export function base64ToHex(base64String: string) {
  const base64Data = base64String.split(',')[1]
  const binaryString = atob(base64Data)

  let hex = ''
  for (let i = 0; i < binaryString.length; i++) {
    const hexByte = binaryString.charCodeAt(i).toString(16).padStart(2, '0')
    hex += hexByte
  }

  return hex
}

export async function dbSetUp() {
  const db = new PGliteWorker(
    new Worker(new URL('/src/my-pglite-worker.js', import.meta.url), {
      type: 'module'
    }),

    {
      dataDir: `idb://${DB_NAME}`,
      extensions: {
        live
      }
    }
    // ducktaping since this type is not official exported
  ) as PGliteWorkerWithLive

  await db.exec(queries.prod.createTable)

  return db
}

export async function excelExport<T>(data: T[]) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Patients')

  const fileName = `patient_records_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}
