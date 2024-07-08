"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"; // import the useToast hook
import { auth } from '@/lib/firebase'; // Adjust this import path as needed
import { supabase } from '@/lib/supabaseClient'; // Adjust this import path as needed
import { User } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Code,
  Link2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Unlink2,
  Undo2,
  Redo2,
  Trash2,
} from 'lucide-react';
import './NoteEditor.css';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const MenuBar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const buttonClass = (active: boolean) =>
    active ? 'is-active bg-blue-500 text-white' : 'bg-gray-200 text-black';

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex space-x-2 mb-4">
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 1 }))}
      >
        H1
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
      >
        H2
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive('heading', { level: 3 }))}
      >
        H3
      </Button>
      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={buttonClass(editor.isActive('paragraph'))}
      >
        Paragraph
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
      >
        <Bold size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
      >
        <Italic size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive('underline'))}
      >
        <UnderlineIcon size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive('strike'))}
      >
        Strike
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={buttonClass(editor.isActive('highlight'))}
      >
        Highlight
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={buttonClass(editor.isActive({ textAlign: 'left' }))}
      >
        <AlignLeft size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={buttonClass(editor.isActive({ textAlign: 'center' }))}
      >
        <AlignCenter size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={buttonClass(editor.isActive({ textAlign: 'right' }))}
      >
        <AlignRight size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={buttonClass(editor.isActive({ textAlign: 'justify' }))}
      >
        <AlignJustify size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
      >
        <List size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
      >
        <ListOrdered size={18} />
      </Button>
      <Button
        onClick={setLink}
        className={buttonClass(editor.isActive('link'))}
      >
        <Link2 size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className={buttonClass(false)}
      >
        <Unlink2 size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={buttonClass(editor.isActive('codeBlock'))}
      >
        <Code size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 size={18} />
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 size={18} />
      </Button>
    </div>
  );
};

const NoteEditor: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast(); // use the useToast hook

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      CodeBlock,
      Link.configure({
        autolink: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'underline',
        },
      }),
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Type / for commands...',
      }),
    ],
    content: currentNote?.content || '',
    onUpdate: ({ editor }) => {
      if (currentNote) {
        const json = editor.getJSON();
        setCurrentNote(prevNote => ({ ...prevNote!, content: JSON.stringify(json), updatedAt: new Date() }));
      }
    },
    editorProps: {
      handleClick: (view, pos, event) => {
        const attrs = view.state.schema.marks.link?.isInSet(view.state.doc.resolve(pos).marks());
        if (attrs) {
          const url = attrs.attrs.href;
          if (event.shiftKey) {
            window.open(url, '_blank');
            return true;
          }
        }
        return false;
      },
    },
  });

  const saveNote = useCallback(async () => {
    if (currentNote) {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: currentNote.title,
          content: currentNote.content,
          updatedAt: new Date(),
        })
        .eq('id', currentNote.id)
        .select();

      if (error) {
        console.error('Error updating note:', error);
      } else if (data) {
        setNotes(prevNotes =>
          prevNotes.map(note =>
            note.id === currentNote.id ? data[0] : note
          )
        );
        setCurrentNote(data[0]);
        toast({
          description: "Note saved.",
        }); // show toast notification
      }
    }
  }, [currentNote, toast]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveNote]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchNotes(user.uid);
      } else {
        setNotes([]);
        setCurrentNote(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editor && currentNote) {
      editor.commands.setContent(JSON.parse(currentNote.content));
    }
  }, [currentNote, editor]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      saveNote();
    }, 120000); // 2 minutes

    return () => clearInterval(intervalId);
  }, [saveNote]);

  const fetchNotes = async (userId: string) => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('userId', userId)
      .order('updatedAt', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
    }
  };

  const createNewNote = useCallback(async () => {
    if (!user) return;

    const newNote: Note = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: JSON.stringify([{ type: 'paragraph' }]),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.uid,
    };

    const { data, error } = await supabase
      .from('notes')
      .insert([newNote])
      .select();

    if (error) {
      console.error('Error creating note:', error);
    } else if (data) {
      setNotes(prevNotes => [...prevNotes, data[0]]);
      setCurrentNote(data[0]);
    }
  }, [user]);

  const deleteNote = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
    } else {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setCurrentNote(null);
    }
  }, []);

  return (
    <div className="flex h-full">
      {/* Note list */}
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        <Button onClick={createNewNote} className="mb-4 w-full">New Note</Button>
        {notes.map(note => (
          <div 
            key={note.id} 
            className={`p-2 mb-2 cursor-pointer ${currentNote?.id === note.id ? 'bg-gray-200' : ''}`}
            onClick={() => setCurrentNote(note)}
          >
            <h3 className="font-bold">{note.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(note.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Note editor */}
      <div className="w-3/4 p-4">
        {currentNote && editor && (
          <>
            <div className="flex justify-between mb-4">
              <Input 
                value={currentNote.title}
                onChange={(e) => setCurrentNote(prevNote => prevNote ? { ...prevNote, title: e.target.value } : prevNote)}
                className="text-2xl font-bold"
              />
              <Button onClick={() => deleteNote(currentNote.id)} variant="destructive">
                <Trash2 />
              </Button>
            </div>
            <MenuBar editor={editor} />
            <div className="border rounded-lg p-4 mb-4 editor-content">
              <EditorContent editor={editor} className="prose max-w-none" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
