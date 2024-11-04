import VersionService from '../src/services/VersionService';
import { Version } from '../src/models/Version';

describe('VersionService', () => {
    let versionService: VersionService;
    const mockDocumentStore = {
        document: {
            id: '1',  
            title: 'Document Title',
            createdAt: new Date(),
            updatedAt: new Date(),
            branches: [
                {
                    id: 'branch-1',
                    name: 'Main Branch',  
                    parentId: '',       
                    versions: [] as Version[],  
                },
            ],
        },
        setDocument: jest.fn()
    };

    const mockVersionStore = {
        setVersionContext: jest.fn(),
        currentBranchId: 'branch-1',
        currentVersionId: null,
    };

    const storeContext = {
        documentStore: mockDocumentStore,
        versionStore: mockVersionStore,
    };

    beforeEach(() => {
        versionService = new VersionService(storeContext);
    });

    test('should save a version correctly', () => {
        const version: Version = {
            id: 'version-1',
            name: 'v1',
            title: 'Initial Version',
            content: 'This is the content.',
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: '',
        };

        versionService.saveVersion(version, 'branch-1');

        expect(mockDocumentStore.document.branches[0].versions).toContain(version);
        expect(mockVersionStore.setVersionContext).toHaveBeenCalledWith('branch-1', version.id);
        expect(mockDocumentStore.setDocument).toHaveBeenCalledWith(mockDocumentStore.document);
    });

    test('should navigate to a version', async () => {
        await versionService.navigateVersion('branch-1', 'version-1');

        expect(mockVersionStore.setVersionContext).toHaveBeenCalledWith('branch-1', 'version-1');
    });

    test('should create a new version', () => {
        const newVersion = versionService.createNewVersion();

        expect(newVersion).toHaveProperty('id');
        expect(newVersion).toHaveProperty('name');
        expect(newVersion?.name).toBe('v2'); 
    });

    test('should identify the head version correctly', () => {
        const version1: Version = {
            id: 'version-1',
            name: 'v1',
            title: 'Version 1',
            content: '',
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: '',
        };

        const version2: Version = {
            id: 'version-2',
            name: 'v2',
            title: 'Version 2',
            content: '',
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            parentId: '',
        };

        mockDocumentStore.document.branches[0].versions.push(version1, version2);
        
        expect(versionService.isHead(version2.id)).toBe(true);
        expect(versionService.isHead(version1.id)).toBe(false);
    });
    
    
});