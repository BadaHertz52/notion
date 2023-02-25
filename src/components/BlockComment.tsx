import React from 'react';
import { IoChatboxOutline } from 'react-icons/io5';
import { Block } from '../modules/notion';

type BlockCommentProps={
  block:Block,
  onClickCommentBtn: (block: Block) => void
};

const BlockComment =({block , onClickCommentBtn}:BlockCommentProps)=>{
  return (
      <div 
        id={`${block.id}_comments`}
        className="commentsBubble"
        >
        <button 
          className='commentBtn btnIcon'
          name={block.id}
          onClick={()=>onClickCommentBtn(block)}
        >
          <IoChatboxOutline/>
          <span className="commentLength">
            {block.comments?.length}
          </span>
        </button>
      </div>

  )
};

export default React.memo(BlockComment)