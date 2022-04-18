import React, { CSSProperties, useRef, useState} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { MdArrowDropDown, MdPlayArrow } from 'react-icons/md';
//icon
import { Block,blockSample,Page } from '../modules/notion';


type BlockProp ={
  block:Block,
  page:Page,
  setTargetBlock : (block:Block)=>void ,
  setFnStyle :(style:CSSProperties)=>void,
  editBlock : (pageId:string, newBlock:Block)=> void,
  addBlock : (pageId:string, newBlock:Block)=> void,
};

const BlockComponent=({block ,page , setTargetBlock, setFnStyle, editBlock ,addBlock}:BlockProp)=>{
  const pageId =page.id ;
  const className =`${block.type} block`;
  const blockRef =useRef<HTMLDivElement>(null);
  const innerRef= useRef<HTMLElement>(null);
  const [toggle, setToggle] =useState<boolean>(false);
  const toggleStyle:CSSProperties={
    transform: toggle? "rotate(90deg)" : "rotate(0deg)" 
  }
  const [editedBlock, setEditedBlock] =useState<Block>(blockSample);

  const onChange =(event:ContentEditableEvent)=>{
    const contents = event.target.value;
    const newBlock :Block ={
      ...block,
      contents: contents,
      editTime: JSON.stringify(Date.now())
    } ;
    setEditedBlock(newBlock);
   // console.log("newBlock", newBlock)
    //
  };
  const onKeyup =(event: React.KeyboardEvent<HTMLDivElement>)=>{
    if(event.key === "Enter"){
      if(block.type.includes("toggle")){
        setToggle(true);
        const newToggleBlock:Block ={
          ...block, 
          subBlocks: block.subBlocks!==null? [...block.subBlocks , blockSample] : [blockSample]
        };
        editBlock(pageId, newToggleBlock);
      }else{
        addBlock(pageId, blockSample);
      }
    }else{
      editBlock(pageId, editedBlock)
    }
  };
  const onShowBlockFn =()=>{
    setTargetBlock(block);
    setFnStyle({
      display:"block" ,
      position: "absolute",
      top: `calc(${blockRef.current?.offsetTop}px + 5px)`,
      left:`calc(${blockRef.current?.offsetLeft}px - 45px)`
    });
  };
  const onDisappearBlockFn =()=>{
    setTargetBlock(blockSample);
    setFnStyle({
      display:"none" ,
      top:0,
      left:0
    })
  };

  const onClickToggleBtn =()=>{
    setToggle(!toggle)
  };
  return(
    <div 
      className={className} 
      onMouseEnter ={onShowBlockFn}
      onMouseLeave={onDisappearBlockFn}
      ref={blockRef}
    >
      {block.type ==="todo" &&
        <button className='checkbox left'>
          <GrCheckbox />
        </button>
      }
      {block.type ==="todo done" &&
        <button className='checkbox left'>
          <GrCheckboxSelected />
        </button>
      }
      {block.type ==="toggle" &&
        <button 
          className='blockToggleBtn left' 
          onClick={onClickToggleBtn}
          style ={toggleStyle}
        >
          <MdPlayArrow/>
        </button>
      }
      {block.type ==="page" &&
        <div className='pageIcon left'>
        {block.icon == null?
          < GrDocumentText/>
        :
          block.icon
        }
        </div>
      }
      <ContentEditable
        className="contentEditable"
        innerRef ={innerRef}
        html ={block.contents}
        onChange={onChange}
        onKeyUp={onKeyup}
      />
    </div>

  )
};

export default React.memo (BlockComponent);
