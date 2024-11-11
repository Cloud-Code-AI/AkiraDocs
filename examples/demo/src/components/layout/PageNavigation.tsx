import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button"

interface PageNavigationProps {
  prev: { title: string; path: string } | null;
  next: { title: string; path: string } | null;
  locale: string;
}

export function PageNavigation({ prev, next, locale }: PageNavigationProps) {
  return (
    <div className="flex justify-between items-center mt-16 pt-8 border-t">
      {prev ? (
        <Link href={`/${locale}${prev.path}`}>
          <Button variant="ghost" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">Previous</span>
              <span className="text-sm">{prev.title}</span>
            </div>
          </Button>
        </Link>
      ) : <div />}
      
      {next ? (
        <Link href={`/${locale}${next.path}`}>
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Next</span>
              <span className="text-sm">{next.title}</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : <div />}
    </div>
  );
} 