
import React, {  Dispatch, FormEvent,SetStateAction,useEffect,useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, BlockCommentType, CommentType } from '../modules/notion';
import { BsFillArrowUpCircleFill, BsLink45Deg, BsThreeDots } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoTrashOutline } from 'react-icons/io5';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Time from './Time';

type CommentsProps={
  block:Block,
  pageId: string,
  userName:string,
  editBlock :(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
};
type CommentProps ={
  userName: string,
  comment:BlockCommentType,
  pageId:string,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
};
type CommentInputProps={
  userName: string,
  pageId: string,
  comment:BlockCommentType | null,
  editBlock :(pageId: string, block: Block) => void,
  commentBlock: Block|null,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
}
type CommentBlockProps ={
  comment: CommentType,
  mainComment:boolean,
  block :Block,
};

type CommentToolProps ={
  mainComment:boolean
};

export const CommentInput =({userName, pageId ,comment,editBlock, commentBlock, setCommentBlock}:CommentInputProps)=>{
  const userNameFirstLetter =userName.substring(0,1).toUpperCase();
  const editableBlock = document.getElementsByClassName("editableBlock")[0] as HTMLElement | undefined ;
  const width = editableBlock !== undefined ? editableBlock.offsetWidth - 192 : '100%' ;
  
  const [submitStyle,setSubmitStyle] =useState<CSSProperties>({
    fill:"grey",
    border:"none"
  });
  const [text, setText]=useState<string>("");


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

  const onClick =(event:React.MouseEvent<HTMLButtonElement>)=>{
    const editTime =JSON.stringify(Date.now());
    const newId = `comment_${editTime}`;
    const updateBlock =(newBlock:Block)=>{
      editBlock(pageId, newBlock );
      setCommentBlock(newBlock);
    };
    const addComment =(block:Block , blockComments:BlockCommentType[])=>{
      if(comment !==null ){
        // commentBlock.comments 중 특정 comment에 comment를 다는 
        const commentsArry =[...blockComments];
        const ids: string[] = blockComments?.map((comment:BlockCommentType)=> comment.id) as string[];
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
        updateBlock(newBlock)
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
            comments:blockComments === null? [newComment]:blockComments.concat(newComment)
          };
          updateBlock(newBlock);
      }
    };
    if(commentBlock ==null){
      const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;
      const block:Block= JSON.parse(sessionItem);
      if(block.comments !==null){
        addComment(block, block.comments);
      }else{
        console.log("Erro: comments of this block is not ")
      };
    }else{  
      if(commentBlock.comments !==null){
        addComment(commentBlock, commentBlock.comments);
      }else{
        console.log("Erro: comments of this block is not ")
      };
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
          onClick={onClick}
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
};

const CommentBlock =({comment ,mainComment ,block}:CommentBlockProps)=>{
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
    {mainComment &&
    <section className='comment_block'>
      <div className='comment_block_line'>

      </div>
      <div className='comment_block_content'>
        {block.contents}
      </div>
    </section>
    }
    <section className='comment_content'>
      <div>{comment.content}</div>
    </section>
    </div>
  )
}
const Comment =({userName,comment, block, pageId, editBlock ,setCommentBlock}:CommentProps)=>{

  return(
    <div className='comment'>
      <div className="main_comment">
        <CommentBlock 
          comment={comment}
          mainComment={true}
          block={block}
        />
      </div>
      <div className='comment_comment'>
        {comment.comments?.map((comment:CommentType)=>
        <CommentBlock
          key={`commentBlock_${comment.id}`} 
          comment={comment}
          mainComment={false}
          block={block}
        />)
        }
      </div>
      <CommentInput
        userName={userName}
        pageId={pageId}
        editBlock={editBlock}
        comment={comment}
        commentBlock={block}
        setCommentBlock={setCommentBlock}
      />
    </div>
  )
};
const Comments =({pageId,block, userName ,editBlock ,setCommentBlock}:CommentsProps)=>{
  
  const [targetComments, setTargetComment]= useState<BlockCommentType[]| null>(null);
  const [resolveComments, setResolveComments]= useState<BlockCommentType[]| null>(null);
  const [openComments, setOpenComments]= useState<BlockCommentType[]| null>(null);

  useEffect(()=>{
    setTargetComment(block.comments);
    if(block.comments !==null){
      setResolveComments(block.comments?.filter((comment:BlockCommentType)=> comment.type ==="resolve") );

      setOpenComments( block.comments?.filter((comment:BlockCommentType)=> comment.type ==="open"))
    }
  },[block]);
  return(
    <div 
      id='comments'
    >
      {resolveComments !==null && openComments !==null &&
        <section className="commentType">
          <button >
            <span>Open</span>
            <span>{openComments?.length}</span>
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
              setCommentBlock={setCommentBlock}
            />
          )
          }
        </section>
      }
    </div>
  )
};

export default React.memo(Comments);