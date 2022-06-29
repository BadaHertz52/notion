import React from "react";
import { Block } from "../modules/notion";
import Comments from "./Comments";

type AllCommentsProps={
  allCommentsBlocks :Block[]|null,
  pageId:string,
  userName:string,
  editBlock: (pageId: string, block: Block) => void
}
const AllComments=({allCommentsBlocks , pageId, userName,editBlock}:AllCommentsProps)=>{
  return(
  <div id="allComments">
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