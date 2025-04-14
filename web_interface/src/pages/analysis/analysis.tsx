import { Edge, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import EdgeLabel from '../../components/edgeLabel';
import CustomEdge from '../../components/customEdge';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '10.0.0.1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '192.168.0.1' } },
  ];

  const initialEdges :Array<Edge> = [{ id: 'e1-2', source: '1', target: '2', type:"custom-edge"}];
   
  const edgeTypes = {"custom-edge" : CustomEdge}

const AnalysisPage = () => {

    return(

        <article>
            <div style={{ width: '100vw', height: '100vh' }}>
                <ReactFlow nodes={initialNodes} edges={initialEdges} edgeTypes={edgeTypes} />
            </div>
        </article>
    )
}


export default AnalysisPage