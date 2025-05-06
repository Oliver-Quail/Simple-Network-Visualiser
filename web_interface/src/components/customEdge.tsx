import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, getStraightPath, useReactFlow } from "@xyflow/react"

interface edgeProps {
    id :String
}

const CustomEdge = ({id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data
  }: EdgeProps) => {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });

    return (
        <>
            <BaseEdge path={edgePath} id={id}/>
            <EdgeLabelRenderer>
                <button
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                        display: "none"
                        }}
                        className="nodrag nopan"></button>
            </EdgeLabelRenderer>
        </>
    )
}


export default CustomEdge