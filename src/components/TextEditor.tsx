import React, { useEffect, useState, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditorStoreContext } from '../stores/EditorStoreProvider';
import VersionService from '../services/VersionService';
import BranchService from '../services/BranchService';
import { Version } from '../models/Version';
import { useWordCounter } from '../hooks/useWordCounter';
import '../styles/global.css';

const TextEditor: React.FC = () => {

    const storeContext = useEditorStoreContext();
    const { documentStore, versionStore } = storeContext
    const { document } = documentStore;
    const { currentBranchId, currentVersionId } = versionStore;
    const versionService = new VersionService(storeContext);
    const branchService = new BranchService(storeContext);

    const [title, setTitle] = useState<string>('');
    const [editorContent, setEditorContent] = useState<string>('');
    const editorContentRef = useRef(editorContent); 
    const [initialContent, setInitialContent] = useState<string>(''); 
    const [hasChanges, setHasChanges] = useState<boolean>(false);


    const editor = useEditor({
        extensions: [StarterKit,
            Placeholder.configure({
                placeholder: 'Start typing your content here...', 
            }),
        ],
        content: editorContent,
        onUpdate: ({ editor }) => {
            const currentContent = editor.getHTML();
            if (currentContent !== editorContentRef.current) {
                editorContentRef.current = currentContent;
                setEditorContent(currentContent);

                setHasChanges(currentContent !== initialContent);
            }
        },
    });

    const wordCount = useWordCounter(editor);

    useEffect(() => {
        if (document && currentBranchId && currentVersionId) {
            const branch = document.branches.find(branch => branch.id === currentBranchId);
            const version = branch?.versions.find(version => version.id === currentVersionId);

            if (version?.content && editor) {
                editor.commands.setContent(version.content); // Load version content into editor
                editorContentRef.current = version.content;
                setInitialContent(version.content);
                setEditorContent(version.content);
                setTitle(version.title || '');
            }
        }
    }, [document, currentBranchId, currentVersionId, editor]);


    // Save the document version when user clicks "Save"
    const handleVersionUpdate = async () => {
        const newContent = editor?.getHTML() || '';
        
        if(newContent && newContent.length > 0){
            const newVersion: Version|null  = versionService.createNewVersion(currentVersionId??undefined);
            
            if(newVersion && currentBranchId ){
                newVersion.title = title;
                newVersion.content = newContent;

                if (currentVersionId && !versionService.isHead(currentVersionId)) { 
                    // If current version is not the head, create a new branch and navigate
                    const branchId = await branchService.addNewBranch(currentVersionId, currentBranchId);
                    if (branchId) {
                        await versionService.navigateVersion(branchId, newVersion.id);
                        // Save the new version in both cases
                        versionService.saveVersion(newVersion, branchId);
                    }
                } else {
                    // If current version is the head, navigate using the current branch
                    await versionService.navigateVersion(currentBranchId, newVersion.id);
                    // Save the new version in both cases
                    versionService.saveVersion(newVersion, currentBranchId);
                }
                
                
                
            
                setInitialContent(newContent);
                setHasChanges(false);
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
            <div className='center-container'>
                {hasChanges && <button className="confirm-button" onClick={handleVersionUpdate}>Save</button>}
            </div>
        </div>
    );
};

export default TextEditor;