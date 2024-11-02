export interface ProseMirrorNode {
    type: string;
    content?: ProseMirrorNode[];
    text?: string;
    marks?: { type: string; attrs?: Record<string, any> }[];
}