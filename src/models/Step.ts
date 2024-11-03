export enum ActionType {
    INSERT = 'insert',
    DELETE = 'delete',
    REPLACE = 'replace',
    NO_ACTION = 'none'
}

export interface Step {
    id: string;
    action: ActionType;
    position: number; //the start index position of insert|delete|update
    change: string;
    length?: number;  // length oc content being deleted or replaced
    createdAt: Date;
}