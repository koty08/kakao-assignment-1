import { useState } from 'react'

export const FILTER = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
}

export function useFilter() {
  const [currentFilter, setFilter] = useState(FILTER.ALL)
  return { currentFilter, setFilter }
}
