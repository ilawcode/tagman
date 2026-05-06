type CsvValue = string | number | null | undefined;

function escapeCsvValue(value: CsvValue) {
  if (value === null || value === undefined) {
    return "";
  }

  const raw = String(value);
  const escaped = raw.replaceAll('"', '""');
  return `"${escaped}"`;
}

export function buildCsv(headers: string[], rows: CsvValue[][], includeUtf8Bom = true) {
  const headerRow = headers.map((header) => escapeCsvValue(header)).join(",");
  const bodyRows = rows.map((row) => row.map((cell) => escapeCsvValue(cell)).join(",")).join("\r\n");
  const content = [headerRow, bodyRows].filter(Boolean).join("\r\n");

  return `${includeUtf8Bom ? "\uFEFF" : ""}${content}`;
}
