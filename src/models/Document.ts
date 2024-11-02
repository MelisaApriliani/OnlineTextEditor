import { Branch } from './Branch'

export interface Document {
    id: string;
    title: string;
    branches: Branch[]; 
    createdAt: Date;
    updatedAt: Date;

}