import { parseTimeLogEntry } from "../../time-log/domain/parse-entry.js";

export function parseTimeLogState(value) {
  if (
    typeof value !== "object" ||
    value === null ||
    !("entries" in value) ||
    !Array.isArray(value.entries)
  ) {
    return undefined;
  }
  const entries = [];
  for (const valueEntry of value.entries) {
    const entry = parseTimeLogEntry(valueEntry);
    if (entry === undefined) return undefined;
    entries.push(entry);
  }
  return { entries };
}
