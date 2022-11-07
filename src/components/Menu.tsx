import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState, useRef} from 'react';
import { Block,listItem, Page } from '../modules/notion';
import CommandBlock from './CommandBlock';
import { CSSProperties } from 'styled-components';
import ColorMenu from './ColorMenu';
import { HiOutlineDuplicate, HiOutlinePencilAlt } from 'react-icons/hi';
import PageMenu from './PageMenu';
import { popupComment, popupMoveToPage, PopupType } from '../containers/EditorContainer';
import Time from './Time';

//icon
import {BiCommentDetail} from 'react-icons/bi';
import { BsArrowClockwise } from 'react-icons/bs';
import {MdOutlineRestorePage} from 'react-icons/md';
import {TiArrowSortedDown} from 'react-icons/ti';
import {IoArrowRedoOutline} from 'react-icons/io5';
import {RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineFormatPainter } from 'react-icons/ai';
import { setTemplateItem } from './BlockComponent';
import { selectionType } from './Frame';
export type MenuAndBlockStylerCommonProps={
  pages:Page[],
  firstlist:listItem[],
  page:Page,
  block:Block,
  userName: string,
  addBlock:(pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  editBlock : (pageId: string, block: Block) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,
  changePageToBlock:(currentPageId: string, block: Block) => void,
  deleteBlock :(pageId: string, block: Block ,isInMenu:boolean) => void,
  editPage: (pageId: string, newPage: Page) => void,
  duplicatePage: (targetPageId: string) => void,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  setPopup :Dispatch<SetStateAction<PopupType>> ,
  popup:PopupType,
  setCommentBlock: React.Dispatch<React.SetStateAction<Block | null>>,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  frameHtml: HTMLDivElement | null,
  
}

type MenuProps
=MenuAndBlockStylerCommonProps& {
  setOpenMenu : Dispatch<SetStateAction<boolean>>,
  setOpenRename:Dispatch<SetStateAction<boolean>>|null,
  setSelection: Dispatch<SetStateAction<selectionType|null>>|null,
  style:CSSProperties|undefined
};

const Menu=({pages,firstlist, page, block, userName, setOpenMenu,addBlock,changeBlockToPage,changePageToBlock ,editBlock, deleteBlock ,duplicatePage,movePageToPage,editPage ,setPopup ,popup ,setCommentBlock ,setTargetPageId ,setOpenRename ,frameHtml,setSelection, style }:MenuProps)=>{
  const templateHtml= document.getElementById("template");
  const blockFnElement = templateHtml !==null? templateHtml.querySelector(".blockFn") as HTMLElement|null : document.querySelector(".blockFn") as HTMLElement|null ;
  const menuRef =useRef<HTMLDivElement>(null);
  const [editBtns, setEditBtns]= useState<Element[]|null>(null);
  const [turnInto, setTurnInto]= useState<boolean>(false);
  const [color, setColor]= useState<boolean>(false);
  const [turnInToPage ,setTurnIntoPage] = useState<boolean>(false);
  const blockStylerHtml = document.getElementById("blockStyler");
  const [menuStyle , setMenuStyle]= useState<CSSProperties|undefined>(style ===undefined? changeMenuStyle():style);
  const [sideMenuStyle, setSideMenuStyle]=useState<CSSProperties|undefined>(undefined);
  function changeMenuStyle (){
    const menu = document.querySelector(".menu");
    const menuHeight =menu? menu.clientHeight: 400;
    const innerWidth =window.innerWidth;
    const frameDomRect= frameHtml?.getClientRects()[0];
    let style:CSSProperties ={};
      if(blockFnElement!==null && frameDomRect!==undefined){
        const blockFnTop = blockFnElement.getClientRects()[0].top as number;
        const overHeight = ( blockFnTop + menuHeight ) >= frameDomRect.height;
        const bottom =(blockFnElement.offsetHeight) *0.5 ;
        const top =(blockFnElement.offsetHeight)  
        style =
        overHeight? {
          bottom: `${bottom}px`,
          left: innerWidth >767 ?'2rem' : '1rem',
        } :
        {
          top:  `${top}px`,
          left: innerWidth >767 ?'2rem' : '1rem',
        };

      };
    return style
  };
  function changeSideMenuStyle(){
    const mainMenu= document.getElementById("mainMenu");
    const innerWidth= window.innerWidth;
    const innerHeight =window.innerHeight;
    if(mainMenu !==null && menuRef.current!==null){
      const menuTop =menuRef.current.getClientRects()[0].top;
      const maxHeight = innerHeight - menuTop -100;
      const left =(mainMenu?.clientWidth)* 0.7;
      const style :CSSProperties= {
        top: innerWidth >767? '-10px' :
        "10px",
        left: innerWidth> 767? left : `${mainMenu.clientWidth * (innerWidth >=375 ? 0.5: 0.3)}px`,
        maxHeight:`${maxHeight}px`,
      };
      setSideMenuStyle(style);
    }
  };
  window.onresize =()=>{
    if(blockStylerHtml ===null){
      const style =changeMenuStyle();
      setMenuStyle(style);
    };
    changeSideMenuStyle();
  };
  useEffect(()=>{
    if(turnInToPage|| turnInto||color){
      changeSideMenuStyle();
    }
  },[turnInToPage, turnInto, color]);

  const popupStyle = blockFnElement?.getAttribute("style");

  const recoveryMenuState=()=>{
    turnInto &&setTurnInto(false);
    turnInToPage && setTurnIntoPage(false);
    color && setColor(false);
    popup.popup && setPopup({
      popup:false,
      what: null
    })
  };
  const showTurnInto =()=>{
    setTurnInto(true);
    setColor(false);
    setTurnIntoPage(false);
  };
  const showColorMenu =()=>{
    setColor(true);
    setTurnInto(false);
    setTurnIntoPage(false);
    recoveryMenuState();
    setSelection!==null && setSelection(null);
  };
  const showPageMenu =()=>{
    setTurnIntoPage(true);
    setSelection!==null && setSelection(null);
    setTurnInto(false);
    setColor(false);
    recoveryMenuState();
  };
  const onClickMoveTo=()=>{
    setOpenMenu(false);
    setSelection!==null && setSelection(null);
    sessionStorage.setItem("popupStyle", JSON.stringify(popupStyle));
    setPopup({
      popup:true,
      what: popupMoveToPage
    })
  };
  const onOpenCommentInput=()=>{
    setCommentBlock(block);
    setOpenMenu(false);
    setSelection!==null && setSelection(null);
    sessionStorage.setItem("popupStyle", JSON.stringify(popupStyle));
    setPopup({
      popup:true,
      what:popupComment
    })
  };
  const removeBlock =()=>{
    setSelection!==null && setSelection(null);
    setTemplateItem(templateHtml,page);
    deleteBlock(page.id, block , true);
    setOpenMenu(false);
  };

  const duplicateBlock=()=>{
    setSelection!==null && setSelection(null);
    if(page.blocks!==null && page.blocksId!==null){
      setTemplateItem(templateHtml,page);
      const blockIndex= page.blocksId.indexOf(block.id);
      const previousBlockId = page.blocksId[blockIndex-1];
      const editTime =JSON.stringify(Date.now());
      const number =page.blocksId.length.toString();
      const newBlock:Block ={
        ...block,
        id:`${page.id}_${number}_${editTime}`,
        editTime:editTime,
      } ;
      addBlock(page.id , newBlock,  blockIndex+1, block.parentBlocksId ===null? null : previousBlockId);
  
      setTemplateItem(templateHtml, page);
      if(block.type==="page"){
        duplicatePage(block.id);
      };
      setOpenMenu(false);
    }
  };
  const onSetEditBtns=()=>{
    setEditBtns([...document.getElementsByClassName("menu_editBtn")]);
  };
  const onSearch =(event:ChangeEvent<HTMLInputElement>)=>{
    const value =event.target.value ; 
    editBtns?.forEach((btn:Element)=>{
      const name =btn.getAttribute("name") as string;
      if(name.includes(value)){
        btn.classList.remove("off");
      }else{
        btn.classList.add ("off");
      };
    })
  };
  const onClickRename =()=>{
    setSelection!==null && setSelection(null);
    setOpenRename!==null&&  setOpenRename(true);
    setOpenMenu(false);
  };
  return(
  <div 
    className="menu"
    ref={menuRef}
    style={menuStyle}
  >

      <div id='mainMenu' >
        <div className="menu_inner">
          <div className='menu_search'>
            <input
              type="search"
              id="menu_search_input"
              name='search'
              placeholder='Search actions'
              onClick={onSetEditBtns}
              onChange={onSearch}
            />
          </div>
            <div className="menu_edit">
              <div id="menu_editBtns">
                <button
                  className='menu_editBtn'
                  onClick ={removeBlock}
                  name="delete"
                >
                  <div>
                    <RiDeleteBin6Line/>
                    <span>Delete</span>
                  </div>
                </button>
                <button
                  className='menu_editBtn'
                  onClick ={duplicateBlock}
                  name="duplicate"
                >
                  <div>
                    <HiOutlineDuplicate/>
                    <span>Duplicate</span>
                  </div>
                </button>
                <button
                  className='menu_editBtn'
                  onMouseOver={showTurnInto}
                  name="turn into"
                >
                  <div>
                    <BsArrowClockwise/>
                    <span>Turn into</span>
                    <span className='arrowDown'>
                        <TiArrowSortedDown/>
                    </span>
                  </div>
                </button>
                <button
                  className='menu_editBtn'
                  name ="turn into page in"
                  onMouseOver={showPageMenu}
                >
                  <div>
                    <MdOutlineRestorePage/>
                    <span>Turn into Page in</span>
                    <span 
                      className="arrowDown" 
                    >
                    <TiArrowSortedDown/>
                    </span>
                  </div>
                </button>
                {block.type === "page" && 
                <button
                  className='menu_editBtn'
                  onClick={onClickRename}
                >
                  <div>
                    <HiOutlinePencilAlt/>
                    <span>Rename</span>
                  </div>
                </button>
                }
                <button
                  className='underline menu_editBtn'
                  name="move to"
                  onClick={onClickMoveTo}
                >
                  <div>
                    <IoArrowRedoOutline/>
                    <span>Move to</span>
                  </div>
                </button>
                {block.type !== "page" &&
                <button
                  className='underline menu_editBtn'
                  name="comment"
                  onClick={onOpenCommentInput}
                >
                  <div>
                    <BiCommentDetail/>
                    <span>Comment</span>
                  </div>
                </button>
                }
                <button 
                  name='color'
                  className='underline menu_editBtn'
                  onMouseOver={showColorMenu}
                >
                  <div>
                    <AiOutlineFormatPainter/>
                    <span>Color</span>
                    <span
                      className="arrowDown"
                    >
                    <TiArrowSortedDown/>
                    </span>
                  </div>
                </button>
              </div>
              <div className='edit_inform'>
                <p>Last edited by {userName} </p>
                  <Time 
                    editTime={block.editTime}
                  />
              </div>
            </div>
                
        </div>
      </div>
      <div 
        id="sideMenu"
        style={sideMenuStyle}
      >
        {turnInto &&
            <CommandBlock
              style={undefined}
              page={page}
              block={block}
              editBlock={editBlock}
              changeBlockToPage={changeBlockToPage}
              changePageToBlock={changePageToBlock}
              editPage={editPage}
              command={null}
              setCommand={null}
              setTurnInto={setTurnInto}
              setSelection={setSelection}
            />
        }
        {color &&
          <ColorMenu
            page={page}
            block={block}
            editBlock={editBlock}
            selection={null}
            setSelection={null}
          />
        }
        {turnInToPage &&
          <PageMenu
            what="block"
            currentPage={page}
            pages={pages}
            firstlist={firstlist}   
            addBlock={addBlock}
            changeBlockToPage={changeBlockToPage}
            deleteBlock={deleteBlock}
            movePageToPage={movePageToPage}
            setOpenMenu={setOpenMenu}
            setTargetPageId={setTargetPageId}
          />
        }
      </div>
  </div>
  )
};

export default React.memo(Menu);