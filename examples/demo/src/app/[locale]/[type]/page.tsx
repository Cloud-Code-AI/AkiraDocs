'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { getRecentContent } from '@/lib/content'
import { NotFound } from '@/components/layout/NotFound'

const PostContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto px-6 font-sans leading-relaxed relative">
    {children}
  </div>
)

export default function Page({ params }: { params: Promise<{ locale: string, type: string }> }) {
  const resolvedParams = React.use(params)
  const locale = resolvedParams.locale || ''
  const type = resolvedParams.type || ''

  const recentContent = getRecentContent(`${locale}/${type}`)
  if (recentContent) {
    redirect(`/${locale}/${type}/${recentContent.slug}`)
  }

  return <NotFound redirectUrl={`/${locale}/${type}`} />
}
