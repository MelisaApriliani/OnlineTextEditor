import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';

export const useWordCounter = (editor: Editor | null) => {
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        if (!editor) return;

        const updateWordCount = () => {
            const textContent = editor.getText(); 
            const count = textContent.trim().split(/\s+/).filter(Boolean).length; 
            setWordCount(count);
        };

        // Initial word count calculation
        updateWordCount();

        // Listen to editor updates for live word count
        editor.on('update', updateWordCount);

        // Cleanup listener when the editor unmounts or hook re-runs
        return () => {
            editor.off('update', updateWordCount);
        };
    }, [editor]);

    return wordCount;
};