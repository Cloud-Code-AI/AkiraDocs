---
author: Akira Team
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: Content Management
keywords:
  - Content Creation
  - Pages
  - Organization
---

# Creating and Organizing Pages

Learn how to create, structure, and organize your documentation pages in AkiraDocs. You can create markdown pages or just use the editor UI. Note in _contents folder, you will only see markdown content created by you. If you use Editor UI, the content will be saved in the compiled folder and will be automatically translated to other languages.

## Page Structure

### Basic Page Template
```markdown
---
title: Your Page Title
description: Brief description of the page
author: Your Name
publishDate: 2024-11-26
modifiedDate: 2024-11-26
category: Category Name
keywords:
  - keyword1
  - keyword2
---

# Main Title

Content starts here...
```

### Directory Structure
```
folder_name/
├── _contents/
│   ├── en/
│   │   ├── getting-started/
│   │   ├── guides/
│   │   └── api/
```

You can just create pages for default language (en) and AkiraDocs will automatically translate them to other languages.

## Creating New Pages

### Method 1: Using the UI
1. Click "New Page" in the sidebar
2. Start adding content

### Method 2: Direct File Creation
1. Create a new `.md` file in the appropriate directory
2. Add required frontmatter
3. Write content using Markdown
4. Save and compile

## Page Organization

### Categories and Tags
- Use consistent categories
- Apply relevant tags
- Organize by topic
- Create logical hierarchies

### Navigation Structure
This is automatically generated from the folder structure. You can customize it by editing the `_meta.json` file inside compiled folder.
```json
{
  "docs": {
    "getting-started": {
      "title": "Getting Started",
      "items": {
        "introduction": {
          "title": "Introduction",
          "path": "/docs/getting-started/introduction"
        }
      }
    }
  }
}
```
