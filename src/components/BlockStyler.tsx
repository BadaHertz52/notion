import React, { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from 'react';
import { BsChatLeftText, BsThreeDots } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import {ImArrowUpRight2} from 'react-icons/im';
import { CSSProperties } from 'styled-components';
import ColorMenu from './ColorMenu';
import { Command, selectionType } from './Frame';
import Menu, { MenuAndBlockStylerCommonProps } from './Menu';
import { Block} from '../modules/notion';
import { detectRange } from './BlockFn';
import LinkLoader from './LinkLoader';
  /**
   * BlockStyler의 타켓인 block에 대한 내용을 담고 있는 element중 mainBlock element의 domRect을 반환하는 함수 
   * @returns DOMRect | undefined
   */
  export const getMainBlockDomRect=(frameHtml:HTMLDivElement | null , block:Block):DOMRect | undefined=>{
    const blockHtml = frameHtml?.querySelector(`#block_${block.id}`);
    const mainBlockHtml= block.type.includes("List")? 
      blockHtml?.parentElement?.parentElement
      :blockHtml?.querySelector('.mainBlock');
    const mainBlockDomRect = mainBlockHtml?.getClientRects()[0];
      return mainBlockDomRect
  }
  export const changeStylerStyle=(frameHtml:HTMLDivElement | null , block:Block , setStyle:Dispatch<SetStateAction<CSSProperties|undefined>>)=>{
    const mainBlockDomRect =getMainBlockDomRect(frameHtml, block);
    if(frameHtml!==null && mainBlockDomRect!==undefined){
      const pageContentInner =frameHtml.querySelector(".pageContent_inner") as Element;
      const frameDomRect = frameHtml.getClientRects()[0]; 
      const top = mainBlockDomRect.top - frameDomRect.top;
      const left =mainBlockDomRect.left -frameDomRect.left - pageContentInner.clientLeft;
      if(left + 450 > frameDomRect.width){
        setStyle({
          top:`${top}px`,
          left:`${(frameDomRect.width - 450)/2}px`
        })
      }else{
        setStyle({
          top:`${top}px`,
          left:`${left}px`
        })
      }
      
    }
  };
/**
 *  select 하거나, 이를 취소한 경우, 변경된 블럭의 contents를 가져오는  함수로 만약 BlockStyler로 스타일을 변경하다면, 스타일 변경 후에 해당 함수를 사용해야 한다.
 * @param block  
 * @returns 
 */
export const getContent=(block:Block):Block=>{
  const contentEditableHtml =document.getElementById(`${block.id}_contents`)?.firstElementChild;
  let newBlock =block;
if(contentEditableHtml!==null&& contentEditableHtml!==undefined){
  const children = contentEditableHtml.childNodes;
  let contentsArry:string[]=[];
  children.forEach((c:Node)=>{
    if(c.nodeType ===3){
      c.nodeValue !==null&&
      contentsArry.push(c.nodeValue);
    }
    //span
    if(c.nodeType===1){
      const element =c as Element; 
      contentsArry.push(element.outerHTML);
    }
  });
  const newBlockContents =contentsArry.join('');
  newBlock ={
    ...block,
    contents:newBlockContents,
    editTime:JSON.stringify(Date.now())
  };
    
};
return newBlock
};
export type BlockStylerProps = MenuAndBlockStylerCommonProps& {
  pagesId:string[],
  recentPagesId:string[]|null,
  selection:selectionType,
  setSelection:Dispatch<SetStateAction<selectionType|null>>,
  setPopupStyle:Dispatch<React.SetStateAction<React.CSSProperties | undefined>>,
  setCommand: React.Dispatch<React.SetStateAction<Command>>,
  command: Command
}
const BlockStyler=({pages, pagesId, firstlist, userName, page,recentPagesId, block, addBlock, editBlock, changeBlockToPage, changePageToBlock,deleteBlock,duplicatePage,movePageToPage, editPage,popup,setPopup, setCommentBlock,setTargetPageId,selection,setSelection ,setPopupStyle,command ,setCommand, frameHtml}:BlockStylerProps)=>{
  const bold="bold";
  const initial="initial";
  const italic= "italic";
  const underline="underline";
  const lineThrough="lineThrough";
  type fontWeightType =typeof bold|typeof initial;
  type fontStyleType= typeof italic| typeof initial;
  type textDecoType= typeof underline| typeof lineThrough ; 
  const getBlockType=()=> 
  {  
    const blockType = block.type ;
    switch (blockType) {
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
  const closeOtherBtns=(event:MouseEvent<HTMLDivElement>)=>{
    const target =event.target as HTMLElement|null; 
    if(target !==null){
      const clickTypeBtn = target.closest(".typeBtn");
      const clickLinkBtn =target.closest(".linkBtn");
      const clickMenuBtn =target.closest(".menuBtn");
      const clickColorBtn =target.closest(".colorBtn");
      !clickTypeBtn && setCommand({
        boolean:false,
        command:null,
        targetBlock:null
      });

      !clickLinkBtn && setOpenLink(false);
      !clickMenuBtn && setOpenMenu(false);
      !clickColorBtn && setOpenColor(false);
    }
  };

  const onClickTypeBtn=()=>{
    command.boolean?
    setCommand({
      boolean:false,
      command:null,
      targetBlock:null
    })
    :
    setCommand({
      boolean:true,
      command:null,
      targetBlock:block
    })
  };
  const changeCommentStyle =()=>{
    const mainBlockDomRect =getMainBlockDomRect(frameHtml, block);
    if(mainBlockDomRect!==undefined && 
      frameHtml!==null && frameHtml !==undefined ){
      const pageContentDomRect= pageContent?.getClientRects()[0];
      const frameDomRect =frameHtml.getClientRects()[0];
      const top = mainBlockDomRect.bottom+ 8 ;
      const innerHeight =window.innerHeight;
      const remainHeight = innerHeight -(top + 50);
      
      if(pageContentDomRect!==undefined ){
        const left =pageContentDomRect.left -frameDomRect.left; 
        const bottom = (innerHeight- mainBlockDomRect.top) + 8 ;
        remainHeight >10 ?
        setPopupStyle({
          top:`${top}px`,
          left: `${left}px`,
        })
        :
        setPopupStyle({
          bottom:`${bottom}px`,
          left: `${left}px`,
        });
      }

    };
  };
  const onClickCommentBtn=()=>{
    changeCommentStyle();
    setPopup({
      popup:true,
      what:"popupComment"
    });
    setCommentBlock(block);
    removeSelected();
  };

  const changeMenuStyle=(param:menuType)=>{
    if(blockStyler!==null && frameHtml !== null && frameHtml!==undefined){
      const blockStylerDomRect =blockStyler.getClientRects()[0];
      const frameHtmlDomRect= frameHtml.getClientRects()[0];
      const top = blockStylerDomRect.bottom + 5
      const left = param ===menu? 
                  (blockStylerDomRect.right - frameHtmlDomRect.left- 240 ) 
                  : 
                  (blockStylerDomRect.right-frameHtmlDomRect.left -200 );
      const bottom = window.innerHeight - top +blockStylerDomRect.height ;
      const remainHeight = bottom - 50; 
      const style :CSSProperties =remainHeight > 300 ?
      { top: `${top}px`,
      left:`${left}px`,
      maxHeight: `${remainHeight}px`,
      overflowY:"scroll"

      }
      : {
        bottom: `${bottom}px`,
        left:`${left}px`,
        maxHeight: `${top - 50}px`,
        overflowY:"scroll"
      };
      if(param === menu){
        const STYLE :CSSProperties ={
          ...style,
          overflowY:initial
        };
        setMenuStyle(STYLE);
      }else{
        setMenuStyle(style);
      }
    }
  };
  const onClickColorBtn=()=>{
    if(openColor){
      setOpenColor(false)
    }else{
      changeMenuStyle(color);
      setOpenColor(true);
    }
  };
  const onClickMenuBtn=()=>{
    if(openMenu){
      setOpenMenu(false);
    }else{
      changeMenuStyle(menu);
      setOpenMenu(true);
    }
  };
  
  window.onresize=()=>{
    changeStylerStyle(frameHtml,block,setBlockStylerStyle);
    openMenu && changeMenuStyle(menu);
    openColor && changeMenuStyle(color);
  };

    /**
   *  textDeco 스타일을 지정할 경우, 기존에 textDeco가 지정된 element의 클래스를 변경하거나, outerHtml의 값을 변경하는 함수 
   * @param deco  삭제하고자 하는 , 기존에 지정된 textDeco 스타일
   * * @param selectedHtml : 선택된 node 
   */
  const removeOtherTextDeco=(deco:textDecoType , selectedHtml:HTMLElement)=>{
    const decoSpan = selectedHtml.querySelectorAll(`.${deco}`);
    if(decoSpan[0]!==undefined){
      decoSpan.forEach((e:Element)=>{
        if(e.classList.length===1){
          e.outerHTML = e.innerHTML
        }else{
          e.classList.remove(deco)
        }
      })
    }
  };
/**
 * 클릭한 버튼에 따라, 선택된 내용의 fontWeight, fontstyle , textDeco를 변경하는 함수 
 * @param btnName 클릭한 버튼의 이름 
 */
  const onClickFontStyleBtn=(btnName:fontWeightType|fontStyleType|textDecoType)=>{
    const selecteds = document.querySelectorAll(".selected") as NodeListOf<HTMLElement>;
    if(selecteds[0]!==undefined){

      selecteds.forEach((selectedHtml:HTMLElement)=>{
        const selectedSpan =selectedHtml.querySelectorAll(btnName);
        if(selectedSpan[0]!==undefined){
          //btnName과 같은 스타일이 지정된 span 이 있으므로 selectedHtml의 class를 변경하기 전에 같은 스타일이 있는 span을 정리해줌 
          selectedSpan.forEach((span:Element)=> {
            if(span.classList.length === 1){
              // span의 class 가 btnName인 경우
              span.outerHTML = span.innerHTML;
            }else{
              span.classList.remove(btnName);
            } 
          });
        };

        if(btnName==="lineThrough"){
          removeOtherTextDeco("underline" ,selectedHtml);
        };
        if(btnName==="underline"){
          removeOtherTextDeco("lineThrough" ,selectedHtml)
        };
        //class 변경 : 버튼을 눌러서 새로 스타일을 지정하거나, 지정했던 스타일을 없애는 기능
        if(selectedHtml.className.includes(btnName)){
          selectedHtml.classList.remove(btnName);
        }else{
          selectedHtml.classList.add(btnName);
        };
      });
      const editedBlock = getContent(block);
      editBlock(page.id, editedBlock);
      setSelection({
        block:editedBlock,
        change:true
      });
    }
  };
    /**
     * block의 content에서 selected class를 삭제하는 함수 
     */
  function removeSelected(){
      // 변경된 내용이 있고, selected 만 제거하면 되는 경우
      const blockContentHtml = frameHtml?.querySelector(`#${block.id}_contents`); 
      const selecteds =blockContentHtml?.querySelectorAll(".selected") ;

      if(selecteds !==undefined && selecteds[0] !== undefined){
        selecteds.forEach((selectedHtml:Element)=>{
          if(selectedHtml.classList.length >1){
            selectedHtml?.classList.remove("selected");
          }else{
            selectedHtml.outerHTML =selectedHtml.innerHTML;
          }
        })    
    }else{
      const spanElements =blockContentHtml?.querySelectorAll("span");
      if(spanElements!==undefined){
        spanElements.forEach((element:HTMLSpanElement)=>{
          if(element.className===""){
            element.outerHTML =element.innerHTML;
          };
        });
      }
      
    }
    const editedBlock = getContent(block);
    editBlock(page.id, editedBlock);
    setSelection(null);
  };

  inner?.addEventListener("click", (event)=>{
    closeBlockStyler(event);
  });
  const closeCommandBlock=(event:globalThis.MouseEvent, commandBlockHtml:HTMLElement)=>{
    const commandBlockDomRect =commandBlockHtml.getClientRects()[0];
    const isIn =detectRange(event, commandBlockDomRect);
    !isIn && setCommand({
      boolean:false,
      command:null,
      targetBlock:null
    })
  };
  /**
   * 유저가 colorMenuHtml 밖의 영역을 클릭 할 경우 openColor의 값을 false로 변경해 colorMenu 창을 닫는 함수 
   * @param event globalThis.MouseEvent
   * @param colorMenuHtml 
   */
  const closeColorMenu=(event:globalThis.MouseEvent, colorMenuHtml:HTMLElement)=>{
    const colorMenuDomRect =colorMenuHtml.getClientRects()[0];
    const isIn =detectRange(event, colorMenuDomRect);
    !isIn && setOpenColor(false);
  };
    /**
   * 유저가 linkLoaderHtml 밖의 영역을 클릭 할 경우 openLinkLoader의 값을 false로 변경해 colorMenu 창을 닫는 함수 
   * @param event globalThis.MouseEvent
   * @param linkLoaderHtml 
   */
  const closeLinkLoader=(event:globalThis.MouseEvent, linkLoaderHtml:HTMLElement)=>{
    const linkLoaderDomRect =linkLoaderHtml.getClientRects()[0];
    const isIn =detectRange(event, linkLoaderDomRect);
    !isIn && setOpenLink(false);
  };
    /**
   * 유저가 mainMenu 나 sideMenu 밖의 영역을 클릭 할 경우 openMenu 의 값을 false로 변경해 Menu 창을 닫는 함수 
   * @param event globalThis.MouseEvent
   * @param colorMenuHtml 
   */
  const closeMenu=(event:globalThis.MouseEvent, mainMenuHtml:HTMLElement)=>{
    const mainMenuDomRect =mainMenuHtml.getClientRects()[0];
    const sideMenuHtml =document.getElementById("sideMenu");
    const sideMenuDomRect =sideMenuHtml?.getClientRects()[0];
    const isInMainMenu =detectRange(event, mainMenuDomRect);
    const isInSideMenu =detectRange(event, sideMenuDomRect);
    !isInMainMenu && !isInSideMenu &&setOpenMenu(false);
  };
    /**
   * 화면상에서 클릭한 곳이 blockStyler외의 곳일 경우, blockStyler 에 의한 변경사항의 여부에 따라 변경 사항이 있으면 블록의 contents 중 선택된 영역을 가리키는 selected 클래스를 제거하고, 변경이 없는 경우 원래의 블록으로 되돌린 후, selection 값은 null로 변경하여 BlockStyler component의 실행을 종료하는 함수   
   * @param event globalThis.MouseEvent
   */
    function closeBlockStyler(event:globalThis.MouseEvent){
      const blockStylerDomRect =blockStyler?.getClientRects()[0];
      if(blockStylerDomRect!==undefined){
        const isInBlockStyler = detectRange(event, blockStylerDomRect);
        if(!isInBlockStyler){
          const colorMenuHtml = document.getElementById("blockStylerColor");
          const commandBlockHtml = document.getElementById("block_commandBlock");
          const mainMenu =document.getElementById("mainMenu");
          const linkLoaderHtml = document.getElementById("linkLoader");
          if(colorMenuHtml==null && commandBlockHtml===null && mainMenu===null && linkLoaderHtml ==null){
            removeSelected();
          }else{
            if(colorMenuHtml!==null){
              closeColorMenu(event, colorMenuHtml);
            };
            if(commandBlockHtml!==null){
              closeCommandBlock(event,commandBlockHtml);
            };
            if(mainMenu!==null){
              closeMenu(event, mainMenu);
            };
            if(linkLoaderHtml!==null){
              closeLinkLoader(event, linkLoaderHtml);
            }
          }
      }
    }
  };

  useEffect(()=>{
    changeStylerStyle(frameHtml, block, setBlockStylerStyle);
    if(selection.change){
      openColor && setOpenColor(false);
      openLink && setOpenLink(false);
      openMenu && setOpenMenu(false);
      command.boolean && setCommand({
        command:null,
        targetBlock:null,
        boolean:false
      })
    };
  },[selection]);
  return(
    <>
    <div 
      id="blockStyler"
      style={blockStylerStyle}
      onClick={(event)=>closeOtherBtns(event)}
    >
      <div className='inner'>

        <button 
          className='typeBtn btn'
          onClick={onClickTypeBtn}
        >
          {getBlockType()}
          <IoIosArrowDown className='arrowDown'/>
        </button>
        <button 
          className='linkBtn btn'
          onClick={()=>setOpenLink(!openLink)}
        >
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
          <button 
            className='boldBtn btn'
            onClick={()=>onClickFontStyleBtn(bold)}
          >
            B
          </button>
          <button 
          className='italicBtn btn'
          onClick={()=>onClickFontStyleBtn(italic)}
          >
            i
          </button>
          <button 
            className='underlineBtn btn'
            onClick={()=>onClickFontStyleBtn(underline)}
          >
            U
          </button>
          <button 
            className='lineThroughBtn btn'
            onClick={()=>onClickFontStyleBtn(lineThrough)}
          >
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
    <div className="sideMenu">
      {openLink &&
        <LinkLoader
          recentPagesId={recentPagesId}
          pages={pages}
          pagesId={pagesId}
          page={page}
          block={selection.block}
          editBlock={editBlock}
          setOpenLink={setOpenLink}
          blockStylerStyle={blockStylerStyle}
          setSelection={setSelection}
          />
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
            editPage={editPage}
            duplicatePage={duplicatePage}
            movePageToPage={movePageToPage}
            popup={popup}
            setPopup={setPopup}
            setCommentBlock={setCommentBlock}
            setTargetPageId={setTargetPageId}
            setOpenRename= {null}
            setSelection={setSelection}
            frameHtml={frameHtml}
            style={menuStyle}
          />
        }
    </div>
    </>
  )
};

export default React.memo(BlockStyler)