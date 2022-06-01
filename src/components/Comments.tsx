
import React, { FormEvent, useState } from 'react';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import { CSSProperties } from 'styled-components';
import { Block, CommentType, } from '../modules/notion';
import Time from './Time';

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
  const editabelBlock = document.getElementsByClassName("editableBlock")[0] as HTMLDivElement;
  const width =editabelBlock.offsetWidth - 192 ;

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
      setSubmitStyle({
        fill:"grey",
        border:"none"
      });

    }else{
      setSubmitStyle({
        fill: " rgb(46, 170, 220)",
      }) ;
    }
  };

  const addComment =(event:React.MouseEvent<HTMLButtonElement>)=>{; 
    const newComment :CommentType ={
      userName:userName,
      comment:text,
      editTime:JSON.stringify(Date.now())
    };
      const newBlock :Block={
        ...block,
        comments:block.comments === null? [newComment]:block.comments.concat(newComment)
      };
      editBlock(pageId ,newBlock );
  };

  return(
    <div 
      className="commentInput"
      style ={{width: width}}
    >
      <div className='firstLetter'>
        {userNameFirstLetter}
      </div>
      <form
      >
        <input
          type="text"
          placeholder='Add a comment'
          className="commentText"
          name="comment"
          onInput={onInputText}
        />
        <button 
          type="button"
          onClick={addComment}
          id="commentInputSubmit"
          name="commentInputSubmit"
          disabled ={text ==null || text ===""}
        >
        <BsFillArrowUpCircleFill
          style={submitStyle}
          />
        </button>
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