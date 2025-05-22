export function base64ToUint8Array(base64String: Base64URLString) {
  const base64Data = base64String.split(',')[1]

  const binaryString = atob(base64Data)

  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes
}
