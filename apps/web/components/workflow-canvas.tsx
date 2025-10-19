'use client'

import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { AgentNode } from './nodes/agent-node'
import { CustomEdge } from './edges/custom-edge'
import { useWorkflowStore } from '@/stores/workflow-store'

const nodeTypes: NodeTypes = {
  agent: AgentNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

export function WorkflowCanvas() {
  const { nodes, edges, addEdge: addEdgeToStore, updateNode } = useWorkflowStore()
  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes)
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges)

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = addEdge(params, reactFlowEdges)
      setEdges(newEdge)
      addEdgeToStore(params)
    },
    [reactFlowEdges, setEdges, addEdgeToStore]
  )

  const onNodeDragStop = useCallback(
    (event: any, node: Node) => {
      updateNode(node.id, { position: node.position })
    },
    [updateNode]
  )

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.type === 'input') return '#0041d0'
            if (n.type === 'output') return '#ff0072'
            return '#1a192b'
          }}
          nodeColor={(n) => {
            if (n.type === 'input') return '#0041d0'
            return '#fff'
          }}
          nodeBorderRadius={2}
        />
      </ReactFlow>
    </div>
  )
}
