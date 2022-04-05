import React from 'react';
import { Item, List } from '../modules/list';
import { Notion, Page } from '../modules/notion';

//react-icon
import {FiCode ,FiChevronsLeft} from 'react-icons/fi';
import {AiOutlineClockCircle, AiOutlinePlus, AiOutlinePlusSquare} from 'react-icons/ai';
import {BiSearchAlt2} from 'react-icons/bi';
import {BsFillTrash2Fill, BsThreeDots} from 'react-icons/bs';
import {IoIosSettings, IoMdArrowDropright} from 'react-icons/io';
import {HiDownload, HiTemplate} from 'react-icons/hi';

type SideBarProps ={
  user:{
    userName:string,
    userEmail:string,
    favorites:string[],
    trash:string[],
  },
  list: List,
  notion:Notion
};

type ListTemplateProp ={
  targetList: List
};

const ListTemplate =({targetList}:ListTemplateProp)=>{
  return(
    <ul>
    {targetList.map((item:Item)=> 
      <li>
        <div className='first page'>
          <button className='toggleBtn'>
            <IoMdArrowDropright/>
          </button>
          <div className='pageName'>
            {item.icon !==null && 
              <span>
                {item.icon}
              </span>
              }
            <span>{item.header}</span>
          </div>
          <div className="pageFun">
            <button  
              className='dotBtn'
              title='delete, duplicate, and more'
            >
              <BsThreeDots/>
            </button>
            <button 
              className='addPageBtn'
              title="Quickly add a page inside"
            >
              <AiOutlinePlusSquare/>
            </button>
          </div>
        </div>
        <div className="inside page">
        </div>
      </li> 
    )}
  </ul>
  )
};

const SideBar =({user ,notion, list }:SideBarProps)=>{
  const recordIcon =user.userName.substring(0,1);
  const favorites:List = notion.pages.filter((page:Page)=> user.favorites.includes(page.id)).map((page:Page)=> ({
    id:page.id,
    header:page.header,
    icon:page.icon
  }));


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
          <div className="list">
            <ListTemplate targetList={favorites}/>
          </div>
        </div>
        <div className="private"></div>
          <div className="header">
            PRIVATE
          </div>
          <div className="list">
            <ListTemplate targetList={list}/>
          </div>
      </div>
      <div className="fun2">
        <ul>
          <li>
            <HiTemplate/>
            <span>Templates</span>
          </li>
          <li>
            <HiDownload/>
            <span>Import</span>
          </li>
          <li>
            <BsFillTrash2Fill/>
            <span>Trash</span>
          </li>
        </ul>
      </div>
      <div>
        <button>
          <AiOutlinePlus/>
          <span>New page</span>
        </button>
      </div>
    </div>
  )
};

export default React.memo(SideBar)