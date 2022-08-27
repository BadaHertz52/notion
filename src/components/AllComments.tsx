import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CSSProperties } from "styled-components";
import { Block, Page } from "../modules/notion";
import { detectRange } from "./BlockFn";
import Comments from "./Comments";

type AllCommentsProps={
  page:Page,
  userName:string,
  favorites:string[]|null,
  editBlock: (pageId: string, block: Block) => void,
  showAllComments:boolean,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
  discardEdit:boolean,
  style:CSSProperties,
}
const AllComments=({page, userName, editBlock, showAllComments, setShowAllComments,discardEdit , style}:AllCommentsProps)=>{
  const inner =document.getElementById("inner");
  inner?.addEventListener("click",(event)=>{
    if(showAllComments){
      const allCommentsHtml =document.querySelector("#allComments");
      const allCommentsHtmlDomRect = allCommentsHtml?.getClientRects()[0];
      if(allCommentsHtmlDomRect!==undefined){
        const isInAllComments= detectRange(event, allCommentsHtmlDomRect);
        console.log("is",isInAllComments);
        if(! isInAllComments){
          setShowAllComments(false);
        }
      }

    };
  })
  const pageId= page.id;
  const [targetCommentsBlocks, setTargetCommentsBlocks] =useState<Block[]|null>(null);
  const open ="open";
  const resolve="resolve" ;
  const [select, setSelect]=useState<typeof open| typeof resolve>(open);

  const openSelect =(event:React.MouseEvent)=>{
    const target =event.currentTarget;
    const typesDoc = target.parentElement;
    typesDoc?.classList.toggle("open");

  };
  useEffect(()=>{
    const blocks= page.blocks.filter((block:Block)=> block.comments !==null && block.comments); 
    setTargetCommentsBlocks(blocks);
  },[page]);

  return(
  <div 
    id="allComments"
    style={style}
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