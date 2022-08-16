import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CSSProperties } from "styled-components";
import { Block, Page } from "../modules/notion";
import Comments from "./Comments";

type AllCommentsProps={
  page:Page,
  userName:string,
  favorites:string[]|null,
  editBlock: (pageId: string, block: Block) => void,
  showAllComments:boolean,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
  discardEdit:boolean,
}
const AllComments=({page, userName, editBlock, showAllComments, setShowAllComments ,discardEdit}:AllCommentsProps)=>{
  const pageId= page.id;
  const [targetCommentsBlocks, setTargetCommentsBlocks] =useState<Block[]|null>(null);
  const open ="open";
  const resolve="resolve" ;
  const [select, setSelect]=useState<typeof open| typeof resolve>(open);

  const offStyle :CSSProperties ={transform:"translateX(0)"};
  const [style, setStyle]=useState<CSSProperties>(offStyle);

  const changeStyle=()=>{
    const innerWidth =window.innerWidth;
    const topbar_left =document.querySelector(".topbar_left");
    const pagePath =document.querySelectorAll(".pagePath");
    const changePathWidth=(topbarLeftWidth:number)=>{
      const width :number =((topbarLeftWidth -32) / pagePath.length);
      pagePath.forEach((e:Element)=> e.setAttribute("style",`width:${width}px`));
    };
    if(showAllComments){
      setStyle(offStyle);
      if(innerWidth >= 385){
        const newWidth =innerWidth -(12+385+5);
        topbar_left?.setAttribute("style", `width: ${newWidth}px`);
        changePathWidth(newWidth);
        
      }else{
        topbar_left!==null &&
        changePathWidth(topbar_left.clientWidth);
      }
    }else{
      setStyle({transform:`translateX(${innerWidth}px)`});
      topbar_left?.setAttribute("style", "width:50%");
      changePathWidth( window.innerWidth -26);
    }
  }
  useEffect(()=>{ 
    changeStyle();
  },[showAllComments]);
  
  window.onresize= changeStyle;
  const openSelect =(event:React.MouseEvent)=>{
    const target =event.currentTarget;
    const typesDoc = target.parentElement;
    typesDoc?.classList.toggle("open");

  };
  useEffect(()=>{
    const blocks= page.blocks.filter((block:Block)=> block.comments !==null && block.comments); 
    setTargetCommentsBlocks(blocks);
  },[page]);
  useEffect(()=>{
    if(!showAllComments){
      const onAllComments =document.querySelector(".allComments");
      onAllComments?.setAttribute("style",  `transform:translateX(${window.innerWidth}px)`
      )
    }else{
      const allComments =document.querySelector(".allComments.on");
      allComments?.setAttribute("style", "transform:translateX(0)")
    }
  },[showAllComments])
  return(
  <div 
    id="allComments"
    style ={style}
  >
    <div className='inner'>
      <div className='allComments_header'>
        <span>Comments</span>
        <div className='commentsTypeBtn'>
          <button 
            className='selectType'
            onClick={openSelect}
          >
            {select=== open? "Open": "Resolve"} 
            <MdKeyboardArrowDown/>
          </button>
          <div 
            className="types"
          >
            <button
              onClick={()=>setSelect(open)}
            >
              Open Comments
            </button>
            <button
              onClick={()=>setSelect(resolve)}
            >
              Resolved Comments
            </button>
          </div>
        </div>
      </div>
      {targetCommentsBlocks==null?
        <div>
          {/*icon*/}
          <p>
            No {select=== open? "Open": "Resolved"}  comments yet
          </p>
          <p> 
            {select=== open? "Open": "Resolved"} comments on this page
            will appear here
          </p>
          
        </div>
        :
        targetCommentsBlocks.map((block:Block)=>
          <Comments
            key={`allComments_${block.id}`}
            pageId={pageId}
            page={null}
            userName={userName}
            block={block}
            editBlock={editBlock}
            editPage={null}
            select={select}
            discardEdit={discardEdit}
          />
        )
      }
    </div>
  </div>
  )
};

export default React.memo(AllComments)