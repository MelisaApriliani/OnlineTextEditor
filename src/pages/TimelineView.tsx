import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditorStoreContext } from '../stores/EditorStoreProvider';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Version } from '../models/Version';
import VersionService  from '../services/VersionService';
import BranchService  from '../services/BranchService';
import BranchingView from '../components/BranchingView';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import '../styles/timelineview.css';

const TimelineView: React.FC = () => {
    const storeContext = useEditorStoreContext();
    const { documentStore, versionStore} = storeContext; 
    const { document } = documentStore;
    const { currentVersionId, currentBranchId } = versionStore;
    const [currentVersion, setCurrentVersion] = useState<Version | null>(null);
    const versionService = new VersionService(storeContext);
    const branchService = new BranchService(storeContext);
    const navigate = useNavigate();

    const editor = useEditor({
        extensions: [StarterKit, 
            Placeholder.configure({
            placeholder: 'Start typing your content here...', 
        }),],
        editable: false,
        content: '',
    });

    // Set initial version content when component mounts or currentVersionId changes
    useEffect(() => {
        if(currentVersionId != null){
            const initialVersion = versionService.getVersionById(currentVersionId);
            if (initialVersion) {
                setCurrentVersion(initialVersion);
                editor?.commands.setContent(initialVersion.content || ''); 
            }
        }
    }, [currentVersionId, document, editor]);

    // Update editor content when currentVersion changes
    useEffect(() => {
        if (currentVersion && editor) {
            editor.commands.setContent(currentVersion.content || ''); 
        }
    }, [currentVersion, editor]);

    // Handler for previous version
    const handlePrevious = () => {
        if(currentVersion){
            const prevVersion = versionService.getPreviousVersion(currentVersion?.id);
            if (prevVersion) {
                setCurrentVersion(prevVersion);
            }
        }
    };

    // Handler for next version
    const handleNext = () => {
        if(currentVersion){
            const nextVersion = versionService.getNextVersion(currentVersion?.id);
            if (nextVersion) {
                setCurrentVersion(nextVersion);
            }
        }
    };

    const handleVersionClick = (branchId: string, versionId: string) => {
        const version = versionService.getVersionById(versionId);
        if (version) {
            setCurrentVersion(version);
            versionService.navigateVersion(branchId,versionId);
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="timeline-container">
            <h1>Document History</h1>
            <div className="editor-content-container">
                <h2>{currentVersion?.title}</h2>
                {editor && <EditorContent editor={editor} />}
            </div>
            <div className='editor-content-footer'>
                {currentVersion && (
                        <div className="branch-version-label">
                            {branchService.getBranchName(currentBranchId)} branch: version {currentVersion.name}
                        </div>
                )}
                <div className="navigation-buttons">
                    <button onClick={handlePrevious} disabled={!currentVersion || !versionService.getPreviousVersion(currentVersion.id)}>
                        <FaArrowLeft /> Previous
                    </button>
                    <button onClick={handleNext} disabled={!currentVersion || !versionService.getNextVersion(currentVersion.id)}>
                        Next <FaArrowRight />
                    </button>
                </div>
            </div>
            <h3>Document branches:</h3>
            <BranchingView branchArray={document?.branches} onVersionClick={handleVersionClick} currentVersionId={currentVersion?.id}/>

        </div>
    );
};

export default TimelineView;