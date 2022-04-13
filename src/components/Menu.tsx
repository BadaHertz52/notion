import React, { Dispatch } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { Block} from '../modules/notion';
//icon
import {BiCommentDetail} from 'react-icons/bi';
import { BsArrowClockwise, BsLink45Deg } from 'react-icons/bs';
import {MdOutlineRestorePage} from 'react-icons/md';
import { IoMdArrowDropright } from 'react-icons/io';
import {IoArrowRedoOutline} from 'react-icons/io5';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';

type MenuProps ={
  block:Block,
  setType :Dispatch<React.SetStateAction<string>>
};

const SwitchBtn =()=>{
  return (
    <div className="wrapper">
      <input type="checkbox" id="switch" />
      <label htmlFor="switch" className="switch_label">
        <span className="onf_btn"></span>
      </label>
    </div>
  )
}
const Menu=({block ,setType }:MenuProps)=>{
  const userName =useSelector((state:RootState)=> state.user.userName);
  const today = new Date().getDate();
  const editTime = new Date(block.editTime);
  const year = editTime?.getFullYear();
  const month  =editTime?.getMonth()+1;
  const date = editTime?.getDate() ;
  const hour = editTime?.getHours();
  const min =editTime?.getMinutes();
  return(
    <div className='menu'>
      <div className='blockMenu'> 
        <div className='menu_search'></div>
        <div className="menu_edit">
          <div className="memu_edit_fun">
            <div className="editFun1">
              <button>
                <BsArrowClockwise/>
                <span>Turn into</span>
                <IoMdArrowDropright/>
              </button>
              <button>
                <MdOutlineRestorePage/>
                <span>Turn into Page in</span>
                <IoMdArrowDropright/>
              </button>
              <button>
                <BsLink45Deg/>
                <span>Copy link to block</span>
              </button>
            </div>
            <div className="editFun2">
              <button>
                <IoArrowRedoOutline/>
                <span>Move to</span>
              </button>
            </div>
            <div className="editFun3">
              <button>
                <BiCommentDetail/>
                <span>Comment</span>
              </button>
              <button>
                <HiOutlineMenuAlt1/>
                <span>Caption</span>
              </button>
            </div>
            <div className="eidtFun4">
              <button>
                <span>Wrap Code</span>
                <SwitchBtn/>
              </button>
              <button>
                <span>Set language</span>
                <IoMdArrowDropright/>
              </button>
              <button>
                <span>Work at Notion</span>
              </button>
            </div>
          </div>
          <div className='menu_edit_inform'>
            <p>Last edited by {userName} </p>
            <p> 
              {today === date ? 
              `Today at ${hour}:${min}` 
              : 
              `${month}/${date}/${year}`}
            </p>
          </div>
        </div>
      </div>
      <div className='blockSubMenu'>
      </div>
    </div>
  )
};

export default React.memo(Menu);