import React, { CSSProperties, useRef, useState} from 'react';

import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { MdPlayArrow } from 'react-icons/md';
//icon
import { Block,Page } from '../modules/notion';


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
};


const BlockComponent=({block}:BlockProp)=>{
  const className =`${block.type} block`;
  const blockRef =useRef<HTMLDivElement>(null);
  const innerRef= useRef<HTMLElement>(null);
  const mainBlockRef =useRef<HTMLDivElement>(null);
  const [toggle, setToggle] =useState<boolean>(false);
  const toggleStyle:CSSProperties={
    transform: toggle? "rotate(90deg)" : "rotate(0deg)" 
  };
  const [blockFn , setBlockFn ] =useState<boolean>(false);

  const onClickToggleBtn =()=>{
    setToggle(!toggle)
  };
  
  const onBlockFocus =()=>{
    innerRef.current?.focus();
  };

  return(
    <div 
      className={className} 
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
        <div className='blockContents' placeholder="type '/' for commmands">
          {block.contents}
        </div>
      </div>
      {/* {
      ((block.type==="toggle" && toggle)
        ||block.type !=="toggle"
        ) && 

        <div 
          className='subBlocks'
        >
          {subBlocks?.map((subBlock :Block)=> 
            <EditableBlock 
              page={page}
              block={subBlock}
              setBlocks={setSubBlocks}
            />
          )
          }
        </div>
      } */}
    </div>

  )
};

export default React.memo (BlockComponent);
