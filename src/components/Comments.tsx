
import React, {  Dispatch, FormEvent,SetStateAction,useEffect,useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, BlockCommentType, CommentType } from '../modules/notion';
import { BsFillArrowUpCircleFill, BsLink45Deg, BsThreeDots } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoTrashOutline } from 'react-icons/io5';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Time from './Time';
import { detectRange } from './BlockFn';

type CommentsProps={
  block:Block,
  pageId: string,
  userName:string,
  editBlock :(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  setMoreOpen:Dispatch<React.SetStateAction<boolean>>,
};
type CommentProps ={
  userName: string,
  comment:BlockCommentType,
  pageId:string,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  setMoreOpen:Dispatch<React.SetStateAction<boolean>>,
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
  comment: CommentType | BlockCommentType,
  mainComment:boolean,
  block :Block,
  pageId: string,
  editBlock:(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  setMoreOpen:Dispatch<React.SetStateAction<boolean>>,
};

type CommentToolProps ={
  mainComment:boolean,
  comment: CommentType | BlockCommentType,
  block:Block,
  pageId: string,
  editBlock: (pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  setMoreOpen:Dispatch<React.SetStateAction<boolean>>,
};

type ResolveBtnProps ={
  comment:BlockCommentType,
  block:Block,
  pageId: string,
  editBlock:(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
};
type ToolMoreProps ={
  pageId:string,
  block:Block | null,
  editBlock:(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>
};
type ToolMoreItem ={
  comment: BlockCommentType |CommentType, 
  style:CSSProperties
};

export const CommentInput =({userName, pageId ,comment,editBlock, commentBlock, setCommentBlock}:CommentInputProps)=>{
  const userNameFirstLetter =userName.substring(0,1).toUpperCase();

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


export const ToolMore =({pageId, block, editBlock, setCommentBlock}:ToolMoreProps)=>{
  const toolMoreItem = sessionStorage.getItem("toolMoreItem");
  const [comment, setComment] =useState<BlockCommentType | CommentType | null >(null);
  const [style, setStyle]= useState<CSSProperties>();
  const editTime = JSON.stringify(Date.now());

  const deleteComment =()=>{
    if(comment !==null && block !==null && block.comments !==null){
      const block_comments :BlockCommentType[] =[...block.comments];
      const mainCommentIds = block.comments.map((comment:BlockCommentType)=> comment.id);
      const updateBlock =()=>{
        const newBlock ={
          ...block,
          editTime:editTime,
          comments : block_comments
        };
        editBlock(pageId, newBlock);
      };
      if(mainCommentIds?.includes(comment.id)){
          //BlockCommentType
          const index = mainCommentIds.indexOf(comment.id);
          block_comments.splice(index,1);
      }else{
        //CommentType
        const mainComments :BlockCommentType = block.comments.filter((block_comment:BlockCommentType)=>
          block_comment.commentsId?.includes(comment.id))[0];
        const mainCommentsIndex= mainCommentIds.indexOf(mainComments.id);
        const commentIndex = mainCommentIds.indexOf(comment.id);
        mainComments.comments?.splice(commentIndex,1);
        mainComments.commentsId?.splice(commentIndex,1);
        const newMainComments :BlockCommentType ={
          ...mainComments,
        };
      block_comments.splice(mainCommentsIndex, 1, newMainComments);
      };
      updateBlock();
    }
  };
  useEffect(()=>{
    if(toolMoreItem !==null){
      const item :ToolMoreItem = JSON.parse(toolMoreItem);
      setComment(item.comment);
      setStyle(item.style);
    }
  },[toolMoreItem]); 
  
  return(
    <div 
      id='tool_more'
      style={style}
    >
      <button>
        <HiOutlinePencil/>
        <span>
          Edit comment
        </span>
      </button>
      <button
        onClick={deleteComment}
      >
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
  )
};

const CommentTool =({mainComment , comment,block ,pageId ,editBlock ,setCommentBlock ,setMoreOpen}:CommentToolProps)=>{

  const ResolveBtn =({comment, block, editBlock, pageId}:ResolveBtnProps)=>{
    const changeToResolve =()=>{
      const newComment:BlockCommentType ={
        ...comment,
          type:"resolve",
      }; 
      const comments = block.comments !==null ?[...block.comments] :[];
      const commentIdes :string[] = comments?.map((comment:BlockCommentType)=> comment.id) as string[];
      const index  = commentIdes.indexOf(comment.id);
      comments.splice(index, 1, newComment);
      const newBlock :Block={
        ...block,
        comments: comments
      }
      editBlock(pageId, newBlock);
      setCommentBlock(newBlock);
    };

    return (
      <button 
        className='resolveTool'
        onClick={changeToResolve}
      >
        Resolve
      </button>
    )
  };
  const openToolMore =(event: React.MouseEvent<HTMLButtonElement>)=>{
    setMoreOpen(true);
    const target = event.target as HTMLElement;
    const targetParent = target.parentElement as HTMLElement ;
    const setItem =(element:HTMLElement)=>{
      const position = element.parentElement?.getClientRects()[0] as DOMRect;
      const style:CSSProperties ={
        position:"absolute" ,
        top: position.top,
        left:position.right -position.width -200
      };
      const item:ToolMoreItem ={
        comment:comment,
        style:style
      };
      sessionStorage.setItem("toolMoreItem", JSON.stringify(item));
    }
    switch (target.tagName) {
      case "svg":
        if(targetParent.className ==="moreTool"){
          setItem(targetParent);
        }
        break;
      case "path":
        if(targetParent.parentElement?.className ==="moreTool"){
          setItem(targetParent.parentElement);
        }
        break;
      case "button":
        if(target.className ==="moreTool"){
          setItem(target);
        }
      break;
      default:
        break;
    };
  };
  const inner =document.getElementById("inner");
  const closeToolMore=(event:MouseEvent , toolMore:HTMLElement)=>{
    const tooleMoreArea = toolMore.getClientRects()[0];
    const isInnerToolMore = detectRange(event, tooleMoreArea);
    if(!isInnerToolMore){
      setMoreOpen(false);
      sessionStorage.removeItem("tool_more");
    }
  };
  inner?.addEventListener("click",  (event)=>{
    const item =sessionStorage.getItem("toolMoreItem");
    const toolMore =document.getElementById("tool_more");
    if(item !==null && toolMore!==null){
      closeToolMore(event, toolMore)
    };
  }
    
  );
  
  return(
    <div className="tool">
      {mainComment &&
        <ResolveBtn
          comment ={comment as BlockCommentType}
          block={block}
          pageId={pageId}
          editBlock={editBlock}
          setCommentBlock={setCommentBlock}
        />
      }
      <button 
        className='moreTool'
        onClick={openToolMore}
      >
        <BsThreeDots/>

      </button>
  </div>
  )
};

const CommentBlock =({comment ,mainComment ,block ,pageId,editBlock ,setCommentBlock ,setMoreOpen}:CommentBlockProps)=>{
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
        comment={comment}
        block={block}
        pageId={pageId}
        editBlock={editBlock}
        setCommentBlock={setCommentBlock}
        setMoreOpen={setMoreOpen}
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
const Comment =({userName,comment, block, pageId, editBlock ,setCommentBlock ,setMoreOpen}:CommentProps)=>{

  return(
    <div className='comment'>
      <div className="main_comment">
        <CommentBlock 
          comment={comment}
          mainComment={true}
          block={block}
          pageId={pageId}
          editBlock={editBlock}
          setCommentBlock={setCommentBlock}
          setMoreOpen={setMoreOpen}
        />
      </div>
      <div className='comment_comment'>
        {comment.comments?.map((comment:CommentType)=>
        <CommentBlock
          key={`commentBlock_${comment.id}`} 
          comment={comment}
          mainComment={false}
          pageId={pageId}
          block={block}
          editBlock={editBlock}
          setCommentBlock={setCommentBlock}
          setMoreOpen={setMoreOpen}
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
const Comments =({pageId,block, userName ,editBlock ,setCommentBlock ,setMoreOpen}:CommentsProps)=>{
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
      {resolveComments !==null && resolveComments.length>0 &&
        <section className="commentType">
          <button 
            id="openTypeBtn"
          >
            <span>Open</span>
            <span>{`(${openComments?.length})`}</span>
          </button>
          <button 
            id="resolveTypeBtn"
          >
            <span>Resolve</span>
            <span>{`(${resolveComments?.length})`}</span>
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
              setMoreOpen={setMoreOpen}
            />
          )
          }
        </section>
      }
    </div>
  )
};

export default React.memo(Comments);