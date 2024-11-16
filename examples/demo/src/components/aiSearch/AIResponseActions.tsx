import { ThumbsUp, ThumbsDown, Copy, Share } from "lucide-react"
import { Button } from "akiradocs-ui"

export function AIResponseActions() {
    return (
      <div className="flex items-center space-x-4 w-full">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ThumbsUp className="mr-2 h-4 w-4" />
            Helpful
          </Button>
          <Button variant="outline" size="sm">
            <ThumbsDown className="mr-2 h-4 w-4" />
            Not Helpful
          </Button>
        </div>
        <div className="flex-grow"></div>
        <Button variant="ghost" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    )
  }