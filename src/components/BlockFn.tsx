import React, { Dispatch, SetStateAction, useEffect,  useState } from 'react';
import Menu from './Menu';
import {Block, findPage, listItem, makeNewBlock, Page} from '../modules/notion';
import { CSSProperties } from 'styled-components';
import Rename from './Rename';

import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { PopupType } from '../containers/EditorContainer';
import { setTemplateItem } from './BlockComponent';

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
  commentBlock: Block|null,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  setMoveTargetBlock :Dispatch<SetStateAction<Block| null>>,
  moveTargetBlock:Block|null,
  setCommentBlock: Dispatch<SetStateAction<Block|null>>,
  popup:PopupType,
  setPopup: Dispatch<SetStateAction<PopupType>>,
  menuOpen:boolean,
  setOpenMenu:Dispatch<SetStateAction<boolean>>,
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

const BlockFn =({pages,pagesId,firstlist, page,userName, addBlock,duplicatePage, editBlock,changeBlockToPage,changePageToBlock, deleteBlock ,addPage,editPage, movePageToPage,  setMoveTargetBlock,moveTargetBlock, setCommentBlock, popup, setPopup ,menuOpen,setOpenMenu ,setPopupStyle ,setTargetPageId }:BlockFnProp)=>{
  const [openRename, setOpenRename] =useState<boolean>(false);

  const [blockFnTargetBlock, setBlockFnTargetBlock]=useState<Block|null>(null);
  const [renameTargetPage, setRenameTargetPage]=useState<Page|null>(null);

  const makeBlock =()=>{
    const templateHtml= document.getElementById("template");
    setTemplateItem(templateHtml, page);
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock") ;
    if(sessionItem !==null && page.blocksId!==null){
      const targetBlock= JSON.parse(sessionItem);
      const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
      const newBlock =makeNewBlock(page, targetBlock,"");
      addBlock(page.id, newBlock, targetBlockIndex+1, targetBlock.id);
    }else{
      console.log("BlockFn-makeBlock error: there is no session item")
    }
  };
  const onMouseDownMenu=()=>{
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock") ;
    if(sessionItem!==null){
      const targetBlock = JSON.parse(sessionItem);
      moveTargetBlock==null && setMoveTargetBlock(targetBlock)
    } ;
  };
  const onClickMenu=()=>{
    moveTargetBlock!==null&& setMoveTargetBlock(null);
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock") ;
    menuOpen && setOpenMenu(false); 
    popup.popup && setPopup({
      popup:false,
      what:null
    })
    if(sessionItem!==null && !menuOpen){
      const targetBlock = JSON.parse(sessionItem);
      setBlockFnTargetBlock(targetBlock);
      setOpenMenu(true);
      sessionStorage.remove("blockFnTargetBlock");
    }else{
      console.log("BlockFn-openMenu error: there is no session item")
    } ;
  };
  useEffect(()=>{
    if(openRename && blockFnTargetBlock !==null){
      const page =findPage(pagesId, pages, blockFnTargetBlock.id) as Page; 
      setRenameTargetPage(page);
    }
  },[openRename, blockFnTargetBlock, pagesId, pages]);

  useEffect(()=>{
    const popupStyleItem =sessionStorage.getItem("popupStyle");
    if(popup.popup && popupStyleItem !==null){
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
  },[popup.popup, setPopupStyle]);

  useEffect(()=>{
    const innerHeight =window.innerHeight;
    const inner =document.getElementById("inner");
    if(menuOpen){
      if(inner !==null){
        if(inner.offsetHeight > innerHeight){
          inner.setAttribute("style","overflow-y:scroll")
        }else{
          inner.setAttribute("style","overflow-y:initial")
        }
      }
    }else{
      if(inner !==null){
        inner.setAttribute("style", "overflow-y:initial");
      }
    }
  },[menuOpen])
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
      <div 
        className='blockFnIcon'
      > 
        <button
          onClick={onClickMenu}
          onMouseDown={onMouseDownMenu}
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
            setOpenMenu={setOpenMenu}
            addBlock={addBlock}
            editBlock={editBlock}
            changeBlockToPage={changeBlockToPage}
            changePageToBlock={changePageToBlock}
            deleteBlock={deleteBlock}
            duplicatePage={duplicatePage}
            movePageToPage={movePageToPage}
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