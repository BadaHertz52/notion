import React, { Dispatch, SetStateAction, useState } from 'react';
import Menu from './Menu';
import {Block, listItem, makeNewBlock, Page} from '../modules/notion';

import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import PageMenu from './PageMenu';
import { CommentInput } from './Comments';

type BlockFnProp ={
  pages:Page[],
  firstlist:listItem[],
  page:Page,
  userName:string,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void, 
  editBlock: (pageId: string, block: Block) => void,
  deleteBlock :(pageId: string, block: Block ,isInMenu:boolean) => void,
  addPage : ( newPage:Page, )=>void,
  duplicatePage: (targetPageId: string) => void,
  deletePage : (pageId:string , )=>void,
  commentBlock: Block|null,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
};
export const popupMoveToPage= "popupMoveToPage" ;
export const popupComment ="popupComment" ;
export type PopupType ={
  popup: boolean,
  what: typeof popupMoveToPage | typeof popupComment | null,
};
export type Position ={
  top:number,
  bottom:number,
  left:number,
  right:number,
};
export const findPosition =(eventTarget:Element ,elementArea:DOMRect ):{
  targetElement_position :Position,
  eventTarget_position : Position
}=>{
  const eventTargetArea = eventTarget?.getClientRects()[0] ;
  const targetElement_position:Position = {
    top: elementArea?.top as number,
    bottom: elementArea?.bottom  as number,
    left: elementArea?.left as number,
    right: elementArea?.right as number,
  };
  const eventTarget_position:Position = {
    top: eventTargetArea?.top as number,
    bottom: eventTargetArea?.bottom  as number,
    left: eventTargetArea?.left as number,
    right: eventTargetArea?.right as number,
  };
  
  return {
    targetElement_position : targetElement_position,
    eventTarget_position : eventTarget_position
  }
};

export const detectRange =(event:MouseEvent| React.MouseEvent , targetArea:DOMRect|undefined ):boolean=>{
  const target =event.target as Element; 
  const target_area= targetArea as DOMRect;
  const {targetElement_position ,eventTarget_position} =findPosition(target, target_area);
  const inner_x:boolean = (eventTarget_position.left >= targetElement_position.left)&&(eventTarget_position.right <= targetElement_position.right);
  const inner_y:boolean = (eventTarget_position.top>= targetElement_position.top) && (eventTarget_position.bottom <= targetElement_position.bottom);
  return (inner_x && inner_y);
};

const BlockFn =({pages,firstlist, page,userName, addBlock,duplicatePage, editBlock, deleteBlock ,addPage, movePageToPage, deletePage ,commentBlock,setCommentBlock}:BlockFnProp)=>{
  const inner =document.getElementById("inner");
  const [menuOpen, setMenuOpen]= useState<boolean>(false);
  const [popup, setPopup]=useState<PopupType>({
    popup:false,
    what:null
  });

  const makeBlock =()=>{
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock") ;
    if(sessionItem !==null){
      const targetBlock= JSON.parse(sessionItem);
      const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
      const newBlock =makeNewBlock(page, targetBlock,"");
      addBlock(page.id, newBlock, targetBlockIndex+1, null);
    }else{
      console.log("BlockFn-makeBlock error: there is no session item")
    }
  };

  const openMenu=()=>{
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock") ;
    if(sessionItem !==null){
      setMenuOpen(!menuOpen);
      setPopup({
        popup:false,
        what:null
      })
    }else{
      console.log("BlockFn-openMenu error: there is no session item")
    } ;
  };

  const closeMenu =(event:MouseEvent)=>{
    const mainMenu =document.getElementById("mainMenu");
    const sideMenu =document.getElementById("sideMenu")?.firstElementChild;
    const mainMenuArea =mainMenu?.getClientRects()[0] ;
    const sideMenuArea =sideMenu?.getClientRects()[0] ;

    const isInrMain = detectRange(event, mainMenuArea);
    const isInSide =detectRange(event, sideMenuArea );

    if(sideMenuArea !==undefined){
      (isInrMain || isInSide) ? setMenuOpen(true) :setMenuOpen(false);
    }else{
      isInrMain ? setMenuOpen(true) : setMenuOpen(false);
    }
  };
  const closePopup =(event:MouseEvent)=>{
    const popupMenu =document.getElementById("popupMenu");
    const popupMenuArea =popupMenu?.getClientRects()[0];
    const isInPopupMenu =detectRange(event, popupMenuArea);
    !isInPopupMenu && setPopup({
      popup:false,
      what: null
    });
  };

  inner?.addEventListener("click", (event:MouseEvent)=>{
      menuOpen &&closeMenu(event);
      popup.popup && closePopup(event);
    });
  return (
    <div 
      id="blockFn"
      className='blockFn'
    >
      <div className='blockFnIcon'>
        <button
        onClick={makeBlock}
        title="Click  to add a block below"
        >
          <AiOutlinePlus/>
        </button>
      </div>
      <div className='blockFnIcon'> 
        <button
          onClick={openMenu}
          title ="Click to open menu"
        >
          <CgMenuGridO/>
        </button>
        {menuOpen &&
          <Menu
            pages={pages}
            firstlist={firstlist}
            page={page}
            userName={userName}
            setMenuOpen={setMenuOpen}
            addBlock={addBlock}
            editBlock={editBlock}
            deleteBlock={deleteBlock}
            addPage={addPage}
            duplicatePage={duplicatePage}
            movePageToPage={movePageToPage}
            deletePage={deletePage}
            popup={popup}
            setPopup={setPopup}
          />
        }
      {popup.popup && (
            popup.what === popupMoveToPage ?
              <div id="popupMenu">
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
              <div id="popupMenu">
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
      </div>

  </div>
  )
};

export default React.memo(BlockFn)