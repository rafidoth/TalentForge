import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { Input } from '@mantine/core';
import '@mantine/tiptap/styles.css';
import { useEffect } from 'react';

export interface MarkdownEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    label?: React.ReactNode;
    description?: React.ReactNode;
    error?: React.ReactNode;
}

export function MarkdownEditor({ value = '', onChange, label, description, error }: MarkdownEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
            Markdown.configure({ transformPastedText: true }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange((editor.storage as any).markdown.getMarkdown());
            }
        },
    });

    useEffect(() => {
        if (editor && value !== (editor.storage as any).markdown.getMarkdown()) {
            if (value === '' || value == null) {
                editor.commands.setContent('');
            }
        }
    }, [value, editor]);

    return (
        <Input.Wrapper label={label} description={description} error={error}>
            <RichTextEditor editor={editor} style={{ minHeight: 200, display: 'flex', flexDirection: 'column' }}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Undo />
                        <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content style={{ flex: 1, minHeight: 150 }} />
            </RichTextEditor>
        </Input.Wrapper>
    );
}
