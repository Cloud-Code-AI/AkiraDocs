'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { getRecentContent } from '@/lib/content'

const PostContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto px-6 font-sans leading-relaxed relative">
    {children}
  </div>
)

export default function Page({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = React.use(params)
  const type = resolvedParams.type || ''
  const recentContent = getRecentContent(type)
  if (recentContent) {
    redirect(`/${type}/${recentContent.slug}`)
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-grow">
        <div className="flex-1 flex py-4">
          <PostContainer>
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Sorry, we couldn't find the page you're looking for. Please check the URL or navigate using the menu.
              </p>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex items-center gap-2"
              >
                ← Go Back
              </Button>
            </div>
          </PostContainer>
        </div>
      </div>
    </div>
  )
}