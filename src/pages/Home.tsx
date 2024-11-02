import React, { useEffect }  from 'react';
import TextEditor from '../components/TextEditor';
import { Document } from '../models/Document';
// import { useDocumentStore } from '../stores/DocumentStore';
import { createDocument } from '../services/DocumentService';
import BranchService  from '../services/BranchService';
import { useEditorStoreContext } from '../stores/EditorStoreProvider';
import '../styles/global.css'

const Home: React.FC = () => {
    // const existingDocument = useDocumentStore((state) => state.document);
    const storeContext = useEditorStoreContext();
    const { documentStore} = storeContext; 
    const { document } = documentStore; 
    const branchService = new BranchService(storeContext);

    useEffect(() => {
        if (!document) {
            
            createDocument().then((newDoc:Document) => {
                documentStore.setDocument(newDoc);
             
                branchService.createBranch();
            });
        } 
        

    }, [document]);

    return (
        <div  className="home-container">
            <h1>Document Editor</h1>
            <TextEditor  />
        </div>
    );
};

export default Home;