import React, { Dispatch, SetStateAction, useState} from 'react';
import { Block, Page } from '../modules/notion';
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


type MenuProps ={
  page:Page,
  userName: string,
  setMenuOpen : Dispatch<SetStateAction<boolean>>,
  editBlock : (pageId: string, block: Block) => void,
  deleteBlock :(pageId: string, block: Block) => void,
};

const Menu=({page, userName, setMenuOpen, editBlock, deleteBlock}:MenuProps)=>{
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
  const mainMenu =document.getElementById("mainMenu");
  const sideMenu =document.getElementById("sideMenu");
  const mainMenuArea =mainMenu?.getClientRects()[0] ;
  const sideMenuArea =sideMenu?.getClientRects()[0] ;
  const inner =document.getElementById("inner");

  const [turnInto, setTurnInto]= useState<boolean>(false);
  const [color, setColor]= useState<boolean>(false);
  
  const [command, setCommand]= useState<Command>({boolean:false, command:null});

  const sideMenuStyle :CSSProperties= {
    display:"block" ,
    position:"absolute" ,
    top: '-5px',
    left: 240 *0.8 ,
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
    const isInnerrMain = detectRange(event, mainMenuArea);
    const isInnerSide =detectRange(event, sideMenuArea );
    (isInnerrMain || isInnerSide) ? setMenuOpen(false) :setMenuOpen(true);
  };
  inner?.addEventListener("click", (event:MouseEvent)=>closeMenu(event));

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
        <div className='blockMenu'> 
          <div className='menu_search'></div>
          <div className="menu_edit">
            <div className="memu_editFns">
              <div className="editFn" id="editFn1">
                <button
                  onClick ={removeBlock}
                >
                  <RiDeleteBin6Line/>
                  <span>Delete</span>
                  <span>Del</span>
                </button>
                <button
                  onMouseOver={showTurnInto}
                >
                  <BsArrowClockwise/>
                  <span>Turn into</span>
                  <span className='arrowDown'>
                      <TiArrowSortedDown/>
                  </span>
                </button>
                <button>
                  <MdOutlineRestorePage/>
                  <span>Turn into Page in</span>
                  <span 
                    className="arrowDown" 
                  >
                  <TiArrowSortedDown/>
                  </span>
                </button>
                <button>
                  <BsLink45Deg/>
                  <span>Copy link to block</span>
                </button>
              </div>
              <div className="editFn"  id="editFun2">
                <button>
                  <IoArrowRedoOutline/>
                  <span>Move to</span>
                  <span>Ctrl+Shift+P</span>
                </button>
              </div>
              <div  className="editFn" id="editFun3">
                <button>
                  <BiCommentDetail/>
                  <span>Comment</span>
                  <span>Ctrl+Shift+M</span>
                </button>
                <button onMouseOver={showColorMenu}>
                  <AiOutlineFormatPainter/>
                  <span>Color</span>
                  <span
                    className="arrowDown"
                  >
                  <TiArrowSortedDown/>
                  </span>
                </button>
              </div>
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
        <div className='blockSubMenu'>
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
    </div>
  </div>
  )
};

export default React.memo(Menu);