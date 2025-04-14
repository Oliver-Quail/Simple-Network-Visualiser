
interface nodePayload {
    ipAddress :String
    commonName :String

}

const Node = (props :nodePayload) => {
    return(
        <section>
            <p>{props.ipAddress}</p>
            <p>{props.commonName}</p>
        </section>
    )
}


export default Node;