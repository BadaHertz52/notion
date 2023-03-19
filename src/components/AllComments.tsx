import React, { Dispatch, MouseEvent, SetStateAction, useEffect, useState} from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CSSProperties } from "styled-components";
import { Block, MainCommentType, Page } from "../modules/notion";
import { detectRange } from "./BlockFn";
import Comments from "./Comments";

type AllCommentsProps={
  page:Page,
  userName:string,
  favorites:string[]|null,
  showAllComments:boolean,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
  discardEdit:boolean,
  setDiscardEdit:Dispatch<SetStateAction<boolean>>,
  style:CSSProperties,
}
const AllComments=({page, userName,showAllComments, setShowAllComments,discardEdit ,setDiscardEdit, style}:AllCommentsProps)=>{
  const inner =document.getElementById("inner");
  inner?.addEventListener("click",(event)=>{
    if(showAllComments){
      const allCommentsHtml =document.querySelector("#allComments");
      const allCommentsHtmlDomRect = allCommentsHtml?.getClientRects()[0];
      if(allCommentsHtmlDomRect!==undefined){
        const isInAllComments= detectRange(event, allCommentsHtmlDomRect);
        if(! isInAllComments){
          setShowAllComments(false);
        }
      }

    };
  })
  const pageId= page.id;
  const commentsBlocks : Block[]|null= page.blocks!==null? page.blocks.filter((block:Block)=> block.comments !==null && block.comments) : null; 
  const targetCommentsBlocks :Block[]|null =commentsBlocks ==null? null:(commentsBlocks[0]!==undefined? commentsBlocks: null);
  const allComments = targetCommentsBlocks?.map((block:Block)=>block.comments);
  const open ="open";
  const resolve="resolve" ;
  const [select, setSelect]=useState<typeof open| typeof resolve>(open);
  const [result, setResult]=useState<boolean>(true);
  const openSelect =(event:MouseEvent)=>{
    const target =event.currentTarget;
    const typesDoc = target.parentElement;
    typesDoc?.classList.toggle("open");
  };
  const closeSelect= (event:MouseEvent)=>{
    const target =event.currentTarget.parentElement?.previousElementSibling;
    if(target !==undefined && target!==null){
      target.parentElement?.classList.remove("open");
    }
  };
  useEffect(()=>{
    if(allComments !== undefined){
      let resultComments:MainCommentType[] =[];
      allComments.forEach((comments:MainCommentType[]|null)=>{
        if(comments !==null){
          const seletedComments= comments.filter((c:MainCommentType)=> c.type=== select);
          seletedComments[0]!==undefined && seletedComments.forEach(c => resultComments.push(c));
        };
        
      });
      if(resultComments[0]===undefined){
        setResult(false);
      }else{
        setResult(true);
      };
    };
  },[select]);

  return(
  <div 
    id="allComments"
    style={style}
  >
    <div className='allComments-inner'>
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
              onClick={(event)=>{setSelect(open); closeSelect(event) }}
            >
              Open Comments
            </button>
            <button
              onClick={(event)=>{setSelect(resolve); closeSelect(event)}}
            >
              Resolved Comments
            </button>
          </div>
        </div>
      </div>
      {(targetCommentsBlocks==null || !result)?
        <div className="noResult">
          <div>
            <p>
              No {select=== open? "Open": "Resolved"}  comments yet
            </p>
            <p> 
              {select=== open? "Open": "Resolved"} comments on this page
              will appear here
            </p>
          </div>
          {/*icon*/}
        </div>
        :
        targetCommentsBlocks.map((block:Block)=>
          <Comments
            key={`allComments_${block.id}`}
            pageId={pageId}
            page={page}
            userName={userName}
            block={block}
            frameHtml={null}
            openComment={false}
            select={select}
            discardEdit={discardEdit}
            setDiscardEdit={setDiscardEdit}
            showAllComments={showAllComments}
          />
        )
      }
    </div>
  </div>
  )
};

export default React.memo(AllComments)