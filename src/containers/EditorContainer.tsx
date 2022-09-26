import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { CSSProperties } from 'styled-components';
import Frame from '../components/Frame';
import TopBar from '../components/TopBar';
import { RootState } from '../modules';
import  {  Block, Page,  change_to_sub, raise_block, listItem } from '../modules/notion';
import { SideAppear } from '../modules/side';
import { fontStyleType, pathType } from './NotionRouter';

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
  recentPagesId:string[]|null,
  sideAppear:SideAppear,
  page:Page,

  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  isInTrash:boolean,

  changePageToBlock:(currentPageId: string, block: Block) => void,

  makePagePath: (page: Page ,pagesId:string[], pages:Page[]) => pathType[] | null,

  setTargetPageId:Dispatch<SetStateAction<string>>,
  setRoutePage: React.Dispatch<React.SetStateAction<Page | null>>,
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
  setDiscardEdit:Dispatch<SetStateAction<boolean>>,
  setOpenExport :Dispatch<SetStateAction<boolean>>,
  openTemplates: boolean,
  setOpenTemplates: Dispatch<SetStateAction<boolean>>,
  fontStyle:fontStyleType,
  setFontStyle:Dispatch<SetStateAction<fontStyleType>>,
};

const EditorContainer =({sideAppear,userName, firstlist,page,pages, pagesId,recentPagesId ,isInTrash, makePagePath,changeSide,addBlock,editBlock ,changeBlockToPage, changePageToBlock,deleteBlock,addPage,editPage,restorePage,duplicatePage, movePageToPage,deletePage, removeFavorites, addFavorites, cleanTrash, setTargetPageId, setRoutePage ,openComment,setOpenComment,commentBlock,setCommentBlock,smallText,setSmallText,fullWidth,setFullWidth,showAllComments,  setShowAllComments ,discardEdit , setDiscardEdit,setOpenExport, openTemplates, setOpenTemplates, fontStyle, setFontStyle}:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const user =useSelector((state:RootState)=>state.user);
  const [editorStyle, setEditorStyle]=useState<CSSProperties|undefined>(undefined);
  const changeToSub =(pageId: string, block: Block,  newParentBlockId: string)=> dispatch(change_to_sub(pageId, block, newParentBlockId));
  const raiseBlock =(pageId: string, block: Block) =>dispatch((raise_block(pageId, block)));
  const [pagePath, setPagePath]=useState<pathType[]|null>(null);

  useEffect(()=>{
    if(sideAppear==="lock"){
      const sideBarHtml = document.querySelector(".sideBar");
      const sideBarWidth =sideBarHtml?.clientWidth;
      if(sideBarWidth!==undefined){
        setEditorStyle({
          width:`calc(100vw - ${sideBarWidth}px)`
        })
      }
    }else{
      setEditorStyle({
        width:"100vw"
      })
    }
  },[sideAppear])

  useEffect(()=>{
    setPagePath(makePagePath(page, pagesId, pages))
  },[page, page.header.icon, page.header.title, makePagePath]);

  return(
    <div 
      className='editor'
      style={editorStyle}
    >
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
      deleteBlock={deleteBlock}
      changeBlockToPage={changeBlockToPage}
      
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
      setFontStyle={setFontStyle}
      /> 
      <Frame
        page={page}
        userName={userName}
        pagesId={pagesId}
        pages={pages}
        firstlist={firstlist}
        recentPagesId={recentPagesId}
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
        setRoutePage={setRoutePage}
        setOpenComment={setOpenComment}
        setCommentBlock ={setCommentBlock}
        smallText={smallText}
        fullWidth={fullWidth}
        discardEdit={discardEdit}
        setDiscardEdit={setDiscardEdit}
        openTemplates={openTemplates}
        setOpenTemplates={setOpenTemplates}
        fontStyle={fontStyle}
      />
    </div>
  )
};

export default React.memo(EditorContainer)