"use client"

import { applyNodeChanges, Edge, MiniMap, Node, NodeChange, OnEdgesChange, OnNodesChange, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomEdge from '../../components/customEdge';
import { useCallback, useEffect, useState } from 'react';
import ELK, { ElkExtendedEdge, ElkNode, LayoutOptions } from 'elkjs/lib/elk.bundled.js';
import { wait } from '@testing-library/user-event/dist/utils';

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
          width: 100,
          height: 30,
        })),
        edges: getEdges(),
      };
      console.log("Graph")
      console.log(graph)
   
      elk.layout(graph).then(({ children }) => {
        // By mutating the children in-place we saves ourselves from creating a
        // needless copy of the nodes array.
        console.log("Iterating over children")
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
    const [updateRequired, setUpdateReqired] = useState<Boolean>(true)

    useEffect(() => {
      console.log("Is updating")
      if(props.edges?.length == 0) {
        fetch("http://localhost:3000/api/nodes", {headers:{'Access-Control-Allow-Origin': '*'}}).then((result :Response) => {
                result.json().then((response) => {
                    // Create a temp holder to limit number of updates required
                    let holder :Node[] = []
                    let tempEdges :Edge[] = []

                    for(let index = 0; index < response.length; index++){
                        holder.push({ id: response[index][0], position: { x: 0 + index * 100, y: 100 * index }, data: { label: response[index][0] }})
                        tempEdges.push({ id: response[index][0], source: response[index][0], target: response[3][0], type:"custom-edge", animated:true})
                    }
                    console.log("nodes updated")
                    console.log("Edges")

                    props.setEdges(tempEdges)
                    props.setNodes(holder)

                    setIsUpdating(false)
                })   
        })
        }
        else {
          console.log("waiting")
          wait(2000)
          console.log("waited")
        }
    }, [props.edges]) 

    return(

        <article>
          <p onClick={() => {getLayoutedElements({})}}>Update graph</p>
            <div style={{ width: '100vw', height: '100vh' }}>
                <ReactFlow nodes={props.nodes} edges={props.edges} edgeTypes={edgeTypes} onNodesChange={props.onNodesChange} onEdgesChange={props.onEdgesChange}>
                  <MiniMap />  
                </ReactFlow>
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