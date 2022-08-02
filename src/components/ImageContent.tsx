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
  const pageContent =document.getElementsByClassName('pageContent')[0] as HTMLElement;
  const previousClientX = useRef(0);
  const previousClientY = useRef(0);
  const drag =useRef<boolean>(false);
  const left ="left";
  const right ="right";
  const bottom= "bottom";
  type dragBtnName = typeof left| typeof right| typeof bottom;
  const dragBtn= useRef<dragBtnName>(left);
  const [imageStyle ,setImageStyle] =useState<CSSProperties>();
  const targetImgContent =document.getElementById(`${block.id}_contents`);
  const onMouseMove =(event:globalThis.MouseEvent)=>{
    if(drag.current){
      const changeX = event.clientX - previousClientX.current;
      const changeY = event.clientX - previousClientX.current;
      previousClientX.current =event.clientX;
      previousClientY.current =event.clientY;
      if( changeX !==0 || changeY!==0){
        const imgDomRect = targetImgContent?.getClientRects()[0];
        if(imgDomRect!==undefined){
          const imgWidth =imgDomRect.width;
          const imgHeight =imgDomRect.height;
          const width =dragBtn.current === right? 
          imgWidth + changeX : 
          imgWidth -changeX  ;
          const height = dragBtn.current === left? imgHeight - changeY : imgHeight +changeY;
          const changedStyle ={
            width: dragBtn.current !== bottom? `${width}px` : block.style.width ,
            height:`${height}px`,
          };
          setImageStyle(changedStyle);
        }
      }
    }
  };
  const onMouseDownSizeBtn=(event:MouseEvent<HTMLButtonElement>, btnName:dragBtnName)=>{
    previousClientX.current =event.clientX;
    previousClientY.current =event.clientY;
    drag.current=true; 
    dragBtn.current =btnName;
  };
  const onMouseUp=useCallback((event:globalThis.MouseEvent)=>{
    if(drag.current){
      previousClientX.current =0;
      previousClientY.current =0;
      drag.current=false;
      const width = targetImgContent?.offsetWidth;
      const height =targetImgContent?.offsetHeight; 
      if(width !==undefined && height !==undefined){
        const editedBlock:Block ={
          ...block,
          style:{
            ...block.style,
            width: `${width}px`  ,
            height:`${height}px`
          },
          editTime:JSON.stringify(Date.now()),
        };
        editBlock(pageId, editedBlock)
      };
    }  
  },[targetImgContent]);

    pageContent?.addEventListener("mousemove", (event)=> onMouseMove(event));
    pageContent?.addEventListener("mouseup", (event)=> onMouseUp(event))
  return(
    <div 
      className="imageContent"
      id={`${block.id}_contents`}
      onMouseOver={showBlockFn}
      style={imageStyle}
      > 
      <button 
        className='sizeBtn length left'
        onMouseDown={(event)=>onMouseDownSizeBtn(event,left)}
      >
        <span></span>
      </button>
      <button 
        className='sizeBtn length right'
        onMouseDown={(event)=>onMouseDownSizeBtn(event, right)}
      >
        <span></span>
      </button>
      <button 
        className='sizeBtn tranverse bottom '
        onMouseDown={(event)=>onMouseDownSizeBtn(event, bottom)}
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
