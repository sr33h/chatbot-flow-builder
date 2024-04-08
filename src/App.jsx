import React, { useState, useRef, useCallback, useEffect } from 'react';

import ReactFlow,  //renders nodes & edges and is the primary component of reactflow
 { ReactFlowProvider, //we share the state of ReactFlow to other components by wrapping them all in this context provider
   addEdge, //adds a new edge to the array of edges if we pass the edge and the array as arguments
   useNodesState,//returns a state variable array,a setter function and an onchange handler for nodes
   useEdgesState,//returns a state variable array,a setter function and an onchange handler for edges
   Controls//the component which shows zoom controls for the canvas
   } from 'reactflow';
import 'reactflow/dist/style.css'; //the main style for reactflow
import './index.css';//the styles for the App component

import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';
import SaveError from './SaveError';

//The custom Message type node which needs to be declared as a nodetype
import MessageNode from './MessageNode';
import './message-node.css';

//the object containing the different node types which are present in the application
//[once more nodes are defined, they can be imported and added to this object]
const nodeTypes = {message: MessageNode};

//a variable to hold the unique ids for different nodes
let nodeid = 0;
//a function which returns the unique id for each node
const getId = () => `${nodeid++}`;

const App = () => {
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [currentlyEditingNode, setCurrentlyEditingNode] = useState(null);
  const [currentlyEditingNodeText, setCurrentlyEditingNodeText] = useState('');
  const [saveError,setSaveError] = useState(false);


  const switchToSettingsPanel = (id) => {
     setIsEditingNode(true);
     setCurrentlyEditingNode(id);     
       
  }

  const backToNodesPanel = () => {
    setIsEditingNode(false);
  }

  
  //the function we pass as the onConnect prop to <ReactFlow/>
  //<React/> flow will automatically call this function whenever two handles are connected 
  const onConnect = (params) => {
   
    setEdges((eds) => addEdge(params, eds));
 
}

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { text: `test message`,
                switchToSettingsPanel : switchToSettingsPanel
       },
        
      };

      setNodes((nds) => nds.concat(newNode));

    }, [reactFlowInstance] );


    //a function to keep track of all the edges in the flow and prevent the creation of more than one edge from a source handle
   const checkEdges = () => {
        edges.forEach(edg => {
          let count = 0;
        
          edges.forEach(e => {
            if(e.source === edg.source){
              count++;
            }
          });
          if(count>1){
            setEdges(edges.filter(eg => eg.id !== edg.id ));
          }
        })
   }
   useEffect(checkEdges,[edges]);

   const updateNodeText = (id,text) => {

     let newNodes = nodes.map(node => {
      if(node.id === id){
        return {
          ...node,
          data: {
            text:text,
            switchToSettingsPanel : switchToSettingsPanel
          }
        }
      }else{
        return node
      }
     })

     setNodes(newNodes);
     console.log('update ran')

   }

   useEffect(() => {
    if(currentlyEditingNode){
      const node = nodes.find(n => n.id === currentlyEditingNode);
      setCurrentlyEditingNodeText(node.data.text);
    }  })

   const handleSave = () => {
    if(nodes.length>1){
      const nodeCount = nodes.length;
      let targetCount = 0;
      
      nodes.forEach( node => {
        for(let i=0;i<edges.length;i++){
          if(node.id === edges[i].target){
            targetCount++;
            break;
          }
        }
      });

      if(nodeCount-targetCount > 1){
        setSaveError(true);
      }


    }
   }

   useEffect(() => {
         setTimeout(() => {
          setSaveError(false)
         }, 3000)
   }, [saveError])
    
      


  return (
    <>
    
    <div className='top-container'>
      <div className='top-nav-bar'>
      {saveError && <SaveError />}
        <button className='save-btn' onClick={handleSave}>Save Changes</button>
      </div>
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
         
            <Controls />
          </ReactFlow>
        </div>
        {isEditingNode ? 
        <SettingsPanel 
        nodeid={currentlyEditingNode} 
        updateNodeText={updateNodeText} 
        nodeText={currentlyEditingNodeText}
        backToNodesPanel={backToNodesPanel} /> : <NodesPanel/>}
        
      </ReactFlowProvider>
    </div>
    </div>

    </>
  );
};

export default App;












































/*
import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';

import NodesPanel from './NodesPanel';
import './index.css';
import MessageNode from './MessageNode';

import './message-node.css';

const nodeTypes = {message: MessageNode};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    
    (params) => {
      console.log(params);
      setEdges((eds) => addEdge(params, eds))
    }, [] );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  return (
    <div className='top-container'>
      <div className='top-nav-bar'></div>
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
        <NodesPanel />
      </ReactFlowProvider>
    </div>
    </div>
  );
};

export default DnDFlow;
*/