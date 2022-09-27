import React, {  Dispatch, FormEvent,SetStateAction,useEffect,useRef,useState, MouseEvent, RefObject } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, MainCommentType, SubCommentType, Page } from '../modules/notion';
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
  page:Page,
  pageId: string,
  userName:string,
  editBlock :(pageId: string, block: Block) => void | null,
  editPage: ((pageId: string, newPage: Page) => void )| null,
  select : null | typeof open | typeof resolve,
  discardEdit:boolean,
  setDiscardEdit:Dispatch<SetStateAction<boolean>>,
};
type CommentProps ={
  userName: string,
  comment:MainCommentType,
  pageId:string,
  page:Page,
  block:Block|null,
  editBlock :(pageId: string, block: Block) => void ,
  editPage: ((pageId: string, newPage: Page) => void )| null,
  allComments:MainCommentType[]|null,
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>>|null,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>,
  discardEdit:boolean,
  setDiscardEdit:Dispatch<SetStateAction<boolean>>,
  templateHtml: HTMLElement | null
  showAllComments:boolean,
};

type CommentInputProps={
  userName: string,
  pageId: string,
  page:Page,
  blockComment:MainCommentType|  null,
  subComment:SubCommentType |null,
  editBlock :(pageId: string, block: Block) => void |null,
  editPage: ((pageId: string, newPage: Page) => void )| null,
  commentBlock: Block|null,
  /**
   * block의 comments 이거나 page.header.comments 
   */
  allComments:MainCommentType[]|null,
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>>|null,
  setPopup:Dispatch<SetStateAction<PopupType>>| null,
  addOrEdit:"add"|"edit",
  setEdit:Dispatch<SetStateAction<boolean>>|null,
  templateHtml: HTMLElement | null
}
type CommentBlockProps ={
  comment: SubCommentType | MainCommentType,
  mainComment:boolean,
  block :Block|null,
  page:Page,
  pageId: string,
  userName:string,
  editBlock:(pageId: string, block: Block) => void,
  editPage: ((pageId: string, newPage: Page) => void )| null,
  allComments:MainCommentType[]|null,
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>>|null,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>,
  setPopup:Dispatch<SetStateAction<PopupType>>| null,
  discardEdit:boolean,
  setDiscardEdit:Dispatch<SetStateAction<boolean>>,
  templateHtml: HTMLElement | null
  showAllComments:boolean,
};

type CommentToolProps ={
  mainComment:boolean,
  comment: SubCommentType | MainCommentType,
  block:Block|null,
  page:Page,
  pageId: string,
  editBlock: (pageId: string, block: Block) => void,
  editPage: ((pageId: string, newPage: Page) => void )| null,
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>>|null,
  moreOpen:boolean,
  setMoreOpen:Dispatch<SetStateAction<boolean>>,
  setToolMoreStyle:Dispatch<SetStateAction<CSSProperties | undefined>>,
  templateHtml: HTMLElement | null
  showAllComments:boolean,
};

type ResolveBtnProps ={
  comment:MainCommentType,
};
type ToolMoreProps ={
  pageId:string,
  page:Page,
  block:Block | null,
  editBlock:(pageId: string, block: Block) => void,
  editPage: ((pageId: string, newPage: Page) => void) | null,
  allComments:MainCommentType[]|null,
  setAllComments: Dispatch<SetStateAction<MainCommentType[] | null>>|null,
  setMoreOpen: Dispatch<SetStateAction<boolean>>,
  toolMoreStyle:CSSProperties|undefined,
  templateHtml:HTMLElement|null
};
const closeToolMore=(event:MouseEvent| globalThis.MouseEvent ,setMoreOpen:Dispatch<SetStateAction<boolean>>)=>{
  const toolMore =document.getElementById("tool_more");
  const tooleMoreArea = toolMore?.getClientRects()[0];
  const isInToolMore = detectRange(event, tooleMoreArea);
  if(!isInToolMore){
    setMoreOpen(false);
    sessionStorage.removeItem("toolMoreItem");
  };
};

export const CommentInput =({userName, pageId, page ,blockComment, subComment,editBlock,editPage, commentBlock ,allComments, setAllComments,setPopup, addOrEdit,setEdit ,templateHtml}:CommentInputProps)=>{
  const editTime =JSON.stringify(Date.now());
  const userNameFirstLetter =userName.substring(0,1).toUpperCase();
  const [submitStyle,setSubmitStyle] =useState<CSSProperties>({
    fill:"#a3a3a2;",
    border:"none"
  });
  const [text, setText]=useState<string>("");
  const [editTargetComment, setEditTargetComment]=useState<MainCommentType|SubCommentType|null>(null) ;
  const updateBlock =(blockComments:MainCommentType[])=>{
    if(commentBlock !==null){
      const editedBlock :Block ={
        ...commentBlock,
        comments: blockComments
      };
      editBlock(pageId,editedBlock);
      setAllComments !==null && setAllComments(blockComments);
    }
  };
  const findBlockCommentIndex =(blockComments:MainCommentType[] , blockComment:MainCommentType):{blockComments:MainCommentType[],
    index:number}=>{
        const comments =[...blockComments];
        const commentsId= blockComments.map((comment:MainCommentType)=> comment.id);
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
  const addNewComment =()=>{
    if(commentBlock !==null){
      const newId = `blockComment_${editTime}`;
      const newBlockComment :MainCommentType ={
        id:newId,
        userName: userName,
        editTime:editTime,
        createTime:editTime,
        content: text ,
        subComments:null,
        subCommentsId:null,
        type:"open"
      };
      
      const newBlockComments  = allComments ===null? [newBlockComment] : allComments.concat(newBlockComment);
      updateBlock(newBlockComments);
    }
  };

  const addSubComment =()=>{
    if(commentBlock!==null && allComments!==null && blockComment !==null){
      const {blockComments, index}=findBlockCommentIndex(allComments, blockComment);
      const newSubComment:SubCommentType ={
        id :`subComment_${editTime}`,
        userName :userName,
        content: text,
        editTime:editTime,
        createTime:editTime
      };
      const newBlockComment:MainCommentType ={
        ...blockComment,
        subComments: blockComment.subComments ==null? [newSubComment]: blockComment.subComments.concat(newSubComment),
        subCommentsId:blockComment.subCommentsId ==null? [newSubComment.id]: blockComment.subCommentsId.concat(newSubComment.id),
        editTime:editTime
      };
      blockComments.splice(index, 1 ,newBlockComment);
      updateBlock(blockComments);
    }
  };
  const updatePageComment =(pageComments:MainCommentType[]|null)=>{
    if(page !==null){
      const editedPage :Page ={
        ...page,
        header :{
          ...page.header,
          comments:pageComments
        },
        editTime:editTime
      };
      setAllComments!==null && setAllComments(pageComments)
      if(editPage!==null){
        editPage(pageId, editedPage);
      } 
    }
  } ;
  const addPageComment =(page:Page)=>{
    const newComment:MainCommentType ={
      id: `pageComment_${editTime}`,
      userName: userName,
      content: text,
      editTime: editTime,
      createTime: editTime,
      type: "open" ,
      subComments: null,
      subCommentsId: null
    };
    const newPageComments:MainCommentType[]|null = page.header.comments ==null? [newComment] : page.header.comments.concat(newComment);
    updatePageComment(newPageComments);
  };
  function findPageCommentIndex( pageComment:MainCommentType){
    const pageComments =[...allComments as MainCommentType[]];
    const commentsId = pageComments.map((c:MainCommentType)=>c.id);
    const pageCommentIndex = commentsId.indexOf(pageComment.id);
    return {pageCommentIndex:pageCommentIndex , pageComments:pageComments}
  };
  const addPageSubComment=(page:Page , pageComment:MainCommentType )=>{
    const newSubComment :SubCommentType ={
      id: `subComment_${editTime}`,
      userName: userName,
      content: text,
      editTime: editTime,
      createTime: editTime,
    };

    const editedPgeComment:MainCommentType ={
      ...pageComment,
      subComments: pageComment.subComments==null? [newSubComment]: pageComment.subComments?.concat(newSubComment),
      subCommentsId: pageComment.subCommentsId ===null ? [newSubComment.id] : pageComment.subCommentsId.concat(newSubComment.id),
    };
    const {pageCommentIndex, pageComments}= findPageCommentIndex(pageComment);
    pageComments.splice(pageCommentIndex,1,editedPgeComment);
    updatePageComment(pageComments);
  };
  const recoveryInputAfterSubmit=()=>{
    setText("");
    closeInput();
    page !==null&& setTemplateItem(templateHtml, page);
    setEditTargetComment(null);
    sessionStorage.removeItem("editComment");
  };
  const makeNewComment =(event:MouseEvent)=>{
    event.preventDefault();
    if(commentBlock !==null){
      blockComment ==null?
      addNewComment():
      addSubComment();
    }else{
      blockComment ==null ?
      addPageComment(page):
      addPageSubComment(page, blockComment);
    };
    recoveryInputAfterSubmit();
  };

  const editBlockComment =()=>{
    console.log("editblockcomment")
    if(commentBlock !== null && allComments !==null && blockComment !==null){
      const {blockComments, index}= findBlockCommentIndex(allComments , blockComment);
      const editedBlockComment :MainCommentType = {
        ...blockComment,
        content:text ,
        editTime:editTime
      };
      blockComments.splice(index, 1, editedBlockComment);
      updateBlock(blockComments);
    }
  };
  const editSubComment =()=>{
    console.log("editsubcomment")
    if(commentBlock !==null && allComments !==null && blockComment !==null  &&blockComment.subComments !==null && blockComment.subCommentsId!==null  ){
      const {blockComments, index}= findBlockCommentIndex(allComments , blockComment);
      const subComment= editTargetComment as SubCommentType ; 
      const subIndex= blockComment.subCommentsId.indexOf(subComment.id);
      const editedSubComment :SubCommentType ={
        ...subComment,
        content:text ,
        editTime:editTime
      };
      blockComment.subComments?.splice(subIndex, 1,editedSubComment);
      blockComments.splice(index, 1, blockComment);
      updateBlock(blockComments);
    }
  }; 

  const editPageComment =(page:Page)=>{
    if(allComments !==null){
      const pageComment  = editTargetComment as MainCommentType
      const {pageCommentIndex, pageComments}=findPageCommentIndex( pageComment);

      const editedPageComment:MainCommentType ={
        ...pageComment,
        content:text ,
        editTime:editTime
      };
      pageComments.splice(pageCommentIndex,1, editedPageComment);
      updatePageComment(pageComments);
    }
  };

  const editPageSubComment=(page:Page)=>{
    if(allComments !==null && editTargetComment!==null){
      const subPageComment =editTargetComment as SubCommentType;
      const pageComments =[...allComments];
      const pageCommentsId =pageComments.map((c:MainCommentType)=> c.id);
      const pageComment = pageComments.filter((c:MainCommentType)=> c.subCommentsId?.includes(subPageComment.id))[0];
      const pageCommentIndex =pageCommentsId.indexOf(pageComment.id);
      const subIndex= pageComment.subCommentsId?.indexOf(editTargetComment.id);
      if(subIndex !==undefined){
        const editedSubComment:SubCommentType ={
          ...subPageComment,
          content:text ,
          editTime:editTime
        };
        pageComment.subComments?.splice(subIndex, 1, editedSubComment);
        pageComments.splice(pageCommentIndex,1,pageComment);
        updatePageComment(pageComments);
      }
    }
  };
  const editComment =(event:MouseEvent)=>{  
    event.preventDefault();
    console.log("click editcomment");
    if(commentBlock !==null){
      editTargetComment?.id === blockComment?.id?
      editBlockComment():
      editSubComment();

    }else{
      editTargetComment?.id === blockComment?.id ? 
      editPageComment(page)
      :
      editPageSubComment(page);
    };
    recoveryInputAfterSubmit();
  };
  const openDiscardEdit =(event:MouseEvent)=>{
    event.preventDefault();
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
  useEffect(()=>{
    if(addOrEdit==="edit"){
      subComment !==null ?
        setEditTargetComment(subComment):
        setEditTargetComment(blockComment)
    };
  },[blockComment, subComment, addOrEdit])
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
          placeholder={
            (addOrEdit==="add")?
            (blockComment==null?
            "Add a comment"
            :
            "Reply.....")
            :
            editTargetComment?.content
          }
          className="commentText"
          name="comment"
          onInput={onInputText}
          value={text}
        />
        { addOrEdit ==="edit" &&
        <button
          className="cancleEditBtn"
          onClick={(event)=>openDiscardEdit(event)}
        >
          <IoMdCloseCircle/>
        </button>
        }
        <button 
          onClick={
            addOrEdit==="add"? 
            (event)=>makeNewComment(event) 
            : 
            (event)=>editComment(event)
          }
          className="commentInputSubmit"
          name="commentInputSubmit"
          disabled ={text ==null || text ===""}
        >
          { addOrEdit ==="edit" ?
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


const ToolMore =({pageId, block,page, editBlock ,editPage, allComments, setAllComments,setMoreOpen ,toolMoreStyle, templateHtml}:ToolMoreProps)=>{
  const toolMoreItem = sessionStorage.getItem("toolMoreItem");
  const [comment, setComment] =useState<MainCommentType | SubCommentType | null >(null);
  const editTime = JSON.stringify(Date.now());
  
  const onClickDeleteComment =()=>{
    page !==null&& setTemplateItem(templateHtml,page);
    setMoreOpen(false);

    const deleteBlockComment =( )=>{
      if(comment !==null && block !==null && allComments !==null){
        const blockComments :MainCommentType[] =[...allComments];
        const mainCommentIds = blockComments.map((comment:MainCommentType)=> comment.id);
        const updateBlock =()=>{
          const templateHtml= document.getElementById("template");
          setTemplateItem(templateHtml,page);
          const editedBlock ={
            ...block,
            editTime:editTime,
            comments : blockComments[0]=== undefined ? null :blockComments
          };
          editBlock(page.id, editedBlock);
          setAllComments !==null && setAllComments(editedBlock.comments);
        };

        if(mainCommentIds?.includes(comment.id)){
            //MainCommentType
            const index = mainCommentIds.indexOf(comment.id);
            blockComments.splice(index,1);
            updateBlock();
        }else{
          //SubCommentType
          const mainComment :MainCommentType = blockComments.filter((b:MainCommentType)=>
            b.subCommentsId?.includes(comment.id))[0];
          const mainCommentIndex= mainCommentIds.indexOf(mainComment.id);
          const commentIndex = mainCommentIds.indexOf(comment.id);
          mainComment.subComments?.splice(commentIndex,1);
          mainComment.subCommentsId?.splice(commentIndex,1);
          const newMainComment :MainCommentType ={
            ...mainComment,
          };
          blockComments.splice(mainCommentIndex, 1, newMainComment);
          updateBlock();
      }
      };
    };
    //page.header.comments 가 아닐 경우 
    if(block !==null){
      deleteBlockComment();
    }else{
      //page.header.comments 인 경우
      if(comment !==null && page.header.comments!==null){
          const pageComments =[...page.header.comments];
          const pageCommentsId =pageComments.map((c:MainCommentType)=>c.id);
          const isBlockComment = pageCommentsId.includes(comment.id);
          if(isBlockComment){
            const index = pageCommentsId.indexOf(comment.id);
            pageComments.splice(index,1);
            const editedPage:Page={
              ...page,
              header :{
                ...page.header,
                comments : pageComments[0]===undefined? null :pageComments
              },
              editTime:editTime
            };
            editPage!==null && editPage(pageId, editedPage);
            setAllComments !==null && setAllComments(editedPage.header.comments);
          }else{
            const pageComment = pageComments.filter((pc:MainCommentType)=> pc.subCommentsId?.includes(comment.id))[0];
            const pageCommentIndex = pageCommentsId.indexOf(pageComment.id);
            const subComments =[...pageComment.subComments as SubCommentType[]];
            const subCommentsId =[...pageComment.subCommentsId as string[]];
            const subCommentIndex = subCommentsId.indexOf(comment.id);
            subCommentsId.splice(subCommentIndex,1);
            subComments.splice(subCommentIndex,1);
            const editedPageComment:MainCommentType ={
              ...pageComment,
              subComments: subComments[0]===undefined? null: subComments,
              subCommentsId: subCommentsId[0]===undefined? null :subCommentsId,
            };
            pageComments.splice(pageCommentIndex,1,editedPageComment);
            
            const editedPage:Page ={
              ...page,
              header :{
                ...page.header ,
                comments:pageComments
              }
            };
            setAllComments !==null && setAllComments(pageComments);
            editPage!==null && editPage(pageId, editedPage);
          };
          
      };
    };
    sessionStorage.removeItem("toolMoreItem");
  };

  const onClickEditComment =()=>{
    setMoreOpen(false);
    comment !==null && sessionStorage.setItem("editComment", comment.id);
    sessionStorage.removeItem("toolMoreItem");
  };
  useEffect(()=>{
    if(toolMoreItem !==null){
      const item = JSON.parse(toolMoreItem);
      setComment(item);
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

const CommentTool =({mainComment , comment,block, page ,pageId ,editBlock ,editPage  ,setAllComments, moreOpen ,setMoreOpen ,setToolMoreStyle, templateHtml ,showAllComments}:CommentToolProps)=>{

  const commentToolRef= useRef<HTMLDivElement>(null);
  const ResolveBtn =({comment}:ResolveBtnProps)=>{
    const changeToResolve =()=>{
      if(page!==null){
        setTemplateItem(templateHtml, page);
      };
      const editTime =JSON.stringify(Date.now());
      const newComment:MainCommentType ={
        ...comment,
          type:"resolve",
          editTime:editTime
      }; 
      if(block!==null){
        const comments = block.comments !==null ?[...block.comments] :[];
        const commentIdes :string[] = comments?.map((comment:MainCommentType)=> comment.id) as string[];
        const index  = commentIdes.indexOf(comment.id);
        comments.splice(index, 1, newComment);
        const editedBlock :Block={
          ...block,
          comments: comments,
          editTime:editTime,
        };
        editBlock(pageId, editedBlock);
        setAllComments!==null && setAllComments(editedBlock.comments)
      }else{
        const pageComment =page.header.comments?.[0];
        if(pageComment !==undefined){
          const editedPageComment:MainCommentType ={
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
          setAllComments !==null && setAllComments(editedPage.header.comments);
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
  /**
   * allComments가 아닌, page header나 block의 comments에서 ToolMore component의 위치를 지정하는 함수 
   * @param commentToolDomRect moreToolBtn을 누른 element(class="commentTool")에 대한 domeRect
   * @param comments  moreToolBtn을 누른 element(class="commentTool")이 위치한 element(class="comments")
   */
  const setStyleInNotAllComments=(commentToolDomRect:DOMRect|undefined, comments:HTMLElement|null)=>{
    const commentsDomRect =comments?.getClientRects()[0]; 
    if(commentToolDomRect!==undefined && commentsDomRect !==undefined){
      console.log("<domRect>","tool:",commentToolDomRect,"comments:",commentsDomRect)
      const style:CSSProperties ={
        position:"absolute" ,
        top: (commentToolDomRect.top -commentsDomRect.top) + commentToolDomRect.height +5 ,
        right: commentsDomRect.right- commentToolDomRect.right
      };
      setToolMoreStyle(style);
    }else{
      console.log("Error:",
      "can find commentTool?",commentToolDomRect!==undefined,"///" , 
      "can find comments?",
      commentsDomRect!==undefined);
    }
  }
  const openToolMore =(event: React.MouseEvent<HTMLButtonElement>)=>{
    setMoreOpen(true);
    const target = event.currentTarget ;
    const targetDomRect = target.getClientRects()[0] as DOMRect;
    const commentToolDomRect =commentToolRef.current?.getClientRects()[0];
    const blockCommentsHtml =document.getElementById("block_comments");  
    //frame 에서의 comments
    if(!showAllComments){
      if(blockCommentsHtml===null){
        //pageComment
        const templateHtml =document.getElementById("template");
        const pageComment =templateHtml==null? document.querySelector(".pageComment") as HTMLElement|null: templateHtml.querySelector(".pageComment") as HTMLElement|null;
        setStyleInNotAllComments(commentToolDomRect,pageComment);
      }else{
        //blockComment
        setStyleInNotAllComments(commentToolDomRect, blockCommentsHtml);

      }
    };
    //AllComments에서의 comments
    if(showAllComments  &&commentToolDomRect!== undefined){
      const top = targetDomRect.bottom + 5;
      const right =window.innerWidth - commentToolDomRect.right;
      const style:CSSProperties={
        position:"absolute",
        top: top,
        right:right
      };
      setToolMoreStyle(style);
    }
    sessionStorage.setItem("toolMoreItem", JSON.stringify(comment));
    }
  
  return(
    <div 
      className="commentTool"
      ref={commentToolRef}
    >
      {mainComment &&
        <ResolveBtn
          comment ={comment as MainCommentType}
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

const CommentBlock =({comment ,mainComment ,block ,page ,pageId, userName,editBlock ,editPage,setPopup ,allComments,setAllComments , moreOpen ,setMoreOpen ,setToolMoreStyle  ,discardEdit,setDiscardEdit, templateHtml , showAllComments}:CommentBlockProps)=>{
  const firstLetter = comment.userName.substring(0,1).toUpperCase();
  const [edit, setEdit]=useState<boolean>(false);
  const editCommentItem= sessionStorage.getItem("editComment");
  useEffect(()=>{
    // discard edit 
    if(editCommentItem!==null){
      if(discardEdit){
        setEdit(false);
        sessionStorage.removeItem("editComment");
        console.log("remove item");
        setDiscardEdit(false);
    }else{
      comment.id === editCommentItem && setEdit(true);
    }
    };
  },[editCommentItem, comment.id ,discardEdit]);
  return (
    <div 
    className='commentBlock'
  >
    <section className='comment_header'>
      <div className="information">
        <div className="firstLetter">
          <div>
            {firstLetter}
          </div>
        </div>
        <div className='userName'>
          {comment.userName}
        </div>
        <Time
          editTime={comment.editTime}
        />
      </div>
      <CommentTool
        mainComment={mainComment }
        comment={comment}
        block={block}
        page={page}
        pageId={pageId}
        editBlock={editBlock}
        editPage={editPage}
        setAllComments={setAllComments}
        moreOpen={moreOpen}
        setMoreOpen={setMoreOpen}
        setToolMoreStyle={setToolMoreStyle}
        templateHtml={templateHtml}
        showAllComments={showAllComments}
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
      { edit ?
        <CommentInput
          userName={userName}
          pageId={pageId}
          page={page}
          blockComment={!mainComment? null: comment as MainCommentType}
          subComment={!mainComment?  comment as SubCommentType : null}
          editBlock={editBlock}
          editPage={editPage}
          commentBlock={block}
          allComments={allComments}
          setAllComments={setAllComments}
          setPopup={setPopup}
          addOrEdit="edit"
          setEdit={setEdit}
          templateHtml={templateHtml}
        />
        :
        comment.content
        }
    </section>

    </div>
  )
}
const Comment =({userName,comment, block,page, pageId, editBlock ,editPage ,allComments ,setAllComments ,moreOpen ,setMoreOpen ,setToolMoreStyle ,discardEdit, setDiscardEdit,templateHtml ,showAllComments}:CommentProps)=>{

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
          allComments={allComments}
          setAllComments={setAllComments}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          setPopup={null}
          discardEdit={discardEdit}
          setDiscardEdit={setDiscardEdit}
          templateHtml={templateHtml}
          showAllComments={showAllComments}
        />
      </div>
      {comment.subComments !==null &&
      <div className='comment_comment'>
        {comment.subComments.map((comment:SubCommentType)=>
        <CommentBlock
          key={`commentBlock_${comment.id}`} 
          userName={userName}
          comment={comment}
          mainComment={false}
          page={page}
          pageId={pageId}
          block= {block}
          editBlock={editBlock}
          editPage={editPage}
          allComments={allComments}
          setAllComments={setAllComments}
          moreOpen={moreOpen}
          setMoreOpen={setMoreOpen}
          setToolMoreStyle={setToolMoreStyle}
          setPopup={null}
          discardEdit={discardEdit}
          setDiscardEdit={setDiscardEdit}
          templateHtml={templateHtml}
          showAllComments={showAllComments}
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
        allComments={allComments}
        setAllComments={setAllComments}
        setPopup={null}
        addOrEdit="add"
        setEdit={null}
        templateHtml={templateHtml}
      />
    </div>
  )
};
const Comments =({pageId,block,page, userName ,editBlock ,editPage  ,select ,discardEdit ,setDiscardEdit ,showAllComments}:CommentsProps)=>{
  const inner =document.getElementById("inner");
  const pageComments =page.header.comments;
  const [allComments, setAllComments]=useState<MainCommentType[]|null>(null);
  const [targetComments, setTargetComment]= useState<MainCommentType[]| null>(null);
  const [resolveComments, setResolveComments]= useState<MainCommentType[]| null>(null);
  const [openComments, setOpenComments]= useState<MainCommentType[]| null>(null);
  const [moreOpen, setMoreOpen]= useState<boolean>(false);
  const [toolMoreStyle, setToolMoreStyle]=useState<CSSProperties|undefined>(undefined);
  const templateHtml= document.getElementById("template");
  const commentsRef =useRef<HTMLDivElement>(null);
  const showComments =(what:"open" | "resolve")=>{
    (what ==="open")?
    setTargetComment(openComments):
    setTargetComment(resolveComments)
  };
  const updateOpenAndResolveComments =(comments:MainCommentType[])=>{
    setResolveComments(comments?.filter((comment:MainCommentType)=> comment.type ==="resolve") );
    setOpenComments( comments?.filter((comment:MainCommentType)=> comment.type ==="open"));
  };

  /**
   *block_comments의 comments의 높이가 일정 수준을 넘어가면 , 스크롤이 가능하도록 클래스를 넣어주는 함수 
   */
  function addClass (element:HTMLElement, maxHeight:number){
    if(!element.classList.contains("overHeight")){
      element.classList.add("overHeight");
      const top = element.style.top;
      const left =element.style.left ;
      const bottom =element.style.bottom;
      const width =element.style.width;
      const basic =`left:${left}; width:${width}; max-height:${maxHeight}px; `;
      if(top===""){
        element.setAttribute("style", basic.concat( `bottom:${bottom}`))
      }else{
        element.setAttribute("style", basic.concat(`top:${top}`))
    }
    }
  };
  /**
   *block_comments의 comments의 높이가 일정 수준으로 작아질 경우 , 스크롤이 가능하도록 클래스를 제거하는 함수 
   */
  function removeClass(element:HTMLElement){
    if(element.classList.contains("overHeight")){
      element.classList.remove("overHeight");
      const top = element.style.top;
      const left =element.style.left ;
      const bottom =element.style.bottom;
      const width =element.style.width;
      const basic =`left:${left}; width:${width};  `;
      if(top===""){
        element.setAttribute("style", basic.concat(`bottom:${bottom}`))
      }else{
        element.setAttribute("style", basic.concat(`top:${top}`))
      }
    }
  };
  /**
   * #block_comments의 comments의 max-height을 설정해 스크롤 기능을 넣거나 제거하는 함수 
   */
  // function resizeBlockCommentsMaxHeight(){
  //   const blockCommentsDomRect= blockComments?.getClientRects()[0];
  //   if( blockCommentsDomRect !==undefined && blockComments!==null ){
  //     const maxim = Math.round(window.innerHeight * 0.5);
  //     const styleTop =blockComments.style.top;
  //     const commentsTop =Math.round( blockCommentsDomRect.top);
  //     const commentsBottom =Math.round(blockCommentsDomRect.bottom);
  //     console.log("styleTop", styleTop);
  //     if(styleTop !==""){
  //       block 아래에 comments 위치
  //       if(commentsBottom +16 >= (window.innerHeight )){
  //         console.log("over")
  //         const max= window.innerHeight - commentsTop;
  //         const maxHeight :number = max >maxim ? maxim : (max <=0 ? 100 : max);
  //         addClass(blockComments,maxHeight );
  //       }else{
  //         removeClass(blockComments);
  //       }
  //     }else{
  //       block 위에 comments 위치
  //       const frameHtml =blockComments.parentElement;
  //       if(frameHtml!==null){
  //         const pageContent =frameHtml.querySelector(".pageContent")  ;
  //         const pageContentDomRect =pageContent?.getClientRects()[0]
  //       if(pageContentDomRect!==undefined){
  //         const pageContentTop =Math.round(pageContentDomRect.top);
  //         if(commentsTop <= pageContentTop){
  //           console.log("over")
  //           const max= commentsTop - pageContentTop  ;
  //           const maxHeight:number = max >maxim ? maxim : (max<=0 ? 100 :max);
  //           addClass(blockComments ,maxHeight);
  //         }else{
  //           removeClass(blockComments);
  //         }
  //       }else{
  //         console.log("Can't find pageContent element")
  //       }
  //       }
  //     } 
  //   }
  // };
  useEffect(()=>{
    if(block?.comments !==undefined && block?.comments !==null){
      setAllComments(block.comments)
    }else{
      setAllComments(pageComments)
    }
  },[block?.comments, pageComments]);

  useEffect(()=>{
    if(allComments !==null){
    updateOpenAndResolveComments(allComments)
    }else{
      setTargetComment(null);
    }
  },[allComments])
  useEffect(()=>{
    if(select !==null){
      select===open? 
      setTargetComment(openComments): 
      setTargetComment(resolveComments);
    }else{
      setTargetComment(openComments);
      if(commentsRef.current !==null ){
        (openComments===null || openComments[0]===undefined) ?
          commentsRef.current.parentElement?.setAttribute("style", "display:none")
          :
          commentsRef.current.parentElement?.setAttribute("style", "display:block")
      }
    }
  },[select, openComments, resolveComments]);


  // if(blockCommentsOpen.current && blockComments!==null){
  //   window.onresize = resizeBlockCommentsMaxHeight;
  // };
  // useEffect(()=>{
  //   if(blockComments !==null && targetComments!==null){
  //     if(blockCommentsOpen.current){
  //       console.log("re")
  //       resizeBlockCommentsMaxHeight()
  //     }else{
  //       blockCommentsOpen.current = true
  //     }
  //   }
  // },[targetComments ,blockComments]);
  inner?.addEventListener("click",  (event)=>{
    if(moreOpen){
      closeToolMore(event,setMoreOpen)
    };
  });
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
      {targetComments !==null  &&
        <section className='comments_comments'>
          {targetComments.map((comment:MainCommentType)=>
            <Comment 
              key={`comment_${comment.id}`}
              userName={userName}
              comment={comment}
              block={block}
              page={page}
              pageId={pageId}
              editBlock={editBlock}
              editPage={editPage}
              allComments={allComments}
              setAllComments={setAllComments}
              moreOpen={moreOpen}
              setMoreOpen={setMoreOpen}
              setToolMoreStyle={setToolMoreStyle}
              discardEdit={discardEdit}
              setDiscardEdit={setDiscardEdit}
              templateHtml={templateHtml}
              showAllComments={showAllComments}
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
          block={block}
          editBlock={editBlock}
          editPage={editPage}
          allComments={allComments}
          setAllComments={setAllComments}
          setMoreOpen={setMoreOpen}
          templateHtml={templateHtml}
        />
        }
  </>
  )
};

export default React.memo(Comments);