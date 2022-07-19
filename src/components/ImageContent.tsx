import React from 'react';
import { Block } from '../modules/notion';

type ImageContentProps={
  block:Block,
  editBlock:(pageId:string, block:Block)=>void,
  showBlockFn:(event: React.MouseEvent) => void,
}
const ImageContent =({block,editBlock , showBlockFn}:ImageContentProps)=>{
  const onMouseDownSizeBtn=()=>{

  };
  const onMouseUpSizeBtn=()=>{

  };

  return(
    <div 
      className="imageContent"
      id={`${block.id}_contents`}
      onMouseOver={showBlockFn}
    > 
      <button 
        className='sizeBtn left'
        onMouseDown={onMouseDownSizeBtn}
        onMouseUp={onMouseUpSizeBtn}
      >
        
      </button>
      <button 
        className='sizeBtn top'
        onMouseDown={onMouseDownSizeBtn}
        onMouseUp={onMouseUpSizeBtn}
      >
      </button>
      <button 
        className='sizeBtn rigth'
        onMouseDown={onMouseDownSizeBtn}
        onMouseUp={onMouseUpSizeBtn}
      >
      </button>
      <button 
        className='sizeBtn bottom'
        onMouseDown={onMouseDownSizeBtn}
        onMouseUp={onMouseUpSizeBtn}
      >
      </button>
      <img
        src={block.contents}
        alt="block_photo"
      /> 
    </div>
  )
};

export default React.memo(ImageContent);
