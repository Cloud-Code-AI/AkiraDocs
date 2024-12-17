import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import { Plus, File, Folder } from 'lucide-react';
export function InsertionPoint({
  onNewFile,
  onNewFolder,
}: {
  onNewFile: () => void;
  onNewFolder: () => void;
}) {
  return (
    <div className="group relative py-1 -my-1">
      <div className="absolute inset-x-0 h-0.5 scale-x-0 bg-border group-hover:scale-x-100 transition-transform" />
      <ContextMenu>
        <ContextMenuTrigger>
          <button
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-background border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground"
            aria-label="Add item"
            onClick={(e) => e.preventDefault()}
          >
            <Plus className="h-3 w-3 m-auto" />
          </button>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onSelect={() => onNewFile()}>
            <File className="mr-2 h-4 w-4" />
            New File
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => onNewFolder()}>
            <Folder className="mr-2 h-4 w-4" />
            New Folder
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
