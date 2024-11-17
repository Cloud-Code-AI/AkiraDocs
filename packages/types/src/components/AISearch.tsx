import React from "react"
export interface SearchBarProps {
    query: string
    onQueryChange: (value: string) => void
    onSubmit: (e: React.FormEvent) => void
}
