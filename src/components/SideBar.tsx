import React, { CSSProperties, useState } from 'react';
import { Item, List } from '../modules/list';
import { Notion, Page } from '../modules/notion';

//react-icon
import {FiCode ,FiChevronsLeft} from 'react-icons/fi';
import {AiOutlineClockCircle, AiOutlinePlus} from 'react-icons/ai';
import {BiSearchAlt2} from 'react-icons/bi';
import {BsFillTrash2Fill, BsThreeDots} from 'react-icons/bs';
import {IoIosSettings} from 'react-icons/io';
import {HiDownload, HiTemplate} from 'react-icons/hi';
import { MdPlayArrow } from 'react-icons/md';

type SideBarProps ={
  user:{
    userName:string,
    userEmail:string,
    favorites:string[],
    trash:string[],
  },
  list: List,
  notion:Notion,
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void 
};

type ItemTemplageProp ={
  item:Item
}
const ItemTemplate =({item}:ItemTemplageProp)=>{
  const [toggle, setToggle] =useState<boolean>(false);
  const toggleStyle:CSSProperties={
    transform: toggle? "rotate(90deg)" : "rotate(0deg)" 
  };

  const onClickToggle =()=>{
    setToggle(!toggle)
  };
  
  return (
  <div className='itemInner pageLink'>
    <div className='pageContent'>
      <button 
        className='toggleBtn'
        style={toggleStyle}
        onClick={onClickToggle}
      >
        <MdPlayArrow/>
      </button>
      <div className='pageName'>
        {item.icon !==null && 
          <span>
            {item.icon}
          </span>
          }
        <span>{item.title}</span>
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

const ListTemplate =({targetList }:ListTemplateProp)=>{
  return(
    <ul>
    {targetList.map((item:Item)=> 
      <li key={item.id}>
        <div className='first page'>
          <ItemTemplate item={item}/>
        </div>
        <div className="inside page">
        </div>
      </li> 
    )}
  </ul>
  )
};

const SideBar =({user ,notion, list ,lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage
}:SideBarProps)=>{
  const recordIcon =user.userName.substring(0,1);
  const favorites:List = notion.pages.filter((page:Page)=> user.favorites.includes(page.id)).map((page:Page)=> ({
    id:page.id,
    title:page.header.title,
    icon:page.header.icon
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
            <button id='closeSideBarBtn' 
            className ="sideBarBtn">
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
    </div>
    </>
  )
};

export default React.memo(SideBar)