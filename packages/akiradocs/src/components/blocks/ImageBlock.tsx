import { cn } from "@/lib/utils";

interface ImageBlockProps {
  id?: string;
  src: string;
  alt: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  position?: 'left' | 'center' | 'right';
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function Image({ id, src, alt, caption, size = 'medium', position = 'center', align = 'left', styles }: ImageBlockProps) {
  const sizeClasses = {
    small: 'w-1/3',
    medium: 'w-2/3',
    large: 'w-5/6',
    full: 'w-full',
  };

  const positionClasses = {
    left: 'mr-auto',
    center: '', // Remove mx-auto for center
    right: 'ml-auto',
  };

  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';

  return (
    <figure id={id} className={`my-8 py-1 ${positionClasses[position]} ${alignClass}`}>
      <img
        src={src}
        alt={alt}
        className={`rounded-lg ${sizeClasses[size]} ${alignClass}`}
      />
      {caption && (
        <figcaption className={cn(
          `mt-2 text-sm text-${align} text-muted-foreground`,
          styles?.bold && 'font-bold',
          styles?.italic && 'italic',
          styles?.underline && 'underline'
        )}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
