import { Edge, Node, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EdgeLabel from '../../components/edgeLabel';
import CustomEdge from '../../components/customEdge';
import { useEffect, useState } from 'react';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '10.0.0.1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '192.168.0.1' } },
  ];

  const initialEdges :Array<Edge> = [{ id: 'e1-2', source: '1', target: '2', type:"custom-edge"}];
  const edgeTypes = {"custom-edge" : CustomEdge}

const AnalysisPage = () => {
    const [data, setData] = useState<any>();
    const [nodes, setNodes] = useState<Node[]>()
    const [edges, setEdges] = useState<Edge[]>()

    useEffect(() => {
        fetch("http://localhost:3000/api/nodes", {headers:{'Access-Control-Allow-Origin': '*'}}).then((result :Response) => {
                result.json().then((response) => {
                    // Create a temp holder to limit number of updates required
                    let holder :Node[] = []
                    let tempEdges :Edge[] = []

                    for(let index = 0; index < response.length; index++){
                        holder.push({ id: response[index][0], position: { x: 0 + index * 100, y: 100 * index }, data: { label: response[index][0] }})
                        tempEdges.push({ id: response[index][0] + "aaaaa", source: response[index][0], target: response[3][0], type:"custom-edge"})
                    }
                    console.log("nodes updated")
                    console.table(holder)
                    setNodes(holder)
                    setEdges(tempEdges)
                    
                })
                
        })
    }, []) 

    return(

        <article>
            <div style={{ width: '100vw', height: '100vh' }}>
                <ReactFlow nodes={nodes} edges={edges} edgeTypes={edgeTypes} />
            </div>
        </article>
    )
}


export default AnalysisPage