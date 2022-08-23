import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { CSSProperties } from 'styled-components';
import Frame from '../components/Frame';
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
export type NotionActionProps ={
  editBlock :(pageId: string, block: Block) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,

  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,

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
}
type EditorContainerProps = NotionActionProps &{
  pages:Page[],
  pagesId:string[],
  userName:string,
  firstlist:listItem[],
  sideAppear:SideAppear,
  page:Page,

  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  isInTrash:boolean,

  changePageToBlock:(currentPageId: string, block: Block) => void,

  makePagePath: (page: Page) => pathType[] | null,
  

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
  setAllCommentsStyle:Dispatch<SetStateAction<CSSProperties>>,
  discardEdit:boolean,
  setOpenExport :Dispatch<SetStateAction<boolean>>,
};

const EditorContainer =({sideAppear,userName, firstlist,page,pages, pagesId,isInTrash, makePagePath,changeSide,addBlock,editBlock ,changeBlockToPage, changePageToBlock,deleteBlock,addPage,editPage,restorePage,duplicatePage, movePageToPage,deletePage, removeFavorites, addFavorites, cleanTrash, setTargetPageId ,openComment,setOpenComment,commentBlock,setCommentBlock,smallText,setSmallText,fullWidth,setFullWidth,showAllComments,  setShowAllComments , setAllCommentsStyle,discardEdit , setOpenExport}:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const user =useSelector((state:RootState)=>state.user);
  const changeToSub =(pageId: string, block: Block,  newParentBlockId: string)=> dispatch(change_to_sub(pageId, block, newParentBlockId));
  const raiseBlock =(pageId: string, block: Block) =>dispatch((raise_block(pageId, block)));
  const [pagePath, setPagePath]=useState<pathType[]|null>(null);


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
      setAllCommentsStyle={setAllCommentsStyle}
      smallText={smallText}
      setSmallText={setSmallText}
      fullWidth={fullWidth}
      setFullWidth={setFullWidth}
      setOpenExport={setOpenExport}
      />
      <Frame
        page={page}
        userName={userName}
        pagesId={pagesId}
        pages={pages}
        firstlist={firstlist}
        addBlock={addBlock}
        editBlock={editBlock}
        changeBlockToPage={changeBlockToPage}
        changePageToBlock={changePageToBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
        editPage={editPage}
        duplicatePage={duplicatePage}
        movePageToPage={movePageToPage}
        commentBlock={commentBlock}
        openComment={openComment}
        setTargetPageId={setTargetPageId}
        setOpenComment={setOpenComment}
        setCommentBlock ={setCommentBlock}
        smallText={smallText}
        fullWidth={fullWidth}
        discardEdit={discardEdit}
      />
    </div>
  )
};

export default React.memo(EditorContainer)