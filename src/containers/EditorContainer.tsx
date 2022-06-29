import React, { Dispatch, SetStateAction, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { CSSProperties } from 'styled-components';
import BlockFn, { detectRange } from '../components/BlockFn';
import Comments, { CommentInput } from '../components/Comments';
import Frame from '../components/Frame';
import PageMenu from '../components/PageMenu';
import TopBar from '../components/TopBar';
import { RootState } from '../modules';
import {  Block, Page,  change_to_sub, raise_block, listItem } from '../modules/notion';
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
  userName:string,
  firstlist:listItem[],
  isInTrash:boolean,
  pagePath : pathType[]|null,
  editBlock :(pageId: string, block: Block) => void,
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

  // setOpenComment: Dispatch<SetStateAction<boolean>>,
  // setCommentBlock:Dispatch<SetStateAction<Block | null>>,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
};

const EditorContainer =({sideAppear,userName, firstlist,page,pages,isInTrash, pagePath ,changeSide,addBlock,editBlock,deleteBlock,addPage,editPage,restorePage,duplicatePage, movePageToPage,deletePage, removeFavorites, addFavorites, cleanTrash, setTargetPageId ,setShowAllComments}:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const user =useSelector((state:RootState)=>state.user);
  const changeToSub =(pageId: string, block: Block,  newParentBlockId: string)=> dispatch(change_to_sub(pageId, block, newParentBlockId));
  const raiseBlock =(pageId: string, block: Block) =>dispatch((raise_block(pageId, block)));
  const inner =document.getElementById("inner");
  const [openComment, setOpenComment]=useState<boolean>(false);
  const [commentBlock, setCommentBlock]=useState<Block|null>(null);
  const [menuOpen, setMenuOpen]= useState<boolean>(false);
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
       console.log("is", isInPopupMenu)
      !isInPopupMenu && setPopup({
        popup:false,
        what:null
      });
    };
    if(openComment){
      const editor =document.getElementsByClassName("editor")[0] as HTMLElement;
      const commentsDoc= editor.getElementsByClassName("comments")[0] as HTMLElement;
      const commentsDocDomRect= commentsDoc.getClientRects()[0];
      const isInComments =detectRange(event, commentsDocDomRect);
      if(!isInComments){
        setCommentBlock(null);
        setOpenComment(false); 
      }
    }
  }
  inner?.addEventListener("click",(event)=>closePopup(event))
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
      favorites={user.favorites}
      sideAppear={sideAppear}
      page={page}
      pagePath ={pagePath}
      changeSide={changeSide}
      removeFavorites={removeFavorites}
      addFavorites={addFavorites}
      setTargetPageId={setTargetPageId}
      setShowAllComments={setShowAllComments}
      />
      <Frame
        targetPage={page}
        firstBlocksId={page.firstBlocksId}
        addBlock={addBlock}
        editBlock={editBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
        editPage={editPage}
        setOpenComment={setOpenComment}
        setCommentBlock ={setCommentBlock}
      />
      <BlockFn
        page={page}
        pages={pages}
        firstlist={firstlist}
        userName={userName}
        addBlock={addBlock}
        editBlock={editBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
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
              addPage={addPage}
              movePageToPage={movePageToPage}
              setMenuOpen={setMenuOpen}
            /> 
          </div>
          :
          <div 
            id="popupMenu"
            style={popupStyle}
          >
              <CommentInput
                pageId={page.id}
                userName={userName}
                editBlock={editBlock}
                comment={null}
                commentBlock={commentBlock}
                setCommentBlock={setCommentBlock}
              />
          </div>
      )
      }
      {commentBlock !==null && openComment &&
        <Comments
          userName={userName}
          block={commentBlock}
          pageId={page.id}
          editBlock={editBlock}
          setCommentBlock={setCommentBlock}
          //setMoreOpen={setMoreOpen}
        />              
      }
    </div>
  )
};

export default React.memo(EditorContainer)