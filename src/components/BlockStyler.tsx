import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { BsChatLeftText, BsThreeDots } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import {ImArrowUpRight2} from 'react-icons/im';
import { CSSProperties } from 'styled-components';
import ColorMenu from './ColorMenu';
import { selectionType } from './Frame';
import Menu, { MenuAndBlockStylerCommonProps } from './Menu';
import { Block} from '../modules/notion';
import { detectRange } from './BlockFn';

type BlockStylerProps = MenuAndBlockStylerCommonProps& {
  selection:selectionType,
  setSelection:Dispatch<SetStateAction<selectionType|null>>,
  openTemplates: boolean,
  setPopupStyle:Dispatch<React.SetStateAction<React.CSSProperties | undefined>>,
  setCommandTargetBlock: React.Dispatch<React.SetStateAction<Block | null>>
}
const BlockStyler=({pages, firstlist, userName, page, block, addBlock, editBlock, changeBlockToPage, changePageToBlock,deleteBlock,duplicatePage,movePageToPage,popup,setPopup, setCommentBlock,setTargetPageId,selection,setSelection, openTemplates, setPopupStyle, setCommandTargetBlock}:BlockStylerProps)=>{
  const changeStart =useRef<boolean>(false);
  const change =useRef<boolean>(false);
  const originBlock =useRef<Block|null>(null);
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
      return "To-do list";
    case "todo done":
      return "To-do list";
    case "toggle":
      return "Toggle list";
    default:
      break;
  }
} 
  const inner =document.getElementById("inner");
  const mainBlockHtml =document.getElementById(`block_${block.id}`)?.firstElementChild;
  const frameHtml = openTemplates?document.querySelector("#template")?.firstElementChild : document.querySelector('.frame');
  const pageContent = frameHtml?.querySelector(".pageContent_inner");
  const blockStyler =document.getElementById("blockStyler");
  const [blockStylerStyle,setBlockStylerStyle]=useState<CSSProperties|undefined>(undefined);
  const [menuStyle,setMenuStyle]=useState<CSSProperties|undefined>(undefined);
  const [openLink, setOpenLink]=useState<boolean>(false);
  const [openMenu, setOpenMenu]=useState<boolean>(false);
  const [openColor, setOpenColor]=useState<boolean>(false);
  const color ="color";
  const menu ="menu";
  type menuType =typeof color| typeof menu ;
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
  const changePopupStyle=()=>{
    if(blockStyler!==null && frameHtml !==null && frameHtml!==undefined) {
      const blockStylerDomRect= blockStyler.getClientRects()[0];
      const frameDomRect= frameHtml.getClientRects()[0];
      const popupStyle:CSSProperties ={
        top: `${blockStylerDomRect.top - frameDomRect.top}px`,
        left :`${blockStylerDomRect.left- frameDomRect.left}px`
      }
      setPopupStyle(popupStyle);
      console.log("popup", popupStyle);
    }

  };
  const onClickTypeBtn=()=>{
    setPopup({
      popup:true,
      what:"popupCommand"
    });
    block !=null&&
    setCommandTargetBlock(block);
  };
  const changeCommentStyle =()=>{
    if(mainBlockHtml!==null && mainBlockHtml!==undefined && 
      frameHtml!==null && frameHtml !==undefined ){
      const blockDomRect= mainBlockHtml.getClientRects()[0];
      const pageContentDomRect= pageContent?.getClientRects()[0];
      const frameDomRect =frameHtml.getClientRects()[0];
      pageContentDomRect!==undefined &&
      setPopupStyle({
        top:`${blockDomRect.bottom + 50 }px`,
        left: `${pageContentDomRect.left -frameDomRect.left}px`,
      });
    };
  };
  const onClickCommentBtn=()=>{
    setPopup({
      popup:true,
      what:"popupComment"
    });
    setSelection(null);
  };

  const changeMenuStyle=(param:menuType)=>{
    if(blockStyler!==null && frameHtml !== null && frameHtml!==undefined){
      const blockStylerDomRect =blockStyler.getClientRects()[0];
      const frameHtmlDomRect= frameHtml.getClientRects()[0];
      const top =` ${blockStylerDomRect.top - 50 - frameHtmlDomRect.top}px`
      if(param === menu){
        const style :CSSProperties ={
          top: top,
          left:`${blockStylerDomRect.right - frameHtmlDomRect.left- 240}px`  
        };
        setMenuStyle(style);
      }else{
        const colorBtnHtml =blockStyler.getElementsByClassName("colorBtn")[0];
        const colorBtnHtmlDomRect= colorBtnHtml.getClientRects()[0];
        const style:CSSProperties ={
          top :`${colorBtnHtmlDomRect.bottom- frameHtmlDomRect.top + colorBtnHtmlDomRect.height + 16}px`,
          left: `${blockStylerDomRect.right-frameHtmlDomRect.left -200 }px`
        };
        setMenuStyle(style);
      }

    }
  };
  const onClickColorBtn=()=>{
    changeMenuStyle(color);
    setOpenColor(true);
  };
  const onClickMenuBtn=()=>{
    changeMenuStyle(menu);
    setOpenMenu(true);
  };
  
  window.onresize=()=>{
    changeBlockStylerStyle();
    openMenu && changeMenuStyle(menu);
    openColor && changeMenuStyle(color);
    popup.popup && changePopupStyle();
  };
  const closeMenu =(event:globalThis.MouseEvent)=>{ 
      const mainMenu =document.getElementById("mainMenu");
      const sideMenu =document.getElementById("sideMenu");
      const mainMenuDomRect =mainMenu?.getClientRects()[0];
      const sideMenuDomRect =sideMenu?.getClientRects()[0];
      const isInMainMenu =detectRange(event, mainMenuDomRect );
      const isInSideMenu =detectRange(event, sideMenuDomRect);
      if(!isInMainMenu && ! isInSideMenu){
        setOpenMenu(false)
        setMenuStyle(undefined);
      };
  };
  const closeColorMenu=(event:globalThis.MouseEvent)=>{
    const colorMenuHtml = document.getElementById("blockStylerColor");
    const colorMenuDomRect = colorMenuHtml?.getClientRects()[0];
    if(colorMenuDomRect!==undefined){
      const isInColorMenu =detectRange(event, colorMenuDomRect);
      if(!isInColorMenu){
        setOpenColor(false);
      }
    }
  };
  const closeBlockStyler=(event:globalThis.MouseEvent)=>{
    const blockStylerDomRect =blockStyler?.getClientRects()[0];
    if(blockStylerDomRect!==undefined){
      const isInBlockStyler = detectRange(event, blockStylerDomRect);
      if(!isInBlockStyler){
        if(!change.current && originBlock.current!==null){
          editBlock(page.id, originBlock.current);
        };
        setSelection(null);
      }
    }
  };
  useEffect(()=>{
    if(selection !==null){
        if(changeStart.current){
          change.current =true
        }else{
          originBlock.current = selection.block;
          changeStart.current = true;
        };
    }else{
      changeStart.current= false
    }
  },[selection])
  inner?.addEventListener("click",(event)=>{
      openMenu && closeMenu(event);
      openColor && closeColorMenu(event);
      
      console.log(openMenu, openColor);
  });
  inner?.addEventListener("dblclick", (event)=>{
    !openMenu && !openColor && !popup.popup &&
      closeBlockStyler(event);
  })
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
          onMouseDown={changePopupStyle}
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
          onMouseDown={changeCommentStyle}
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
        <button 
          className='colorBtn btn'
          onClick={onClickColorBtn}
        >
            A
            <IoIosArrowDown className='arrowDown'/>
        </button>
        <button 
          className='menuBtn btn'
          onClick={onClickMenuBtn}
        >
            <BsThreeDots/>
        </button>
      </div>
    </div>
    {openLink &&
      <div className='linkLoader'>

      </div>
    }
      {openColor &&
      <div 
        id="blockStylerColor"
        style={menuStyle}
      >
          <ColorMenu
            page={page}
            block={selection.block}
            editBlock={editBlock}
            selection={selection}
            setSelection ={setSelection}
          />
      </div>

      }
      {openMenu&&
      <div 
        id="blockStylerMenu"
        style={menuStyle}
      >
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
      </div>
      }
    </>
  )
};

export default React.memo(BlockStyler)