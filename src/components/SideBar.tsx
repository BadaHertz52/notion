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

type ItemTemplageProp ={
  item:Item
}
const ItemTemplate =({item}:ItemTemplageProp)=>{
  return (
  <div className='itemInner'>
    <div className='pageContent'>
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
        <AiOutlinePlus/>
      </button>
    </div>
  </div>
  )
};
type ListTemplateProp ={
  targetList: List
};

const ListTemplate =({targetList}:ListTemplateProp)=>{
  return(
    <ul>
    {targetList.map((item:Item)=> 
      <li>
        <button className='first page'>
          <ItemTemplate item={item}/>
        </button>
        <button className="inside page">
        </button>
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
    <>
    <div  id="sideBar">
      <div id="sideBar_inner">
        <div className="switcher">
          <div className='itemInner'>
            <div>
              <div id="record-icon">
                <div>
                  {recordIcon}
                </div>
                
              </div>
              <div className='user'>
                <div>{user.userName}'s Notion</div>
                <div><FiCode/></div>
              </div>
            </div>
            <button id='closeSideBarBtn' className ="sideBarBtn">
              <FiChevronsLeft/>
            </button>
          </div>
        </div>
        <div className="fun1">
          <div>
            <div className='itemInner'>
              <BiSearchAlt2/>
              <span>Quick Find</span>
            </div>
          </div>
          <div>
            <div className="itemInner">
              <AiOutlineClockCircle/>
              <span>All Updates</span>
            </div>
          </div>
          <div>
            <div className='itemInner'>
              <IoIosSettings/>
              <span>Setting &amp; Members</span>
            </div>
          </div>
        </div>
        <div className="srcoller">
          <div className="favorites">
            <div className="header">
              <span>FAVORITES </span>
            </div>
            <div className="list">
              <ListTemplate targetList={favorites}/>
            </div>
          </div>
          <div className="private">
            <div className="header">
              <span>PRIVATE</span>
              <button 
                className='addPageBtn'
                title="Quickly add a page inside"
              >
                <AiOutlinePlus/>
              </button>
            </div>
            <div className="list">
              <ListTemplate targetList={list}/>
            </div>
          </div>
          <div className="fun2">
            <button>
              <div className="itemInner">
                <HiTemplate/>
                <span>Templates</span>
              </div>
            </button>
            <button>
              <div className="itemInner">
                <HiDownload/>
                <span>Import</span>
              </div>
            </button>
            <button>
              <div className="itemInner">
                <BsFillTrash2Fill/>
                <span>Trash</span>
              </div>
            </button>
          </div>
        </div>
        <div className= "addNewPage">
          <button>
            <AiOutlinePlus/>
            <span>New page</span>
          </button>
        </div>
      </div>
      <button className='sideBarBtn ' id="openSideBarBtn">
        <FiChevronsLeft/>
      </button>
    </div>
    </>
  )
};

export default React.memo(SideBar)