import React, { useEffect }  from 'react';
import TextEditor from '../components/TextEditor';
import { Document } from '../models/Document';
// import { useDocumentStore } from '../stores/DocumentStore';
import DocumentService  from '../services/DocumentService';

import { useEditorStoreContext } from '../stores/EditorStoreProvider';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css'

const Home: React.FC = () => {
    // const existingDocument = useDocumentStore((state) => state.document);
    const storeContext = useEditorStoreContext();
    const { documentStore, versionStore} = storeContext; 
    const { document } = documentStore; 
    const documentService = new DocumentService(storeContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!document) {

            console.log("Entry of application")
            
            documentService.initializeDocument().then((newDoc:Document) => {
                documentStore.setDocument(newDoc);
                versionStore.setVersionContext(newDoc.branches[0]?.id, null);

                console.log("check document", newDoc)
            });
        } 
        
    }, [document]);

    

    const handleViewHistory = () => {
        navigate('/timeline');
    };

    return (
        <div  className="home-container">
            <div className="header">
                <h1>Document Editor</h1>
                <button className="history-button" onClick={handleViewHistory}>View Document History</button>
            </div>
            <TextEditor  />
        </div>
    );
};

export default Home;