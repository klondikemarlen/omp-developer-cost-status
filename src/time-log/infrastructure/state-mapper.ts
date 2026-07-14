import { parseTimeLogEntry } from "@/time-log/domain/parse-entry.js"
import type { TimeLogEntry } from "@/time-log/domain/model.js"

export type TimeLogState = {
  entries: TimeLogEntry[]
}

export function parseTimeLogState(value: unknown): TimeLogState | undefined {
  if (
    typeof value !== "object" ||
    value === null ||
    !("entries" in value) ||
    !Array.isArray(value.entries)
  ) {
    return undefined
  }

  const entries: TimeLogEntry[] = []
  for (const valueEntry of value.entries) {
    const entry = parseTimeLogEntry(valueEntry)
    if (entry === undefined) return undefined
    entries.push(entry)
  }

  return { entries }
}
