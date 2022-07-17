import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Menu from './Menu';
import {Block, findPage, listItem, Page} from '../modules/notion';
import { CSSProperties } from 'styled-components';
import Rename from './Rename';

import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { PopupType } from '../containers/EditorContainer';


type BlockFnProp ={
  pages:Page[],
  pagesId:string[],
  firstlist:listItem[],
  page:Page,
  userName:string,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void, 
  editBlock: (pageId: string, block: Block) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,
  changePageToBlock: (currentPageId: string, block: Block) => void
  deleteBlock :(pageId: string, block: Block ,isInMenu:boolean) => void,
  addPage : ( newPage:Page, )=>void,
  editPage: (pageId: string, newPage: Page) => void,
  duplicatePage: (targetPageId: string) => void,
  deletePage : (pageId:string , )=>void,
  commentBlock: Block|null,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  popup:PopupType,
  setPopup: Dispatch<SetStateAction<PopupType>>,
  menuOpen:boolean,
  setMenuOpen:Dispatch<SetStateAction<boolean>>,
  setPopupStyle:Dispatch<SetStateAction<CSSProperties|undefined>>,
  setTargetPageId: Dispatch<SetStateAction<string>>,
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

const BlockFn =({pages,pagesId,firstlist, page,userName, addBlock,duplicatePage, editBlock,changeBlockToPage,changePageToBlock, deleteBlock ,addPage,editPage, movePageToPage, deletePage ,setCommentBlock, popup, setPopup ,menuOpen,setMenuOpen ,setPopupStyle ,setTargetPageId}:BlockFnProp)=>{
  const inner =document.getElementById("inner");
  const [openRename, setOpenRename] =useState<boolean>(false);
  const [blockFnTargetBlock, setBlockFnTargetBlock]=useState<Block|null>(null);
  const [renameTargetPage, setRenameTargetPage]=useState<Page|null>(null);
  useEffect(()=>{
    if(openRename && blockFnTargetBlock !==null){
      const page =findPage(pagesId, pages, blockFnTargetBlock.id) as Page; 
      setRenameTargetPage(page);
    }
  },[openRename])
  const makeBlock =()=>{
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock") ;
    if(sessionItem !==null){
      const targetBlock= JSON.parse(sessionItem);
      setBlockFnTargetBlock(targetBlock);
      const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
     // const newBlock =makeNewBlock(page, targetBlock,"");
      //addBlock(page.id, newBlock, targetBlockIndex+1, targetBlock.id);
    }else{
      console.log("BlockFn-makeBlock error: there is no session item")
    }
  };

  const openMenu=()=>{
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock") ;
    if(sessionItem !==null){
      const targetBlock = JSON.parse(sessionItem);
      setBlockFnTargetBlock(targetBlock);
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
    if(!isInPopupMenu){

      setPopup({
        popup:false,
        what: null
      });
    }

  };

  inner?.addEventListener("click", (event:MouseEvent)=>{
      menuOpen &&closeMenu(event);
      popup.popup && closePopup(event);
    });

  useEffect(()=>{
    const popupStyleItem =sessionStorage.getItem("popupStyle");
    if(popup && popupStyleItem !==null){
      const firstPoint= popupStyleItem.indexOf("px;");
      const secondPosint =popupStyleItem.indexOf("left:");
      const lastPosint =popupStyleItem.lastIndexOf("px");
      const top =Number(popupStyleItem.slice(5, firstPoint))+24;
      const left =Number(popupStyleItem.slice(secondPosint+5, lastPosint))+45 ;
      setPopupStyle({
        top: `${top}px`,
        left:`${left}px`
      });
      sessionStorage.removeItem("popupStyle")
    }
  },[popup])
  return (
  <>
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
        {menuOpen && blockFnTargetBlock !==null &&
          <Menu
            pages={pages}
            block={blockFnTargetBlock}
            firstlist={firstlist}
            page={page}
            userName={userName}
            setMenuOpen={setMenuOpen}
            addBlock={addBlock}
            editBlock={editBlock}
            changeBlockToPage={changeBlockToPage}
            changePageToBlock={changePageToBlock}
            deleteBlock={deleteBlock}
            addPage={addPage}
            duplicatePage={duplicatePage}
            movePageToPage={movePageToPage}
            deletePage={deletePage}
            popup={popup}
            setPopup={setPopup}
            setCommentBlock={setCommentBlock}
            setTargetPageId={setTargetPageId}
            setOpenRename= {setOpenRename}
          />
        }
        {openRename && renameTargetPage !==null &&
        <Rename
          currentPageId={page.id}
          block={blockFnTargetBlock}
          page={renameTargetPage}
          editBlock={editBlock}
          editPage={editPage}
          renameStyle={undefined}
          setOpenRename={setOpenRename}
        />
        }
      </div>
    </div>

  </>
  )
};

export default React.memo(BlockFn)