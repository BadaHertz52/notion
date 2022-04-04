import React from 'react';
import {FiCode ,FiChevronsLeft} from 'react-icons/fi';
import {AiOutlineClockCircle} from 'react-icons/ai';
import {BiSearchAlt2} from 'react-icons/bi';
import {IoIosSettings} from 'react-icons/io';
import { List, Page } from '../modules/list';

type SideBarProps ={
  user:{
    userName:string,
    userEmail:string,
    favorites:string[],
    trash:string[],
  },
  page:Page,
  list: List[],
};


const SideBar =({user ,page, list }:SideBarProps)=>{
  const recordIcon =user.userName.substring(0,1);
  return(
    <div id="sideBar">
      <div className="switcher">
        <div className="record-icon">
          {recordIcon}
        </div>
        <div className='user'>
          <div>{user.userName}'s Notion</div>
          <div><FiCode/></div>
        </div>
        <button className='sideBarFade in'>
          <FiChevronsLeft/>
        </button>
        
      </div>
      <div className="fun1">
        <div>
          <BiSearchAlt2/>
          <span>Quick Find</span>
        </div>
        <div>
          <AiOutlineClockCircle/>
          <span>All Updates</span>
        </div>
        <div>
          <IoIosSettings/>
          <span>Setting &amp; Members</span>
        </div>
      </div>
      <div className="srcoller">
        <div className="favorites">
          <div className="header">
            FAVORITES
          </div>

        </div>
        <div className="private"></div>
          <div className="header">
            PRIVATE
          </div>
      </div>
      <div className="fun2"></div>
    </div>
  )
};

export default React.memo(SideBar)