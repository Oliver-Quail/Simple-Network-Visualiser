import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react"

interface edgeProps {
    id :String
}

const CustomEdge = ({id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  }: EdgeProps) => {

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      });

    return (
        <BaseEdge path={edgePath} id={id}/>
    )
}


export default CustomEdge