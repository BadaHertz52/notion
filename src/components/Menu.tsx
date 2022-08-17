import React, { ChangeEvent, Dispatch, SetStateAction, useState} from 'react';
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


type MenuProps ={
  pages:Page[],
  firstlist:listItem[],
  page:Page,
  block:Block,
  userName: string,
  setMenuOpen : Dispatch<SetStateAction<boolean>>,
  addBlock:(pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  editBlock : (pageId: string, block: Block) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,
  changePageToBlock:(currentPageId: string, block: Block) => void,
  deleteBlock :(pageId: string, block: Block ,isInMenu:boolean) => void,
  addPage : ( newPage:Page, )=>void,
  duplicatePage: (targetPageId: string) => void,
  deletePage : (pageId:string , )=>void,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  setPopup :Dispatch<SetStateAction<PopupType>> ,
  popup:PopupType,
  setCommentBlock: React.Dispatch<React.SetStateAction<Block | null>>,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  setOpenRename:Dispatch<SetStateAction<boolean>>,
};

const Menu=({pages,firstlist, page, block, userName, setMenuOpen,addBlock,changeBlockToPage,changePageToBlock ,editBlock, deleteBlock ,addPage ,duplicatePage,deletePage,movePageToPage,setPopup ,popup ,setCommentBlock ,setTargetPageId ,setOpenRename}:MenuProps)=>{

  const blockFnElement = document.getElementById("blockFn") ;
  const [editBtns, setEditBtns]= useState<Element[]|null>(null);
  const [turnInto, setTurnInto]= useState<boolean>(false);
  const [color, setColor]= useState<boolean>(false);
  const [turnInToPage ,setTurnIntoPage] = useState<boolean>(false);
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
  const popupStyle = blockFnElement?.getAttribute("style");

  };
  };
  };
  const onClickMoveTo=()=>{
    setMenuOpen(false);
    sessionStorage.setItem("popupStyle", JSON.stringify(popupStyle));
    setPopup({
      popup:true,
      what: popupMoveToPage
    })
  };
  const onOpenCommentInput=()=>{
    setCommentBlock(block);
    setMenuOpen(false);
    sessionStorage.setItem("popupStyle", JSON.stringify(popupStyle));
    setPopup({
      popup:true,
      what:popupComment
    })
  };
  const removeBlock =()=>{
    deleteBlock(page.id, block , true);
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
  const onClickRename =()=>{
    setOpenRename(true);
    setMenuOpen(false);
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
                  onMouseOver={()=>setTurnInto(true)}
                  onMouseOut={()=>setTurnInto(false)}
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
                  onMouseOver={()=>setTurnIntoPage(true)}
                  onMouseOut={()=>setTurnIntoPage(false)}
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
                  onMouseOver={()=>setColor(true)}
                  onMouseOut={()=>setColor(false)}
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
            changeBlockToPage={changeBlockToPage}
            deleteBlock={deleteBlock}
            addPage={addPage}
            movePageToPage={movePageToPage}
            setMenuOpen={setMenuOpen}
            setTargetPageId={setTargetPageId}
          />
        }
      </div>
  </div>
  )
};

export default React.memo(Menu);