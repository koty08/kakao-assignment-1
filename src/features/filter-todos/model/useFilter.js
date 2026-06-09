import { useState } from 'react'
import { FILTER } from '@/shared/lib'

export function useFilter() {
  const [currentFilter, setFilter] = useState(FILTER.ALL)
  return { currentFilter, setFilter }
}
