'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TextToSpeechProps {
  blocks: any[];
}

// Define fixed voice options with clearer voices
const VOICE_OPTIONS = [
  { name: 'Samantha', lang: 'en-US' },      // Clear, natural female voice
  { name: 'Daniel', lang: 'en-GB' },        // Clear male voice
  { name: 'Karen', lang: 'en-AU' },         // Clear Australian female voice
  { name: 'Moira', lang: 'en-IE' }          // Clear Irish female voice
];

export function TextToSpeech({ blocks }: TextToSpeechProps) {
  const [mounted, setMounted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getVoice = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes(VOICE_OPTIONS[selectedVoiceIndex].name)
    );
    return preferredVoice || voices[0];
  }, [selectedVoiceIndex]);

  const generateSpeechText = (blocks: any[]) => {
    return blocks
      .filter(block => block.content !== undefined)
      .map(block => {
        try {
          switch (block.type) {
            case 'heading':
              return `${block.content}. `;
            
            case 'paragraph':
              return `${block.content} `;
            
            case 'list':
              const listItems = Array.isArray(block.content) ? block.content : block.content.split('\n').filter((item: string) => item.trim());
              return `${listItems.join(', ')}`;
            
            case 'checkList':
              if (block.metadata?.checkedItems) {
                return `Checklist: ${block.metadata.checkedItems.map((item: { text: string; checked: boolean }) => 
                  `${item.text} (${item.checked ? 'checked' : 'unchecked'})`
                ).join(', ')}`;
              }
              return '';
            
            case 'toggleList':
              if (block.metadata?.items) {
                return `Toggle list: ${block.metadata.items.map((item: { title: string; content: string }) => 
                  `${item.title}: ${item.content}`
                ).join('. ')}`;
              }
              return '';
            
            case 'blockquote':
              return `Quote: ${block.content}. `;
            
            case 'code':
              const lang = block.metadata?.language || 'code';
              const filename = block.metadata?.filename ? ` in file ${block.metadata.filename}` : '';
              return `Code block${filename} in ${lang}. `;
            
            case 'table':
              try {
                const tableData = typeof block.content === 'string' 
                  ? JSON.parse(block.content)
                  : block.content;
                return `Table with ${tableData.rows?.length || 0} rows and ${tableData.columns?.length || 0} columns. `;
              } catch {
                return 'Table content. ';
              }
            
            case 'image':
              try {
                const imageContent = typeof block.content === 'string' 
                  ? JSON.parse(block.content)
                  : block.content;
                const caption = imageContent.caption ? `: ${imageContent.caption}` : '';
                return `Image for ${caption}. `;
              } catch {
                return 'Image. ';
              }
            
            case 'video':
              const videoCaption = block.metadata?.caption ? `: ${block.metadata.caption}` : '';
              return `Video for ${videoCaption}. `;
            
            case 'audio':
              const audioCaption = block.metadata?.caption ? `: ${block.metadata.caption}` : '';
              return `Audio for ${audioCaption}. `;
            
            case 'file':
              const fileName = block.metadata?.filename || 'file';
              return `Downloadable file called ${fileName}. `;
            
            case 'callout':
              const type = block.metadata?.type || 'info';
              const title = block.metadata?.title ? `, titled ${block.metadata.title}` : '';
              return `${type} callout${title}: ${block.content}. `;
            
            case 'divider':
              return '';
            
            default:
              return '';
          }
        } catch (error) {
          console.error(`Error processing block of type ${block.type}:`, error);
          return '';
        }
      })
      .join(' ');
  };

  const speak = useCallback(() => {
    if (typeof window === 'undefined') return;

    window.speechSynthesis.cancel();
    const text = generateSpeechText(blocks);
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = getVoice();
    if (voice) utterance.voice = voice;
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [blocks, getVoice]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings2 className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {VOICE_OPTIONS.map((voice, index) => (
            <DropdownMenuItem
              key={voice.lang}
              onClick={() => setSelectedVoiceIndex(index)}
              className={selectedVoiceIndex === index ? "bg-accent" : ""}
            >
              {voice.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        onClick={speaking ? stop : speak}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        {speaking ? (
          <>
            <VolumeX className="w-4 h-4" />
            Stop Reading
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            Read Content
          </>
        )}
      </Button>
    </div>
  );
}