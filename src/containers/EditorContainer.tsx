import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { CSSProperties } from 'styled-components';
import BlockFn, { detectRange } from '../components/BlockFn';
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
export type PopupType ={
  popup: boolean,
  what: typeof popupMoveToPage | typeof popupComment | null,
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
  showAllComments:boolean,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
  discardEdit:boolean
};

const EditorContainer =({sideAppear,userName, firstlist,page,pages, pagesId,isInTrash, makePagePath,changeSide,addBlock,editBlock ,changeBlockToPage, changePageToBlock,deleteBlock,addPage,editPage,restorePage,duplicatePage, movePageToPage,deletePage, removeFavorites, addFavorites, cleanTrash, setTargetPageId , showAllComments,  setShowAllComments , discardEdit}:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const user =useSelector((state:RootState)=>state.user);
  const changeToSub =(pageId: string, block: Block,  newParentBlockId: string)=> dispatch(change_to_sub(pageId, block, newParentBlockId));
  const raiseBlock =(pageId: string, block: Block) =>dispatch((raise_block(pageId, block)));
  const inner =document.getElementById("inner");
  const [pagePath, setPagePath]=useState<pathType[]|null>(null);
  const [openComment, setOpenComment]=useState<boolean>(false);
  const [commentBlock, setCommentBlock]=useState<Block|null>(null);
  const [commentsStyle, setCommentsStyle]= useState<CSSProperties>();
  const [menuOpen, setMenuOpen]= useState<boolean>(false);
  const [popup, setPopup]=useState<PopupType>({
    popup:false,
    what:null
  });
  const [popupStyle, setPopupStyle]=useState<CSSProperties |undefined>(undefined); 
  const [smallText, setSmallText]=useState<boolean>(false);
  const [fullWidth, setFullWidth]=useState<boolean>(false);
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
      />
      {popup.popup && (
        popup.what === popupMoveToPage ?
          <div 
            id="popupMenu"
            style ={popupStyle}
          >
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
          </div>
          :
          <div 
            id="popupMenu"
            style={popupStyle}
          >
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
          </div>
      )
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