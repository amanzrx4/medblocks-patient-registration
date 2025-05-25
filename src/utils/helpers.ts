import { queries } from '@/db/queries'
import type { PatientTable, PGliteWorkerWithLive } from '@/utils'
import * as XLSX from 'xlsx'
import { DB_NAME } from '@/utils'
import { live } from '@electric-sql/pglite/live'
import { PGliteWorker } from '@electric-sql/pglite/worker'

export function base64ToUint8Array(base64String: Base64URLString) {
  const base64Data = base64String.split(',')[1]
  const binaryString = atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

function uint8ArrayToBase64(bytes: Uint8Array) {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function uint8ArrayToDataURL(bytes: Uint8Array, mime = 'image/jpg') {
  const base64 = uint8ArrayToBase64(bytes)
  return `data:${mime};base64,${base64}`
}

export async function imageEncodeUint8Array(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  return new Uint8Array(arrayBuffer)
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
    // ducktaping since this type is not officially exported
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

export function getFormattedDate(dt: Date) {
  const now = new Date(dt)
  const date = now.getDate().toLocaleString()
  const day = now.getDay().toLocaleString()
  const year = now.getFullYear()
  return `${date}/${day}/${year}`
}

export function scrollToTop() {
  document.body.scrollTop = document.documentElement.scrollTop = 0
}

/**
 *
 * @param arr Array of objects
 * @description Removes the keys that consistently have null values in all objects of the array
 */
export function cleanArray<T>(arr: T[]) {
  const nullKeys = Object.keys(arr[0] || {}).filter((k) =>
    arr.every((o) => o[k as keyof T] === null)
  )
  return arr.map((o) =>
    Object.fromEntries(
      Object.entries(o as Record<string, unknown>).filter(
        ([k]) => !nullKeys.includes(k)
      )
    )
  )
}

/**
 *
 * @param key string key
 * @returns formatted postgres table key into readable format
 */
export function formatKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function formatValueForObj(key: keyof PatientTable, value: unknown) {
  if (value === null || value === undefined) return ''

  switch (key) {
    case 'photo':
      return value ? '✅' : '❌'
    case 'registration_datetime':
    case 'dob':
    case 'created_at':
      return getFormattedDate(new Date(value as string))
    case 'key_value_pairs':
      return JSON.stringify(value)
    default:
      return String(value)
  }
}
