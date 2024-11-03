import { Version } from '../models/Version';
import { Step } from '../models/Step';
import { generateUniqueId } from '../utils/Util';
// import { useDocumentStore } from '../stores/DocumentStore';
// import { useVersionStore } from '../stores/VersionStore';
// import { useEditorStoreContext } from '../stores/EditorStoreProvider';
import { EditorStoreContextProps } from '../stores/EditorStoreProvider';

class VersionService {
    private documentStore: EditorStoreContextProps['documentStore'];
    private versionStore: EditorStoreContextProps['versionStore'];

    constructor(storeContext: EditorStoreContextProps) {
        this.documentStore = storeContext.documentStore;
        this.versionStore = storeContext.versionStore;
    }

    public addStep(step: Step) {
        const { document } = this.documentStore;
        const { currentBranchId, currentVersionId } = this.versionStore;

        if (document && currentBranchId && currentVersionId) {
            const branch = document.branches.find(branch => branch.id === currentBranchId);
            const currentVersion = branch?.versions.find(v => v.id === currentVersionId);
            currentVersion?.steps.push(step);
            this.documentStore.setDocument(document);
        }
    }

    public setSteps(steps: Step[]) {
        const { document } = this.documentStore;
        const { currentBranchId, currentVersionId } = this.versionStore;

        if (document && currentBranchId && currentVersionId) {
            const branch = document.branches.find(branch => branch.id === currentBranchId);
            const currentVersion = branch?.versions.find(v => v.id === currentVersionId);
            if (currentVersion) {
                currentVersion.steps = steps;
            }
            this.documentStore.setDocument(document);
        }
    }

    public saveVersion(version: Version) {
        const { document } = this.documentStore;
        const { currentBranchId } = this.versionStore;

        if (document && currentBranchId) {
            const branch = document.branches.find(branch => branch.id === currentBranchId);
            if (branch) {
                branch.versions.push(version);
                this.versionStore.setVersionContext(currentBranchId, version.id);
                this.documentStore.setDocument(document);
            }
        }

        console.log("Saved document", document);
    }

    public createNewVersion(parentVersionId?: string): Version | null {
        const { document } = this.documentStore;

        if (!document) return null;

        // Find the highest version number across all branches
        const latestVersionNumber = document.branches.reduce((max, branch) => {
            return branch.versions.reduce((branchMax, version) => {
                const versionNumber = parseInt(version.name.replace(/\D/g, '')) || 0;
                return versionNumber > branchMax ? versionNumber : branchMax;
            }, max);
        }, 0);

        return {
            id: generateUniqueId(),
            name: `v${latestVersionNumber + 1}`,
            title: '',
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: parentVersionId,
        };
    }

    public navigateVersion(branchId: string, versionId: string) {
        this.versionStore.setVersionContext(branchId, versionId);
    }
}

export default VersionService;


// export const setSteps = (storeContext: EditorStoreContextProps, steps: Step[]) => {
//     const { documentStore, versionStore } = storeContext
//     const { document } = documentStore; 
//     const { currentBranchId, currentVersionId } = versionStore;
    
//     if (document && currentBranchId && currentVersionId) {
//         const branch = document.branches.find(branch => branch.id === currentBranchId);
//         const currentVersion = branch?.versions.find(v => v.id === currentVersionId);
//         if(currentVersion){
//             currentVersion.steps = steps;
//         }
//         documentStore.setDocument(document);
//     }
// };

// export const saveVersion = (storeContext: EditorStoreContextProps, version: Version) => {
//     const { documentStore, versionStore } = storeContext
//     const { document } = documentStore; 
//     const { currentBranchId} = versionStore;

//     if (document && currentBranchId) {
//         const branch = document.branches.find(branch => branch.id === currentBranchId);
//         if (branch) {
//             // const newVersion: Version|null  = createNewVersion(currentVersionId??undefined);
//             // if(newVersion){
//                 branch.versions.push(version);
//                 versionStore.setVersionContext(
//                     currentBranchId,version.id,
//                 );
            
//                 documentStore.setDocument( document );
//             // }
//         }
//     }

//     console.log("Document",document)
// };

// export const createNewVersion = (parentVersionId? : string): Version | null => {
//     const { documentStore } = useEditorStoreContext(); 
//     const { document } = documentStore; 
    
//     if (!document) return null;

//     // const branch = document.branches.find(branch => branch.id === branchId);
//     // if (!branch) return null;

//     // Find the highest version number across all branches
//     const latestVersionNumber = document.branches.reduce((max, branch) => {
//         return branch.versions.reduce((branchMax, version) => {
//             const versionNumber = parseInt(version.name.replace(/\D/g, '')) || 0;
//             return versionNumber > branchMax ? versionNumber : branchMax;
//         }, max);
//     }, 0);

//     const newVersion: Version = {
//         id: generateUniqueId(),
//         name: `v${latestVersionNumber + 1}`, 
//         steps: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         parentId: parentVersionId,
//     };

//     // branch.versions.push(newVersion);
//     // useDocumentStore.setState({ document });

//     // useVersionStore.setState({
//     //     currentBranchId: branchId,
//     //     currentVersionId: newVersion.id,
//     // });

//     return newVersion;
// }

// export const navigateVersion = (branchId: string, versionId: string) => {

//     const { versionStore } = useEditorStoreContext(); 
    
//     versionStore.setVersionContext(branchId, versionId);
// };