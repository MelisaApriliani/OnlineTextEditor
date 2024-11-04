import DocumentService from '../src/services/DocumentService';
import BranchService from '../src/services/BranchService';
import { Document } from '../src/models/Document';
import { Branch } from '../src/models/Branch';

jest.mock('../src/services/BranchService'); // Mock BranchService

describe('DocumentService', () => {
  let documentService: DocumentService;
  let mockDocumentStore: any;
  let mockVersionStore: any;

  beforeEach(() => {
    mockDocumentStore = {
      document: { branches: [] },
      setDocument: jest.fn(),
    };
    mockVersionStore = {
      getVersionById: jest.fn(),
      setVersion: jest.fn(),
      currentBranchId: 'branch1',
      currentVersionId: 'version1',
      setVersionContext: jest.fn(),
    };

    // Initialize DocumentService with mocked document and version stores
    documentService = new DocumentService({ documentStore: mockDocumentStore, versionStore: mockVersionStore });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize a document with a new branch', async () => {
    const mockBranch = { id: 'branch1', name: 'main', versions: [], parentId: '' } as Branch;
    
    // Mock createBranch
    (BranchService as jest.Mock).mockImplementation(() => ({
      createBranch: jest.fn().mockReturnValue(mockBranch),
    }));

    const result: Document = await documentService.initializeDocument();

    // Validate the created document structure
    expect(result).toEqual({
      id: '1', 
      title: '',
      branches: [mockBranch],
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});