import React, {  Dispatch, FormEvent,SetStateAction,useEffect,useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, BlockCommentType, CommentType, Page } from '../modules/notion';
import {  BsThreeDots } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoArrowUpCircleSharp, IoCheckmarkCircle, IoTrashOutline } from 'react-icons/io5';
import Time from './Time';
import { detectRange } from './BlockFn';
import { PopupType } from '../containers/EditorContainer';
import { IoMdCloseCircle } from 'react-icons/io';
const open="open";
const resolve="resolve";
type CommentsProps={
  block:Block | null,
  page:Page|null,
  pageId: string,
  userName:string,
  editBlock :(pageId: string, block: Block) => void | null,
  select : null | typeof open | typeof resolve,
  discardEdit:boolean
};
type CommentProps ={
  userName: string,
  comment:BlockCommentType,
  pageId:string,
  page:Page|null,
  block:Block|null,
  editBlock :(pageId: string, block: Block) => void ,
  setCommentBlock: Dispatch<SetStateAction<Block|null>> ,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>,
  discardEdit:boolean
};
type CommentInputProps={
  userName: string,
  pageId: string,
  page:Page|null,
  blockComment:BlockCommentType|  null,
  subComment:CommentType |null,
  editBlock :(pageId: string, block: Block) => void |null,
  commentBlock: Block|null,
  setCommentBlock: Dispatch<SetStateAction<Block|null>> ,
  setPopup:Dispatch<SetStateAction<PopupType>>| null,
  addOrEdit:"add"|"edit",
  setEdit:Dispatch<SetStateAction<boolean>>|null,
}
type CommentBlockProps ={
  comment: CommentType | BlockCommentType,
  mainComment:boolean,
  block :Block|null,
  page:Page|null,
  pageId: string,
  userName:string,
  editBlock:(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>,
  setPopup:Dispatch<SetStateAction<PopupType>>| null,
  discardEdit:boolean
};

type CommentToolProps ={
  mainComment:boolean,
  comment: CommentType | BlockCommentType,
  block:Block|null,
  page:Page|null,
  pageId: string,
  editBlock: (pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>
};

type ResolveBtnProps ={
  comment:BlockCommentType,
  block:Block|null,
  page:Page|null
  pageId: string,
  editBlock:(pageId: string, block: Block) => void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
};
type ToolMoreProps ={
  pageId:string,
  page:Page|null,
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

export const CommentInput =({userName, pageId, page ,blockComment, subComment,editBlock, commentBlock, setCommentBlock ,setPopup, addOrEdit,setEdit}:CommentInputProps)=>{
  const userNameFirstLetter =userName.substring(0,1).toUpperCase();
  const [submitStyle,setSubmitStyle] =useState<CSSProperties>({
    fill:"#a3a3a2;",
    border:"none"
  });
  const [text, setText]=useState<string>("");
  const [editTargetComment, setEditTargetComment]=useState<BlockCommentType|CommentType|null>(null) ;
  useEffect(()=>{
    switch (addOrEdit) {
      case "add":
        
        blockComment !==null && setEditTargetComment(blockComment); 
        break;
      case "edit":
        subComment !==null ?
        setEditTargetComment(subComment):
        setEditTargetComment(blockComment)
        break;
      default:
        break;
    };
    
  },[blockComment, subComment, addOrEdit])

  const updateBlock =(blockComments:BlockCommentType[])=>{
    if(commentBlock !==null){
      const editedBlock :Block ={
        ...commentBlock,
        comments: blockComments
      };
      setCommentBlock(editedBlock);
      editBlock(pageId,editedBlock);
    }
  };
  const findBlockCommentIndex =(blockComments:BlockCommentType[] , blockComment:BlockCommentType):{blockComments:BlockCommentType[],
    index:number}=>{
        const comments =[...blockComments];
        const commentsId= blockComments.map((comment:BlockCommentType)=> comment.id);
        const index= commentsId.indexOf(blockComment.id);
        return {
          blockComments:comments,
          index:index
        }
    }
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
    const addNewComment =()=>{
      if(commentBlock !==null){
        const newId = `blockComment_${editTime}`;
        const newBlockComment :BlockCommentType ={
          id:newId,
          userName: userName,
          editTime:editTime,
          createTime:editTime,
          content: text ,
          subComments:null,
          subCommentsId:null,
          type:"open"
        };
        updateBlock(commentBlock.comments ==null? [newBlockComment] : commentBlock.comments.concat(newBlockComment));
      }
    };

    const addSubComment =()=>{
      if(commentBlock!==null && commentBlock.comments!==null && blockComment !==null){
        const {blockComments, index}=findBlockCommentIndex(commentBlock.comments, blockComment);
        const newSubComment:CommentType ={
          id :`subComment_${editTime}`,
          userName :userName,
          content: text,
          editTime:editTime,
          createTime:editTime
        };
        const newBlockComment:BlockCommentType ={
          ...blockComment,
          subComments: blockComment.subComments ==null? [newSubComment]: blockComment.subComments.concat(newSubComment),
          subCommentsId:blockComment.subCommentsId ==null? [newSubComment.id]: blockComment.subCommentsId.concat(newSubComment.id),
          editTime:editTime
        };
        blockComments.splice(index, 1 ,newBlockComment);
        updateBlock(blockComments);
      }
    };
    const editBlockComment =()=>{
      if(commentBlock !== null && commentBlock.comments !==null && blockComment !==null){
        const {blockComments, index}= findBlockCommentIndex(commentBlock.comments , blockComment);
        const editedBlockComment :BlockCommentType = {
          ...blockComment,
          content:text ,
          editTime:editTime
        };
        blockComments.splice(index, 1, editedBlockComment);
        updateBlock(blockComments);
      }
    };
    const editSubComment =()=>{
      if(commentBlock !==null && commentBlock.comments !==null && blockComment !==null  &&blockComment.subComments !==null && blockComment.subCommentsId!==null  ){
        const {blockComments, index}= findBlockCommentIndex(commentBlock.comments , blockComment);
        const subComment= editTargetComment as CommentType ; 
        const subIndex= blockComment.subCommentsId.indexOf(subComment.id);
        const editedSubComment :CommentType ={
          ...subComment,
          content:text ,
          editTime:editTime
        };
        blockComment.subComments?.splice(subIndex, 1,editedSubComment);
        blockComments.splice(index, 1, blockComment);
        updateBlock(blockComments);
      }
    }; 
    switch (addOrEdit) {
      case "add":
        blockComment ==null?
        addNewComment():
        addSubComment();
        break;
      case "edit":
        if(editTargetComment !==null && blockComment !==null){
          editTargetComment.id === blockComment.id?
          editBlockComment():
          editSubComment();
        };
        break;
      default:
        break;
    }
      closeInput();

  };
  const openDiscardEdit =()=>{
    const discardEdit= document.getElementById("discardEdit");
    discardEdit?.classList.add("on");
  };
  function closeInput (){
    setEdit !==null && setEdit(false);
    setText("");
    setPopup !==null&& setPopup({
      popup:false,
      what:null
    })
  };
  return(
    <div 
      className={addOrEdit==="edit" ? "commentInput editComment" : "commentInput" }
    >
      {addOrEdit==="add" &&
      <div className='firstLetter'>
        <div>
          {userNameFirstLetter}
        </div>
      </div> 
      }
      <form
      >
        <input
          type="text"
          placeholder={blockComment===null? 
            "Add a comment" :
            (addOrEdit ==="add")? 
            "Reply....": 
            editTargetComment?.content
          }
          className="commentText"
          name="comment"
          onInput={onInputText}
        />
        {blockComment !==null && addOrEdit ==="edit" &&
        <button
          className="cancleEditBtn"
          onClick={openDiscardEdit}
        >
          <IoMdCloseCircle/>
        </button>
        }
        <button 
          onClick={onClickToMakeNewComment}
          className="commentInputSubmit"
          name="commentInputSubmit"
          disabled ={text ==null || text ===""}
          
        >
        {blockComment !==null && addOrEdit ==="edit" ?
          <IoCheckmarkCircle
            style={submitStyle}
          />
        :
          <IoArrowUpCircleSharp
            style={submitStyle}
          />
        }
        </button>
      </form>

    </div>
  )
};


const ToolMore =({pageId, block,page, editBlock, setCommentBlock ,setMoreOpen ,toolMoreStyle}:ToolMoreProps)=>{
  const toolMoreItem = sessionStorage.getItem("toolMoreItem");
  const [comment, setComment] =useState<BlockCommentType | CommentType | null >(null);
  const editTime = JSON.stringify(Date.now());

  const onClickDeleteComment =()=>{
    setMoreOpen(false);
    if(block !==null){
      updateComments(pageId,block,comment,editTime,editBlock, setCommentBlock,"delete", null);
    };

  };

  const onClickEditComment =()=>{
    setMoreOpen(false);
    comment !==null && sessionStorage.setItem("editComment", comment.id);
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
        onClick={onClickEditComment}
      >
        <HiOutlinePencil/>
        <span>
          Edit comment
        </span>
      </button>
      <button
        onClick={onClickDeleteComment}
      >
        <IoTrashOutline/>
        <span>
          Delete comment
        </span>
      </button>
    </div>
  )
};

const CommentTool =({mainComment , comment,block, page ,pageId ,editBlock ,setCommentBlock , moreOpen ,setMoreOpen ,setToolMoreStyle}:CommentToolProps)=>{

  const ResolveBtn =({comment, block,page, pageId, editBlock}:ResolveBtnProps)=>{
    const changeToResolve =()=>{
      const newComment:BlockCommentType ={
        ...comment,
          type:"resolve",
      }; 
      if(block!==null){
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
      }
      if(page !==null){

      }

    };

    return (
      <button 
        className='resolveTool'
        onClick={changeToResolve}
      >
        <span>
          Resolve
        </span>
      </button>
    )
  };
  const openToolMore =(event: React.MouseEvent<HTMLButtonElement>)=>{
    setMoreOpen(true);
    const target = event.currentTarget ;
    const editor =document.getElementsByClassName("editor")[0] as HTMLElement;
    const block_comments =document.getElementById("block_comments");  
    
    const position = target.getClientRects()[0] as DOMRect;
    if(block_comments !==null){
      const block_commentsDomRect = block_comments.getClientRects()[0];
      const style:CSSProperties ={
        position:"absolute" ,
        top: (position.top- block_commentsDomRect.top) ,
        right:block_commentsDomRect.right - position.left + 5
      };
      setToolMoreStyle(style);
    }else{
      const pageComment =document.getElementsByClassName("pageComment")[0]; 
      const pageCommentDomRect= pageComment.getClientRects()[0];
      console.log(pageCommentDomRect, position)
      const style:CSSProperties={
        position:"absolute",
        top: position.top - pageCommentDomRect.top,
        right: pageCommentDomRect.right -position.left +5
      };
      setToolMoreStyle(style);
    }

    

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
          page={page}
          pageId={pageId}
          editBlock={editBlock}
          setCommentBlock={setCommentBlock}
        />
      }
      <button 
        className='moreTool'
        onClick={ !moreOpen ? (event)=>openToolMore(event): ()=>setMoreOpen(false)}
      >
        <span>
          <BsThreeDots/>
        </span>
      </button>
  </div>
  )
};

const CommentBlock =({comment ,mainComment ,block ,page ,pageId, userName,editBlock ,setPopup ,setCommentBlock , moreOpen ,setMoreOpen ,setToolMoreStyle  ,discardEdit}:CommentBlockProps)=>{
  const firstLetter = comment.userName.substring(0,1).toUpperCase();
  const [edit, setEdit]=useState<boolean>(false);
  const editCommentItem= sessionStorage.getItem("editComment");
  const onClickCommentBlock =(event:React.MouseEvent)=>{
    moreOpen && closeToolMore(event, setMoreOpen)
  };
  useEffect(()=>{
    if(editCommentItem !==null){
    comment.id === editCommentItem && setEdit(true);
    }
  },[editCommentItem]);

  useEffect(()=>{
    if(discardEdit){
      setEdit(false);
      
    }
  },[discardEdit]);
  useEffect(()=>{
    !edit && editCommentItem !==null && sessionStorage.removeItem("editComment");
  },[edit]);
  return (
    <div 
    className='commentBlock'
    onClick={onClickCommentBlock}
  >
    <section className='comment_header'>
      <div className="information">
        <div className="firstLetter">
          <div>
            {firstLetter}
          </div>
        </div>
        <div className='userName'>
          <p>
            {comment.userName}
          </p>
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
        page={page}
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
      {block !==null &&
      <div className='comment_block_content'>
        {block.contents}
      </div>
      }
    </section>
    }
    <section className='comment_content'>
      <div>
      { edit ?
        <CommentInput
          userName={userName}
          pageId={pageId}
          page={page}
          blockComment={!mainComment? null: comment as BlockCommentType}
          subComment={!mainComment?  comment as CommentType : null}
          editBlock={editBlock}
          commentBlock={block}
          setCommentBlock={setCommentBlock}
          setPopup={setPopup}
          addOrEdit="edit"
          setEdit={setEdit}
        />
        :
        comment.content
        }
        </div>
    </section>

    </div>
  )
}
const Comment =({userName,comment, block,page, pageId, editBlock ,setCommentBlock ,moreOpen ,setMoreOpen ,setToolMoreStyle ,discardEdit}:CommentProps)=>{

  return(
    <div className='comment'>
      <div className="main_comment">
        <CommentBlock 
          userName={userName}
          comment={comment}
          mainComment={true}
          block={block}
          page={page}
          pageId={pageId}
          editBlock={editBlock}
          setCommentBlock={setCommentBlock}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          setPopup={null}
          discardEdit={discardEdit}
        />
      </div>
      {block !==null &&
      <div className='comment_comment'>
        {comment.subComments?.map((comment:CommentType)=>
        <CommentBlock
          key={`commentBlock_${comment.id}`} 
          userName={userName}
          comment={comment}
          mainComment={false}
          page={page}
          pageId={pageId}
          block={block}
          editBlock={editBlock}
          setCommentBlock={setCommentBlock}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          setPopup={null}
          discardEdit={discardEdit}
        />)
        }
      </div>
      }
      <CommentInput
        userName={userName}
        page={page}
        pageId={pageId}
        editBlock={editBlock}
        blockComment={comment}
        subComment={null}
        commentBlock={block}
        setCommentBlock={setCommentBlock}
        setPopup={null}
        addOrEdit="add"
        setEdit={null}
      />
    </div>
  )
};
const Comments =({pageId,block,page, userName ,editBlock  ,select ,discardEdit}:CommentsProps)=>{
  const [targetComments, setTargetComment]= useState<BlockCommentType[]| null>(null);
  const [resolveComments, setResolveComments]= useState<BlockCommentType[]| null>(null);
  const [openComments, setOpenComments]= useState<BlockCommentType[]| null>(null);

  const [moreOpen, setMoreOpen]= useState<boolean>(false);
  const [toolMoreStyle, setToolMoreStyle]=useState<CSSProperties|undefined>(undefined);
  const [commentBlock, setCommentBlock]=useState<Block|null>(block);

  const showComments =(what:"open" | "resolve")=>{
    (what ==="open")?
    setTargetComment(openComments):
    setTargetComment(resolveComments)
  };

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
    if(page !==null){
      setTargetComment(page.header.comments)
    }
  },[page])
  useEffect(()=>{
    if(select !==null){
      select===open? 
      setTargetComment(openComments): 
      setTargetComment(resolveComments);
    }
  },[select, openComments, resolveComments]);

  return(
    <>
    <div 
      className='comments'
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
      {targetComments !==null && (commentBlock !==null || page !==null) &&
        <section className='comments_comments'>
          {targetComments.map((comment:BlockCommentType)=>
            <Comment 
              key={`comment_${comment.id}`}
              userName={userName}
              comment={comment}
              block={commentBlock}
              page={page}
              pageId={pageId}
              editBlock={editBlock}
              setCommentBlock={setCommentBlock}
              moreOpen={moreOpen}
              setMoreOpen={setMoreOpen}
              setToolMoreStyle={setToolMoreStyle}
              discardEdit={discardEdit}
            />
          )
          }
        </section>
      }
    </div>
    {moreOpen &&
        <ToolMore
          toolMoreStyle={toolMoreStyle}
          page={page}
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