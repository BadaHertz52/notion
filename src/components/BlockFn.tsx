import React, { useState } from 'react';
import Menu from './Menu';
import {Block, Page} from '../modules/notion';

import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { makeNewBlock } from './EditableBlock';

type BlockFnProp ={
  page:Page,
  userName:string,
  addBlock: (pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void, 
  editBlock: (pageId: string, block: Block) => void,
  deleteBlock :(pageId: string, block: Block) => void,
};

const BlockFn =({page,userName, addBlock, editBlock, deleteBlock}:BlockFnProp)=>{
  const editTime = JSON.stringify(Date.now());
  const newContents:string ="";
  const [menuOpen, setMenuOpen]= useState<boolean>(false);
  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;

  const makeBlock =()=>{
    const targetBlock= JSON.parse(sessionItem);
    const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
    makeNewBlock(page, editTime,addBlock, editBlock, targetBlock, targetBlockIndex, newContents);
  };

  const openMenu=()=>{
    setMenuOpen(!menuOpen);
  };

  return (
    <div 
      id="blockFn"
      className='blockFn'
    >
      <button 
        className='blockFnIcon'
        title="Click  to add a block below"
        onClick={makeBlock}
      >
        <AiOutlinePlus/>
      </button>
      <button 
        className='blockFnIcon'
        title ="Click to open menu"
        onClick={openMenu}
      >
        <CgMenuGridO/>
        {menuOpen &&
          <Menu
            page={page}
            userName={userName}
            setMenuOpen={setMenuOpen}
            editBlock={editBlock}
            deleteBlock={deleteBlock}
          />
        }
      </button>

  </div>
  )
};

export default React.memo(BlockFn)