
import React, {  Dispatch, FormEvent,SetStateAction,useEffect,useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, BlockCommentType, CommentType } from '../modules/notion';
import { BsFillArrowUpCircleFill, BsThreeDots } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoTrashOutline } from 'react-icons/io5';
import Time from './Time';
import { detectRange } from './BlockFn';
type CommentsProps={
  block:Block,
  pageId: string,
  userName:string,
  editBlock :(pageId: string, block: Block) => void,
};

type CommentProps ={
  userName: string,
  comment:BlockCommentType,
  pageId:string,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  setComments: Dispatch<SetStateAction<BlockCommentType[] | null>>
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>,
  setToolTargetComment :Dispatch<SetStateAction<CommentType|BlockCommentType|null>>,
  setMainComment:Dispatch<SetStateAction<BlockCommentType|null>>,
};

type CommentInputProps={
  where : "comments" | "menu",
  userName: string,
  pageId: string,
  comment:BlockCommentType | null,
  editBlock :(pageId: string, block: Block) => void,
  commentBlock: Block|null,
  setComments: Dispatch<SetStateAction<BlockCommentType[] | null>> | null
};
type CommentBlockProps ={
  mainComment:BlockCommentType,
  comment: CommentType | BlockCommentType,
  main:boolean,
  block :Block,
  pageId: string,
  editBlock:(pageId: string, block: Block) => void,
  setComments: Dispatch<SetStateAction<BlockCommentType[] | null>>
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>,
  setToolTargetComment :Dispatch<SetStateAction<CommentType|BlockCommentType|null>>,
  setMainComment:Dispatch<SetStateAction<BlockCommentType|null>>,
};
type CommentToolProps ={
  mainComment:BlockCommentType,
  main:boolean,
  comment: CommentType | BlockCommentType,
  block:Block,
  pageId: string,
  editBlock: (pageId: string, block: Block) => void,
  setComments: Dispatch<SetStateAction<BlockCommentType[] | null>>
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle: Dispatch<SetStateAction<CSSProperties | undefined>>,
  setToolTargetComment :Dispatch<SetStateAction<CommentType|
  BlockCommentType|null>>,
  setMainComment:Dispatch<SetStateAction<BlockCommentType|null>>,
};

type ToolMoreProps ={
  pageId:string,
  block:Block | null,
  editBlock:(pageId: string, block: Block) => void,
  comments: BlockCommentType[] | null,
  setComments: Dispatch<SetStateAction<BlockCommentType[] | null>>
  setMoreOpen: Dispatch<SetStateAction<boolean>>,
  style:CSSProperties |undefined,
  setToolTargetComment :Dispatch<SetStateAction<CommentType|BlockCommentType|null>>,
  toolTargetComment: CommentType|BlockCommentType|null ,
  mainComment:BlockCommentType|null,
};

export const CommentInput =({where ,userName, pageId ,comment,editBlock, commentBlock, setComments
 }:CommentInputProps)=>{
  const userNameFirstLetter =userName.substring(0,1).toUpperCase();
  const [submitStyle,setSubmitStyle] =useState<CSSProperties>({
    fill:"grey",
    border:"none"
  });
  const [text, setText]=useState<string>("");
  const [editItem, setEditItem]=useState<BlockCommentType|CommentType|null>(null);
  const item= sessionStorage.getItem("editCommentItem");
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
    };
    
  };
  const onClickToMakeNewComment =(event:React.MouseEvent<HTMLButtonElement>)=>{
    if(commentBlock !==null){
      console.log('where', where, editItem, comment)
      const editTime =JSON.stringify(Date.now());
      const newMainId = `${commentBlock.id}_comment_${editTime}`;
      function editComment(block:Block){
        if(comment !==null && block.comments!==null && editItem !==null){
          const mainComment =comment ;
          const blockComments=[...block.comments];
          const mainIndex =blockComments.map((comment:BlockCommentType)=>comment.id).indexOf(mainComment.id);
          
          if(editItem.id === mainComment.id){
            const editedMainComment:BlockCommentType ={
              ...mainComment,
              content:text ,
              editTime:editTime
            };
            blockComments.splice(mainIndex, 1, editedMainComment);
            const editedBlock :Block ={
              ...block,
              comments: blockComments,
              editTime:editTime
            };
            editBlock(pageId, editedBlock);
            setComments !==null && setComments(editedBlock.comments)
          }else{
            if(mainComment.subComments !==null && mainComment.subCommentsId!==null){
              const editedSubComment:CommentType ={
                ...editItem,
                content:text ,
                editTime:editTime
              };
              const subIndex= mainComment.subCommentsId?.indexOf(editItem.id);
              const subComments= [...mainComment.subComments];
              subComments.splice(subIndex,1, editedSubComment);
              const editedMianComment:BlockCommentType ={
                ...mainComment,
                subComments:subComments,
                editTime:editTime
              };
              blockComments.splice(mainIndex,1, editedMianComment);
              const editedBlock :Block ={
                ...block,
                comments: blockComments,
                editTime:editTime
              };
              editBlock(pageId, editedBlock);
              setComments !==null && setComments(editedBlock.comments)
            }
          }
          setEditItem(null);
          sessionStorage.removeItem("editCommentItem")
        }
      };
  
      function addMainComment (block:Block){
        const newMaiComment:BlockCommentType ={
          id: newMainId,
          userName:userName,
          content: text,
          editTime:editTime,
          createTime:editTime,
          type: "open",
          subComments: null,
          subCommentsId: null
        };
        let  editedBlock:Block ={
          ...block,
          comments: [newMaiComment],
          editTime:editTime
        };
        block.comments==null?
        editedBlock ={
          ...editedBlock,
          comments: [newMaiComment],
        }
        :
        editedBlock ={
          ...editedBlock,
          comments: block.comments.concat(newMaiComment),
        };
        editBlock(pageId, editedBlock);
        setComments !==null && setComments(editedBlock.comments);
      };
      function addSubComment(block:Block){
        if(comment !==null && block.comments !==null){
          const blockComments=[...block.comments];
          const mainIndex =blockComments.map((comment:BlockCommentType)=> comment.id).indexOf(comment.id);
          const newSubComment :CommentType ={
            id: `${comment.id}_subComment_${editTime}`,
            userName:userName,
            content: text,
            editTime:editTime,
            createTime:editTime,
          };

          const newMainComment :BlockCommentType ={
            ...comment,
            subComments: comment.subComments ===null ? [newSubComment] : comment.subComments.concat(newSubComment),
            subCommentsId: comment.subCommentsId ===null?  [newSubComment.id] :comment.subCommentsId.concat(newSubComment.id),
            editTime:editTime
          };
          blockComments.splice(mainIndex, 1, newMainComment);
          const editedBlock ={
            ...block,
            comments: blockComments,
            editTime:editTime
          };
          console.log("newMain." , newMainComment , blockComments);
          editBlock(pageId , editedBlock);
          setComments!==null && setComments(blockComments);
        }
      };
      
      switch (where) {
        case "menu":
          addMainComment(commentBlock);
          break;
        case "comments":
          if(editItem !==null){
            editComment(commentBlock);
          }else{
            addSubComment(commentBlock);
          };
        break;
        default:
          break;
      }
        setText("");
        setEditItem(null);
    }
  };

  useEffect(()=>{
    if(item !==null){
      const editCommentItem :BlockCommentType| CommentType= JSON.parse(item);
        setEditItem(editCommentItem);
    }else{
      setEditItem(null)
    }
  },[item]);

  return(
    <div 
      className={editItem!==null ? "commentInput editComment" : "commentInput" }
    >
      {editItem ==null &&
      <div className='firstLetter'>
        {userNameFirstLetter}
      </div> 
      }
      <form
      >
        <input
          type="text"
          placeholder={editItem==null? "Add a comment" : 
        "edit a comment"}
          className="commentText"
          name="comment"
          value={text}
          onInput={onInputText}
        />
        <button 
          type="button"
          onClick={onClickToMakeNewComment}
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


const ToolMore =({pageId, block, editBlock,comments,
  setComments ,setMoreOpen,toolTargetComment, mainComment,
  style}:ToolMoreProps)=>{

  const editTime = JSON.stringify(Date.now());
  const blockCommentsId = comments?.map((comment:BlockCommentType)=> comment.id);
  
  const deleteComment =()=>{
    setMoreOpen(false);
    if(block !==null && comments !==null && mainComment !==null && toolTargetComment !==null){
      const mainIndex = blockCommentsId?.indexOf(mainComment.id) as number; 
      if(mainComment.id === toolTargetComment.id){
        const newComments =comments.filter((comment:BlockCommentType)=> comment.id !== toolTargetComment.id);
        const editedBlock :Block ={
          ...block,
          comments: newComments,
          editTime:editTime 
        };
        editBlock(pageId, editedBlock);
        setComments(newComments);
      }else{
        if(mainComment.subComments !==null && mainComment.subCommentsId!==null){
          const subIndex= mainComment.subCommentsId.indexOf(toolTargetComment.id);
          mainComment.subComments.splice(subIndex,1);
          mainComment.subCommentsId.splice(subIndex,1); 
          comments.splice(mainIndex,1, mainComment);
          const editedBlock :Block ={
            ...block,
            editTime:editTime,
          };
          editBlock(pageId, editedBlock);
          setComments(comments); 
        }
      }
    };

  };

  const editComment =()=>{
    setMoreOpen(false);
    if(toolTargetComment !== null && mainComment !==null){
      const item=toolTargetComment;
      sessionStorage.setItem("editCommentItem", JSON.stringify(item));
    };
  };
  return(
    <div 
      id='tool_more'
      style={style}
    >
      <button
        onClick={editComment}
      >
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
    </div>
  )
};

const CommentTool =({mainComment ,main , comment,block ,pageId ,editBlock ,setComments,setMoreOpen ,setToolMoreStyle, setToolTargetComment ,setMainComment}:CommentToolProps)=>{

  const ResolveBtn =()=>{
    const changeToResolve =()=>{ 
      const comments = block.comments !==null ?[...block.comments] :[];
      const commentIdes :string[] = comments?.map((comment:BlockCommentType)=> comment.id) as string[];
      if(mainComment){
        const index  = commentIdes.indexOf(comment.id);
        const newComment:BlockCommentType ={
          ...comment as BlockCommentType,
            type:"resolve",
        };
        comments.splice(index, 1, newComment);
        const newBlock :Block={
          ...block,
          comments: comments
        }
        editBlock(pageId, newBlock);
        setComments(newBlock.comments)
      }
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
    setToolTargetComment(comment);
    setMainComment(mainComment);
    const  commentsInner =document.getElementById("commentsInner");
    const commentInnerDomRect =commentsInner?.getClientRects()[0];
    //const toolMoreDomRect =toolMore?.getClientRects()[0];
    const target = event.currentTarget;
    const position = target.getClientRects()[0];
    if(position !== undefined && commentInnerDomRect !==undefined) {
      const toolMoreStyle :CSSProperties = {
        position:"absolute" ,
        top: position.top - commentInnerDomRect.top ,
        right:commentInnerDomRect.right - position.right +position.width,
      };
      setToolMoreStyle(toolMoreStyle);
    }
  };
  const inner =document.getElementById("inner");
  const closeToolMore=(event:MouseEvent , toolMore:HTMLElement)=>{
    const tooleMoreArea = toolMore.getClientRects()[0];
    const isInToolMore = detectRange(event, tooleMoreArea);
    if(!isInToolMore){
      setMoreOpen(false);
      sessionStorage.removeItem("toolMoreItem");
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
      {main &&
        <ResolveBtn
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

const CommentBlock =({comment ,main,mainComment ,block ,pageId,editBlock ,setComments,setMoreOpen ,setToolMoreStyle ,setToolTargetComment ,setMainComment
}:CommentBlockProps)=>{
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
        main={main}
        mainComment={mainComment}
        comment={comment}
        block={block}
        pageId={pageId}
        editBlock={editBlock}
        setComments={setComments}
        setMoreOpen={setMoreOpen}
        setToolMoreStyle={setToolMoreStyle}
        setToolTargetComment={setToolTargetComment}
        setMainComment={setMainComment}
      />
    </section>
    {main &&
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
const Comment =({userName,comment, block, pageId, editBlock ,
  setComments,setMoreOpen ,setToolMoreStyle ,setToolTargetComment ,setMainComment}:CommentProps)=>{

  return(
    <div className='comment'>
      <div className="main_comment">
        <CommentBlock 
          comment={comment}
          mainComment={comment}
          main={true}
          block={block}
          pageId={pageId}
          editBlock={editBlock}
          setComments={setComments}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          setToolTargetComment={setToolTargetComment}
          setMainComment={setMainComment}
        />
      </div>
      <div className='comment_subComment'>
        {comment.subComments?.map((subComment:CommentType)=>
        <CommentBlock
          key={`${block.id}'s comment_${comment.id}_${subComment.id}`} 
          comment={subComment}
          mainComment={comment}
          main={false}
          pageId={pageId}
          block={block}
          editBlock={editBlock}
          setComments={setComments}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          setToolTargetComment={setToolTargetComment}
          setMainComment={setMainComment}
        />)
        }
      </div>
      <CommentInput
        userName={userName}
        pageId={pageId}
        editBlock={editBlock}
        comment={comment}
        commentBlock={block}
        setComments={setComments}
        where={"comments"}
      />
    </div>
  )
};
const Comments =({pageId,block, userName ,editBlock ,
  //setMoreOpen
}:CommentsProps)=>{
  const [comments, setComments]=useState<BlockCommentType[]|null>(block.comments); 
  const [targetComments, setTargetComments]= useState<BlockCommentType[]| null>(null);
  const [resolveComments, setResolveComments]= useState<BlockCommentType[]| null>(null);
  const [openComments, setOpenComments]= useState<BlockCommentType[]| null>(null);
  const [commentsStyle, setCommentsStyle]= useState<CSSProperties>();
  const [moreOpen, setMoreOpen]= useState<boolean>(false);
  const [toolMoreStyle, setToolMoreStyle]=useState<CSSProperties>();
  const [toolTargetComment, setToolTargetComment]=useState<CommentType|BlockCommentType|null>(null);
  const [mainComment, setMainComment]=useState<BlockCommentType|null>(null);

  useEffect(()=>{
    if(comments !==null){
      setResolveComments(comments.filter((comment:BlockCommentType)=> comment.type ==="resolve") );
      setOpenComments( comments.filter((comment:BlockCommentType)=> comment.type ==="open"))
    };
  },[comments]);
  
  useEffect(()=>{
    const blockDoc = document.getElementById(`block_${block.id}`);
    const position =blockDoc?.getClientRects()[0]
    if(position !== undefined){
      const style :CSSProperties ={
        position:"absolute",
        top: position.bottom,
        left: position.left,
        width:position.width
      };
      setCommentsStyle(style);
    } 
  },[block]);

  const showComments =(what:"open" | "resolve")=>{
    (what ==="open")?
    setTargetComments(openComments):
    setTargetComments(resolveComments)
  };
  return(
    <div 
      id='comments'
      style={commentsStyle}
    >
      <div
        id="commentsInner"
      >
        {resolveComments !==null && resolveComments.length>0 &&
          <section className="commentType">
            <button 
              id="openTypeBtn"
              onClick={()=>showComments("open")}
            >
              <span>Open</span>
              <span>{`(${openComments?.length})`}</span>
            </button>
            <button 
              id="resolveTypeBtn"
              onClick={()=>showComments("resolve")}
            >
              <span>Resolve</span>
              <span>{`(${resolveComments?.length})`}</span>
            </button>
          </section>
        }

        <section className='comments_comments'>
          { targetComments !==null ?
            targetComments.map((comment:BlockCommentType)=>
            <Comment 
              key={`comment_${comment.id}`}
              userName={userName}
              comment={comment}
              setComments={setComments}
              block={block}
              pageId={pageId}
              editBlock={editBlock}
              setMoreOpen={setMoreOpen}
              setToolMoreStyle={setToolMoreStyle}
              setToolTargetComment={setToolTargetComment}
              setMainComment={setMainComment}
            />
          ):
          comments?.map((comment:BlockCommentType)=>
          <Comment 
            key={`comment_${comment.id}`}
            userName={userName}
            comment={comment}
            setComments={setComments}
            block={block}
            pageId={pageId}
            editBlock={editBlock}
            setMoreOpen={setMoreOpen}
            setToolMoreStyle={setToolMoreStyle}
            setToolTargetComment={setToolTargetComment}
            setMainComment={setMainComment}
          />
        )
          }
        </section>
        {moreOpen &&
          <ToolMore
            style={toolMoreStyle}
            pageId={pageId}
            block={block}
            editBlock={editBlock}
            comments={comments}
            setComments={setComments}
            setMoreOpen={setMoreOpen}
            toolTargetComment ={toolTargetComment}
            setToolTargetComment={setToolTargetComment}
            mainComment={mainComment}
          />
        }
      </div>
    </div>
  )
};

export default React.memo(Comments);