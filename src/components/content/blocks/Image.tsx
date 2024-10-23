interface ImageBlockProps {
    src: string;
    alt: string;
    caption?: string;
  }
  
  export function Image({ src, alt, caption }: ImageBlockProps) {
    return (
      <figure className="my-8">
        <img
          src={src}
          alt={alt}
          className="rounded-lg w-full"
        />
        {caption && (
          <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }