import React, { useEffect, useState, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEditorStoreContext } from '../stores/EditorStoreProvider';
import VersionService from '../services/VersionService';
import { Step, ActionType } from '../models/Step';
import { Version } from '../models/Version';
import { useWordCounter } from '../hooks/useWordCounter';
import '../styles/global.css';

const TextEditor: React.FC = () => {

    const storeContext = useEditorStoreContext();
    const { documentStore, versionStore } = storeContext
    const { document } = documentStore;
    const { currentBranchId, currentVersionId } = versionStore;
    const versionService = new VersionService(storeContext);

    
    const [title, setTitle] = useState<string>('');
    const [editorContent, setEditorContent] = useState<string>('');
    const [steps, setSteps] = useState<Step[]>([]);
    const editorContentRef = useRef(editorContent); 
    // const previousAction = useRef<ActionType | null>(null);
    const currentAction = useRef<ActionType | null>(null);


    const editor = useEditor({
        extensions: [StarterKit],
        content: editorContent,
        onUpdate: ({ editor }) => {
            const currentContent = editor.getHTML(); // Capture current HTML content
            const previousContent = editorContentRef.current;

            if (currentContent !== previousContent) {
                const actionType = getActionType(currentContent, previousContent);

                // If the action type has changed, create a new step
                if (actionType !== currentAction.current) {
                    if (currentAction.current) {
                        // Create a step for the previous action
                        const step = createStep(currentAction.current, previousContent, currentContent);
                        setSteps(prevSteps => [...prevSteps, step]);
                    }
                    // Update the current action and previous content
                    currentAction.current = actionType;

                    
                    editorContentRef.current = currentContent;
                    setEditorContent(currentContent);
                } else {
                    // If the action type is the same, just update previousContent
                    editorContentRef.current = currentContent;
                }
            }
        },
    });

    // Helper function to detect change and create a step
    const createStep = (actionType: ActionType, previousContent: string, currentContent: string): Step => {
        
        let position = 0; // The position of the change
        let change = ''; // The content change to log
        let length = 0; // Length of deleted content

        console.log("ON CREATE STEP")
        console.log("previous content", previousContent)
        console.log("current content", currentContent)

        // Determine the exact change
        if (actionType === ActionType.INSERT) {
            // Find the insertion position
            position = previousContent.length; // Insertion is always at the end for simple case
            change = currentContent.slice(previousContent.length); // New content added
        } else if (actionType === ActionType.DELETE) {
            // Find the deleted content and its position
            const deletedText = previousContent.slice(currentContent.length);
            length = deletedText.length; // Length of deleted content
            position = currentContent.length; // Deletion happens from the end
            change = deletedText; // Content that was deleted
        }

        console.log("change", change);

        return {
            id: `${Date.now()}`,
            action: actionType,
            position: position, // Position can be adjusted based on the change
            change: change,
            length: length,
            createdAt: new Date(),
        };
    };


    // const editor = useEditor({
    //     extensions: [StarterKit],
    //     content: editorContent,
    //     onUpdate: ({ editor }) => {
    //         const currentContent = editor.getText();  // Capture current plain text content
    //         const previousContent = editorContentRef.current;

    //         if (currentContent !== previousContent) {
    //             console.log("editor unupdate. currentContent:" +currentContent+" -previousContent: "+previousContent)
    //             const step = createStep(previousContent, currentContent);

    //             // Only add step if it’s a new action or a continuous action
    //             if (step && step.action !== previousAction.current) {
    //                 setSteps((prevSteps) => [...prevSteps, step]);
    //                 previousAction.current = step.action;
    //             }

    //             editorContentRef.current = currentContent;
    //             setEditorContent(currentContent);
    //         }
    //     },
    // });

    //   // Helper function to detect change and create a step
    // const createStep = (prev: string, curr: string): Step | null => {
    //     const diffIndex = findDiffIndex(prev, curr);

    //     if (diffIndex === null) return null;

    //     const prevLength = prev.length;
    //     const currLength = curr.length;

    //     if (currLength > prevLength) {
    //         // Insertion detected
    //         return {
    //             id: `${Date.now()}`,
    //             action: ActionType.INSERT,
    //             position: diffIndex,
    //             change: curr.slice(diffIndex, curr.length),
    //             createdAt: new Date(),
    //         };
    //     } else if (currLength < prevLength) {
    //         // Deletion detected
    //         return {
    //             id: `${Date.now()}`,
    //             action: ActionType.DELETE,
    //             position: diffIndex,
    //             change: prev.slice(diffIndex),
    //             length: prevLength - currLength,
    //             createdAt: new Date(),
    //         };
    //     } else {
    //         // Replacement detected
    //         return {
    //             id: `${Date.now()}`,
    //             action: ActionType.REPLACE,
    //             position: diffIndex,
    //             change: curr.slice(diffIndex),
    //             length: prevLength - diffIndex,
    //             createdAt: new Date(),
    //         };
    //     }
    // };

      // Helper function to find the first difference index
    //   const findDiffIndex = (prev: string, curr: string): number | null => {
    //     const minLength = Math.min(prev.length, curr.length);
    //     for (let i = 0; i < minLength; i++) {
    //         if (prev[i] !== curr[i]) return i;
    //     }
    //     return prev.length !== curr.length ? minLength : null;
    // };

    const getActionType = (currentContent: string, previousContent: string): ActionType => {
        // Logic to determine the action type

        if (currentContent.length > previousContent.length) {
            return ActionType.INSERT;
        } else if (currentContent.length < previousContent.length) {
            return ActionType.DELETE;
        }else{
            return ActionType.NO_ACTION;
        }

    };



    const wordCount = useWordCounter(editor);

    useEffect(() => {
        if (document && currentBranchId && currentVersionId) {
            const branch = document.branches.find(branch => branch.id === currentBranchId);
            const version = branch?.versions.find(version => version.id === currentVersionId);

            const latestContent = applySteps(version?.steps || []);
            if (latestContent !== editorContentRef.current && editor) {
                editor.commands.setContent(latestContent);
                editorContentRef.current = latestContent;
                setEditorContent(latestContent);
            }
        }
    }, [document, currentBranchId, currentVersionId, editor]);

    // Helper to reconstruct content from steps
    const applySteps = (steps: Step[]): string => {
        let content = '';
        steps.forEach(step => {
            if (step.action === 'insert') {
                content = content.slice(0, step.position) + step.change + content.slice(step.position);
            } else if (step.action === 'delete') {
                content = content.slice(0, step.position) + content.slice(step.position + (step.length || 0));
            } else if (step.action === 'replace') {
                content = content.slice(0, step.position) + step.change + content.slice(step.position + (step.length || 0));
            }
        });
        return content;
    };

    useEffect(() => {
        console.log("steps",steps);
    },[steps])

    // Save the document version when user clicks "Save"
    const handleSave = () => {
        
        if(steps && steps.length > 0){
            let newVersion: Version|null  = versionService.createNewVersion(currentVersionId??undefined);
            
            if(newVersion && currentBranchId ){
                newVersion.title = title;
                newVersion.steps = steps;
                versionService.navigateVersion(currentBranchId,newVersion.id);
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
            {(steps.length > 0) && <button onClick={handleSave}>Save</button>}
        </div>
    );
};

export default TextEditor;