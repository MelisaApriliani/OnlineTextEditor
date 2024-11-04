import { Branch } from '../models/Branch';
import { Document } from '../models/Document';
import BranchService from '../services/BranchService';
import { EditorStoreContextProps } from '../stores/EditorStoreProvider';

class DocumentService {

    private storeContext : EditorStoreContextProps;

    constructor(storeContext: EditorStoreContextProps) {
        this.storeContext = storeContext;
        
    }

    public initializeDocument() : Promise<Document> {
        const branchService = new BranchService(this.storeContext);
        const branch : Branch = branchService.createBranch();

        const initialDocument = {
            id: '1', // Assign a unique ID
            title: '',
            branches: [branch],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return Promise.resolve(initialDocument); 
    }
  
}

export default DocumentService;



