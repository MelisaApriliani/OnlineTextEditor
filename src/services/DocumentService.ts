import { Branch } from '../models/Branch';
import { Document } from '../models/Document';
import BranchService from '../services/BranchService';
import { EditorStoreContextProps } from '../stores/EditorStoreProvider';

class DocumentService {

    private documentStore: EditorStoreContextProps['documentStore'];
    private storeContext : EditorStoreContextProps;


    constructor(storeContext: EditorStoreContextProps) {
        this.storeContext = storeContext;
        this.documentStore = storeContext.documentStore;


        console.log(this.documentStore);

    }

    public initializeDocument() : Promise<Document> {
        let branchService = new BranchService(this.storeContext);
        let branch : Branch = branchService.createBranch();

        let initialDocument = {
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



