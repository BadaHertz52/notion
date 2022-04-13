import React, { useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import Menu from './Menu';

//icon
import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuBoxed } from 'react-icons/cg';
import { Block,Page } from '../modules/notion';


type BlockProp ={
  key : string, 
  block:Block,
  page:Page,
  editBlock : (pageId:string, newBlock:Block)=> void
};

const BlockComponent=({ key,block ,page ,editBlock}:BlockProp)=>{
  const className =`${block.type} block`;
  const innerRef= useRef<HTMLElement>(null);
  const [type, setType]= useState<string>(block.type);
  
  const onChange =(event:ContentEditableEvent)=>{
    const pageId =page.id ;
    const content = event.target.value;
    const newBlock ={
      ...block,
      type: type,
      content: content 
    } 
    editBlock(pageId, newBlock)
  };

  const showMenu =()=>{

  };

  const addBlock =()=>{

  };

  return(
    <div className={className} key={key}>
      <div className='blockFun'>
        <button 
          className='addBlock'
          onClick={addBlock}
          title="Click  to add a block below"
        >
          <AiOutlinePlus/>
        </button>
        <button 
          className='menuBtn'
          onClick={showMenu}
          title ="Click to open menu"
        >
          <CgMenuBoxed/>
          <Menu block={block} setType={setType}/>
        </button>
      </div>
      <ContentEditable
        className="contentEditable"
        innerRef ={innerRef}
        html ={block.contents}
        onChange={onChange}
      />
    </div>

  )
};

export default React.memo (BlockComponent);
