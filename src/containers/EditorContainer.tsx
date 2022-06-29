import React, { Dispatch, SetStateAction, useState } from 'react';
import {useDispatch } from 'react-redux';
import { CSSProperties } from 'styled-components';
import BlockFn from '../components/BlockFn';
import Comments, { CommentInput } from '../components/Comments';
import Frame from '../components/Frame';
import PageMenu from '../components/PageMenu';
import TopBar from '../components/TopBar';
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

  changeSide: (appear: SideAppear) => void,
  setTargetPageId:Dispatch<SetStateAction<string>>,

  // setOpenComment: Dispatch<SetStateAction<boolean>>,
  // setCommentBlock:Dispatch<SetStateAction<Block | null>>,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
};

const EditorContainer =({sideAppear,userName, firstlist,page,pages,isInTrash, pagePath ,changeSide,addBlock,editBlock,deleteBlock,addPage,editPage,restorePage,duplicatePage, movePageToPage,deletePage, cleanTrash, setTargetPageId ,setShowAllComments}:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const changeToSub =(pageId: string, block: Block,  newParentBlockId: string)=> dispatch(change_to_sub(pageId, block, newParentBlockId));
  const raiseBlock =(pageId: string, block: Block) =>dispatch((raise_block(pageId, block)));

  const [openComment, setOpenComment]=useState<boolean>(false);
  const [commentBlock, setCommentBlock]=useState<Block|null>(null);
  const [menuOpen, setMenuOpen]= useState<boolean>(false);
  const [popup, setPopup]=useState<PopupType>({
    popup:false,
    what:null
  });

  const [popupStyle, setPopupStyle]=useState<CSSProperties |undefined>(undefined); 
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
      sideAppear={sideAppear}
      page={page}
      pagePath ={pagePath}
      changeSide={changeSide}
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