import { ThumbsUp, ThumbsDown, Copy, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

interface AIResponseActionsProps {
  response: string
}

export function AIResponseActions({ response }: AIResponseActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response)
      setCopied(true)
      toast.success("Response copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy response")
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          text: response,
          title: "AI Response Share",
        })
        toast.success("Shared successfully")
      } else {
        await handleCopy()
        toast.success("Link copied to clipboard (sharing not supported)")
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Failed to share response")
      }
    }
  }

  return (
    <div className="flex items-center space-x-4 w-full">
      {/* <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <ThumbsUp className="mr-2 h-4 w-4" />
          Helpful
        </Button>
        <Button variant="outline" size="sm">
          <ThumbsDown className="mr-2 h-4 w-4" />
          Not Helpful
        </Button>
      </div> */}
      <div className="flex-grow"></div>
      <Button variant="ghost" size="sm" onClick={handleCopy}>
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copied!" : "Copy"}
      </Button>
      <Button variant="ghost" size="sm" onClick={handleShare}>
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  )
}