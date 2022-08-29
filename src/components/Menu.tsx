import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from 'react';
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
import { BsArrowClockwise, BsLink45Deg } from 'react-icons/bs';
import {MdOutlineRestorePage} from 'react-icons/md';
import {TiArrowSortedDown} from 'react-icons/ti';
import {IoArrowRedoOutline} from 'react-icons/io5';
import {RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineFormatPainter } from 'react-icons/ai';
import { setTemplateItem } from './BlockComponent';
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
  duplicatePage: (targetPageId: string) => void,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  setPopup :Dispatch<SetStateAction<PopupType>> ,
  popup:PopupType,
  setCommentBlock: React.Dispatch<React.SetStateAction<Block | null>>,
  setTargetPageId: Dispatch<SetStateAction<string>>,
}

type MenuProps
=MenuAndBlockStylerCommonProps& {
  setOpenMenu : Dispatch<SetStateAction<boolean>>,
  setOpenRename:Dispatch<SetStateAction<boolean>>|null,
};

const Menu=({pages,firstlist, page, block, userName, setOpenMenu,addBlock,changeBlockToPage,changePageToBlock ,editBlock, deleteBlock ,duplicatePage,movePageToPage ,setPopup ,popup ,setCommentBlock ,setTargetPageId ,setOpenRename}:MenuProps)=>{

  const blockFnElement = document.getElementById("blockFn") ;
  const [editBtns, setEditBtns]= useState<Element[]|null>(null);
  const [turnInto, setTurnInto]= useState<boolean>(false);
  const [color, setColor]= useState<boolean>(false);
  const [turnInToPage ,setTurnIntoPage] = useState<boolean>(false);
  const [menuStyle , setMenuStyle]= useState<CSSProperties>(changeMenuStyle());
  const [sideMenuStyle, setSideMenuStyle]=useState<CSSProperties|undefined>(undefined);
  const templateHtml= document.getElementById("template");
  function changeMenuStyle (){
    const menu = document.querySelector(".menu");
    const menuHeight =menu? menu.clientHeight: 400;
    const innerWidth =window.innerWidth;
    const innerHeight =window.innerHeight;
    const top = blockFnElement?.getClientRects()[0].top as number;
    const overHeight = ( top + menuHeight ) >= innerHeight;
    let style:CSSProperties ={};
    if(blockFnElement!==null){
      style =
      overHeight? {
        bottom: (blockFnElement.offsetHeight) *0.5 ,
        left: innerWidth >767 ?'3rem' : '0.5rem',
      } :
      {
        top:  (blockFnElement.offsetHeight) *0.5 ,
        left: innerWidth >767 ?'3rem' : '1rem',
      };
    };
    return style
  };
  function changeSideMenuStyle(){
    const mainMenu= document.getElementById("mainMenu");
    const innerWidth= window.innerWidth;
    if(mainMenu !==null ){
      const left =(mainMenu?.clientWidth)* 0.7;
      const style :CSSProperties= {
        top: innerWidth >767? '-10px' :
        "10px",
        left: innerWidth> 767? left : `${mainMenu.clientWidth * (innerWidth >=375 ? 0.5: 0.3)}px`,
      };
      setSideMenuStyle(style);
    }
  };
  window.onresize =()=>{
    const style =changeMenuStyle();
    setMenuStyle(style);
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
  };
  const showColorMenu =()=>{
    setColor(true);
    recoveryMenuState();
  };
  const showPageMenu =()=>{
    setTurnIntoPage(true);
    recoveryMenuState();
  };
  const onClickMoveTo=()=>{
    setOpenMenu(false);
    sessionStorage.setItem("popupStyle", JSON.stringify(popupStyle));
    setPopup({
      popup:true,
      what: popupMoveToPage
    })
  };
  const onOpenCommentInput=()=>{
    setCommentBlock(block);
    setOpenMenu(false);
    sessionStorage.setItem("popupStyle", JSON.stringify(popupStyle));
    setPopup({
      popup:true,
      what:popupComment
    })
  };
  const removeBlock =()=>{
    setTemplateItem(templateHtml,page);
    deleteBlock(page.id, block , true);
    setOpenMenu(false);
  };

  const duplicateBlock=()=>{
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
   setOpenRename!==null&&  setOpenRename(true);
    setOpenMenu(false);
  };
  return(
  <div 
    className="menu"
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
                    <span>Del</span>
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
                    <span>Ctrl+D</span>
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
                <button
                  className='underline menu_editBtn'
                  name="copy link to block"
                >
                  <div>                
                    <BsLink45Deg/>
                    <span>Copy link to block</span>
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
                    <span>Ctrl+Shift+R</span>
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
                    <span>Ctrl+Shift+P</span>
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
                    <span>Ctrl+Shift+M</span>
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
              page={page}
              block={block}
              editBlock={editBlock}
              changeBlockToPage={changeBlockToPage}
              changePageToBlock={changePageToBlock}
              command={null}
              setCommand={null}
              setCommandTargetBlock={null}
              setPopup={null}
            />
        }
        {color &&
          <ColorMenu
            page={page}
            block={block}
            editBlock={editBlock}
            selection={null}
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