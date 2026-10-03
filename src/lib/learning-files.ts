export const LEARNING_FILE_LIMIT = 3 * 1024 * 1024;
export function allowedLearningFile(bytes: Uint8Array, mime: string) {
  if (!bytes.length || bytes.length > LEARNING_FILE_LIMIT) return false;
  if (mime === "application/pdf") return new TextDecoder().decode(bytes.slice(0,5)) === "%PDF-";
  if (mime === "image/png") return [137,80,78,71,13,10,26,10].every((value,index) => bytes[index] === value);
  if (mime === "image/jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mime === "text/plain") {
    try { new TextDecoder("utf-8",{fatal:true}).decode(bytes); return !bytes.includes(0); } catch { return false; }
  }
  return false;
}
