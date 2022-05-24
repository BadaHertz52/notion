import React, { Dispatch, SetStateAction, useState} from 'react';
import { Block, listItem, Page } from '../modules/notion';
import CommandBlock from './CommandBlock';

//icon
import {BiCommentDetail} from 'react-icons/bi';
import { BsArrowClockwise, BsLink45Deg } from 'react-icons/bs';
import {MdOutlineRestorePage} from 'react-icons/md';
import {TiArrowSortedDown} from 'react-icons/ti';
import {IoArrowRedoOutline} from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineFormatPainter } from 'react-icons/ai';
import { CSSProperties } from 'styled-components';
import { Command } from '../containers/EditorContainer';
import ColorMenu from './ColorMenu';
import { HiOutlineDuplicate } from 'react-icons/hi';
import MoveToPageMenu from './MoveToPageMenu';


type MenuProps ={
  pages:Page[],
  firstlist:listItem[],
  page:Page,
  userName: string,
  setMenuOpen : Dispatch<SetStateAction<boolean>>,
  addBlock:(pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void,
  editBlock : (pageId: string, block: Block) => void,
  deleteBlock :(pageId: string, block: Block) => void,
  addPage : (pageId:string , newPage:Page, block:null)=>void,
  editPage : (pageId:string , newPage:Page, block:null)=>void,
  deletePage : (pageId:string , block:null)=>void,
};

const Menu=({pages,firstlist, page, userName, setMenuOpen,addBlock, editBlock, deleteBlock}:MenuProps)=>{
  const today = new Date().getDate();
  type TimeInform ={
    year:number,
    month:number,
    date:number,
    hour:number,
    min:number
  };
  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;
  const block:Block= JSON.parse(sessionItem);
  const editTime =  new Date(Number(block.editTime));
  const timeInform :TimeInform ={
      year :editTime?.getFullYear(),
      month :editTime?.getMonth()+1,
      date: editTime?.getDate() ,
      hour: editTime?.getHours(),
      min: editTime?.getMinutes(),
    };

  const inner =document.getElementById("inner");

  const [turnInto, setTurnInto]= useState<boolean>(false);
  const [color, setColor]= useState<boolean>(false);
  
  const [command, setCommand]= useState<Command>({boolean:false, command:null});

  const sideMenuStyle :CSSProperties= {
    display:"block" ,
    position:"absolute" ,
    top: '-10px',
    left: 240 *0.88 ,
    zIndex:2
  };

  type Position ={
    top:number,
    bottom:number,
    left:number,
    right:number,
  };

  const findPosition =(eventTarget:Element ,elementArea:DOMRect ):{
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
  
  const detectRange =(event:MouseEvent , targetArea:DOMRect|undefined ):boolean=>{
    const target =event.target as Element; 
    const target_area= targetArea as DOMRect;
    const {targetElement_position ,eventTarget_position} =findPosition(target, target_area);
    const inner_x:boolean = (eventTarget_position.left >= targetElement_position.left)&&(eventTarget_position.right <= targetElement_position.right);
    const inner_y:boolean = (eventTarget_position.top>= targetElement_position.top) && (eventTarget_position.bottom <= targetElement_position.bottom);
    return (inner_x && inner_y);
  };

  const closeMenu =(event:MouseEvent)=>{
    const mainMenu =document.getElementById("mainMenu");
    const sideMenu =document.getElementById("sideMenu")?.firstElementChild;
    const mainMenuArea =mainMenu?.getClientRects()[0] ;
    const sideMenuArea =sideMenu?.getClientRects()[0] ;

    const isInnerrMain = detectRange(event, mainMenuArea);
    const isInnerSide =detectRange(event, sideMenuArea );

    if(sideMenuArea !==undefined){
      (isInnerrMain || isInnerSide) ? setMenuOpen(true) :setMenuOpen(false);
    }else{
      isInnerrMain ? setMenuOpen(true) : setMenuOpen(false);
    }
  
  };
  inner?.addEventListener("click", (event:MouseEvent)=> closeMenu(event));

  const showTurnInto =()=>{
    setTurnInto(!turnInto);
    setColor(false);
  };
  const showColorMenu =()=>{
    setColor(!color);
    setTurnInto(false);
  };
  const removeBlock =()=>{
    deleteBlock(page.id, block);
  };

  return(
  <div className="menu">
    <div id='mainMenu' >
      <div className="menu_inner">
        <div className='menu_search'>
        </div>
        <div className='blockMenu'> 
          <div className="menu_edit">
            <div className="menu_editBtns">
              <button
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
                name ="turn into page in"
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
                className='underline'
                name="copy link to block"
              >
                <div>                
                  <BsLink45Deg/>
                  <span>Copy link to block</span>
                </div>
              </button>
              <button
                className='underline'
                name="move to"
              >
                <div>
                  <IoArrowRedoOutline/>
                  <span>Move to</span>
                  <span>Ctrl+Shift+P</span>
                </div>
              </button>
              <button
                className='underline'
                name="comment"
              >
                <div>
                  <BiCommentDetail/>
                  <span>Comment</span>
                  <span>Ctrl+Shift+M</span>
                </div>
              </button>
              <button 
                name='color'
                className='underline'
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
            <div className='menu_edit_inform'>
              <p>Last edited by {userName} </p>
              <p> 
                {timeInform !==null &&
                                (today === timeInform.date ? 
                                  `Today at ${timeInform.hour}:${timeInform.min}` 
                                  : 
                                  `${timeInform.month}/${timeInform.date}/${timeInform.year}`)
                }
              </p>
            </div>
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
          />
      }
      {color &&
        <ColorMenu
          page={page}
          block={block}
          editBlock={editBlock}
        />
      }
      {moveToPage &&
        <MoveToPageMenu
          pages={pages}
          firstlist={firstlist}
          existingPage={page}
          block={block}
        />
      }
    </div>
  </div>
  )
};

export default React.memo(Menu);