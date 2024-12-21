'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Loader2, RefreshCcw, Home } from "lucide-react"

export function NotFound({ redirectUrl = '/' }: { redirectUrl?: string }) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [robotMood, setRobotMood] = useState<'confused' | 'thinking' | 'happy'>('confused')

  const messages = useMemo(() => [
    "Oops! Our AI seems to have misplaced this page in its neural network.",
    "Don't panic! Even the smartest AIs make mistakes sometimes.",
    "Our digital detectives are on the case, searching through bits and bytes.",
    "While we're looking, why not enjoy this little chat with our 404 AI assistant?",
    "Fun fact: In binary, 404 is 110010100. But that doesn't help us find your page!",
    "We've dispatched our fastest algorithms to locate your missing content.",
    "Looks like this page is playing hide and seek. We're pretty good at seeking though!",
    "Our AI is feeling a bit embarrassed about this. Can you tell?",
    "On the bright side, you've discovered our super-secret 404 page. Congratulations!",
    "We're not saying it was aliens, but... okay, it probably wasn't aliens.",
  ], [])

  useEffect(() => {
    let messageIndex = 0
    let charIndex = 0
    let typeMessageTimeout: NodeJS.Timeout
    let typingTimeout: NodeJS.Timeout
    let moodTimeout: NodeJS.Timeout

    const typeMessage = () => {
      if (messageIndex < messages.length) {
        if (charIndex < messages[messageIndex].length) {
          setCurrentMessage(prev => prev + messages[messageIndex][charIndex])
          charIndex++
          typeMessageTimeout = setTimeout(typeMessage, 30)
        } else {
          typingTimeout = setTimeout(() => {
            setIsTyping(false)
            moodTimeout = setTimeout(() => {
              setIsTyping(true)
              messageIndex++
              charIndex = 0
              setCurrentMessage('')
              setRobotMood(messageIndex % 2 === 0 ? 'thinking' : 'confused')
              typeMessage()
            }, 1000)
          }, 1000)
        }
      } else {
        setIsTyping(false)
        setRobotMood('happy')
      }
    }

    typeMessage()

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          router.push(redirectUrl)
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(typeMessageTimeout)
      clearTimeout(typingTimeout)
      clearTimeout(moodTimeout)
    }
  }, [messages, redirectUrl, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="90" fill="#4F46E5" className="animate-pulse" />
                <circle cx="70" cy="80" r="10" fill="white" />
                <circle cx="130" cy="80" r="10" fill="white" />
                <path
                  d={
                    robotMood === 'confused'
                      ? "M 60 130 Q 100 100 140 130"
                      : robotMood === 'thinking'
                      ? "M 60 120 H 140"
                      : "M 60 110 Q 100 140 140 110"
                  }
                  stroke="white"
                  strokeWidth="6"
                  fill="transparent"
                />
              </svg>
              {isTyping && (
                <div className="absolute top-0 right-0 -mr-4 -mt-4">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <p className="text-lg font-semibold mb-2">404 AI Assistant says:</p>
            <p className="text-md">{currentMessage}</p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push(redirectUrl)}
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Redirecting in {countdown} seconds...</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Powered by</span>
            <Bot className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-blue-600">AkiraDocs</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}