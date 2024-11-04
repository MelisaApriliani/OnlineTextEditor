import React, { createContext, useContext, ReactNode } from 'react';
import { useDocumentStore, DocumentStore } from './DocumentStore';
import { useVersionStore, VersionStore } from './VersionStore';

export interface EditorStoreContextProps {
    documentStore: DocumentStore; 
    versionStore: VersionStore; 
}

const EditorStoreContext = createContext<EditorStoreContextProps | undefined>(undefined);

export const EditorStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const documentStore = useDocumentStore();
    const versionStore = useVersionStore();

    return (
        <EditorStoreContext.Provider value={{ documentStore, versionStore }}>
            {children}
        </EditorStoreContext.Provider>
    );
};

export const useEditorStoreContext = (): EditorStoreContextProps => {
    const context = useContext(EditorStoreContext);
    if (!context) {
        throw new Error('useEditorStoreContext must be used within an EditorStoreProvider');
    }
    return context as EditorStoreContextProps; 
};