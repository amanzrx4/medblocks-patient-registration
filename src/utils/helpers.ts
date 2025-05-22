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
