import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
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
 *  select 하거나, 이를 취소한 경우, 변경된 블럭의 contents를 가져오는  함수로 만약 BlockStyler로 스타일을 변경하다면, 스타일 변경 후에 해당 함수를 사용해야 한다.
 * @param targetBlock  
 * @returns 
 */
export const getContent=(targetBlock:Block):Block=>{
  const contentEditableHtml =document.getElementById(`${targetBlock.id}_contents`)?.firstElementChild;
  let newBlock =targetBlock;
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
    ...targetBlock,
    contents:newBlockContents,
    editTime:JSON.stringify(Date.now())
  };
    
};
return newBlock
};
type BlockStylerProps = MenuAndBlockStylerCommonProps& {
  pagesId:string[],
  recentPagesId:string[]|null,
  selection:selectionType,
  setSelection:Dispatch<SetStateAction<selectionType|null>>,
  setPopupStyle:Dispatch<React.SetStateAction<React.CSSProperties | undefined>>,
  setCommand: React.Dispatch<React.SetStateAction<Command>>,
  command: Command
}
const BlockStyler=({pages, pagesId, firstlist, userName, page,recentPagesId, block, addBlock, editBlock, changeBlockToPage, changePageToBlock,deleteBlock,duplicatePage,movePageToPage, editPage,popup,setPopup, setCommentBlock,setTargetPageId,selection,setSelection ,setPopupStyle,command ,setCommand, frameHtml}:BlockStylerProps)=>{
  const index =page.blocksId?.indexOf(block.id) as number;
  const blocks =page.blocks as Block[];
  const targetBlock =blocks[index];
  //select-> selection의 스타일 변경-> 변경된 내용을 selection, block에 반영 의 순서로 이루어짐

  /**
   * selection의 value의 변화가 select 메서드에 의해 변경된 것인지, 스타일 변경에 따른 것인지 구별하기 위해 사용,
  이 true이면 selection의 스타일 변경에 의한 것이고, false라면 select 메서드에 의한 것으로 판별하다. 
   */
  const changeStart =useRef<boolean>(false);
  /**
   * 스타일의 변경에 따라 selection 에 변경이 있으면 true, 변경 사항이 없으면 false
   */
  const change =useRef<boolean>(false);
  /**
   * select 된 내용의 스타일이 변경되기 전의 targetBlock 
   */
  const originBlock =useRef<Block|null>(null);
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
    const blockType = targetBlock.type ;
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
  /**
   * BlockStyler의 타켓인 block에 대한 내용을 담고 있는 element중 mainBlock element의 domRect을 반환하는 함수 
   * @returns DOMRect | undefined
   */
  const getMainBlockDomRect=():DOMRect | undefined=>{
    const blockHtml = frameHtml?.querySelector(`#block_${targetBlock.id}`);
    const mainBlockHtml= targetBlock.type.includes("List")? 
      blockHtml?.parentElement?.parentElement
      :blockHtml?.querySelector('.mainBlock');
    const mainBlockDomRect = mainBlockHtml?.getClientRects()[0];
      return mainBlockDomRect
  }
  const changeBlockStylerStyle=()=>{
    const mainBlockDomRect =getMainBlockDomRect();
    if(frameHtml!==undefined && frameHtml!==null && mainBlockDomRect!==undefined){
      const pageContentInner =frameHtml.querySelector(".pageContent_inner") as Element;
      const frameDomRect = frameHtml.getClientRects()[0]; 
      const top = mainBlockDomRect.top - frameDomRect.top;
      const left =mainBlockDomRect.left -frameDomRect.left - pageContentInner.clientLeft;
      if(left + 450 > frameDomRect.width){
        setBlockStylerStyle({
          top:`${top}px`,
          left:`${(frameDomRect.width - 450)/2}px`
        })
      }else{
        setBlockStylerStyle({
          top:`${top}px`,
          left:`${left}px`
        })
      }
      
    }
  };
  const onClickTypeBtn=()=>{
    setCommand({
      boolean:true,
      command:null,
      targetBlock:targetBlock
    })
  };
  const changeCommentStyle =()=>{
    const mainBlockDomRect =getMainBlockDomRect();
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
  const closeCommandBlock=(event:globalThis.MouseEvent)=>{
    const commandBlock = document.getElementById("block_commandBlock");
    const commandBlockDomRect =commandBlock?.getClientRects()[0];
    if(commandBlockDomRect!==undefined){
      const isInCommandBlock = detectRange(event, commandBlockDomRect);
      !isInCommandBlock && setCommand({
        boolean:false,
        command:null,
        targetBlock:null
      })
    };
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
      const editedBlock = getContent(targetBlock);
      editBlock(page.id, editedBlock);
      setSelection({
        block:editedBlock
      });
    }
  };
    /**
   * blockStyler를 통해 연 popupMenu를 닫는 함수  
   * @param event globalThis.MouseEvent
   */
    const closePopupInBlockStyler =(event:globalThis.MouseEvent)=>{
      openMenu && closeMenu(event);
      openColor && closeColorMenu(event);
      command.boolean && closeCommandBlock(event);
    };
  /**
   * 화면상에서 클릭한 곳이 blockStyler외의 곳일 경우, blockStyler 에 의한 변경사항의 여부에 따라 변경 사항이 있으면 블록의 contents 중 선택된 영역을 가리키는 selected 클래스를 제거하고, 변경이 없는 경우 원래의 블록으로 되돌린 후, selection 값은 null로 변경하여 BlockStyler component의 실행을 종료하는 함수   
   * @param event globalThis.MouseEvent
   */
  const closeBlockStyler=(event:globalThis.MouseEvent)=>{
    const blockStylerDomRect =blockStyler?.getClientRects()[0];
    if(blockStylerDomRect!==undefined){
      const isInBlockStyler = detectRange(event, blockStylerDomRect);
      if(!isInBlockStyler){
        if(!change.current && originBlock.current!==null){
          // 변경된 내용이 없는 경우 
          editBlock(page.id, originBlock.current);
        }else{
          // 변경된 내용이 있고, selected 만 제거하면 되는 경우 
          const selecteds =document.querySelectorAll(".selected")  as NodeListOf<HTMLElement>;
          if(selecteds[0] !== undefined){
            selecteds.forEach((selectedHtml:HTMLElement)=>{
              if(selectedHtml.classList.length >1){
                selectedHtml?.classList.remove("selected");
              }else{
                selectedHtml.outerHTML =selectedHtml.innerHTML;
              }
            })

          };
          const editedBlock = getContent(block);
          editBlock(page.id, editedBlock);          
        }
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
      changeStart.current= false;
    }
  },[selection]);

  inner?.addEventListener("click",(event)=>{
    closePopupInBlockStyler(event);
  });
  inner?.addEventListener("dblclick", (event)=>{
    if(openMenu || openColor ||popup.popup || command.boolean){
      closePopupInBlockStyler(event);
    }; 
      closeBlockStyler(event);
  })
  useEffect(()=>{
    changeBlockStylerStyle();
  },[]);
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
          onMouseDown={changeCommentStyle}
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
          frameHtml={frameHtml}
          style={menuStyle}
        />
      }
    </>
  )
};

export default React.memo(BlockStyler)