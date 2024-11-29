import { getConfig } from '@/lib/config'


export function getAnalyticsConfig() {
  const config = getConfig()
  return {
    enabled: config.analytics?.google?.enabled ?? false,
    measurementId: config.analytics?.google?.measurementId,
    debug: config.analytics?.debug ?? false,
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return
  
  const { enabled, debug } = getAnalyticsConfig()
  
  if (!enabled) return
  
  if (window.gtag) {
    window.gtag('event', eventName, params)
    
    if (debug) {
      console.log('[Analytics]', eventName, params)
    }
  }
} 