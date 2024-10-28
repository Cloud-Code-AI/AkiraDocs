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
  info: { icon: Info, className: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950' },
  warning: { icon: AlertTriangle, className: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950' },
  success: { icon: CheckCircle, className: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' },
  error: { icon: XCircle, className: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' }
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
          'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300': type === 'info',
          'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300': type === 'warning',
          'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300': type === 'success',
          'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300': type === 'error'
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
