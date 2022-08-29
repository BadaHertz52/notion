import React, { Dispatch,SetStateAction, useEffect, useState } from 'react';
import { BsChatLeftText, BsThreeDots } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import {ImArrowUpRight2} from 'react-icons/im';
import { CSSProperties } from 'styled-components';
import ColorMenu from './ColorMenu';
import { selectionType } from './Frame';
import Menu, { MenuAndBlockStylerCommonProps } from './Menu';
import { Block} from '../modules/notion';

type BlockStylerProps = MenuAndBlockStylerCommonProps& {
  selection:selectionType,
  setSelection:Dispatch<SetStateAction<selectionType|null>>,
  openTemplates: boolean,
  setPopupStyle:Dispatch<React.SetStateAction<React.CSSProperties | undefined>>
}
const BlockStyler=({pages, firstlist, userName, page, addBlock, editBlock, changeBlockToPage, changePageToBlock,deleteBlock,duplicatePage,movePageToPage,popup,setPopup, setCommentBlock,setTargetPageId,selection,setSelection, openTemplates, setPopupStyle}:BlockStylerProps)=>{
  const block =selection.block;
  const bold="bold";
  const initial="initial";
  const italic= "italic";
  const underline="underline";
  const lineThrough="line-through";
  const none="none";
  type fontWeightType =typeof bold|typeof initial;
  type fontStyleType= typeof italic| typeof initial;
  type textDecoType= typeof underline| typeof lineThrough | typeof none; 
  const blockType=(block:Block)=> 
  {switch (block.type) {
    case "bulletList":
      return "Bullted list";
    case "h1":
      return "Heading 1";
    case "h2":
      return "Heading 2";
    case "h3":
      return "Heading 3";
    case "numberList":
      return "Number list";
    case "page":
      return "Page";
    case "text":
      return "Text";
    case "todo":
      return "To-doolist";
    case "todo done":
      return "To-doolist";
    case "toggle":
      return "Toggle list";
    default:
      break;
  }
}
  const mainBlockHtml =document.getElementById(`block_${block.id}`)?.firstElementChild;
  const frameHtml = openTemplates?document.querySelector("#template")?.firstElementChild : document.querySelector('.frame');
  const [blockStylerStyle,setBlockStylerStyle]=useState<CSSProperties|undefined>(undefined);
  const [openLink, setOpenLink]=useState<boolean>(false);
  const [openMenu, setOpenMenu]=useState<boolean>(false);
  const [openColor, setOpenColor]=useState<boolean>(false);
  const changeBlockStylerStyle=()=>{
    if(mainBlockHtml!==null && mainBlockHtml!==undefined && frameHtml!==undefined && frameHtml!==null){
      const blockDomRect= mainBlockHtml.getClientRects()[0];
      const frameDomRect = frameHtml.getClientRects()[0];
      const top = blockDomRect.top - frameDomRect.top;
      setBlockStylerStyle({
        top:`${top}px`,
        left:"45px",
        maxWidth :`${frameDomRect.width -90}px`
      })
    }
  };
  const onClickTypeBtn=()=>{
    setPopup({
      popup:true,
      what:"popupCommand"
    });
    setPopupStyle(blockStylerStyle);
  };
  const onClickCommentBtn=()=>{
    setPopup({
      popup:true,
      what:"popupComment"
    });
    setPopupStyle(blockStylerStyle)
  };
  window.onresize=()=>changeBlockStylerStyle

  useEffect(()=>{
    changeBlockStylerStyle();
  },[mainBlockHtml, frameHtml]);
  return(
    <>
    <div 
      id="blockStyler"
      style={blockStylerStyle}
    >
      <div className='inner'>
        <button 
          className='typeBtn btn'
          onClick={onClickTypeBtn}
        >
          {blockType(block)}
          <IoIosArrowDown className='arrowDown'/>
        </button>
        <button className='linkBtn btn'>
          <ImArrowUpRight2/>
          Link
          <IoIosArrowDown className='arrowDown'/>
        </button>
        <button 
          className='commentBtn btn'
          onClick={onClickCommentBtn}
        >
            <BsChatLeftText/>
            Comment
        </button>
        <div className='styles'>
          <button className='boldBtn btn'>
            B
          </button>
          <button className='italicBtn btn'>
            i
          </button>
          <button className='underlineBtn btn'>
            U
          </button>
          <button className='lineThroughBtn btn'>
            S
          </button>
        </div>
        <button className='colorBtn btn'>
            A
            <IoIosArrowDown className='arrowDown'/>
        </button>
        <button className='menuBtn btn'>
            <BsThreeDots/>
        </button>
      </div>
    </div>
    {openLink &&
      <div className='linkLoader'>

      </div>
    }
      {openColor &&
            <ColorMenu
            page={page}
            block={selection.block}
            editBlock={editBlock}
            selection={selection}
          />
      }
      {openMenu&&
        <Menu
          pages={pages}
          firstlist={firstlist}
          page={page}
          block={selection.block}
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
          setOpenRename= {null}
        />
      }
    </>
  )
};

export default React.memo(BlockStyler)