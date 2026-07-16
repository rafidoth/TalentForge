import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import '@mantine/tiptap/styles.css';
import { useEffect } from 'react';

export interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const editor = useEditor({
        editable: false,
        extensions: [
            StarterKit,
            Link,
            Markdown,
        ],
        content: content,
    });

    useEffect(() => {
        if (editor && (editor.storage as any).markdown.getMarkdown() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <RichTextEditor editor={editor} style={{ border: 'none', backgroundColor: 'transparent' }}>
            <RichTextEditor.Content style={{ padding: 0 }} />
        </RichTextEditor>
    );
}
