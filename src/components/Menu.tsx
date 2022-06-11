import React, { ChangeEvent, Dispatch, SetStateAction, useState} from 'react';
import { Block, findPage, listItem, Page } from '../modules/notion';
import CommandBlock from './CommandBlock';

//icon
import {BiCommentDetail} from 'react-icons/bi';
import { BsArrowClockwise, BsLink45Deg } from 'react-icons/bs';
import {MdOutlineRestorePage} from 'react-icons/md';
import {TiArrowSortedDown} from 'react-icons/ti';
import {IoArrowRedoOutline} from 'react-icons/io5';
import {RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineFormatPainter } from 'react-icons/ai';
import { CSSProperties } from 'styled-components';
import { Command } from '../containers/EditorContainer';
import ColorMenu from './ColorMenu';
import { HiOutlineDuplicate } from 'react-icons/hi';
import PageMenu from './PageMenu';
import { popupComment, popupMoveToPage, PopupType } from './BlockFn';
import Time from './Time';

type MenuProps ={
  pages:Page[],
  firstlist:listItem[],
  page:Page,
  userName: string,
  setMenuOpen : Dispatch<SetStateAction<boolean>>,
  addBlock:(pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  editBlock : (pageId: string, block: Block) => void,
  deleteBlock :(pageId: string, block: Block) => void,
  addPage : ( newPage:Page, )=>void,
  duplicatePage: (targetPageId: string) => void,
  deletePage : (pageId:string , )=>void,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  setPopup :Dispatch<SetStateAction<PopupType>> ,
  popup:PopupType
};

const Menu=({pages,firstlist, page, userName, setMenuOpen,addBlock, editBlock, deleteBlock ,addPage ,duplicatePage,deletePage,movePageToPage,setPopup ,popup}:MenuProps)=>{
  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;
  const block:Block= JSON.parse(sessionItem);
  const blockFnElement = document.getElementById("blockFn") ;
  const [editBtns, setEditBtns]= useState<Element[]|null>(null);
  const [turnInto, setTurnInto]= useState<boolean>(false);
  const [color, setColor]= useState<boolean>(false);
  const [turnInToPage ,setTurnIntoPage] = useState<boolean>(false);
  const [command, setCommand]= useState<Command>({boolean:false, command:null});
  const menuStyle:CSSProperties ={
    position:"absolute" ,
    top: blockFnElement?.offsetHeight,
    left:'3rem',
  }
  const sideMenuStyle :CSSProperties= {
    display:"block" ,
    position:"absolute" ,
    top: '-10px',
    left: 240 *0.88 ,
    zIndex:2
  };

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
    console.log("turninto", turnInto);
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
    setMenuOpen(false);
    setPopup({
      popup:true,
      what: popupMoveToPage
    })
  };
  const onOpenCommentInput=()=>{
    setMenuOpen(false);
    setPopup({
      popup:true,
      what:popupComment
    })
  };
  const removeBlock =()=>{
    deleteBlock(page.id, block);
    if(block.type==="page"){
      deletePage(block.id);
    };
    setMenuOpen(false);
  };

  const duplicateBlock=()=>{
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
    if(block.type==="page"){
      duplicatePage(block.id);
    };
    setMenuOpen(false);
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
              editTime={JSON.stringify(Date.now())}
              editBlock={editBlock}
              setCommand={setCommand}
              addPage={addPage}
            />
        }
        {color &&
          <ColorMenu
            page={page}
            block={block}
            editBlock={editBlock}
          />
        }
        {turnInToPage &&
          <PageMenu
            what="block"
            currentPage={page}
            pages={pages}
            firstlist={firstlist}   
            addBlock={addBlock}
            editBlock={editBlock}
            deleteBlock={deleteBlock}
            addPage={addPage}
            movePageToPage={movePageToPage}
            setMenuOpen={setMenuOpen}
          />
        }
      </div>
  </div>
  )
};

export default React.memo(Menu);