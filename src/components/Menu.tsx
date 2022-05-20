import React, { Dispatch, SetStateAction, useState} from 'react';
import { Block, Page } from '../modules/notion';
import ColorInform from './ColorInform';

//icon
import {BiCommentDetail} from 'react-icons/bi';
import { BsArrowClockwise, BsLink45Deg } from 'react-icons/bs';
import {MdOutlineRestorePage} from 'react-icons/md';
import {TiArrowSortedDown} from 'react-icons/ti';
import {IoArrowRedoOutline} from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineFormatPainter } from 'react-icons/ai';


type MenuProps ={
  page:Page,
  userName: string,
  setMenuOpen : Dispatch<SetStateAction<boolean>>,
  editBlock : (pageId: string, block: Block) => void,
};

const Menu=({page, userName, setMenuOpen, editBlock}:MenuProps)=>{
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
  const menu = document.getElementById("menu");
  const menuArea = menu?.getClientRects()[0];
  const inner =document.getElementById("inner");
  
  const [turnInto, setTurnInto]= useState<boolean>(false);
  const [color, setColor]= useState<boolean>(true);

  const closeMenu =(event:MouseEvent)=>{
    const target =event.target as Element | null;
    const targetArea = target?.getClientRects()[0] ;
    type Position ={
      top:number,
      bottom:number,
      left:number,
      right:number
    };
    const menu_position:Position = {
      top: menuArea?.top as number,
      bottom: menuArea?.bottom  as number,
      left: menuArea?.left as number,
      right: menuArea?.right as number,
    };
    const target_position:Position = {
      top: targetArea?.top as number,
      bottom: targetArea?.bottom  as number,
      left: targetArea?.left as number,
      right: targetArea?.right as number,
    };

    const inner_x:boolean = (target_position.left >= menu_position.left)&&(target_position.right <= menu_position.right);
    const inner_y:boolean = (target_position.top>= menu_position.top) && (target_position.top <= menu_position.bottom);

    if(!inner_x && !inner_y){
      setMenuOpen(false);
      console.log("close menu");
    };
  };
  inner?.addEventListener("click", (event:MouseEvent)=>closeMenu(event));

  const showTurnInto =()=>{
    setTurnInto(!turnInto);
  };
  const showColorMenu =()=>{
    setColor(!color);
  };

  return(
    <div id='menu' >
      <div className="menu_inner">
        <div className='blockMenu'> 
          <div className='menu_search'></div>
          <div className="menu_edit">
            <div className="memu_editFns">
              <div className="editFn" id="editFn1">
                <button>
                  <RiDeleteBin6Line/>
                  <span>Delete</span>
                  <span>Del</span>
                </button>
                <button>
                  <BsArrowClockwise/>
                  <span>Turn into</span>
                  <button 
                    className='arrowDown'
                    onMouseOver={showTurnInto}
                  >
                      <TiArrowSortedDown/>
                  </button>
                </button>
                <button>
                  <MdOutlineRestorePage/>
                  <span>Turn into Page in</span>
                  <button 
                    className="arrowDown"
                    onMouseOver={showColorMenu}
                  >
                  <TiArrowSortedDown/>
                  </button>
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
                <button>
                  <AiOutlineFormatPainter/>
                  <span>Color</span>
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
      {color &&
        <div id="menu_color" className="sideMenu">
          <div className="menu_inner">
            <div className="color_colors">
              <ColorInform
                colorName='Default'
                color={"black"}
                background ={undefined}
              />
              <ColorInform
                colorName='Orange'
                color={"#f8ba0e"}
                background ={undefined}
              />
              <ColorInform
                colorName='Green'
                color={"#009723"}
                background ={undefined}
              />
              <ColorInform
                colorName='Blue'
                color={"#1565c0"}
                background={undefined}
              />
              <ColorInform
                colorName='Red'
                color={"#d32f2f"}
                background={undefined}
              />
            </div>
            <div className="color_background">
              <ColorInform
                colorName='Default'
                color={undefined}
                background={"#e0e0e0"}
              />
              <ColorInform
                colorName='Orange'
                color={undefined}
                background={"#ffecd0"}
                />
              <ColorInform
                colorName='Green'
                color={undefined}
                background={"#dcedc8"}
              />
              <ColorInform
                colorName='Blue'
                color={undefined}
                background={"#e3f2fd"}
              />
              <ColorInform
                colorName='Red'
                color={undefined}
                background={"#ffcdd2"}
            />
            </div>
          </div>
        </div>
      }
    </div>
  )
};

export default React.memo(Menu);