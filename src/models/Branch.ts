import { Version } from "./Version";

export interface Branch {
    id: string;
    name: string;
    versions: Version[]; 
}