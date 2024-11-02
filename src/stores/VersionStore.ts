import { create } from 'zustand';

export interface VersionStore {
    currentBranchId: string | null;
    currentVersionId: string | null;
    setVersionContext: (branchId: string, versionId: string|null) => void;
}

export const useVersionStore = create<VersionStore>((set) => ({
    currentBranchId: null,
    currentVersionId: null,
    setVersionContext: (branchId, versionId: string|null) => {
        set({ currentBranchId: branchId, currentVersionId: versionId });
    },

}));

