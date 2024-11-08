import React from 'react';

interface IconSVGProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const IconSVG: React.FC<IconSVGProps> = ({ src, alt, width = 24, height = 24, className }) => {
  const [svgContent, setSvgContent] = React.useState<string>('');

  React.useEffect(() => {
    fetch(src)
      .then(res => res.text())
      .then(setText => {
        // Parse the SVG content to modify viewBox if necessary
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(setText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        if (svgElement) {
          svgElement.setAttribute('width', width.toString());
          svgElement.setAttribute('height', height.toString());
          if (!svgElement.getAttribute('viewBox')) {
            svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
          }
        }
        setSvgContent(svgDoc.documentElement.outerHTML);
      });
  }, [src, width, height]);

  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      role="img"
      aria-label={alt}
      style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default IconSVG;