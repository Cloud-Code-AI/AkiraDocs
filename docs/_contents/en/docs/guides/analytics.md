---
title: Analytics Integration
description: Learn how to add analytics tracking to your documentation
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: Guides
keywords:
  - Akira Docs
  - Analytics
  - Google Analytics
---

# Analytics Integration

AkiraDocs supports Google Analytics 4 (GA4) out of the box. This guide will help you set up analytics tracking for your documentation.

## Setting up Google Analytics

1. Create a Google Analytics 4 property in your [Google Analytics account](https://analytics.google.com/)
2. Get your Measurement ID (starts with "G-")
3. Add the ID to your `akiradocs.config.json`: 
```json
{
"analytics": {
"google": {
"measurementId": "G-XXXXXXXXXX",
"enabled": true
},
"debug": false
}
}
```

## What's Tracked Automatically

- Page views
- Navigation between pages
- Time on page
- User language preferences
- Device and browser information

## Custom Event Tracking

You can track custom events using the `useAnalytics` hook:
```typescript
import { useAnalytics } from '@/hooks/useAnalytics'
function MyComponent() {
    const { track } = useAnalytics()
    const handleClick = () => {
        track('doc_rating', {
            rating: 5,
            page: 'getting-started',
            helpful: true
        })
    }
    return <button onClick={handleClick}>This was helpful</button>
}
```


## Debug Mode

Enable debug mode to see analytics events in the console during development:
```json
{
"analytics": {
"debug": true
}
}
```

This provides a complete analytics integration that's easy for users to set up and extend as needed.