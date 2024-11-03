import {Step} from './Step'

export interface Version {
    id: string;
    name: string;
    title: string;
    steps: Step[];
    createdAt: Date;
    updatedAt: Date;
    parentId?: string; 
}