import React from 'react';
import Menu from './Menu';
import {Block} from '../modules/notion';

import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';

type BlockFnProp ={
  block: Block,
  userName:string,
};

const BlockFn =({block ,userName}:BlockFnProp)=>{
  return (
    <div 
      id="blockFn"
      className='blockFn'
    >
      <button 
        className='addBlock'
        title="Click  to add a block below"
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