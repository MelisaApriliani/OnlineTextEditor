import { Version } from '../models/Version';
import { Step } from '../models/Step';
import { generateUniqueId } from '../utils/Util';
import { EditorStoreContextProps } from '../stores/EditorStoreProvider';

class VersionService {
    private documentStore: EditorStoreContextProps['documentStore'];
    private versionStore: EditorStoreContextProps['versionStore'];

    constructor(storeContext: EditorStoreContextProps) {
        this.documentStore = storeContext.documentStore;
        this.versionStore = storeContext.versionStore;
    }

    public saveVersion(version: Version, branchId: string) {
        const { document } = this.documentStore;
        
        console.log("current branch", branchId);

        if (document && branchId) {
            const branch = document.branches.find(branch => branch.id === branchId);
            if (branch) {
                branch.versions.push(version);
                this.versionStore.setVersionContext(branchId, version.id);
                this.documentStore.setDocument(document);
            }
        }

        console.log("Saved document", document);
    }

    public navigateVersion(branchId: string, versionId: string): Promise<void> {
        return new Promise((resolve) => {
            console.log("set version context-branchId",branchId);
            this.versionStore.setVersionContext(branchId, versionId);
            resolve(); // Resolve the promise after setting the version context
        });
    }

    public createNewVersion(parentVersionId?: string): Version | null {
        const { document } = this.documentStore;

        if (!document) return null;

        // Find the highest version number across all branches
        const latestVersionNumber = document.branches.reduce((max, branch) => {
            return branch.versions.reduce((branchMax, version) => {
                const versionNumber = parseInt(version.name.replace(/\D/g, '')) || 0;
                return (versionNumber > branchMax) ? versionNumber : branchMax;
            }, max);
        }, 0);

        return {
            id: generateUniqueId(),
            name: `v${latestVersionNumber + 1}`,
            title: '',
            content: '',
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: parentVersionId,
        };
    }

    public isHead(versionId: string): boolean{
        const { document } = this.documentStore;
        const { currentBranchId} = this.versionStore;
        if (document && currentBranchId && versionId) {
            const branch = document.branches.find(branch => branch.id === currentBranchId);
            if(branch){
                const sortedVersions = branch.versions.sort(
                    (a, b) => this.getVersionNumber(a.name) - this.getVersionNumber(b.name)
                );
                const headVersion = sortedVersions[sortedVersions.length - 1];
                return headVersion.id === versionId;
            }

        }

        return false;

    }

    public getVersionNumber(versionName: string): number {
        return parseInt(versionName.slice(1));
    }

    public getVersionById(versionId: string) : Version | null {
        const { document } = this.documentStore;
        if (!document || !versionId) return null;
        for (const branch of document.branches) {
            const version = branch.versions.find(v => v.id === versionId);
            if (version) return version;
        }
        return null;
    }

    public getPreviousVersion(versionId: string) : Version | null {
        const { document } = this.documentStore;
        if (!document || !versionId) return null;
        const allVersions = document.branches.flatMap(branch => branch.versions);
        const currentIndex = allVersions.findIndex(v => v.id === versionId);
        return (currentIndex > 0) ? allVersions[currentIndex - 1] : null;
    }

    public getNextVersion(versionId: string) : Version | null {
        const { document } = this.documentStore;
        if (!document || !versionId) return null;
        const allVersions = document.branches.flatMap(branch => branch.versions);
        const currentIndex = allVersions.findIndex(v => v.id === versionId);
        return (currentIndex >= 0) ? allVersions[currentIndex + 1] : null;
    }

    // NOTE: The codes section below are not used yet. 
    // This is preserved to be used for implementing versions as incremental steps
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
}

export default VersionService;
