import { Handle, Position } from "reactflow";
import { BsChatText } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";

function MessageNode(props) {
  
 const handleClick = () => {
 
 props.data.switchToSettingsPanel(props.id);
 }

  return (
    <div className="message-node" onClick={handleClick}>
      <div className="node-header">
        <BsChatText
          style={{
            height: "7px",
            width: "7px",
            marginLeft: "5px",
            marginRight: "5px",
          }}
        />
        <h6 style={{ fontSize: "8px" }}>Send Message</h6>
        <IoLogoWhatsapp
          style={{
            height: "7px",
            width: "7px",
            position: "absolute",
            right: "0px",
            marginRight: "10px",
            backgroundColor: "#efefef",
            borderRadius: "4px",
            padding: "1px",
            color: "#11ee11",
          }}
        />
      </div>
      <div className="node-body">{`${props.data.text}`}</div>

      <Handle
        className="handle"
        type="target"
        position={Position.Left}
        isConnectable={true}    
      />
      <Handle
      className="handle"
        type="source"
        position={Position.Right}
        isConnectable={true}
      />
    </div>
  );
}

export default MessageNode;
