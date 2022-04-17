import React, { CSSProperties, useRef} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
//icon
import { Block,blockSample,Page } from '../modules/notion';


type BlockProp ={
  block:Block,
  page:Page,
  setTargetBlock : (block:Block)=>void ,
  setFnStyle :(style:CSSProperties)=>void,
  editBlock : (pageId:string, newBlock:Block)=> void
};

const BlockComponent=({block ,page , setTargetBlock, setFnStyle, editBlock}:BlockProp)=>{
  const className =`${block.type} block`;
  const blockRef =useRef<HTMLDivElement>(null);
  const innerRef= useRef<HTMLElement>(null);
  const onChange =(event:ContentEditableEvent)=>{
    const pageId =page.id ;
    const content = event.target.value;
    const newBlock ={
      ...block,
      content: content 
    } 
    editBlock(pageId, newBlock)
  };

  const onShowBlockFn =()=>{
    setTargetBlock(block);
    setFnStyle({
      display:"block" ,
      position: "absolute",
      top: `${blockRef.current?.offsetTop}px`,
      left:`calc(${blockRef.current?.offsetLeft}px - 40px)`
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
  return(
    <div 
      className={className} 
      onMouseEnter ={onShowBlockFn}
      onMouseLeave={onDisappearBlockFn}
      ref={blockRef}
    >
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
