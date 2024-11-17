export interface Source {
    id: string;
    title: string;
    url: string;
  }

export interface AIResponseSourcesProps {
    sources: Source[]
}

export interface AIResponseProps {
  response: string
  sources: Source[]
  onBack: () => void
}