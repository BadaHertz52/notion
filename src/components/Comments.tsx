
import React, {  Dispatch, FormEvent,SetStateAction,useEffect,useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, BlockCommentType, CommentType } from '../modules/notion';
import { BsFillArrowUpCircleFill, BsThreeDots } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoTrashOutline } from 'react-icons/io5';
import Time from './Time';
import { detectRange } from './BlockFn';
import { PopupType } from '../containers/EditorContainer';
type EditCommentItem = {
  edit:boolean,
  comment:BlockCommentType | CommentType
};
const open="open";
const resolve="resolve";
type CommentsProps={
  block:Block,
  pageId: string,
  userName:string,
  editBlock :(pageId: string, block: Block) => void,
  commentsStyle: CSSProperties | undefined ,
  select : null | typeof open | typeof resolve,
};
type CommentProps ={
  userName: string,
  comment:BlockCommentType,
  pageId:string,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>
};
type CommentInputProps={
  userName: string,
  pageId: string,
  comment:BlockCommentType | null,
  editBlock :(pageId: string, block: Block) => void,
  commentBlock: Block|null,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  setPopup:Dispatch<SetStateAction<PopupType>>| null,

}
type CommentBlockProps ={
  comment: CommentType | BlockCommentType,
  mainComment:boolean,
  block :Block,
  pageId: string,
  editBlock:(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>
};

type CommentToolProps ={
  mainComment:boolean,
  comment: CommentType | BlockCommentType,
  block:Block,
  pageId: string,
  editBlock: (pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>
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
  setMoreOpen: Dispatch<SetStateAction<boolean>>,
  toolMoreStyle:CSSProperties|undefined,
};
const closeToolMore=(event:MouseEvent| React.MouseEvent ,setMoreOpen:Dispatch<SetStateAction<boolean>>)=>{
  const toolMore =document.getElementById("tool_more");
  const tooleMoreArea = toolMore?.getClientRects()[0];
  const isInToolMore = detectRange(event, tooleMoreArea);
  if(!isInToolMore && tooleMoreArea!==undefined){
    setMoreOpen(false);
    sessionStorage.removeItem("toolMoreItem");
  }
};
const updateComments =(pageId: string, block:Block, comment:CommentType | BlockCommentType | null , editTime:string, editBlock:(pageId: string, block: Block) => void ,setCommentBlock:Dispatch<SetStateAction<Block|null>>,fnType:"delete"|"edit", text:string|null)=>{
  if(comment !==null && block.comments !==null){
    const block_comments :BlockCommentType[] =[...block.comments];
    const mainCommentIds = block.comments.map((comment:BlockCommentType)=> comment.id);
    const updateBlock =()=>{
      const newBlock ={
        ...block,
        editTime:editTime,
        comments : block_comments[0]=== undefined ? null :block_comments
      };
      editBlock(pageId, newBlock);
      setCommentBlock(newBlock);
      sessionStorage.removeItem("editCommentItem");
    };
    if(mainCommentIds?.includes(comment.id)){
        //BlockCommentType
        const index = mainCommentIds.indexOf(comment.id);
        switch (fnType) {
          case "delete":
            block_comments.splice(index,1);
            break;
          case  "edit":
            if(text !==null ){
              const mainComment:BlockCommentType = block_comments[index];
              const newMainComment:BlockCommentType ={
                ...mainComment,
                editTime:editTime,
                content:text 
              }
              block_comments.splice(index,1 , newMainComment);
            };
          break;
          default:
            break;
        };
        updateBlock();
    }else{
      //CommentType
      const mainComments :BlockCommentType = block.comments.filter((block_comment:BlockCommentType)=>
        block_comment.subCommentsId?.includes(comment.id))[0];
      const mainCommentsIndex= mainCommentIds.indexOf(mainComments.id);
      const commentIndex = mainCommentIds.indexOf(comment.id);

      switch (fnType) {
        case "delete":
          mainComments.subComments?.splice(commentIndex,1);
          mainComments.subCommentsId?.splice(commentIndex,1);
          break;
        case "edit":
          if(text !==null){
            const newComment:CommentType ={
              ...comment,
              editTime:editTime,
              content:text 
            };
            mainComments.subComments?.splice(commentIndex,1 , newComment);
          }
        break;
        default:
          break;
      };

      const newMainComments :BlockCommentType ={
        ...mainComments,
      };
      block_comments.splice(mainCommentsIndex, 1, newMainComments);
      updateBlock();
  }
  };
};

export const CommentInput =({userName, pageId ,comment,editBlock, commentBlock, setCommentBlock ,setPopup }:CommentInputProps)=>{
  const userNameFirstLetter =userName.substring(0,1).toUpperCase();
  const [submitStyle,setSubmitStyle] =useState<CSSProperties>({
    fill:"grey",
    border:"none"
  });
  const [text, setText]=useState<string>("");
  const [edit, setEdit]=useState<boolean>(false);
  const [editItem, setEditItem]=useState<EditCommentItem|null>(null);
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
    }
  };

  const onClickToMakeNewComment =(event:React.MouseEvent<HTMLButtonElement>)=>{
    const editTime =JSON.stringify(Date.now());
    const updateBlock =(newBlock:Block)=>{
      editBlock(pageId, newBlock );
      setCommentBlock(newBlock);
    };
    
    const addComment =(block:Block , blockComments:BlockCommentType[]|null)=>{
      const number = block.comments !==null? block.comments.length.toString() :0;
      const newId = `comment_${number}_${editTime}`;
      if(comment !==null && blockComments !==null ){
        // commentBlock.comments 중 특정 comment에 comment를 다는 (Comment의 하위 요소로 존재할 경우) 
        const commentsArry =[...blockComments];
        const ids: string[] = blockComments?.map((comment:BlockCommentType)=> comment.id) as string[];
        const commentIndex = ids.indexOf(comment.id);
        const comment_newComment:CommentType ={
          id:newId,
          userName: userName,
          editTime:editTime,
          createTime:editTime,
          content: text ,
        };
        const updatedComment:BlockCommentType ={
          ...comment,
          subComments:comment.subComments !==null? 
                  comment.subComments.concat(comment_newComment) :
                  [comment_newComment],
          subCommentsId: comment.subCommentsId !==null ?
          comment.subCommentsId.concat(comment_newComment.id):
          [comment_newComment.id],
        };
        commentsArry.splice(commentIndex,1, updatedComment);

        const newBlock:Block ={
          ...block,
          comments:commentsArry
        }
        updateBlock(newBlock)
      }else{
        //blockFn 에서 새로운 mainComment를 만듦 
        const newComment :BlockCommentType ={
          id:newId,
          userName:userName,
          content:text,
          type:"open",
          editTime:editTime,
          createTime:editTime,
          subComments:null,
          subCommentsId:null,
        };
          const newBlock :Block={
            ...block,
            comments:blockComments === null? [newComment]:blockComments.concat(newComment)
          };
          updateBlock(newBlock);
      }
    };
    const editComment =(block:Block)=>{
      if(editItem !==null){
        const comment =editItem.comment;
        updateComments(pageId, block, comment ,editTime, editBlock,setCommentBlock, "edit" ,text);
      }
    };
    if(commentBlock !==null){
      if(item ==null){
        addComment(commentBlock, commentBlock?.comments);
      }else{
        !edit ?
        addComment(commentBlock, commentBlock?.comments):
        editComment(commentBlock);
      };
    }else{
      console.log("Can't find commentBlock")
    }

      setText("");
      setEdit(false);
      setEditItem(null);
      setPopup !==null&& setPopup({
        popup:false,
        what:null
      })
  };

  useEffect(()=>{
    if(item !==null){
      const editCommentItem :EditCommentItem= JSON.parse(item);
      if(editCommentItem?.edit){
        setEditItem(editCommentItem);
        setEdit(true) 
      }else{
        setEditItem(null);
        setEdit(false) 
      }
    }
  },[item])
  return(
    <div 
      className={edit ? "commentInput editComment" : "commentInput" }
    >
      {!edit &&
      <div className='firstLetter'>
        {userNameFirstLetter}
      </div> 
      }
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
          onClick={onClickToMakeNewComment}
          className="commentInputSubmit"
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


const ToolMore =({pageId, block, editBlock, setCommentBlock ,setMoreOpen ,toolMoreStyle}:ToolMoreProps)=>{
  const toolMoreItem = sessionStorage.getItem("toolMoreItem");
  const [comment, setComment] =useState<BlockCommentType | CommentType | null >(null);
  const editTime = JSON.stringify(Date.now());

  const deleteComment =()=>{
    setMoreOpen(false);
    if(block !==null){
      updateComments(pageId,block,comment,editTime,editBlock, setCommentBlock,"delete", null);
    };

  };

  const editComment =()=>{
    setMoreOpen(false);
    if(comment !== null){
      const item:EditCommentItem ={
        edit:true, 
        comment :comment};
        sessionStorage.setItem("editCommentItem", JSON.stringify(item));
    };
  };
  useEffect(()=>{
    if(toolMoreItem !==null){
      const item = JSON.parse(toolMoreItem);
      setComment(item);
      sessionStorage.removeItem("toolMoreItem");
    }
  },[toolMoreItem]); 

  return(
    <div 
      id='tool_more'
      style={toolMoreStyle}
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

const CommentTool =({mainComment , comment,block ,pageId ,editBlock ,setCommentBlock , moreOpen ,setMoreOpen ,setToolMoreStyle}:CommentToolProps)=>{

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
    const target = event.currentTarget ;
    const editor =document.getElementsByClassName("editor")[0] as HTMLElement;
    const editorDomRect =editor.getClientRects()[0] as DOMRect; 
    const editorScrollTop =editor.scrollTop;
    const position = target.getClientRects()[0] as DOMRect;
    console.log(position)
    const style:CSSProperties ={
      position:"absolute" ,
      top: position.top+ editorScrollTop,
      right:editorDomRect.width -position.left-8
    };

    setToolMoreStyle(style);

    sessionStorage.setItem("toolMoreItem", JSON.stringify(comment));

  };
  const inner =document.getElementById("inner");

  inner?.addEventListener("click",  (event)=>{
    const item =sessionStorage.getItem("toolMoreItem");
    if(item !==null ){
      closeToolMore(event,setMoreOpen)
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
        onClick={ !moreOpen ? (event)=>openToolMore(event): ()=>setMoreOpen(false)}
      >
        <BsThreeDots/>

      </button>
  </div>
  )
};

const CommentBlock =({comment ,mainComment ,block ,pageId,editBlock ,setCommentBlock , moreOpen ,setMoreOpen ,setToolMoreStyle}:CommentBlockProps)=>{
  const firstLetter = comment.userName.substring(0,1).toUpperCase();
  const onClickCommentBlock =(event:React.MouseEvent)=>{
    moreOpen && closeToolMore(event, setMoreOpen)
  }
  return (
    <div 
    className='commentBlock'
    onClick={onClickCommentBlock}
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
        moreOpen={moreOpen}
        setMoreOpen={setMoreOpen}
        setToolMoreStyle={setToolMoreStyle}
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
const Comment =({userName,comment, block, pageId, editBlock ,setCommentBlock ,moreOpen ,setMoreOpen ,setToolMoreStyle}:CommentProps)=>{

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
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
        />
      </div>
      <div className='comment_comment'>
        {comment.subComments?.map((comment:CommentType)=>
        <CommentBlock
          key={`commentBlock_${comment.id}`} 
          comment={comment}
          mainComment={false}
          pageId={pageId}
          block={block}
          editBlock={editBlock}
          setCommentBlock={setCommentBlock}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
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
        setPopup={null}
      />
    </div>
  )
};
const Comments =({pageId,block, userName ,editBlock ,commentsStyle  ,select}:CommentsProps)=>{
  const [targetComments, setTargetComment]= useState<BlockCommentType[]| null>(null);
  const [resolveComments, setResolveComments]= useState<BlockCommentType[]| null>(null);
  const [openComments, setOpenComments]= useState<BlockCommentType[]| null>(null);

  const [moreOpen, setMoreOpen]= useState<boolean>(false);
  const [toolMoreStyle, setToolMoreStyle]=useState<CSSProperties|undefined>(undefined);
  const [commentBlock, setCommentBlock]=useState<Block|null>(block);

  useEffect(()=>{
    if(commentBlock!==null){
      setTargetComment(commentBlock.comments);
      if(commentBlock.comments !==null){
        setResolveComments(commentBlock.comments?.filter((comment:BlockCommentType)=> comment.type ==="resolve") );
  
        setOpenComments( commentBlock.comments?.filter((comment:BlockCommentType)=> comment.type ==="open"))
      };
    }
  },[commentBlock]);
  useEffect(()=>{
    if(select !==null){
      select===open? 
      setTargetComment(openComments): 
      setTargetComment(resolveComments);
    }
  },[select, openComments, resolveComments]);
  const showComments =(what:"open" | "resolve")=>{
    (what ==="open")?
    setTargetComment(openComments):
    setTargetComment(resolveComments)
  };

  return(
    <>
    <div 
      className='comments'
      style={commentsStyle}
    >
      {resolveComments !==null && resolveComments.length>0 && select==null &&
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
      {targetComments !==null && commentBlock !==null &&
        <section className='comments_comments'>
          {targetComments.map((comment:BlockCommentType)=>
            <Comment 
              key={`comment_${comment.id}`}
              userName={userName}
              comment={comment}
              block={commentBlock}
              pageId={pageId}
              editBlock={editBlock}
              setCommentBlock={setCommentBlock}
              moreOpen={moreOpen}
              setMoreOpen={setMoreOpen}
              setToolMoreStyle={setToolMoreStyle}
            />
          )
          }
        </section>
      }
    </div>
    {moreOpen &&
        <ToolMore
          toolMoreStyle={toolMoreStyle}
          pageId={pageId}
          block={commentBlock}
          editBlock={editBlock}
          setCommentBlock={setCommentBlock}
          setMoreOpen={setMoreOpen}
        />
        }
  </>
  )
};

export default React.memo(Comments);