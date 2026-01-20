export function stableId(prefix: string, params: Record<string, unknown>) {
  const normalized = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .toSorted(([a], [b]) => a.localeCompare(b));

  return [prefix, JSON.stringify(Object.fromEntries(normalized))].join(':');
}
