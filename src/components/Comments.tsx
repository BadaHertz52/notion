import React, {  Dispatch, FormEvent,SetStateAction,useEffect,useRef,useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, BlockCommentType, CommentType, Page } from '../modules/notion';
import {  BsThreeDots } from 'react-icons/bs';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoArrowUpCircleSharp, IoCheckmarkCircle, IoTrashOutline } from 'react-icons/io5';
import Time from './Time';
import { detectRange } from './BlockFn';
import { PopupType } from '../containers/EditorContainer';
import { IoMdCloseCircle } from 'react-icons/io';
import { setTemplateItem } from './BlockComponent';
const open="open";
const resolve="resolve";
type CommentsProps={
  block:Block | null,
  page:Page|null,
  pageId: string,
  userName:string,
  editBlock :(pageId: string, block: Block) => void | null,
  editPage: ((pageId: string, newPage: Page) => void )| null,
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
  editPage: ((pageId: string, newPage: Page) => void )| null,
  setCommentBlock: Dispatch<SetStateAction<Block|null>> ,
  setPageComments: (Dispatch<SetStateAction<BlockCommentType[] | null>>)|null,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>,
  discardEdit:boolean,
  templateHtml: HTMLElement | null
};
type CommentInputProps={
  userName: string,
  pageId: string,
  page:Page|null,
  blockComment:BlockCommentType|  null,
  subComment:CommentType |null,
  editBlock :(pageId: string, block: Block) => void |null,
  editPage: ((pageId: string, newPage: Page) => void )| null,
  commentBlock: Block|null,
  setCommentBlock: (Dispatch<SetStateAction<Block|null>>)|null ,
  setPageComments: (Dispatch<SetStateAction<BlockCommentType[] | null>>)|null,
  setPopup:Dispatch<SetStateAction<PopupType>>| null,
  addOrEdit:"add"|"edit",
  setEdit:Dispatch<SetStateAction<boolean>>|null,
  templateHtml: HTMLElement | null
}
type CommentBlockProps ={
  comment: CommentType | BlockCommentType,
  mainComment:boolean,
  block :Block|null,
  page:Page|null,
  pageId: string,
  userName:string,
  editBlock:(pageId: string, block: Block) => void,
  editPage: ((pageId: string, newPage: Page) => void )| null,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  setPageComments: (Dispatch<SetStateAction<BlockCommentType[] | null>>)|null,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>,
  setPopup:Dispatch<SetStateAction<PopupType>>| null,
  discardEdit:boolean,
  templateHtml: HTMLElement | null
};

type CommentToolProps ={
  mainComment:boolean,
  comment: CommentType | BlockCommentType,
  block:Block|null,
  page:Page|null,
  pageId: string,
  editBlock: (pageId: string, block: Block) => void,
  editPage: ((pageId: string, newPage: Page) => void )| null,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  setPageComments: (Dispatch<SetStateAction<BlockCommentType[] | null>>)|null,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>,
  templateHtml: HTMLElement | null
};

type ResolveBtnProps ={
  comment:BlockCommentType,
};
type ToolMoreProps ={
  pageId:string,
  page:Page|null,
  block:Block | null,
  editBlock:(pageId: string, block: Block) => void,
  editPage: ((pageId: string, newPage: Page) => void) | null,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  setPageComments: (Dispatch<SetStateAction<BlockCommentType[] | null>>)|null,
  setMoreOpen: Dispatch<SetStateAction<boolean>>,
  toolMoreStyle:CSSProperties|undefined,
  templateHtml:HTMLElement|null
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
const updateComments =(page: Page, block:Block, comment:CommentType | BlockCommentType | null , editTime:string, editBlock:(pageId: string, block: Block) => void ,setCommentBlock:Dispatch<SetStateAction<Block|null>>,fnType:"delete"|"edit", text:string|null)=>{
  if(comment !==null && block.comments !==null){
    const block_comments :BlockCommentType[] =[...block.comments];
    const mainCommentIds = block.comments.map((comment:BlockCommentType)=> comment.id);
    const updateBlock =()=>{
      const templateHtml= document.getElementById("template");
      setTemplateItem(templateHtml,page);
      const newBlock ={
        ...block,
        editTime:editTime,
        comments : block_comments[0]=== undefined ? null :block_comments
      };
      editBlock(page.id, newBlock);
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

export const CommentInput =({userName, pageId, page ,blockComment, subComment,editBlock,editPage, commentBlock, setCommentBlock ,setPageComments,setPopup, addOrEdit,setEdit ,templateHtml}:CommentInputProps)=>{

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
      setCommentBlock!==null && setCommentBlock(editedBlock);
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
    page !==null&& setTemplateItem(templateHtml, page)
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
    const updatePageComment =(pageComment:BlockCommentType)=>{
      if(page !==null){
        const editedPage :Page ={
          ...page,
          header :{
            ...page.header,
            comments:[pageComment]
          },
          editTime:editTime
        };
        setPageComments !==null && setPageComments([pageComment]);
        if(editPage!==null){
          editPage(pageId, editedPage);
        } 
      }
    } ;
    const addPageComment =(page:Page)=>{
      const newComment:BlockCommentType ={
        id: `pageComment_${editTime}`,
        userName: userName,
        content: text,
        editTime: editTime,
        createTime: editTime,
        type: "open" ,
        subComments: null,
        subCommentsId: null
      };

      updatePageComment(newComment);
    };
    const addPageSubComment=(page:Page , blockComment:BlockCommentType )=>{
      const newSubComment :CommentType ={
        id: `subComment_${editTime}`,
        userName: userName,
        content: text,
        editTime: editTime,
        createTime: editTime,
      };

      const pageComment:BlockCommentType ={
        ...blockComment,
        subComments: blockComment.subComments==null? [newSubComment]: blockComment.subComments?.concat(newSubComment),
        subCommentsId: blockComment.subCommentsId ===null ? [newSubComment.id] : blockComment.subCommentsId.concat(newSubComment.id),
      };

      updatePageComment(pageComment);
    };

    const editPageComment =(page:Page)=>{
      if(page.header.comments !==null){
        const pageComments =page.header.comments[0];
        const editedComment:BlockCommentType ={
          ...pageComments,
          content:text ,
          editTime:editTime
        };
        updatePageComment(editedComment);
      }
    };

    const editPageSubComment=(page:Page)=>{
      if(page.header.comments !==null && editTargetComment!==null){
        console.log("edi", editTargetComment)
        const pageComment= page.header.comments[0];
        const subIndex= pageComment.subCommentsId?.indexOf(editTargetComment.id);
        if(subIndex !==undefined){
          const editedSubComment:CommentType ={
            ...editTargetComment,
            content:text ,
            editTime:editTime
          };
          pageComment.subComments?.splice(subIndex, 1, editedSubComment);
          updatePageComment(pageComment);
        }
      }
    };
    switch (addOrEdit) {
      case "add":
        if(page ==null){
          blockComment ==null?
          addNewComment():
          addSubComment();
        }else{
          blockComment ==null ?
          addPageComment(page):
          addPageSubComment(page, blockComment);
        }
        break;
      case "edit":
        if(page ==null){
          editTargetComment?.id === blockComment?.id?
          editBlockComment():
          editSubComment();

        }else{
          editTargetComment?.id === blockComment?.id ? 
          editPageComment(page)
          :
          editPageSubComment(page);
        }
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


const ToolMore =({pageId, block,page, editBlock ,editPage, setCommentBlock ,setPageComments,setMoreOpen ,toolMoreStyle, templateHtml}:ToolMoreProps)=>{
  const toolMoreItem = sessionStorage.getItem("toolMoreItem");
  const [comment, setComment] =useState<BlockCommentType | CommentType | null >(null);
  const editTime = JSON.stringify(Date.now());
  
  const onClickDeleteComment =()=>{
    page !==null&& setTemplateItem(templateHtml,page);
    setMoreOpen(false);
    if(block !==null && page!==null){
      updateComments(page,block,comment,editTime,editBlock, setCommentBlock,"delete", null);
    }
    if(page !==null  && comment !==null){
      const pageComment = page.header.comments?.[0];
      if(pageComment !==undefined){
        if(pageComment.id === comment.id){
          const editedPage:Page ={
            ...page,
            header: {
              ...page.header,
              comments:null 
            },
            editTime:editTime 
          };
          editPage !== null && editPage(pageId, editedPage);
        }else{
          const editedPageComment:BlockCommentType ={
            ...pageComment,
            subComments:pageComment.subComments !==null?  pageComment.subComments.filter((sub:CommentType)=> comment.id !== sub.id) : null,
            subCommentsId:pageComment.subCommentsId !== null?  pageComment.subCommentsId.filter((sub:string)=> sub !== comment.id) : null,
          };
          setPageComments !==null && setPageComments([editedPageComment]);
          const editedPage:Page ={
            ...page,
            header :{
              ...page.header ,
              comments: [editedPageComment]
            }
          };
          editPage!==null && editPage(pageId, editedPage);
        }
      };
    }
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

const CommentTool =({mainComment , comment,block, page ,pageId ,editBlock ,editPage ,setCommentBlock ,setPageComments, moreOpen ,setMoreOpen ,setToolMoreStyle, templateHtml}:CommentToolProps)=>{

  const ResolveBtn =({comment}:ResolveBtnProps)=>{
    const changeToResolve =()=>{
      if(page!==null){
        setTemplateItem(templateHtml, page);
      };
      const editTime =JSON.stringify(Date.now());
      const newComment:BlockCommentType ={
        ...comment,
          type:"resolve",
          editTime:editTime
      }; 
      if(block!==null){
        const comments = block.comments !==null ?[...block.comments] :[];
        const commentIdes :string[] = comments?.map((comment:BlockCommentType)=> comment.id) as string[];
        const index  = commentIdes.indexOf(comment.id);
        comments.splice(index, 1, newComment);
        const newBlock :Block={
          ...block,
          comments: comments,
          editTime:editTime,
        };
        editBlock(pageId, newBlock);
        setCommentBlock(newBlock);
      }
      if(page !==null){
        const pageComment =page.header.comments?.[0];
        if(pageComment !==undefined){
          const editedPageComment:BlockCommentType ={
            ...pageComment,
            type:"resolve" ,
            editTime:editTime
          };
          const editedPage:Page ={
            ...page, 
            header :{
              ...page.header,
              comments: [editedPageComment]
            },
            editTime:editTime
          };
          setPageComments !==null && setPageComments([editedPageComment]);
          editPage !==null && editPage(pageId, editedPage)
        }
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

const CommentBlock =({comment ,mainComment ,block ,page ,pageId, userName,editBlock ,editPage,setPopup ,setCommentBlock ,setPageComments , moreOpen ,setMoreOpen ,setToolMoreStyle  ,discardEdit, templateHtml}:CommentBlockProps)=>{
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
        editPage={editPage}
        setCommentBlock={setCommentBlock}
        setPageComments={setPageComments}
        moreOpen={moreOpen}
        setMoreOpen={setMoreOpen}
        setToolMoreStyle={setToolMoreStyle}
        templateHtml={templateHtml}
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
          editPage={editPage}
          commentBlock={block}
          setCommentBlock={setCommentBlock}
          setPageComments={setPageComments}
          setPopup={setPopup}
          addOrEdit="edit"
          setEdit={setEdit}
          templateHtml={templateHtml}
        />
        :
        comment.content
        }
        </div>
    </section>

    </div>
  )
}
const Comment =({userName,comment, block,page, pageId, editBlock ,editPage ,setCommentBlock ,setPageComments ,moreOpen ,setMoreOpen ,setToolMoreStyle ,discardEdit, templateHtml}:CommentProps)=>{

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
          editPage={editPage}
          setCommentBlock={setCommentBlock}
          setPageComments={setPageComments}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          setPopup={null}
          discardEdit={discardEdit}
          templateHtml={templateHtml}
        />
      </div>
      {comment.subComments !==null &&
      <div className='comment_comment'>
        {comment.subComments.map((comment:CommentType)=>
        <CommentBlock
          key={`commentBlock_${comment.id}`} 
          userName={userName}
          comment={comment}
          mainComment={false}
          page={page}
          pageId={pageId}
          block={page !==null? null: block}
          editBlock={editBlock}
          editPage={editPage}
          setCommentBlock={setCommentBlock}
          setPageComments={setPageComments}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          setPopup={null}
          discardEdit={discardEdit}
          templateHtml={templateHtml}
        />)
        }
      </div>
      }
      <CommentInput
        userName={userName}
        page={page}
        pageId={pageId}
        editBlock={editBlock}
        editPage={editPage}
        blockComment={comment}
        subComment={null}
        commentBlock={block}
        setCommentBlock={setCommentBlock}
        setPageComments={setPageComments}
        setPopup={null}
        addOrEdit="add"
        setEdit={null}
        templateHtml={templateHtml}
      />
    </div>
  )
};
const Comments =({pageId,block,page, userName ,editBlock ,editPage  ,select ,discardEdit}:CommentsProps)=>{
  const [targetComments, setTargetComment]= useState<BlockCommentType[]| null>(null);
  const [resolveComments, setResolveComments]= useState<BlockCommentType[]| null>(null);
  const [openComments, setOpenComments]= useState<BlockCommentType[]| null>(null);

  const [moreOpen, setMoreOpen]= useState<boolean>(false);
  const [toolMoreStyle, setToolMoreStyle]=useState<CSSProperties|undefined>(undefined);
  const [commentBlock, setCommentBlock]=useState<Block|null>(block);
  const [pageComments, setPageComments]=useState<BlockCommentType[]|null>(page !==null? page.header.comments : null);

  const templateHtml= document.getElementById("template");

  const commentsRef =useRef<HTMLDivElement>(null);

  const showComments =(what:"open" | "resolve")=>{
    (what ==="open")?
    setTargetComment(openComments):
    setTargetComment(resolveComments)
  };
  const updateOpenAndResolveComments =(comments:BlockCommentType[])=>{
    setResolveComments(comments?.filter((comment:BlockCommentType)=> comment.type ==="resolve") );
    setOpenComments( comments?.filter((comment:BlockCommentType)=> comment.type ==="open"));
  };
  useEffect(()=>{
    if(commentBlock!==null){
      setTargetComment(commentBlock.comments);
      if(commentBlock.comments !==null){
        updateOpenAndResolveComments(commentBlock.comments)
      };
    }
  },[commentBlock]);
  useEffect(()=>{
    if(page !==null){
      console.log(pageComments)
      if(pageComments !== null){
        updateOpenAndResolveComments(pageComments);
      }
    }
  },[pageComments]);
  useEffect(()=>{
    if(page !==null){
      setTargetComment(openComments);
        if(commentsRef.current !==null ){
          (openComments===null || openComments[0]===undefined) ?
            commentsRef.current.parentElement?.setAttribute("style", "display:none")
            :
            commentsRef.current.parentElement?.setAttribute("style", "display:block")
        }
    }

  },[resolveComments])
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
      ref = {commentsRef}
    >
      {resolveComments !==null && resolveComments.length>0 && select==null && block !==null &&
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
      {targetComments !==null && (commentBlock !==null || pageComments !==null) &&
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
              editPage={editPage}
              setCommentBlock={setCommentBlock}
              setPageComments={setPageComments}
              moreOpen={moreOpen}
              setMoreOpen={setMoreOpen}
              setToolMoreStyle={setToolMoreStyle}
              discardEdit={discardEdit}
              templateHtml={templateHtml}
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
          editPage={editPage}
          setCommentBlock={setCommentBlock}
          setPageComments={setPageComments}
          setMoreOpen={setMoreOpen}
          templateHtml={templateHtml}
        />
        }
  </>
  )
};

export default React.memo(Comments);