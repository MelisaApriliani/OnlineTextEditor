import BranchService from '../src/services/BranchService';
import { DocumentStore } from '../src/stores/DocumentStore';
import { generateUniqueId } from '../src/utils/Util';

jest.mock('../src/utils/Util', () => ({
  generateUniqueId: jest.fn(),
}));

describe('BranchService', () => {
  let branchService: BranchService;

  // Mock DocumentStore
  const mockDocumentStore = {
    document: {
      branches: [
        {
          id: 'branch1',
          name: 'main',
          parentId: '',
          versions: [
            { 
              id: 'version1', 
              name: 'v1',
              title: 'Version 1 Title',
              content: 'Some content here',
              steps: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { 
              id: 'version2', 
              name: 'v2',
              title: 'Version 2 Title',
              content: 'Other content here',
              steps: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      ],
    },
    setDocument: jest.fn(),
  } as unknown as DocumentStore;

  // Mock VersionStore with required properties
  const mockVersionStore = {
    getVersionById: jest.fn(),
    setVersion: jest.fn(),
    currentBranchId: 'branch1',
    currentVersionId: 'version1',
    setVersionContext: jest.fn(),
  };

  beforeEach(() => {
    // Pass both documentStore and versionStore to BranchService
    branchService = new BranchService({
      documentStore: mockDocumentStore,
      versionStore: mockVersionStore,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBranch', () => {
    it('should create a new branch with a name based on fromVersionName', () => {
      (generateUniqueId as jest.Mock).mockReturnValue('newBranchId');
      const newBranch = branchService.createBranch('version1', 'branch1');

      expect(newBranch).toEqual({
        id: 'newBranchId',
        name: 'v1-branch',
        versions: [],
        parentId: 'branch1',
      });
    });

    it('should create a main branch if no version name is found', () => {
      (generateUniqueId as jest.Mock).mockReturnValue('mainBranchId');
      const newBranch = branchService.createBranch();

      expect(newBranch).toEqual({
        id: 'mainBranchId',
        name: 'main',
        versions: [],
        parentId: '',
      });
    });
  });

  describe('getBranchName', () => {
    it('should return the branch name if branchId exists', () => {
      const branchName = branchService.getBranchName('branch1');
      expect(branchName).toBe('main');
    });

    it('should return null if branchId does not exist', () => {
      const branchName = branchService.getBranchName('nonexistentBranchId');
      expect(branchName).toBeNull();
    });

    it('should return null if branchId is null', () => {
      const branchName = branchService.getBranchName(null);
      expect(branchName).toBeNull();
    });
  });

  describe('addNewBranch', () => {
    it('should create and add a new branch to the document', async () => {
      (generateUniqueId as jest.Mock).mockReturnValue('newBranchId');
      const branchId = await branchService.addNewBranch('version1', 'branch1');

      expect(branchId).toBe('newBranchId');
      expect(mockDocumentStore.document?.branches).toHaveLength(2);
      expect(mockDocumentStore.document?.branches[1]).toEqual({
        id: 'newBranchId',
        name: 'v1-branch',
        versions: [],
        parentId: 'branch1',
      });
      expect(mockDocumentStore.setDocument).toHaveBeenCalledWith(mockDocumentStore.document);
    });

    it('should return null if document is not available', async () => {
      mockDocumentStore.document = null;
      const branchId = await branchService.addNewBranch('version1', 'branch1');

      expect(branchId).toBeNull();
      expect(mockDocumentStore.setDocument).not.toHaveBeenCalled();
    });
  });
});