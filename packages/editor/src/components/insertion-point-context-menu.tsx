import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { File, FolderPlus } from 'lucide-react';

interface InsertionPointContextMenuProps {
  onNewFile: () => void;
  onNewFolder: () => void;
  children: React.ReactNode;
}

export function InsertionPointContextMenu({
  onNewFile,
  onNewFolder,
  children,
}: InsertionPointContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onNewFile} className="cursor-pointer">
          <File className="mr-2 h-4 w-4" />
          New File
        </ContextMenuItem>
        <ContextMenuItem onClick={onNewFolder} className="cursor-pointer">
          <FolderPlus className="mr-2 h-4 w-4" />
          New Folder
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
