import React, { CSSProperties, useRef, useState} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { MdPlayArrow } from 'react-icons/md';
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
  const [toggle, setToggle] =useState<boolean>(false);
  const [toggleBtnStyle, setToggleBtnStyle]=useState<CSSProperties>({
    transform: "rotate(90deg)",
  });
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

  const onClickToggleBtn =(event :React.MouseEvent<HTMLElement>)=>{
    const target = event.target as HTMLElement;
    setToggle(!toggle);
    const tagName = target?.tagName ;
    switch (tagName) {
      case "SVG":
        
        break;
      case "BUTTON" :
        break;
      default:
        break;
    }
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
          onClick={(event:React.MouseEvent<HTMLElement>)=>onClickToggleBtn(event)}
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
      />
    </div>

  )
};

export default React.memo (BlockComponent);
