"use client"
import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  author?: string
  publishDate?: string
  modifiedDate?: string
  category?: string
  keywords?: string[]
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  ogImage = '/akiradocs_logo.svg',
  noIndex = false,
  author,
  publishDate,
  modifiedDate,
  category,
  keywords = []
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {author && <meta name="author" content={author} />}
      {publishDate && <meta name="article:published_time" content={publishDate} />}
      {modifiedDate && <meta name="article:modified_time" content={modifiedDate} />}
      {category && <meta name="article:section" content={category} />}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: description,
          image: ogImage,
          author: author ? { '@type': 'Person', name: author } : undefined,
          datePublished: publishDate,
          dateModified: modifiedDate,
          keywords: keywords.join(',')
        })}
      </script>
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex" />}
    </Head>
  )
} 