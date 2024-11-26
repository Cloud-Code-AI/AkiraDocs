'use client'

import { useCallback } from 'react'
import { trackEvent } from '@/lib/analytics'

export function useAnalytics() {
  const track = useCallback((eventName: string, params?: Record<string, any>) => {
    trackEvent(eventName, params)
  }, [])

  return { track }
} 