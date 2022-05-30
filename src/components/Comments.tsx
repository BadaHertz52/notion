import React, { FormEvent, FormEventHandler, useState } from 'react';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import { Block, CommentType, page } from '../modules/notion';
type CommentComponentProps={
  pageId: string,
  block:Block,
  userName:string,
  editBlock :(pageId: string, block: Block) => void,
};
type CommentProps ={
  comment:CommentType
};
type CommentInputProps={
  userName: string,
  pageId: string,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
}
export const CommentInput =({userName, pageId, block ,editBlock}:CommentInputProps)=>{
  const userNameFirstLetter =userName.substring(0,1).toUpperCase();
  const inputSubmit = document.getElementById("commentInputSubmit") as HTMLInputElement;
  const [text, setText]=useState<string>("");

  const onInputText=(event:FormEvent)=>{
    const target =event?.target as Node; 
    const value =target.textContent;
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
      <div className='commentInput_form'>
        <form
          onSubmit={addComment}
        >
          <input
            type="text"
            placeholder='Add a comment'
            name="comment"
            value={text}
            onInput={onInputText}
          />

          <input 
            type="submit"
            id="commentInPutSubmit"
            value="submit"
          >
          </input>
        </form>
      </div>
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
        block={block}
        pageId={pageId}
        editBlock={editBlock}
      />
    </div>
  )
};

export default React.memo(Comments);