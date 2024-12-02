'use client';

import { TextToSpeech } from '@/components/tts/TextToSpeech';
import { Edit2 } from 'lucide-react';
import { Button } from '../ui/button';

interface ClientSideControlsProps {
  editMode: boolean;
  textToSpeech: boolean;
  locale: string;
  type: string;
  slug: string;
  blocks: any[]; // Replace with your blocks type
}

export function ClientSideControls({
  editMode,
  textToSpeech,
  locale,
  type,
  slug,
  blocks
}: ClientSideControlsProps) {
  return (
    <>
      {editMode && (
        <Button variant="outline" size="icon">
          <Edit2 className="w-4 h-4" />
        </Button>
      )}
      {textToSpeech && (
        <TextToSpeech blocks={blocks} />
      )}
    </>
  );
}