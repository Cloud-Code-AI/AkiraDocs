import { FileSystemContentProvider, createContentProvider } from 'akiradocs-core';

let contentProvider: FileSystemContentProvider;

export function initializeContent() {
  if (!contentProvider) {
    contentProvider = createContentProvider('filesystem', {
      contentRoot: process.cwd() + '/_contents'
    });
  }
  return contentProvider;
}

export function getContentProvider(): FileSystemContentProvider {
  if (!contentProvider) {
    throw new Error('Content provider not initialized');
  }
  return contentProvider;
}