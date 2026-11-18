export function normalizeAnswer(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/["'`]/g, " ")
    .replace(/[,;\n\r\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
