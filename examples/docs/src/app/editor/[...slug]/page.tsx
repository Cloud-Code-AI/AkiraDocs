'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from 'akiradocs-ui';
import { toast } from 'sonner';
import { BlockType } from 'akiradocs-core';
import { Plus } from 'lucide-react';
import { ArticleHeaders } from 'akiradocs-ui';
import { TitleBar } from 'akiradocs-ui';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableBlock } from 'akiradocs-ui';
import { SEO } from 'akiradocs-ui';
// import { MarkdownEditor } from 'akiradocs-ui';
// import { SegmentedControl } from 'akiradocs-ui';

type Block = {
  id: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, any>;
};

export default function ArticleEditorContent({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = React.use(params);
  const filePath = resolvedParams.slug?.length
    ? resolvedParams.slug.join('/')
    : '';
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeChangeTypeId, setActiveChangeTypeId] = useState<string | null>(
    null
  );
  const [editorMode, setEditorMode] = useState<'blocks' | 'markdown'>('blocks');

  useEffect(() => {
    const loadFileContent = async () => {
      if (!filePath) {
        setBlocks([{ id: '1', type: 'paragraph', content: '', metadata: {} }]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/files?path=${encodeURIComponent(filePath)}`
        );
        if (!response.ok) throw new Error('Failed to load file');
        const data = await response.json();
        setTitle(data.title || '');
        setSubtitle(data.description || '');
        setBlocks(
          data.blocks || [
            { id: '1', type: 'paragraph', content: '', metadata: {} },
          ]
        );
      } catch (error) {
        console.error('Error loading file:', error);
        setBlocks([{ id: '1', type: 'paragraph', content: '', metadata: {} }]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFileContent();
  }, [filePath]);

  const handleSave = async () => {
    if (!filePath) {
      console.error('No file path specified');
      return;
    }

    setIsSaving(true);
    try {
      const content = {
        title,
        description: subtitle,
        author: 'Anonymous',
        publishDate: new Date().toISOString().split('T')[0],
        modifiedDate: new Date().toISOString().split('T')[0],
        blocks,
      };

      const response = await fetch('/api/files', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: filePath,
          content,
          format: editorMode === 'markdown' ? 'markdown' : 'json',
        }),
      });

      if (!response.ok) throw new Error('Failed to save file');
      toast.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const addBlock = (afterId: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type: 'paragraph',
      content: '',
      metadata: {},
    };

    if (newBlock.type === 'list') {
      newBlock.content = '[]';
    }

    if (afterId === 'new') {
      setBlocks([newBlock]);
    } else {
      const index = blocks.findIndex((block) => block.id === afterId);
      setBlocks([
        ...blocks.slice(0, index + 1),
        newBlock,
        ...blocks.slice(index + 1),
      ]);
    }
    setActiveChangeTypeId(newBlock.id);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === id) {
          if (block.type === 'list') {
            try {
              const parsed = JSON.parse(content);
              return {
                ...block,
                content: JSON.stringify(
                  Array.isArray(parsed) ? parsed : [parsed]
                ),
              };
            } catch {
              return { ...block, content: JSON.stringify([content]) };
            }
          }
          return { ...block, content };
        }
        return block;
      })
    );
  };

  const changeBlockType = (id: string, newType: BlockType) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, type: newType } : block
      )
    );
    setActiveChangeTypeId(null);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);

        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <SEO title={`${title} | Editor`} description={subtitle} noIndex={true} />
      <TitleBar
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <div className="flex justify-between items-center">
        {/* <SegmentedControl
          value={editorMode}
          onValueChange={(value) =>
            setEditorMode(value as 'blocks' | 'markdown')
          }
          options={[
            { label: 'Block Editor', value: 'blocks' },
            { label: 'Markdown', value: 'markdown' },
          ]}
        /> */}
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={blocks}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              updateBlock={updateBlock}
              changeBlockType={changeBlockType}
              addBlock={addBlock}
              deleteBlock={deleteBlock}
              showPreview={showPreview}
              isChangeTypeActive={activeChangeTypeId === block.id}
              setActiveChangeTypeId={setActiveChangeTypeId}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

