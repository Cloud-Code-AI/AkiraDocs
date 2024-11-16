'use client'

import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "akiradocs-ui"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbProps {
  type: string
  slug: string
  locale: string
}

export function PageBreadcrumb({ type, slug, locale }: BreadcrumbProps) {
  const segments = slug ? slug.split('/') : []
  const baseUrl = `/${locale}/${type}`

  return (
    <Breadcrumb className="my-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href={baseUrl} className="capitalize">
            {type}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const path = `${baseUrl}/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={path}>{segment}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 