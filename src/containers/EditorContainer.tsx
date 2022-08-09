import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { CSSProperties } from 'styled-components';
import BlockFn, { detectRange } from '../components/BlockFn';
import CommandBlock from '../components/CommandBlock';
import Comments, { CommentInput } from '../components/Comments';
import Frame from '../components/Frame';
import PageMenu from '../components/PageMenu';
import TopBar from '../components/TopBar';
import { RootState } from '../modules';
import  {  Block, Page,  change_to_sub, raise_block, listItem } from '../modules/notion';
import { SideAppear } from '../modules/side';
import { pathType } from './NotionRouter';

export const popupMoveToPage= "popupMoveToPage" ;
export const popupComment ="popupComment" ;
export const popupCommand="popupCommand";
export type PopupType ={
  popup: boolean,
  what: typeof popupMoveToPage | typeof popupComment | typeof popupCommand| null,
};

type EditorContainerProps ={
  sideAppear:SideAppear,
  page:Page,
  pages:Page[],
  pagesId:string[],
  userName:string,
  firstlist:listItem[],
  isInTrash:boolean,
  //pagePath : pathType[]|null,
  makePagePath: (page: Page) => pathType[] | null,
  editBlock :(pageId: string, block: Block) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,
  changePageToBlock:(currentPageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  deleteBlock: (pageId: string, block: Block , isInMenu:boolean) => void,
  
  addPage : ( newPage:Page, )=>void
  editPage : (pageId:string , newPage:Page, )=>void,
  deletePage : (pageId:string )=>void,
  duplicatePage: (targetPageId: string) => void,
  movePageToPage: (targetPageId: string, destinationPageId: string) => void,

  restorePage: (pageId: string) => void,
  cleanTrash: (pageId: string) => void,

  addFavorites: (itemId: string) => void,
  removeFavorites: (itemId: string) => void,

  changeSide: (appear: SideAppear) => void,
  setTargetPageId:Dispatch<SetStateAction<string>>,
  openComment :boolean,
  setOpenComment: Dispatch<SetStateAction<boolean>>,
  commentBlock :Block|null,
  setCommentBlock:Dispatch<SetStateAction<Block|null>>,
  smallText:boolean,
  setSmallText:Dispatch<SetStateAction<boolean>>,
  
  fullWidth:boolean,
  setFullWidth:Dispatch<SetStateAction<boolean>>,
  showAllComments:boolean,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
  discardEdit:boolean,
  setOpenExport :Dispatch<SetStateAction<boolean>>,
};

const EditorContainer =({sideAppear,userName, firstlist,page,pages, pagesId,isInTrash, makePagePath,changeSide,addBlock,editBlock ,changeBlockToPage, changePageToBlock,deleteBlock,addPage,editPage,restorePage,duplicatePage, movePageToPage,deletePage, removeFavorites, addFavorites, cleanTrash, setTargetPageId ,openComment,setOpenComment,commentBlock,setCommentBlock,smallText,setSmallText,fullWidth,setFullWidth,showAllComments,  setShowAllComments , discardEdit , setOpenExport}:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const user =useSelector((state:RootState)=>state.user);
  const changeToSub =(pageId: string, block: Block,  newParentBlockId: string)=> dispatch(change_to_sub(pageId, block, newParentBlockId));
  const raiseBlock =(pageId: string, block: Block) =>dispatch((raise_block(pageId, block)));
  const inner =document.getElementById("inner");
  const [pagePath, setPagePath]=useState<pathType[]|null>(null);

  const [commentsStyle, setCommentsStyle]= useState<CSSProperties>();
  const [menuOpen, setMenuOpen]= useState<boolean>(false);
  const [commandTargetBlock, setCommandTargetBlock]=useState<Block|null>(null);
  const [popup, setPopup]=useState<PopupType>({
    popup:false,
    what:null
  });
  const [popupStyle, setPopupStyle]=useState<CSSProperties |undefined>(undefined); 

  const closePopup=(event: MouseEvent)=>{
    if(popup.popup){
      const popupMenu =document.getElementById("popupMenu");
      const popupMenuDomRect= popupMenu?.getClientRects()[0];
      const isInPopupMenu =detectRange(event, popupMenuDomRect);
      !isInPopupMenu && setPopup({
        popup:false,
        what:null
      });
    };
    if(openComment){
      const commentsDoc= document.getElementById("block_comments") ;
      if(commentsDoc !==null){
        const commentsDocDomRect= commentsDoc.getClientRects()[0];
        const isInComments =detectRange(event, commentsDocDomRect);
        if(!isInComments){
          setCommentBlock(null);
          setOpenComment(false); 
        }
      }
    }
  };
  inner?.addEventListener("click",(event)=>closePopup(event));

  useEffect(()=>{
    if(commentBlock !==null){
      const blockDoc = document.getElementById(`block_${commentBlock.id}`);
      const editor =document.getElementsByClassName("editor")[0] as HTMLElement;
      const position =blockDoc?.getClientRects()[0]
      if(position !== undefined){
        const style :CSSProperties ={
          position:"absolute",
          top: position.bottom +editor.scrollTop,
          left: position.left,
          width:position.width
        };
        setCommentsStyle(style);
      } 
    }
  },[commentBlock]);
  useEffect(()=>{
    setPagePath(makePagePath(page))
  },[page, page.header.icon, page.header.title]);
  useEffect(()=>{
    if(commandTargetBlock!==null){
      const editor= document.getElementsByClassName("editor")[0];
      const editorDomRect= editor.getClientRects()[0];
      const blockDom = document.getElementById(`block_${commandTargetBlock.id}`);
      const blockDomRect =blockDom?.getClientRects()[0];
      if(blockDomRect!==undefined){
        const style:CSSProperties ={
          position:"absolute",
          top : blockDomRect.bottom + blockDomRect.height + editor.scrollTop,
          left :blockDomRect.left -editorDomRect.left
        };
        console.log(editorDomRect, editor.scrollTop, blockDomRect)
        setPopupStyle(style);
      };
    }
  },[commandTargetBlock])
  return(
    <div className='editor'>
      {isInTrash &&
      <div className='isInTrash'>
        <div>
          This is page is in Trash.
        </div>
        <div className="isInTrashBtns">
          <button
            onClick={()=>restorePage(page.id)}
          >
            Restore page
          </button>
          <button
            onClick={()=>cleanTrash(page.id)}
          >
            Delete permanently
          </button>
        </div>
      </div>
      }
      <TopBar
      firstlist={firstlist}
      favorites={user.favorites}
      sideAppear={sideAppear}
      page={page}
      pages={pages}
      pagePath ={pagePath}
      changeSide={changeSide}

      addBlock={addBlock}
      editBlock={editBlock}
      deleteBlock={deleteBlock}
      changeBlockToPage={changeBlockToPage}
      
      addPage={addPage}
      deletePage={deletePage}
      movePageToPage={movePageToPage}

      removeFavorites={removeFavorites}
      addFavorites={addFavorites}

      setTargetPageId={setTargetPageId}
      showAllComments={showAllComments}
      setShowAllComments={setShowAllComments}
      smallText={smallText}
      setSmallText={setSmallText}
      fullWidth={fullWidth}
      setFullWidth={setFullWidth}
      setOpenExport={setOpenExport}
      />
      <Frame
        page={page}
        firstBlocksId={page.firstBlocksId}
        addBlock={addBlock}
        editBlock={editBlock}
        changeBlockToPage={changeBlockToPage}
        changePageToBlock={changePageToBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
        editPage={editPage}
        setTargetPageId={setTargetPageId}
        setOpenComment={setOpenComment}
        setCommentBlock ={setCommentBlock}
        smallText={smallText}
        fullWidth={fullWidth}
        discardEdit={discardEdit}
        userName={userName}
      />
      <BlockFn
        page={page}
        pages={pages}
        pagesId={pagesId}
        firstlist={firstlist}
        userName={userName}
        addBlock={addBlock}
        editBlock={editBlock}
        changeBlockToPage={changeBlockToPage}
        changePageToBlock={changePageToBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
        editPage={editPage}
        duplicatePage={duplicatePage}
        movePageToPage={movePageToPage}
        deletePage={deletePage}
        commentBlock={commentBlock}
        setCommentBlock={setCommentBlock}
        popup={popup}
        setPopup={setPopup}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setPopupStyle={setPopupStyle}
        setTargetPageId={setTargetPageId}
        setCommandTargetBlock={setCommandTargetBlock}
      />
      {popup.popup && 
          <div 
            id="popupMenu"
            style ={popupStyle}
          >
            {popup.what==="popupMoveToPage" &&
            <PageMenu
              what="block"
              currentPage={page}
              pages={pages}
              firstlist={firstlist}
              deleteBlock={deleteBlock}
              addBlock={addBlock}
              editBlock={editBlock}
              changeBlockToPage={changeBlockToPage}
              addPage={addPage}
              movePageToPage={movePageToPage}
              setMenuOpen={setMenuOpen}
              setTargetPageId={setTargetPageId}
            /> 
            }
            {popup.what ==="popupComment" &&
                <CommentInput
                pageId={page.id}
                page={null}
                userName={userName}
                editBlock={editBlock}
                editPage={editPage}
                blockComment={null}
                subComment={null}
                commentBlock={commentBlock}
                setCommentBlock={setCommentBlock}
                setPageComments={null}
                setPopup={setPopup}
                addOrEdit="add"
                setEdit={null}
              />
            }
            {popup.what === "popupCommand" && commandTargetBlock !==null&&
              <CommandBlock
                page ={page}
                block ={commandTargetBlock}
                editBlock ={editBlock}
                changeBlockToPage ={changeBlockToPage}
                changePageToBlock ={changePageToBlock}
                setPopup ={setPopup}
                setCommandTargetBlock={setCommandTargetBlock}
                setCommand ={null}
                command ={null}
              />
            }
          </div>
      }
      {commentBlock !==null && openComment &&
      <div 
        id="block_comments"
        style={commentsStyle}
      >
        <Comments
          userName={userName}
          block={commentBlock}
          pageId={page.id}
          page={null}
          editBlock={editBlock}
          editPage={editPage}
          select={null}
          discardEdit={discardEdit}
        />  
      </div>            
      }

    </div>
  )
};

export default React.memo(EditorContainer)