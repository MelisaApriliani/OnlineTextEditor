import React from 'react';
import ReactFlow, { Node, Edge, Position } from 'react-flow-renderer';
import { Branch } from '../models/Branch';


interface Props {
    branchArray: Branch[] | undefined;
    onVersionClick: (branchId: string, versionId: string) => void;
    currentVersionId?: string ;
}

const BranchingView: React.FC<Props> = ({ branchArray, onVersionClick, currentVersionId }) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    branchArray?.forEach((branch, branchIndex) => {
        branch.versions.forEach((version, versionIndex) => {
            // Create a node for each version
            nodes.push({
                id: version.id,
                data: { 
                    label: `${branch.name}: ${version.name}` ,
                    onClick: () => onVersionClick(branch.id, version.id)
                    
                },
                position: {
                    x: versionIndex * 100,
                    y: branchIndex * 50,
                },
                style: {
                    border: '1px solid #555',
                    padding: '4px',
                    borderRadius: 5,
                    maxWidth: '35px',  // Set maximum width
                    maxHeight: '20px',  // Set maximum height
                    width: '30px',  // Set maximum width
                    height: '17px',
                    textOverflow: 'ellipsis', // Optional: add ellipsis for overflow text
                    whiteSpace: 'nowrap',
                    fontSize: '5px',
                    cursor:'pointer',
                    backgroundColor: version.id === currentVersionId ? '#FFD700' : '#FFF',
                },
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top,
                draggable: false, 
            });

            // Create an edge between versions if there's a parentId reference
            if (version.parentId) {
                edges.push({
                    id: `e${version.parentId}-${version.id}`,
                    source: version.parentId,
                    target: version.id,
                    type: 'smoothstep',
                    animated: true,
                });
               
            }
        });
    });

    const maxHeight = Math.max(...nodes.map(node => node.position.y)) + 150;

    return (
        <div style={{ width: '100%', height: maxHeight, display: 'flex', justifyContent: 'flex-start', border: 'none' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                
                fitViewOptions={{ padding: 0.1}}
                style={{ background: 'transparent', border:'none' }} 
                onNodeClick={(_, node) => node.data.onClick?.()}
                zoomOnScroll={false} 
                zoomOnPinch={false} 
                panOnScroll={false} 
                panOnDrag={false}
            />
        </div>
    );
};

export default React.memo(BranchingView);

