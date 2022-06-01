
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
  const inputSubmit =document.getElementById("commentInputSubmit")
  const [submitStyle,setSubmitStyle] =useState<CSSProperties>({
    fill:"grey",
    border:"none"
  });
  const [text, setText]=useState<string>("");
  
  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;
  const block:Block= JSON.parse(sessionItem);

  const onInputText=(event:FormEvent<HTMLInputElement>)=>{
    const target =event?.currentTarget ; 
    const value =target.value;
    setText(value);
    if(value ==null  || value===""){
      inputSubmit?.setAttribute("disabled", "disabled");
      setSubmitStyle({
        fill:"grey",
        border:"none"
      });

    }else{
      inputSubmit?.setAttribute("disabled", "enabled");
      setSubmitStyle({
        fill: " rgb(46, 170, 220)",
      }) ;
    }
  };

  const addComment =(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault(); 
    const newComment :CommentType ={
      userName:userName,
      comment:text,
      editTime:JSON.stringify(Date.now())
    };
    if(text !==null && text !==""){
      const newBlock ={
        ...block,
        comment:block.comments === null? [newComment]:block.comments.concat(newComment)
      };
      editBlock(pageId ,newBlock );
    }
  };

  return(
    <div className="commentInput">
      <div className='firstLetter'>
        {userNameFirstLetter}
      </div>
      <form
        onSubmit={addComment}
      >
          <input
            type="text"
            placeholder='Add a comment'
            className="commentText"
            name="comment"
            onInput={onInputText}
          />
          <label
          htmlFor="commentInputSubmit"
          >
            <BsFillArrowUpCircleFill
              style={submitStyle}
            />
          </label>
            <input 
            type="submit"
            id="commentInputSubmit"
            name="commentInputSubmit"
            />
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