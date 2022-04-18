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
  addBlock : (pageId:string, newBlock:Block, nextBlockIndex:number)=> void,
};

const BlockComponent=({block ,page , setTargetBlock, setFnStyle, editBlock ,addBlock}:BlockProp)=>{
  const pageId:string =page.id ;
  const blockIndex:number = page.blockIdes.indexOf(block.id) ;
  const nextBlockIndex :number= blockIndex +1; 
  const className =`${block.type} block`;
  const blockRef =useRef<HTMLDivElement>(null);
  const innerRef= useRef<HTMLElement>(null);
  const [toggle, setToggle] =useState<boolean>(false);
  const toggleStyle:CSSProperties={
    transform: toggle? "rotate(90deg)" : "rotate(0deg)" 
  }
  const [editedBlock, setEditedBlock] =useState<Block>(blockSample);
  const  editTime = JSON.stringify(Date.now());

  const onChange =(event:ContentEditableEvent)=>{
    const contents = event.target.value;
    const newBlock :Block ={
      ...block,
      contents: contents,
      editTime: editTime
    } ;
    setEditedBlock(newBlock);
  };
  const makeSubBlock =()=>{
    const newToggleBlock:Block ={
      ...block, 
      editTime :editTime ,
      subBlocks:{
        blocks:block.subBlocks.blocks!==null? [...block.subBlocks.blocks , blockSample] : [blockSample] ,
        blockIdes: block.subBlocks.blockIdes !==null? [...block.subBlocks.blockIdes , blockSample.id] : [blockSample.id] ,
      } 
    };
    editBlock(pageId, newToggleBlock);
  };
  const makeNewBlock =()=> addBlock(pageId, blockSample, nextBlockIndex);
  const onKeyup =(event: React.KeyboardEvent<HTMLDivElement>)=>{
    if(event.code === "Enter"){
      // 새로운 블록 만들기 
      if(block.type.includes("toggle")){
        //subBtn 
        setToggle(true);
        makeSubBlock();
      }else{
        //새로운 버튼 
        makeNewBlock();
      }
    }else if(event.code ==="Tab"){
      makeSubBlock();
    }else{
      // 블록 내용 수정 
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
      <div className='mainBlock'>
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
      {block.subBlocks !==null && 
      (block.type !== "toggle" || 
        (block.type ==="toggle" && toggle
        )
      ) &&
        <div className='subBlocks'>
          {block.subBlocks.blocks?.map((subBlock :Block)=> 
          <BlockComponent
            key={block.subBlocks.blockIdes?.indexOf(subBlock.id)}
            block={subBlock}
            page={page}
            setFnStyle={setFnStyle}
            setTargetBlock={setTargetBlock}
            editBlock={editBlock} 
            addBlock={addBlock}
          />)
          }
        </div>
      }
    </div>

  )
};

export default React.memo (BlockComponent);
