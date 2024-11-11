'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { getRecentContent } from '@/lib/content'
import { NotFound } from '@/components/layout/NotFound'

export const runtime = 'edge'

export default function Page({ params }: { params: Promise<{ locale: string, type: string }> }) {
  const resolvedParams = React.use(params)
  const locale = resolvedParams.locale || ''
  const type = resolvedParams.type || ''

  const recentContent = getRecentContent(`${locale}/${type}`)
  if (recentContent) {
    const redirectUrl = `/${locale}/${type}/${recentContent.slug.replace(`${type}/`, '')}`
    redirect(redirectUrl)
  }

  return <NotFound redirectUrl={`/`} />
}
