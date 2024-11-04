//This file is not used yet. This is preserved to be used for implementing versions as incremental steps
export enum ActionType {
    INSERT = 'insert',
    DELETE = 'delete',
    REPLACE = 'replace',
    NOACTION = 'none'
}

export interface Step {
    id: string;
    action: ActionType;
    position: number; //the start index position of insert|delete|update
    change: string;
    length?: number;  // length of content being deleted or replaced
    createdAt: Date;
}