// components/notes/BlockEditor.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Command } from 'cmdk';

interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberedList' | 'code';
  content: string;
}

interface BlockEditorProps {
  initialBlocks?: Block[];
  onChange: (blocks: Block[]) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ initialBlocks = [], onChange }) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandMenuPosition, setCommandMenuPosition] = useState({ top: 0, left: 0 });
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (JSON.stringify(blocks) !== JSON.stringify(initialBlocks)) {
      onChange(blocks);
    }
  }, [blocks, onChange, initialBlocks]);

  const createNewBlock = (type: Block['type'] = 'paragraph', afterId?: string) => {
    const newBlock: Block = { id: Date.now().toString(), type, content: '' };
    if (afterId) {
      const index = blocks.findIndex(b => b.id === afterId);
      setBlocks([...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)]);
    } else {
      setBlocks([...blocks, newBlock]);
    }
    setFocusedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, ...updates } : block));
  };

  const deleteBlock = (id: string) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index > 0) {
      setFocusedBlockId(blocks[index - 1].id);
    }
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent, block: Block) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      createNewBlock(block.type, block.id);
    } else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      deleteBlock(block.id);
    } else if (e.key === '/' && block.content === '') {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setCommandMenuPosition({ top: rect.bottom, left: rect.left });
      setShowCommandMenu(true);
    }
  };

  const handleCommand = (command: string) => {
    if (focusedBlockId) {
      updateBlock(focusedBlockId, { type: command as Block['type'] });
    }
    setShowCommandMenu(false);
  };

  const renderBlock = (block: Block) => {
    const commonProps = {
      ref: (el: HTMLDivElement | null) => blockRefs.current[block.id] = el,
      contentEditable: true,
      onFocus: () => setFocusedBlockId(block.id),
      onBlur: (e: React.FocusEvent<HTMLDivElement>) => updateBlock(block.id, { content: e.target.innerText }),
      onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => handleKeyDown(e, block),
      dangerouslySetInnerHTML: { __html: block.content },
    };

    switch (block.type) {
      case 'heading1':
        return <h1 {...commonProps} className="text-4xl font-bold" />;
      case 'heading2':
        return <h2 {...commonProps} className="text-3xl font-bold" />;
      case 'heading3':
        return <h3 {...commonProps} className="text-2xl font-bold" />;
      case 'bulletList':
        return <li {...commonProps} className="list-disc ml-5" />;
      case 'numberedList':
        return <li {...commonProps} className="list-decimal ml-5" />;
      case 'code':
        return <pre {...commonProps} className="bg-gray-100 p-2 rounded font-mono" />;
      default:
        return <p {...commonProps} />;
    }
  };

  return (
    <div className="p-4 relative">
      {blocks.map(block => (
        <div key={block.id} className="mb-2">
          {renderBlock(block)}
        </div>
      ))}
      {showCommandMenu && (
        <div style={{ position: 'absolute', top: commandMenuPosition.top, left: commandMenuPosition.left }}>
          <Command>
            <Command.Input placeholder="Type a command" />
            <Command.List>
              <Command.Item onSelect={() => handleCommand('paragraph')}>Text</Command.Item>
              <Command.Item onSelect={() => handleCommand('heading1')}>Heading 1</Command.Item>
              <Command.Item onSelect={() => handleCommand('heading2')}>Heading 2</Command.Item>
              <Command.Item onSelect={() => handleCommand('heading3')}>Heading 3</Command.Item>
              <Command.Item onSelect={() => handleCommand('bulletList')}>Bullet List</Command.Item>
              <Command.Item onSelect={() => handleCommand('numberedList')}>Numbered List</Command.Item>
              <Command.Item onSelect={() => handleCommand('code')}>Code Block</Command.Item>
            </Command.List>
          </Command>
        </div>
      )}
    </div>
  );
};

export default BlockEditor;