import React, { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block } from '../modules/notion';

type ImageContentProps={
  pageId:string,
  block:Block,
  editBlock:(pageId:string, block:Block)=>void,
  showBlockFn:(event: React.MouseEvent) => void,
}
const ImageContent =({pageId,block,editBlock , showBlockFn}:ImageContentProps)=>{
  const targetImgContent =document.getElementById(`${block.id}_contents`);
  const previousClientX = useRef(0);
  const previousClientY = useRef(0);
  const [draging ,setDraging]=useState<boolean>(false);
  const [imageStyle ,setImageStyle] =useState<CSSProperties>();

  const onMouseMove = (event:globalThis.MouseEvent)=>{
    console.log("move" ,draging);
    if(draging){
        const changeX = event.clientX - previousClientX.current;
        const changeY = event.clientX - previousClientX.current;
        previousClientX.current =event.clientX;
        previousClientY.current =event.clientY;
        if( changeX !==0 || changeY!==0){
          const imgDomRect = targetImgContent?.getClientRects()[0];
          if(imgDomRect!==undefined){
            const imgWidth =imgDomRect.width;
            const imgHeight =imgDomRect.height;
            const width =imgWidth - changeX;
            const height =imgHeight - changeY;
            const changedStyle ={
              width:`${width}px` ,
              height:`${height}px` 
            };
            setImageStyle(changedStyle)
          }
        }
      }
  };
  const onMouseDownSizeBtn= useCallback((event:MouseEvent<HTMLButtonElement>)=>{
    console.log("click");
    previousClientX.current =event.clientX;
    previousClientY.current =event.clientY;
    setDraging(true);
  },[]);
  const onMouseUp=useCallback((event:globalThis.MouseEvent)=>{
      previousClientX.current =0;
      previousClientY.current =0;
      console.log("up",draging)
      if(imageStyle !==undefined){
        const editedBlock:Block ={
          ...block,
          style:{
            ...block.style,
            width:imageStyle.width as string ,
            height: imageStyle.height as string
          },
          editTime:JSON.stringify(Date.now()),
        };
        editBlock(pageId, editedBlock)
      };
      setDraging(false);
  },[]);
  
      window.addEventListener("mousemove", (event)=> onMouseMove(event));
      draging && window.addEventListener("mouseup", (event)=> onMouseUp(event))

  return(
    <div 
      className="imageContent"
      id={`${block.id}_contents`}
      onMouseOver={showBlockFn}
      style={imageStyle}
      > 
      <button 
        className='sizeBtn length left'
        onMouseDown={onMouseDownSizeBtn}
      >
        <span></span>
      </button>
      <button 
        className='sizeBtn tranverse top'
        onMouseDown={onMouseDownSizeBtn}
      >
        <span></span>
      </button>
      <button 
        className='sizeBtn length right'
        onMouseDown={onMouseDownSizeBtn}
      >
        <span></span>
      </button>
      <button 
        className='sizeBtn tranverse bottom '
        onMouseDown={onMouseDownSizeBtn}
      >
        <span></span>
      </button>
      <img
        src={block.contents}
        alt="block_photo"
      /> 
    </div>
  )
};

export default React.memo(ImageContent);
