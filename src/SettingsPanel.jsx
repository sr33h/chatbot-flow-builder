import React, { useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from "react-icons/ai";



export default function SettingsPanel(props){


    const [text, setText] = useState(props.nodeText);

    useEffect(() => {
        setText(props.nodeText)
    }, [props])


    

  const handleChange = (event) => {
    setText(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    props.updateNodeText(props.nodeid, text);

    

  }

  const handleClick = () => {
    props.backToNodesPanel();
  }


    return (
        <aside>
        <div className='settings-panel-container'>
            <div className='settings-panel-header'>
                <button className='back-to-nodespanel-btn' onClick={handleClick}>
                    <AiOutlineArrowLeft />
                </button>
                <span className='settings-panel-header-label'>Message</span>
            </div>
            <form className='node-editor-form' onSubmit={handleSubmit}>
            <div>Text</div>
           <input className='node-editor-text-input' type='text' value={text} onChange={handleChange}>    
           </input>
            </form>          
        </div>
      </aside>
    )

}