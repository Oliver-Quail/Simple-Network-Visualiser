"use client"

import { applyNodeChanges, Edge, MiniMap, Node, NodeChange, OnEdgesChange, OnNodesChange, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow, XYPosition } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomEdge from '../../components/customEdge';
import { useCallback, useEffect, useState } from 'react';
import ELK, { ElkExtendedEdge, ElkNode, LayoutOptions } from 'elkjs/lib/elk.bundled.js';
import { wait } from '@testing-library/user-event/dist/utils';
import { Slider } from '@mui/material';

const edgeTypes = {"custom-edge" : CustomEdge}

const elk = new ELK();

const useLayoutedElements = () => {
    const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
    const defaultOptions = {
      'elk.algorithm': 'layered',
      'elk.layered.spacing.nodeNodeBetweenLayers': 100,
      'elk.spacing.nodeNode': 80,
    };
    
   
    const getLayoutedElements = useCallback((options :LayoutOptions) => {
      console.log("activated")
      const layoutOptions = { ...defaultOptions, ...options };
      const graph :any  = {
        id: 'root',
        layoutOptions: layoutOptions,
        children: getNodes().map((node) => ({
          ...node,
          width: 200,
          height: 50,
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

const endPoint = "http://localhost:3000"

const AnalysisPageFlowGraph = (props :AnalysisPageFlowGraphProps) => {

    const { getLayoutedElements } = useLayoutedElements();

    const [isUpdating, setIsUpdating] = useState<Boolean>(false)
    const [data, setData] = useState<any>()
    const [updateRequired, setUpdateReqired] = useState<Boolean>(true)
    const [timeWindow, setTimeWindow] = useState<number[]>([0, 1000000000000])
    const [minTime, setMinTime] = useState<number>(0)
    const [maxTime, setMaxTime] = useState<number>(1000000000000)

    const handleTimeWindowChange = (event :Event, newValue :number[]) => {
      setTimeWindow(newValue)
    }

    useEffect(() => {
      
      console.log("Is updating")
      if(props.edges?.length == 0) {
        fetch(endPoint + "/api/nodes?minTime=" + timeWindow[0] + "&maxTime=" + timeWindow[1], {headers:{'Access-Control-Allow-Origin': '*'}}).then((result :Response) => {
          let keys :string[] = []
                result.json().then((response) => {
                    // Create a temp holder to limit number of updates required
                    console.table(response)
                    let holder :Node[] = []
                    let tempEdges :Edge[] = []

                    for(let index = 0; index < response.length; index++){
                        if(!(keys.includes(response[index][0]))) {
                          holder.push({ id: response[index][0], position: { x: 0 + index * 100, y: 100 * index }, data: { label: response[index][0] }})
                          keys.push(response[index][0])
                          console.log(keys)
                        }
                        if(!(keys.includes(response[index][1]))) {
                          holder.push({ id: response[index][1], position: { x: 0 + index * 100, y: 100 * index }, data: { label: response[index][1] + "\n (" + response[index][2] + ")" }})
                          keys.push(response[index][1])
                          console.log(keys)
                        }
                        tempEdges.push({ id: response[index][0] + index, source: response[index][0], target: response[index][1], type:"custom-edge", animated:true, data:{"a": response[index][1]}})
                    }
                    console.log("nodes updated")
                    console.log("Edges")

                    props.setEdges(tempEdges)
                    props.setNodes(holder)

                    setIsUpdating(false)
                })   
        })
        }
        if(timeWindow[0] == 0) {
        fetch("http://localhost:3000/api/time", {}).then((result :Response) => {
          result.json().then((response) => {
            setTimeWindow([response[0][0]* (1/1000000), response[0][1]* (1/1000000)])
            setMinTime(response[0][0] * (1/1000000))
            setMaxTime(response[0][1]* (1/1000000))
          })
        })
      }
    }, [props.edges]) 

    return(

        <article style={{ width: '100vw', height: '100vh' }}>
          <section style={{"display": "flex"}}>
            <p style={{"marginLeft":"5px", "cursor": "pointer"}} onClick={() => {getLayoutedElements({'elk.algorithm': 'org.eclipse.elk.force'})}}>Update graph</p>
            <p style={{"marginLeft":"5px", "cursor": "pointer"}} onClick={() => {props.setEdges([]); getLayoutedElements({'elk.algorithm': 'org.eclipse.elk.force'})}}>Update time</p>
          </section>
          <section style={{"display": "flex", "flexDirection": "column", "justifyContent": "center", "alignItems": "center", "width": "100%"}}>
            <Slider style={{"width" : "100vw"}} value={timeWindow} min={minTime} max={maxTime} onChange={handleTimeWindowChange}/>
            <section style={{"display": "flex", "justifyContent": "space-between", "width": "100%"}}>
              <p>Start: {new Date(timeWindow[0]).toString()}</p>
              <p>End: {new Date(timeWindow[1]).toString()}</p>
            </section>
          </section>
            <div style={{"height":"100%"}}>
                <ReactFlow nodes={props.nodes} edges={props.edges} edgeTypes={edgeTypes} onNodesChange={props.onNodesChange} onEdgesChange={props.onEdgesChange} style={{"width": "100%"}}>
                  <MiniMap />  
                </ReactFlow>
            </div>
        </article>
    )
}



const AnalysisPage = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([{ id: "aaa", position: { x: 0, y: 0 }, data: { label: "test" }}, { id: "aaa1", position: { x: 3, y: 5 }, data: { label: "test1" }}, { id: "aaa2", position: { x: 0, y: 0 }, data: { label: "test2" }}, { id: "aaa3", position: { x: 0, y: 0 }, data: { label: "test3" }} ])
    //const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([{ id:"bb", target: "aaa", source:"aaa1" }, { id:"bb1", target: "aaa", source:"aaa2" }, { id:"bb2", target: "aaa", source:"aaa2" }, { id:"bb3", target: "aaa", source:"aaa3" }])
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