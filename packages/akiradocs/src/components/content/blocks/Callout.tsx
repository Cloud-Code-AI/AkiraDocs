import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type CalloutType = 'info' | 'warning' | 'success' | 'error'

interface CalloutProps {
  id?: string;
  type: CalloutType
  title?: string
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

const calloutStyles: Record<CalloutType, { icon: React.ElementType; className: string }> = {
  info: { icon: Info, className: 'border-primary/20 bg-primary/5' },
  warning: { icon: AlertTriangle, className: 'border-yellow-500/20 bg-yellow-500/5' },
  success: { icon: CheckCircle, className: 'border-green-500/20 bg-green-500/5' },
  error: { icon: XCircle, className: 'border-destructive/20 bg-destructive/5' }
}

export function Callout({ id, type, title, children, align = 'left', styles }: CalloutProps) {
  const { icon: Icon, className } = calloutStyles[type]

  return (
    <Alert id={id} className={cn(
      'flex flex-col sm:flex-row items-start gap-4 p-4 my-4 rounded-lg border-2',
      className,
      {
        'text-left': align === 'left',
        'text-center sm:text-left': align === 'center',
        'text-right sm:text-left': align === 'right'
      },
      styles?.bold && 'font-bold',
      styles?.italic && 'italic',
      styles?.underline && 'underline'
    )}>
      <div className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full shrink-0',
        {
          'bg-primary/10 text-primary': type === 'info',
          'bg-yellow-500/10 text-yellow-500': type === 'warning',
          'bg-green-500/10 text-green-500': type === 'success',
          'bg-destructive/10 text-destructive': type === 'error'
        }
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{children}</AlertDescription>
      </div>
    </Alert>
  )
}
