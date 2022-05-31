
import React, { FormEvent, useState } from 'react';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import { CSSProperties } from 'styled-components';
import { Block, CommentType, } from '../modules/notion';

type CommentComponentProps={
  block:Block,
  pageId: string,
  userName:string,
  editBlock :(pageId: string, block: Block) => void,
};
type CommentProps ={
  comment:CommentType
};
type CommentInputProps={
  userName: string,
  pageId: string,
  editBlock :(pageId: string, block: Block) => void,
}
export const CommentInput =({userName, pageId ,editBlock}:CommentInputProps)=>{
  const userNameFirstLetter =userName.substring(0,1).toUpperCase();
  const inputSubmit = document.getElementById("commentInputSubmit") as HTMLInputElement;
  const [submitStyle,setSubmitStyle] =useState<CSSProperties>({
    backgroundColor:"grey",
    border:"none"
  });
  const [text, setText]=useState<string>("");
  
  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;
  const block:Block= JSON.parse(sessionItem);

  const onInputText=(event:FormEvent)=>{
    const target =event?.target as Node; 
    const value =target.textContent;
    value !==null && setSubmitStyle({
      backgroundColor: " rgb(46, 170, 220)",
    })
  };

  const addComment =()=>{
    const value = inputSubmit.value; 
    const newComment :CommentType ={
      userName:userName,
      comment:value,
      editTime:JSON.stringify(Date.now())
    };
    const newBlock ={
      ...block,
      comment:block.comments === null? [newComment]:block.comments.concat(newComment)
    };
    editBlock(pageId ,newBlock );
  };

  return(
    <div className="commentInput">
      <div className='firstLetter'>
        {userNameFirstLetter}
      </div>
      <form
        onSubmit={addComment}
        
      >
        <div>
          <input
            type="text"
            placeholder='Add a comment'
            className="commentText"
            name="comment"
            value={text}
            onInput={onInputText}
          />
          <div>
            <label >
              <BsFillArrowUpCircleFill
                style={submitStyle}
              />
              <input 
              type="submit"
              className="commentInPutSubmit"
              />
            </label>

          </div>

        </div>
      </form>

    </div>
  )
};
const Comments =({pageId,block, userName ,editBlock}:CommentComponentProps)=>{
  const comments=block.comments ;

  const Comment =({comment}:CommentProps)=>{
    const firstLetter = comment.userName.substring(0,1).toUpperCase();
    return(
      <div 
          className='comment'
        >
          <div className="firstLetter">
            {firstLetter}
          </div>
        </div>
    )
  }
  return(
    <div className='comments'>
      {comments?.map((comment:CommentType)=>
        <Comment 
          key={`comment_${comments.indexOf(comment)}`}
          comment={comment} 
        />
      )}
      <CommentInput
        userName={userName}
        pageId={pageId}
        editBlock={editBlock}
      />
    </div>
  )
};

export default React.memo(Comments);