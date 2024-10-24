interface ImageBlockProps {
  src: string;
  alt: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  position?: 'left' | 'center' | 'right';
}

export function Image({ src, alt, caption, size = 'medium', position = 'center' }: ImageBlockProps) {
  const sizeClasses = {
    small: 'w-1/3',
    medium: 'w-2/3',
    large: 'w-5/6',
    full: 'w-full',
  };

  const positionClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <figure className={`my-8 ${positionClasses[position]}`}>
      <img
        src={src}
        alt={alt}
        className={`rounded-lg ${sizeClasses[size]}`}
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
