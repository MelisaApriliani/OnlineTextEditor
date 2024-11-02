import { Document } from '../models/Document';



export const createDocument = (): Promise<Document> => {

    const initialDocument = {
        id: '1', // Assign a unique ID
        title: 'Untitled Document',
        branches: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return Promise.resolve(initialDocument); 

}