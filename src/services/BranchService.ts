

// BranchService.ts
import { Branch } from '../models/Branch';
import { generateUniqueId } from '../utils/Util';
import { EditorStoreContextProps } from '../stores/EditorStoreProvider';

class BranchService {
    private documentStore: EditorStoreContextProps['documentStore'];

    constructor(storeContext: EditorStoreContextProps) {
        this.documentStore = storeContext.documentStore;
    }

    public createBranch(fromVersionId?: string, parentBranchId?: string) : Branch {
            const { document } = this.documentStore;

            let fromVersionName: string = '';
            if(document && parentBranchId ){
                const branch = document.branches.find(branch => branch.id === parentBranchId);
                const currentVersion = branch?.versions.find(v => v.id === fromVersionId);
                fromVersionName = currentVersion ? currentVersion.name : '';

            }

            const branchName: string = (fromVersionName != '') ? `${fromVersionName}-branch` : "main";

            const newBranch: Branch = {
                id: generateUniqueId(),
                name: branchName,
                versions: [],
                parentId: parentBranchId? parentBranchId : '',
            };
        return newBranch;
    }

    public getBranchName(branchId: string | null) : string | null {
        const { document } = this.documentStore;
        let branchName;

        if(document && branchId){
            const branch = document.branches.find(branch => branch.id === branchId);
            branchName = branch?.name;
        }

        return branchName ? branchName : null;
    }

    public addNewBranch(versionId: string, branchId: string): Promise<string | null> {
        return new Promise((resolve) => {
            const { document } = this.documentStore;
    
            const newBranch: Branch = this.createBranch(versionId, branchId);
    
            if (document && newBranch) {
                document.branches.push(newBranch);
                this.documentStore.setDocument(document);
            }
    
            resolve((document && newBranch) ? newBranch.id : null); 
        });
    }
 
}

export default BranchService;