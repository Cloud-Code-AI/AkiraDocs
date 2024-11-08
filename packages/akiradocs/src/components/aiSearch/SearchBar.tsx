"use client"
import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
    query: string
    onQueryChange: (value: string) => void
    onSubmit: (e: React.FormEvent) => void
}

export function SearchBar({ query, onQueryChange, onSubmit }: SearchBarProps) {
    return (
        <form onSubmit={onSubmit} className="flex-1 max-w-2xl w-full">
            <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="What do you want to learn?"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    className="pl-12 pr-20 py-6 w-full text-lg rounded-full focus-visible:ring-2 focus-visible:ring-primary shadow-lg"
                />
                <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-2 bg-accent hover:bg-accent/80 text-accent-foreground"
                >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Search
                </Button>
            </div>
        </form>
    )
}