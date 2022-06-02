
import React, { Dispatch, FormEvent, SetStateAction, useRef, useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, BlockCommentType, CommentType, page, } from '../modules/notion';
import { BsFillArrowUpCircleFill, BsLink45Deg } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoTrashOutline } from 'react-icons/io5';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Time from './Time';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { detectRange } from './BlockFn';

type CommentsProps={
  block:Block,
  pageId: string,
  userName:string,
  editBlock :(pageId: string, block: Block) => void,
  setCommentOpen :Dispatch<SetStateAction<boolean>>,
};
type CommentProps ={
  userName: string,
  comment:BlockCommentType,
  pageId:string,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
};
type CommentInputProps={
  userName: string,
  pageId: string,
  comment:BlockCommentType | null,
  editBlock :(pageId: string, block: Block) => void,
}
type CommentBlockProps ={
  comment: CommentType,
  mainComment:boolean
};

type CommentToolProps ={
  mainComment:boolean
};

export const CommentInput =({userName, pageId ,comment,editBlock}:CommentInputProps)=>{
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

  const addComment =(event:React.MouseEvent<HTMLButtonElement>)=>{
    const editTime =JSON.stringify(Date.now());
    const newId = `comment_${editTime}`;
    if(comment !==null && block.comments !== null){
      // block.comments 중 특정 comment에 comment를 다는 
      const commentsArry =[...block.comments];
      const ids: string[] = block.comments.map((comment:BlockCommentType)=> comment.id);
      const commentIndex = ids.indexOf(comment.id);

      const comment_newComment:CommentType ={
        id:newId,
        userName: userName,
        editTime:editTime,
        content: text ,
      };
      const updatedComment:BlockCommentType ={
        ...comment,
        comments:comment.comments !==null? 
                comment.comments.concat(comment_newComment) :
                [comment_newComment],
        commentsId: comment.commentsId !==null ?
        comment.commentsId.concat(comment_newComment.id):
        [comment_newComment.id],
      };
      commentsArry.splice(commentIndex,1, updatedComment);

      const newBlock:Block ={
        ...block,
        comments:commentsArry
      }
      editBlock(pageId, newBlock );

    }else{
      const newComment :BlockCommentType ={
        id:newId,
        userName:userName,
        content:text,
        type:"open",
        editTime:editTime,
        comments:null,
        commentsId:null,
      };
        const newBlock :Block={
          ...block,
          comments:block.comments === null? [newComment]:block.comments.concat(newComment)
        };
        editBlock(pageId ,newBlock );
    }

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

const CommentTool =({mainComment}:CommentToolProps)=>{
  const [moreOpen, setMoreOpen]= useState<boolean>(false);

  return(
    <div className="tool">
      {mainComment &&
          <button className='resolveTool'>
          Resolve
        </button>
      }
      <button className='moreTool'>
        <BsThreeDots/>
      </button>
    {moreOpen &&
            <div className='tool-more'>
            <button>
              <HiOutlinePencil/>
              <span>
                Edit comment
              </span>
            </button>
            <button>
              <IoTrashOutline/>
              <span>
                Delete comment
              </span>
            </button>
            <button>
              <BsLink45Deg/>
              <span>
                Copy link to comment
              </span>
            </button>
            <button className='aboutComments'>
              <AiOutlineQuestionCircle/>
              <span>Learn about comments</span>
            </button>
          </div>
    }

  </div>
  )
}

const CommentBlock =({comment ,mainComment}:CommentBlockProps)=>{
  const firstLetter = comment.userName.substring(0,1).toUpperCase();
  return (
    <div 
    className='commentBlock'
  >
    <section className='comment_header'>
      <div className="information">
        <div className="firstLetter">
          {firstLetter}
        </div>
        <div className='userName'>
          {comment.userName}
        </div>
        <div className="time">
          <Time
            editTime={comment.editTime}
          />
        </div>
      </div>
      <CommentTool
        mainComment={mainComment }
      />
    </section>
    <section className='comment_content'>
      <div>{comment.content}</div>
    </section>
    </div>
  )
}
const Comment =({userName,comment, block, pageId, editBlock}:CommentProps)=>{

  return(
    <div className='comment'>
      <div className="main_comment">
        <CommentBlock 
          comment={comment}
          mainComment={true}
        />
      </div>
      <div className='comment_comment'>
        {comment.comments?.map((comment:CommentType)=>
        <CommentBlock 
          comment={comment}
          mainComment={false}
        />)
        }
      </div>
      <CommentInput
        userName={userName}
        pageId={pageId}
        editBlock={editBlock}
        comment={comment}
      />
    </div>
  )
};
const Comments =({pageId,block, userName ,editBlock ,setCommentOpen}:CommentsProps)=>{

  const comments=block.comments ;
  const commentsRef =useRef<HTMLDivElement>(null);
  const resolveComments :BlockCommentType[]| null =comments !==null ? 
  comments?.filter((comment:BlockCommentType)=> comment.type ==="resolve") :
  null;
  const opendComments :BlockCommentType[]| null = comments !== null ?
  comments?.filter((comment:BlockCommentType)=> comment.type ==="open"):
    null;
  const [targetComments, setTargetComment]= useState<BlockCommentType[]| null>(comments);
  const inner =document.getElementById("inner");

  const closeComments =(event:MouseEvent)=>{
    const commentsDoc = commentsRef.current;
    const commentsDocArea =commentsDoc?.getClientRects()[0];
    const isInnerCommentsDoc =detectRange(event, commentsDocArea);
    !isInnerCommentsDoc &&
    setCommentOpen(false);
  };
  inner?.addEventListener("click", (event:MouseEvent)=>{
      closeComments(event)
    });
  return(
    <div 
      className='comments'
      ref={commentsRef}
    >
      {resolveComments !==null && resolveComments[0]!== undefined &&
        <section className="commentType">
          <button >
            <span>Open</span>
            <span>{opendComments?.length}</span>
          </button>
          <button className="commentType">
            <span>Resolve</span>
            <span>{resolveComments?.length}</span>
          </button>
        </section>
      }
      {targetComments !==null &&
        <section className='comments_comments'>
          {targetComments.map((comment:BlockCommentType)=>
            <Comment 
              key={`comment_${comment.id}`}
              userName={userName}
              comment={comment}
              block={block}
              pageId={pageId}
              editBlock={editBlock}
            />
          )
          }
        </section>
      }
    </div>
  )
};

export default React.memo(Comments);