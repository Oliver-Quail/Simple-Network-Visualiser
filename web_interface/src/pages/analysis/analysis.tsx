"use client"

import { applyNodeChanges, Edge, Node, NodeChange, OnEdgesChange, OnNodesChange, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomEdge from '../../components/customEdge';
import { useCallback, useEffect, useState } from 'react';
import ELK, { ElkExtendedEdge, ElkNode, LayoutOptions } from 'elkjs/lib/elk.bundled.js';

const edgeTypes = {"custom-edge" : CustomEdge}

const elk = new ELK();

const useLayoutedElements = () => {
    const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
    const defaultOptions = {
      'elk.algorithm': 'layered',
      'elk.layered.spacing.nodeNodeBetweenLayers': 100,
      'elk.spacing.nodeNode': 80,
    };
    
    console.log(getNodes())
   
    const getLayoutedElements = useCallback((options :LayoutOptions) => {
      console.log("activated")
      const layoutOptions = { ...defaultOptions, ...options };
      const graph :any  = {
        id: 'root',
        layoutOptions: layoutOptions,
        children: getNodes().map((node) => ({
          ...node,
          width: node.measured?.width,
          height: node.measured?.height,
        })),
        edges: getEdges(),
      };
   
      elk.layout(graph).then(({ children }) => {
        // By mutating the children in-place we saves ourselves from creating a
        // needless copy of the nodes array.
        console.log(children)
        children?.forEach((node :any) => {
          console.log("Ran")
          node.position = { x: node.x, y: node.y } as XYPosition;
        });
   
        setNodes(children as Node[]);
        fitView();
      });
    }, []);
   
    return { getLayoutedElements };
  };


interface AnalysisPageFlowGraphProps {
    setNodes :(nodes:Node[]) => void,
    setEdges :(nodes:Edge[]) => void,
    nodes :Node[] | undefined,
    edges :Edge[] | undefined
    onNodesChange :OnNodesChange<Node> | undefined
    onEdgesChange :OnEdgesChange<Edge> | undefined
}

const AnalysisPageFlowGraph = (props :AnalysisPageFlowGraphProps) => {

    const { getLayoutedElements } = useLayoutedElements();

    const [isUpdating, setIsUpdating] = useState<Boolean>(false)
    const [data, setData] = useState<any>()
    const [canUpdateGraph, setCanUpdateGraph] = useState<Boolean>(false)

    useEffect(() => {
      if(!isUpdating && !canUpdateGraph) {
        fetch("http://localhost:3000/api/nodes", {headers:{'Access-Control-Allow-Origin': '*'}}).then((result :Response) => {
                result.json().then((response) => {
                    // Create a temp holder to limit number of updates required
                    let holder :Node[] = []
                    let tempEdges :Edge[] = []

                    for(let index = 0; index < response.length; index++){
                        holder.push({ id: response[index][0], position: { x: 0 + index * 100, y: 100 * index }, data: { label: response[index][0] }})
                        tempEdges.push({ id: response[index][0], source: response[index][0], target: response[3][0], type:"custom-edge"})
                    }
                    console.log("nodes updated")
                    console.log("Edges")
                    if(props.nodes == holder){
                      return
                    }
                    props.setNodes(holder)
                    console.table(tempEdges)
                    console.table(holder)
                    setData(tempEdges)

                })
                setIsUpdating(true)    
        })
        }
        if(props.nodes != undefined) {
          if(props.nodes?.length > 1 && isUpdating && !canUpdateGraph) {
            props.setEdges(data)
            setCanUpdateGraph(true)
            setIsUpdating(false)
          }
        }
        if(canUpdateGraph) {
          console.log("Updated")
          getLayoutedElements({'elk.algorithm': 'org.eclipse.elk.radial'})
          setCanUpdateGraph(true)
        }
    }, [canUpdateGraph, isUpdating]) 

    return(

        <article>
            <div style={{ width: '100vw', height: '100vh' }}>
                <ReactFlow nodes={props.nodes} edges={props.edges} edgeTypes={edgeTypes} onNodesChange={props.onNodesChange} onEdgesChange={props.onEdgesChange} />
            </div>
        </article>
    )
}



const AnalysisPage = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([{ id: "aaa", position: { x: 0, y: 0 }, data: { label: "test" }}])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

    return (
        <article>
            <ReactFlowProvider>
                <AnalysisPageFlowGraph setNodes={setNodes} setEdges={setEdges} nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} />
            </ReactFlowProvider>
        </article>
    )
}


interface AnalysisPageFlowGraphProps {
    
}


export default AnalysisPage