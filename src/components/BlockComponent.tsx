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
  deleteBlock : (pageId:string, block:Block)=> void,
};

const BlockComponent=({block ,page , setTargetBlock, setFnStyle, editBlock ,addBlock ,deleteBlock}:BlockProp)=>{
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
  const [html ,setHtml] =useState<string>(block.contents);
  const  editTime = JSON.stringify(Date.now());

  const editContents =(contents :string)=> {
    const newBlock :Block ={
      ...block,
      contents: contents,
      editTime: editTime
    } ;
    editBlock(pageId,newBlock);
  };

  const onChange =(event:ContentEditableEvent)=>{   
    const contents = event.target.value;
    setHtml(contents);
    editContents(contents);
  };
  
  const makeSubBlock =(parentBlock:Block, newSubBlock:Block)=>{
    const newToggleBlock:Block ={
      ...parentBlock, 
      editTime :editTime ,
      subBlocks:{
        blocks:parentBlock.subBlocks.blocks!==null? [...parentBlock.subBlocks.blocks , newSubBlock] : [newSubBlock] ,
        blockIdes: parentBlock.subBlocks.blockIdes !==null? [...parentBlock.subBlocks.blockIdes , newSubBlock.id] : [newSubBlock.id] ,
      } 
    };
    editBlock(pageId, newToggleBlock);
  };

  const onKeyup =(event: React.KeyboardEvent<HTMLDivElement>)=>{

    if(event.code === "Enter"){
      const start = html.indexOf("<div>");
      const last =html.indexOf("</div>");
      const newContents = html.substring(start+5, last);
      setHtml(newContents);

      const newBlock:Block ={
        id:editTime,
        editTime:editTime,
        type:"text",
        contents:newContents,
        subBlocks:{
          blocks:null,
          blockIdes:null
        },
        icon:null,
      };
      // 새로운 블록 만들기 
      if(block.type.includes("toggle")){
        //subBtn 
        setToggle(true);
        makeSubBlock(block, newBlock);
      }else{
        //새로운 버튼 
          addBlock(pageId, newBlock, nextBlockIndex);
      }
    } 
    if(event.code ==="Tab" && html ===""){
      //  이전 블록의 sub 으로 변경 
      const parentBlock = page.blocks[blockIndex-1];
      const editedBlock ={
        ...block,
        editTime:editTime,
        contentes:html 
      }
      makeSubBlock(parentBlock,editedBlock);
      deleteBlock(page.id, block);
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
          id={block.id}
          innerRef ={innerRef}
          html ={html}
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
            deleteBlock={deleteBlock}
          />)
          }
        </div>
      }
    </div>

  )
};

export default React.memo (BlockComponent);
