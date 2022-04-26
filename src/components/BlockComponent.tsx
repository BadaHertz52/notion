import React, { CSSProperties, useEffect, useRef, useState} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { MdPlayArrow } from 'react-icons/md';
//icon
import { Block,blockSample,Page, SubBlocks } from '../modules/notion';
import Menu from './Menu';
type BlockFnProp ={
  block:Block
};

const BlockFn =({block}:BlockFnProp)=>{
  
  const showMenu =()=>{

  };
  
  const makeNewBlock =()=>{

  };

  return (
    <div 
    className='blockFn'
    >
      <button 
        className='addBlock'
        onClick={makeNewBlock}
        title="Click  to add a block below"
      >
        <AiOutlinePlus/>
      </button>
      <button 
        className='menuBtn'
        onClick={showMenu}
        title ="Click to open menu"
      >
        <CgMenuGridO/>
        <Menu 
        block={block} 
        />
      </button>
  </div>
  )
}
type BlockProp ={
  block:Block,
  page:Page,
  editBlock : (pageId:string, newBlock:Block)=> void,
  addBlock : (pageId:string, newBlock:Block, nextBlockIndex:number)=> void,
  deleteBlock : (pageId:string, block:Block)=> void,
  makeSubBlock : (pageId:string ,mainBlock:Block, subBlock:Block)=> void,
};

const BlockComponent=({block ,page ,editBlock ,addBlock ,deleteBlock, makeSubBlock}:BlockProp)=>{
  const pageId:string =page.id ;
  const blockIndex:number = page.blocksId.indexOf(block.id) ;
  const nextBlockIndex :number= blockIndex +1; 
  const className =`${block.type} block`;
  const blockRef =useRef<HTMLDivElement>(null);
  const innerRef= useRef<HTMLElement>(null);
  const mainBlockRef =useRef<HTMLDivElement>(null);
  const [toggle, setToggle] =useState<boolean>(false);
  const toggleStyle:CSSProperties={
    transform: toggle? "rotate(90deg)" : "rotate(0deg)" 
  }
  // const mainBlockX:number|undefined = mainBlockRef.current?.offsetLeft ;

  // // const subBlockStyle:CSSProperties ={
  // //   marginLeft: mainBlockX !==undefined? mainBlockX-96+16+"px" : "96PX"
  // // };
  const [html ,setHtml] =useState<string>(block.contents);
  const [targetBlock, setTargetBlock]=useState<Block>(block); // 새로운 블록 만들때 
  const  editTime = JSON.stringify(Date.now());
  const [blockFn , setBlockFn ] =useState<boolean>(false);
  
  const editContents =(contents :string , targetBlock:Block)=> {
    const newBlock :Block ={
      ...targetBlock,
      contents: contents,
      editTime: editTime
    } ;
    editBlock(pageId,newBlock);
  };

  const changeSubBlock =(contents:string)=>{
    if(block.parents!==null){
      //1. parentBlocks 만들기 
      let parentId:string =block.parents[0];

      const  firstParentBlock:Block =
      page.blocks[page.blocksId.indexOf(parentId)];

      let parentBlock:Block =firstParentBlock;
      let parentBlocks:Block[] =[firstParentBlock];

      for (let i = 1; i < block.parents.length; i++) {
        const index = block.parents[i];
        const elementIndex:number = parentBlock.subBlocks.blocksId?.indexOf(index) as number;
        const element:Block = parentBlock.subBlocks.blocks?.splice(elementIndex,1)[0] as Block;
        console.log("element", element);
        parentBlocks.push(element);
        parentBlock =element;
      }
      
      console.log( block.id,"parentBlocks," , parentBlocks);

      //2. 수정된 블록 업데이트 
      
    }   
  }; 

  useEffect(()=>{
    if(block.id ==="sub2_1"){
      changeSubBlock("");
    }
  },[block])
  const onChange =(event:ContentEditableEvent)=>{   
    const contents = event.target.value;
      setHtml(contents);
      
      if(targetBlock.id === block.id){
        if(block.parents==null){
          editContents(contents ,block);
        }else{
          changeSubBlock(contents);
        }       
      }else{
      const start = contents.indexOf("<div>");
      const last =contents.indexOf("</div>");
      const text =contents.substring(start+5, last);
      const newContents = text=== "<br>" ? "": text;
      editContents(newContents, targetBlock);
      }
      
  };
  const make_subBlock =(parentBlock:Block, newSubBlock:Block)=>{

    const newMainBlock:Block ={
      ...parentBlock, 
      editTime :editTime ,
      subBlocks:{
        blocks:parentBlock.subBlocks.blocks!==null? [newSubBlock ,...parentBlock.subBlocks.blocks ]  : [newSubBlock] ,
        blocksId: parentBlock.subBlocks.blocksId !==null? [newSubBlock.id,...parentBlock.subBlocks.blocksId  ] : [newSubBlock.id] ,
      },
    };
    makeSubBlock(page.id, newMainBlock,newSubBlock );
  };

  const onKeydown =(event: React.KeyboardEvent<HTMLDivElement>)=>{
    if(event.code === "Enter"){
      
      // 새로운 블록 만들기 
        const newBlock:Block ={
          id:editTime,
          editTime:editTime,
          type:"text",
          contents:"",
          subBlocks:{
            blocks:null,
            blocksId:null
          },
          icon:null,
          parents:[]
        };
        setTargetBlock(newBlock);
      if(block.type.includes("toggle")){
        //subBtn 
        setToggle(true);
        const newSubBlock ={
          ...newBlock,
          parents:block.parents? block.parents.concat(block.id) : [block.id]
        }
        make_subBlock(block, newSubBlock);
      }else{
        //새로운 버튼 
        addBlock(pageId, newBlock, nextBlockIndex);
        document.getElementById(newBlock.id)?.focus();
      }

    } 
    if(event.code ==="Tab" && blockIndex>0){
      //  이전 블록의 sub 으로 변경 
      blockRef.current?.focus();
      console.log("tab block", block);
      const parentBlock = page.blocks[blockIndex-1];
      const editedBlock ={
        ...block,
        editTime:editTime
      };
      make_subBlock(parentBlock,editedBlock);
    };
  };

  const onKeyup=(event:React.KeyboardEvent)=>{
    if(event.code ==="Backspace" && html===""){
      deleteBlock(pageId, block);
    }
  }
  const onClickToggleBtn =()=>{
    setToggle(!toggle)
  };
  
  const onBlockFocus =()=>{
    innerRef.current?.focus();
  };

  return(
    <div 
      className={className} 
      id={block.id}
      onMouseEnter ={()=>setBlockFn(true)}
      onMouseLeave={()=>setBlockFn(false)}
      onClick={onBlockFocus}
      ref={blockRef}
    > 
      {blockFn &&
        <BlockFn  
          block={block}
        />
      }
      <div 
        className='mainBlock'
        ref={mainBlockRef}
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
          html ={html}
          onChange={onChange}
          onKeyDown={onKeydown}
          onKeyUp={onKeyup}
        />
      </div>
      {
      ((block.type==="toggle" && toggle)
        ||block.type !=="toggle"
        ) && 

        <div 
          className='subBlocks'
        >
          {block.subBlocks.blocks?.map((subBlock :Block)=> 
          <BlockComponent
            key={block.subBlocks.blocksId?.indexOf(subBlock.id)}
            block={subBlock}
            page={page}
            editBlock={editBlock} 
            addBlock={addBlock}
            deleteBlock={deleteBlock}
            makeSubBlock={makeSubBlock}
          />)
          }
        </div>
      }
    </div>

  )
};

export default React.memo (BlockComponent);
