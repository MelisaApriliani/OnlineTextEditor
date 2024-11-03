import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent  } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEditorStoreContext } from '../stores/EditorStoreProvider';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Version } from '../models/Version';
import '../styles/global.css';

const TimelineView: React.FC = () => {
    const { documentStore, versionStore } = useEditorStoreContext();
    const { document } = documentStore;
    const { currentVersionId } = versionStore;

    const [currentVersion, setCurrentVersion] = useState<Version | null>(null);
    const [editorContent, setEditorContent] = useState<string>('');
    
    const editor = useEditor({
        extensions: [StarterKit],
        editable: false,
        content: editorContent,
    });

    // Function to fetch the version by ID
    const getVersionById = (versionId: string | null): Version | null => {
        if (!document || !versionId) return null;
        for (const branch of document.branches) {
            const version = branch.versions.find(v => v.id === versionId);
            if (version) return version;
        }
        return null;
    };

    // Function to find the previous version across branches
    const getPreviousVersion = (): Version | null => {
        if (!document || !currentVersion) return null;

        // Flatten all versions across branches into a single array
        const allVersions = document.branches.flatMap(branch => branch.versions);
        const currentIndex = allVersions.findIndex(v => v.id === currentVersion.id);
        console.log("previous - all versions", allVersions);
        console.log("previous - currentIndex", currentIndex);
        let prevVersion : Version|null;
        prevVersion = currentIndex > 0 ? allVersions[currentIndex - 1] : null;
        console.log("previous version", prevVersion);
        return prevVersion;
    };

    // Function to find the next version across branches
    const getNextVersion = (): Version | null => {
        if (!document || !currentVersion) return null;

        const allVersions = document.branches.flatMap(branch => branch.versions);
        const currentIndex = allVersions.findIndex(v => v.id === currentVersion.id);
        console.log("next - all next versions", allVersions);
        console.log("next - currentIndex", currentIndex);
        let nextVersion : Version|null;
        nextVersion = currentIndex >= 0 ? allVersions[currentIndex + 1] : null;
        console.log("next version", nextVersion);
        return nextVersion;
    };

    // Update current version on component mount or when currentVersionId changes
    useEffect(() => {
        console.log("Document in Timeline", document)
        const initialVersion = getVersionById(currentVersionId);
        console.log("initialVersion", initialVersion)
        if (initialVersion) {
            setCurrentVersion(initialVersion);
            // setEditorContent(initialVersion.steps.map(step => step.content).join(''));
        }
    }, [currentVersionId, document]);

    // Handler to navigate to the previous version
    const handlePrevious = () => {
        const prevVersion = getPreviousVersion();
        if (prevVersion) {
            setCurrentVersion(prevVersion);
            // setEditorContent(prevVersion.steps.map(step => step.content).join(''));
        }
    };

    // Handler to navigate to the next version
    const handleNext = () => {
        const nextVersion = getNextVersion();
        if (nextVersion) {
            setCurrentVersion(nextVersion);
            setEditorContent(nextVersion.steps.map(step => step.change).join(''));
        }
    };

    return (
        <div className="timeline-container">
            <h1>{currentVersion?.title}</h1>
            <div className="editor-content-container">
                {editor && <EditorContent editor={editor} />}
            </div>
            <div className="navigation-buttons">
                <button onClick={handlePrevious} disabled={!getPreviousVersion()}>
                    <FaArrowLeft /> Previous
                </button>
                <button onClick={handleNext} disabled={!getNextVersion()}>
                    Next <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default TimelineView;