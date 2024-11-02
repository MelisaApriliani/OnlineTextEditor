import React, { useEffect, useState, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEditorStoreContext } from '../stores/EditorStoreProvider';
import VersionService from '../services/VersionService';
import { Step } from '../models/Step';
import { Version } from '../models/Version';
import { useWordCounter } from '../hooks/useWordCounter';
import '../styles/global.css';

const TextEditor: React.FC = () => {

    const storeContext = useEditorStoreContext();
    const { documentStore, versionStore } = storeContext
    const { document } = documentStore;
    const { currentBranchId, currentVersionId } = versionStore;
    const versionService = new VersionService(storeContext);

    const [editorContent, setEditorContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [steps, setSteps] = useState<Step[]>([]);
    const editorContentRef = useRef(editorContent); 

    const editor = useEditor({
        extensions: [StarterKit],
        content: editorContent,
        onUpdate: ({ editor }) => {
            const currentContent = editor.getHTML();
            if (currentContent !== editorContentRef.current) {
                const step: Step = {
                    id: `${Date.now()}`,
                    content: currentContent,
                    createdAt: new Date(),
                };
                setSteps((prevSteps) => [...prevSteps, step]);
                editorContentRef.current = currentContent; // Update ref, not state
                setEditorContent(currentContent); // Update state if needed
            }
        },
    });

    const wordCount = useWordCounter(editor);

    // Populate editor based on current version and branch
    useEffect(() => {
        if (document && currentBranchId && currentVersionId) {
            const branch = document.branches.find(branch => branch.id === currentBranchId);
            const version = branch?.versions.find(version => version.id === currentVersionId);

            const latestContent = version?.steps[version.steps.length - 1]?.content || '';
            if (latestContent !== editorContentRef.current && editor) {
                editor.commands.setContent(latestContent);
                editorContentRef.current = latestContent;
                setEditorContent(latestContent);
                setTitle(document.title);
            }
        }
    }, [document, currentBranchId, currentVersionId, editor]);

    // Save the document version when user clicks "Save"
    const handleSave = () => {
        
        if(steps && steps.length > 0){
            let newVersion: Version|null  = versionService.createNewVersion(currentVersionId??undefined);
            if(newVersion && currentBranchId ){
                versionService.navigateVersion(currentBranchId,newVersion.id);
                versionService.setSteps(steps)
                versionService.saveVersion(newVersion)

            }
            alert('Document version saved successfully!');
        }
    };

    return (
        <div className='editor-container'>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document Title"
                className="document-title-input"
            />
            {editor && <EditorContent className="text-editor" editor={editor} />}

            <div>Word Count: {wordCount}</div>
            <button onClick={handleSave}>Save Version</button>
        </div>
    );
};

export default TextEditor;