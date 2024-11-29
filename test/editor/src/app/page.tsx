"use client"

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function Home() {
  useEffect(() => {
    redirect('/editMode')
  }, [])

  // Return null or loading state since we're redirecting immediately
  return null
}
