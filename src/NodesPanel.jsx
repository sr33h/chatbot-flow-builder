import React from 'react';
import { BsChatText } from "react-icons/bs";


export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="dndnode message" onDragStart={(event) => onDragStart(event, 'message')} draggable>
      <BsChatText style={{height:'20px',width:'20px',paddingBottom:'10px'}}/>
       Message
      </div>
    </aside>
  );
};
