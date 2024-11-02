import { create } from 'zustand';
import { Document } from '../models/Document';

export interface DocumentStore {
    document: Document | null;
    setDocument: (doc: Document) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
    document: null, 
    setDocument: (doc) => {
        set({ document: doc });
    },
}));