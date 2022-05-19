import React, { useState } from 'react';
import Menu from './Menu';
import {Block, blockSample, Page} from '../modules/notion';

import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { makeNewBlock } from './EditableBlock';

type BlockFnProp ={
  page:Page,
  userName:string,
  addBlock: (pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void, 
  editBlock: (pageId: string, block: Block) => void
};

const BlockFn =({page,userName, addBlock, editBlock}:BlockFnProp)=>{
  const editTime = JSON.stringify(Date.now());
  const newContents:string ="";
  const [block, setBlock]=useState<Block>(blockSample);

  const makeBlock =()=>{
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;
    const targetBlock= JSON.parse(sessionItem);
    setBlock(targetBlock);
    const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
    makeNewBlock(page, editTime,addBlock, editBlock, targetBlock, targetBlockIndex, newContents);
  };

  return (
    <div 
      id="blockFn"
      className='blockFn'
    >
      <button 
        className='addBlock'
        title="Click  to add a block below"
        onClick={makeBlock}
      >
        <AiOutlinePlus/>
      </button>
      <button 
        className='menuBtn'
        title ="Click to open menu"
      >
        <CgMenuGridO/>
        <Menu 
          block={block} 
          userName={userName}
        />
      </button>
  </div>
  )
};

export default React.memo(BlockFn)