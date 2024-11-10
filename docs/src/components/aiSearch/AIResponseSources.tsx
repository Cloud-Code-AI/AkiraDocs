import { Source } from "../../types/Source"

interface AIResponseSourcesProps {
    sources: Source[]
}

export function AIResponseSources({ sources }: AIResponseSourcesProps) {
    return (
        <div className="w-full">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Sources</h4>
            <ul className="space-y-1">
                {sources.map((source, index) => (
                    <li key={index}>
                        <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            {source.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}