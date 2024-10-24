"use client"
import { BookOpen } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface LegacyDocsToggleProps {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}

export function LegacyDocsToggle({ checked, onCheckedChange }: LegacyDocsToggleProps) {
    return (
        <div className="flex items-center space-x-2">
            <Switch
                id="show-docs"
                checked={checked}
                onCheckedChange={onCheckedChange}
                className="data-[state=checked]:bg-indigo-600"
            />
            <Label
                htmlFor="show-docs"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center cursor-pointer"
            >
                <BookOpen className="h-5 w-5 mr-1 text-indigo-600 dark:text-indigo-400" />
                Legacy View
            </Label>
        </div>
    )
}