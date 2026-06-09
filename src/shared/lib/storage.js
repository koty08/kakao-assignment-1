export function loadJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
