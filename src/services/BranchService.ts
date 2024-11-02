
// import { Branch } from '../models/Branch';
// import { generateUniqueId } from '../utils/Util';
// // import { DocumentStore } from '../stores/DocumentStore';
// // import { VersionStore } from '../stores/VersionStore';
// import { EditorStoreContextProps } from '../stores/EditorStoreProvider';




// export const createBranch = (storeContext: EditorStoreContextProps, fromVersionId?: string) => {
//     const { documentStore, versionStore } = storeContext; 
//     const { document } = documentStore; 
//     // const { currentVersionId } = useVersionStore.getState();
    
//     if (document ) {

//         let branchName:string = fromVersionId? `${fromVersionId}-branch` : "main"

//         // let newVersion:Version|null = createNewVersion()
 
//         // if(newVersion && newVersion != null){
//             const newBranch: Branch = {
//                 id: generateUniqueId(),
//                 name: branchName,
//                 versions: [],
//             };
            
//             document.branches.push(newBranch);
//             documentStore.setDocument(document);
            
//             let currentVersionId = fromVersionId? fromVersionId : null;
//             versionStore.setVersionContext(newBranch.id, currentVersionId);
//         // }
//     }
// };

// BranchService.ts
import { Branch } from '../models/Branch';
import { generateUniqueId } from '../utils/Util';
import { EditorStoreContextProps } from '../stores/EditorStoreProvider';

class BranchService {
    private documentStore: EditorStoreContextProps['documentStore'];
    private versionStore: EditorStoreContextProps['versionStore'];

    constructor(storeContext: EditorStoreContextProps) {
        this.documentStore = storeContext.documentStore;
        this.versionStore = storeContext.versionStore;
    }

    public createBranch(fromVersionId?: string) {
        const { document } = this.documentStore;

        if (document) {
            const branchName: string = fromVersionId ? `${fromVersionId}-branch` : "main";

            const newBranch: Branch = {
                id: generateUniqueId(),
                name: branchName,
                versions: [],
            };

            document.branches.push(newBranch);
            this.documentStore.setDocument(document);

            const currentVersionId = fromVersionId ? fromVersionId : null;
            this.versionStore.setVersionContext(newBranch.id, currentVersionId);
        }
    }
}

export default BranchService;