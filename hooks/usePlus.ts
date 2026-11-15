'use client'

import { useEffect, useState } from 'react'
import { isPlus, subscribePlus } from '@/lib/monetization'

export const usePlus = (): boolean => {
  const [plus, setPlusState] = useState(isPlus)
  useEffect(() => subscribePlus(setPlusState), [])
  return plus
}
