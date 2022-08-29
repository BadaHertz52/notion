import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BsChatLeftText, BsThreeDots } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import {ImArrowUpRight2} from 'react-icons/im';
import { CSSProperties } from 'styled-components';
import ColorMenu from './ColorMenu';
import CommandBlock from './CommandBlock';
import { selectionType } from './Frame';
import Menu, { MenuProps } from './Menu';
import { Block } from '../modules/notion';

type BlockStylerProps = MenuProps & {
  selection:selectionType,
  setSelection:Dispatch<SetStateAction<selectionType|null>>,
  openTemplates: boolean
}
const BlockStyler=({pages, firstlist, userName, page, addBlock, editBlock, changeBlockToPage, changePageToBlock,deleteBlock,addPage,duplicatePage,movePageToPage,popup,setPopup, setMenuOpen, setOpenRename,setCommentBlock,setTargetPageId,selection,setSelection, openTemplates}:BlockStylerProps)=>{
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
  const mainBlockHtml =document.getElementById(`block_${block.id}`)?.firstElementChild;
  const frameHtml = openTemplates?document.querySelector("#template")?.firstElementChild : document.querySelector('.frame');
  const [blockStylerStyle,setBlockStylerStyle]=useState<CSSProperties|undefined>(undefined);

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
  window.onresize=()=>changeBlockStylerStyle

  useEffect(()=>{
    changeBlockStylerStyle();
  },[mainBlockHtml, frameHtml]);
  return(
    <div 
      id="blockStyler"
      style={blockStylerStyle}
    >
      <div className='inner'>
        <div className='typeBtn'>
            {selection.block.type}
          <button className='blockType btn'>
            <IoIosArrowDown className='arrowDown'/>
          </button>
          <CommandBlock
            page ={page}
            block={selection.block}
            editBlock={editBlock}
            changeBlockToPage={changeBlockToPage}
            changePageToBlock={changePageToBlock}
            setCommand ={null}
            command ={null}
            setPopup ={null}
            setCommandTargetBlock ={null}
          />
        </div>
        <div className='linkBtn'>
          <button className='btn'>
            <ImArrowUpRight2/>
            Link
            <IoIosArrowDown className='arrowDown'/>
          </button>
        </div>
        <div className='commentBtn'>
          <button className='btn'>
            <BsChatLeftText/>
            Comment
          </button>
        </div>
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
        <div className='colorBtn'>
          <button className='btn'>
            A
            <IoIosArrowDown className='arrowDown'/>
          </button>
          <ColorMenu
            page={page}
            block={selection.block}
            editBlock={editBlock}
            selection={selection}
          />
        </div>
        <div className='menuBtn'>
          <button className='btn'> 
            <BsThreeDots/>
          </button>
          <Menu
            pages={pages}
            firstlist={firstlist}
            page={page}
            block={selection.block}
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
            popup={popup}
            setPopup={setPopup}
            setCommentBlock={setCommentBlock}
            setTargetPageId={setTargetPageId}
            setOpenRename= {setOpenRename}
          />
        </div>
      </div>
    </div>
  )
};

export default React.memo(BlockStyler)