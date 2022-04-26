import React, { CSSProperties, useEffect, useRef, useState} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { MdPlayArrow } from 'react-icons/md';
//icon
import { Block,blockSample,Page } from '../modules/notion';
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
  changeToSub : (pageId:string ,block:Block)=> void,
  raiseBlock: (pageId:string, block:Block)=>void,
};

const BlockComponent=({block ,page ,editBlock ,addBlock ,deleteBlock, changeToSub , raiseBlock}:BlockProp)=>{
  const pageId:string =page.id ;
  const blockIndex:number = page.blocksId.indexOf(block.id) ;
  const nextBlockIndex :number= blockIndex +1; 
  const className =`${block.type} block`;
  const blockRef =useRef<HTMLDivElement>(null);
  const innerRef= useRef<HTMLElement>(null);
  const mainBlockRef =useRef<HTMLDivElement>(null);
  const [subBlocks, setSubBlocks]=useState<Block[] | null>(null);
  const [toggle, setToggle] =useState<boolean>(false);
  const toggleStyle:CSSProperties={
    transform: toggle? "rotate(90deg)" : "rotate(0deg)" 
  }

  const [html ,setHtml] =useState<string>(block.contents);
  const [targetBlock, setTargetBlock]=useState<Block>(block); // 새로운 블록 만들때 
  const  editTime = JSON.stringify(Date.now());
  const [blockFn , setBlockFn ] =useState<boolean>(false);


  const editContents =(contents :string , targetBlock:Block , change:boolean)=> {
    const newBlock :Block ={
      ...targetBlock,
      contents: contents,
      editTime: editTime
    } ;
    editBlock(pageId,newBlock);
  };

  const onChange =(event:ContentEditableEvent)=>{   
    const contents = event.target.value;
      setHtml(contents);
      
      if(targetBlock.id === block.id){
        editContents(contents ,block, false);      
      }else{
        //when user press eneter 
      const start = contents.indexOf("<div>");
      const last =contents.indexOf("</div>");
      const text =contents.substring(start+5, last);
      const newContents = text=== "<br>" ? "": text;
      editContents(newContents, targetBlock , false);
      }
      
  };
  const make_subBlock =(parentBlock:Block, subBlock:Block)=>{
    const newMainBlock:Block ={
      ...parentBlock, 
      editTime :editTime ,
      subBlocksId: parentBlock.subBlocksId? [ subBlock.id ,...parentBlock.subBlocksId]: [subBlock.id],
    };
    const newSubBlock:Block ={
      ...subBlock,
      parentBlocksId:parentBlock.parentBlocksId?  [...parentBlock.parentBlocksId, parentBlock.id] : [
        parentBlock.id
      ]
    };
    addBlock(page.id,newSubBlock,nextBlockIndex);
    editBlock(page.id, newMainBlock);
    document.getElementById(newSubBlock.id)?.focus();
  };

  const onKeydown =(event: React.KeyboardEvent<HTMLDivElement>)=>{
    if(event.code === "Enter"){
      
      // 새로운 블록 만들기 
        const newBlock:Block ={
          id:editTime,
          editTime:editTime,
          type:"text",
          contents:"",
          firstBlock:true,
          subBlocksId:null,
          parentBlocksId:null,
          icon:null,
        };
        setTargetBlock(newBlock);
      if(block.type.includes("toggle")){
        //subBtn 
        setToggle(true);
        const newSubBlock:Block ={
          ...newBlock,
          firstBlock:false,
          parentBlocksId:[block.id]
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
      const newParentBlock:Block = page.blocks[blockIndex-1];
      const editedBlock:Block ={
        ...block,
        firstBlock: false,
        parentBlocksId: newParentBlock.parentBlocksId? newParentBlock.parentBlocksId.concat(newParentBlock.id) : [newParentBlock.id],
        editTime:editTime
      };
      changeToSub(page.id, editedBlock);
      
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

  useEffect(()=>{
    const subBlocksId = block.subBlocksId;
    if(subBlocksId!==null){
      const subBlockArray:Block[] = subBlocksId.map((id:string)=>{
        const index:number = page.blocksId.indexOf(id);
        const subBlock:Block = page.blocks[index];
        return subBlock;
      });
      setSubBlocks(subBlockArray);
    }
  },[block.subBlocksId]);

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
          {subBlocks?.map((subBlock :Block)=> 
          <BlockComponent
            key={block.subBlocksId?.indexOf(subBlock.id)}
            block={subBlock}
            page={page}
            editBlock={editBlock} 
            addBlock={addBlock}
            deleteBlock={deleteBlock}
            changeToSub={changeToSub}
            raiseBlock={raiseBlock}
          />)
          }
        </div>
      }
    </div>

  )
};

export default React.memo (BlockComponent);
