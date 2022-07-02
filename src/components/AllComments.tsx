import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Block, Page } from "../modules/notion";
import Comments from "./Comments";

type AllCommentsProps={
  page:Page,
  userName:string,
  favorites:string[]|null,
  editBlock: (pageId: string, block: Block) => void,
  showAllComments:boolean,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
}
const AllComments=({page, userName, editBlock, showAllComments, setShowAllComments}:AllCommentsProps)=>{
  const pageId= page.id;
  const [allCommentsBlocks, setAllCommentsBlocks] =useState<Block[]|null>(null);

  useEffect(()=>{
    const blocks= page.blocks.filter((block:Block)=> block.comments !==null);
    setAllCommentsBlocks(blocks);
  },[page])
  return(
  <div 
    id="allComments"
    className={showAllComments? "allComments on" : "allComments"}
  >
    <div className='inner'>
      <div className='allComments_header'>
        <span>Comments</span>
        <div className='commentsTypeBtn'>
          <div className='selectType'></div>
          <div className="types">
            <button>
              open
            </button>
            <button>
              resolve
            </button>
          </div>
        </div>
      </div>
      {allCommentsBlocks==null?
        <div>
          {/*icon*/}
          <p>No open comments yet</p>
          <p>Open comments on thi page
            will appear here
          </p>
          
        </div>
        :
        allCommentsBlocks.map((block:Block)=>
          <Comments
            commentsStyle={undefined}
            pageId={pageId}
            userName={userName}
            block={block}
            editBlock={editBlock}
          />
        )
      }
    </div>
  </div>
  )
};

export default React.memo(AllComments)