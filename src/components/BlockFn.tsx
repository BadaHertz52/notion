import React, { useState } from 'react';
import Menu from './Menu';
import {Block, listItem, Page} from '../modules/notion';

import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { makeNewBlock } from './EditableBlock';
import PageMenu from './PageMenu';
import { CommentInput } from './Comments';

type BlockFnProp ={
  pages:Page[],
  firstlist:listItem[],
  page:Page,
  userName:string,
  addBlock: (pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void, 
  editBlock: (pageId: string, block: Block) => void,
  deleteBlock :(pageId: string, block: Block) => void,
  addPage : (pageId:string , newPage:Page, block:null)=>void,
  editPage : (pageId:string , newPage:Page, block:null)=>void,
  deletePage : (pageId:string , block:null)=>void,
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

export const detectRange =(event:MouseEvent , targetArea:DOMRect|undefined ):boolean=>{
  const target =event.target as Element; 
  const target_area= targetArea as DOMRect;
  const {targetElement_position ,eventTarget_position} =findPosition(target, target_area);
  const inner_x:boolean = (eventTarget_position.left >= targetElement_position.left)&&(eventTarget_position.right <= targetElement_position.right);
  const inner_y:boolean = (eventTarget_position.top>= targetElement_position.top) && (eventTarget_position.bottom <= targetElement_position.bottom);
  return (inner_x && inner_y);
};

const BlockFn =({pages,firstlist, page,userName, addBlock, editBlock, deleteBlock ,addPage, editPage, deletePage}:BlockFnProp)=>{
  const inner =document.getElementById("inner");
  const editTime = JSON.stringify(Date.now());
  const newContents:string ="";
  const [menuOpen, setMenuOpen]= useState<boolean>(false);
  const [popup, setPopup]=useState<PopupType>({
    popup:false,
    what:null
  });

  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;

  const makeBlock =()=>{
    const targetBlock= JSON.parse(sessionItem);
    const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
    makeNewBlock(page, editTime,addBlock, editBlock, targetBlock, targetBlockIndex, newContents);
  };

  const openMenu=()=>{
    setMenuOpen(!menuOpen);
    setPopup({
      popup:false,
      what:null
    })
  };

  const closeMenu =(event:MouseEvent)=>{
    const mainMenu =document.getElementById("mainMenu");
    const sideMenu =document.getElementById("sideMenu")?.firstElementChild;
    const mainMenuArea =mainMenu?.getClientRects()[0] ;
    const sideMenuArea =sideMenu?.getClientRects()[0] ;

    const isInnerrMain = detectRange(event, mainMenuArea);
    const isInnerSide =detectRange(event, sideMenuArea );

    if(sideMenuArea !==undefined){
      (isInnerrMain || isInnerSide) ? setMenuOpen(true) :setMenuOpen(false);
    }else{
      isInnerrMain ? setMenuOpen(true) : setMenuOpen(false);
    }
  };
  const closePopup =(event:MouseEvent)=>{
    const popupMenu =document.getElementById("popupMenu");
    const popupMenuArea =popupMenu?.getClientRects()[0];
    const isInnerPopupMenu =detectRange(event, popupMenuArea);
    !isInnerPopupMenu && setPopup({
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
            editPage={editPage}
            deletePage={deletePage}
            setPopup={setPopup}
          />
        }
      {popup.popup && (
            popup.what === popupMoveToPage ?
              <div id="popupMenu">
                <PageMenu
                  pages={pages}
                  firstlist={firstlist}
                  existingPage={page}
                  deleteBlock={deleteBlock}
                  addBlock={addBlock}
                  setMenuOpen={setMenuOpen}
                /> 
              </div>
              :
              <div id="popupMenu">
                <div className='comments'>
                  <CommentInput
                    pageId={page.id}
                    userName={userName}
                    editBlock={editBlock}
                    comment={null}
                  />
                </div>
              </div>
          )
          }
      </div>

  </div>
  )
};

export default React.memo(BlockFn)