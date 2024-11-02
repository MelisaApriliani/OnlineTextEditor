import React from 'react';
// import { useDocumentStore } from '../stores/DocumentStore';
// import { Version } from '../models/Version';

interface TimelineProps {
    handleForward: () => void;
    handleBackward: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ handleForward, handleBackward }) => {
    // const { document } = useDocumentStore();

    return (
        <div className="timeline-controls">
            <button onClick={handleBackward}>←</button>
            {/* <div className="timeline">
                {document?.versions.map((version:Version, index:number) => (
                    <span
                        key={version.id}
                        className={`timeline-dot ${version.id === currentVersionId ? 'active' : ''}`}
                        onClick={() => navigateVersion(version.id)}
                    >
                        {index + 1}
                    </span>
                ))}
            </div>
            <button onClick={handleForward}>→</button>
            <span>Version: {currentVersionId}</span> */}
            <button onClick={handleForward}>→</button>
        </div>
    );
};

export default Timeline;