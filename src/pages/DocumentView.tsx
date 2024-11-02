import React from 'react';


const DocumentView: React.FC = () => {
    // const { document, currentVersionId, navigateVersion } = useDocumentStore();

    // const handleForward = () => {
    //     if (!document) return;
    //     const currentIndex = document.versions.findIndex(version => version.id === currentVersionId);
    //     if (currentIndex < document.versions.length - 1) {
    //         navigateVersion(document.versions[currentIndex + 1].id);
    //     }
    // };

    // const handleBackward = () => {
    //     if (!document) return;
    //     const currentIndex = document.versions.findIndex(version => version.id === currentVersionId);
    //     if (currentIndex > 0) {
    //         navigateVersion(document.versions[currentIndex - 1].id);
    //     }
    // };

    return (
        <div className="timeline-view">
            <h1>Timeline View</h1>
            {/* <h2>{document?.title}</h2>
            <div className="document-content">{document?.content}</div>
            <Timeline
                handleForward={handleForward}
                handleBackward={handleBackward}
            /> */}
        </div>
    );
};

export default DocumentView;