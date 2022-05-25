import React from 'react';
import { CommentType } from '../modules/notion';
type CommentComponentProps={
  comments:CommentType[]
};
type CommentProps ={
  comment:CommentType
}
const Comments =({comments}:CommentComponentProps)=>{

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
      {comments.map((comment:CommentType)=>
        <Comment 
          key={`comment_${comments.indexOf(comment)}`}
          comment={comment} 
        />
      )}
    </div>
  )
};

export default React.memo(Comments);