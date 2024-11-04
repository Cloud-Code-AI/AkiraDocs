'use client';

import React from 'react';
import { getContentBySlug, getContentNavigation } from '@/lib/content';
import { BlockRenderer } from '@/components/content/renderers/BlockRenderer';
import { Header } from '@/components/content/layout/Header';
import Footer from '@/components/content/layout/Footer';
import Navigation from '@/components/content/layout/Navigation';
import TableOfContents from '@/components/content/layout/TableOfContents';
import { getHeaderConfig } from '@/lib/headerConfig';
import { getFooterConfig } from '@/lib/footerConfig';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';
import { PageBreadcrumb } from '@/components/content/layout/Breadcrumb';
import { getNextPrevPages } from '@/utils/navigationUtils';
import { PageNavigation } from '@/components/content/layout/PageNavigation';
import { MainTitle, SubTitle } from '@/components/content/blocks/Heading';
import { SEO } from '@/components/content/SEO';
const PostContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 min-w-0 px-8 py-6 mx-4 font-sans leading-relaxed relative">
    {children}
  </div>
);

export default function ContentPage({
  params,
}: {
  params: Promise<{ type: string; slug: string[] }>;
}) {
  const resolvedParams = React.use(params);
  const type = resolvedParams.type;
  const slug = resolvedParams.slug?.length ? resolvedParams.slug.join('/') : '';
  const post = getContentBySlug(type, slug);
  const headerConfig = getHeaderConfig();
  const footerConfig = getFooterConfig();
  const navigationItems = getContentNavigation({}, type);
  const { prev, next } = getNextPrevPages(navigationItems, `/${type}/${slug}`);
  const pageTitle = post.title || 'Documentation';
  const pageDescription = post.description || 'Documentation content';
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${type}/${slug}`;

  const handleEdit = () => {
    const fileSlug =
      slug !== '' ? slug : post.id || post.filename?.replace('.json', '');
    const filePath = `${type}/${fileSlug}.json`;
    window.location.href = `/editor/${filePath}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
      />
      <Header {...headerConfig} />
      <div className="flex flex-grow">
        <Navigation key={type} items={navigationItems} />
        <div className="flex-1 flex py-4 w-full">
          <PostContainer>
            <PageBreadcrumb type={type} slug={slug} />
            {process.env.NEXT_PUBLIC_AKIRADOCS_EDIT_MODE === 'true' && (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="absolute top-0 right-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            )}

            <MainTitle>{post.title}</MainTitle>
            <SubTitle>{post.description}</SubTitle>
            <br></br>
            {post.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
            <PageNavigation prev={prev} next={next} />
          </PostContainer>
          <TableOfContents
            publishDate={post.publishDate}
            modifiedDate={post.modifiedDate}
            author={post.author}
          />
        </div>
      </div>
      <Footer {...footerConfig} />
    </div>
  );
}
