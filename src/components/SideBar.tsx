import React, { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { findPage, listItem, Notion, Page } from '../modules/notion';

//react-icon
import {FiCode ,FiChevronsLeft} from 'react-icons/fi';
import {AiOutlineClockCircle, AiOutlinePlus} from 'react-icons/ai';
import {BiSearchAlt2} from 'react-icons/bi';
import {BsFillTrash2Fill, BsThreeDots} from 'react-icons/bs';
import {IoIosSettings} from 'react-icons/io';
import {HiDownload, HiTemplate} from 'react-icons/hi';
import { MdPlayArrow } from 'react-icons/md';

type SideBarProps ={
  notion : Notion,
  user:{
    userName:string,
    userEmail:string,
    favorites:string[],
    trash:string[],
  },
  pages:Page[],
  firstPages:Page[],
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void ,
  setTargetPageId: Dispatch<SetStateAction<string>>,
};

type ItemTemplageProp ={
  item: listItem,
  setTargetPageId: Dispatch<SetStateAction<string>>,
};
type ListTemplateProp ={
  notion:Notion,
  targetList: listItem[],
  setTargetPageId: Dispatch<SetStateAction<string>>,
};
const ItemTemplate =({item ,setTargetPageId  }:ItemTemplageProp)=>{
  const [toggleStyle ,setToggleStyle]=useState<CSSProperties>({
    transform : "rotate(0deg)" 
  });
  const onToggleSubPage =(event:React.MouseEvent)=>{
    const target =event.target as HTMLElement ;
    const toggleSubPage=(subPageElement:null|undefined|Element)=>{
      if(subPageElement !==null && subPageElement !== undefined){
        subPageElement.classList.toggle("on");
        console.log(subPageElement.classList)
        subPageElement.classList.contains("on")?
        setToggleStyle({
          transform: "rotate(90deg)"
        })
        :
        setToggleStyle({
          transform: "rotate(0deg)"
        })
      }

    };
    switch (target.tagName.toLocaleLowerCase()) {
      case "path":
        let subPageElement = target.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.nextElementSibling ;
        toggleSubPage(subPageElement);
        break;
      case "svg":
        subPageElement = target.parentElement?.parentElement?.parentElement?.parentElement?.nextElementSibling ;
        toggleSubPage(subPageElement);
        break;
      case "button":
        subPageElement = target.parentElement?.parentElement?.parentElement?.nextElementSibling ;
        toggleSubPage(subPageElement);
        break;
    
      default:
        break;
    }
      
  };
  return (
  <div 
    className='itemInner pageLink'
  >
    <div className='pageContent'>
      <button 
        className='toggleBtn'
        onClick={onToggleSubPage}
        style={toggleStyle}
      >
        <MdPlayArrow/>
      </button>
      <button 
        className='pageName'
            onClick={()=>{setTargetPageId(item.id) }}
      >
        {item.icon !==null && 
          <span>
            {item.icon}
          </span>
          }
        <span>{item.title}</span>
      </button>
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

const ListTemplate =({notion, targetList ,setTargetPageId}:ListTemplateProp)=>{
  const findSubPage =(id:string):listItem=>{
    const index =notion.pagesId.indexOf(id);
    const subPage:Page =notion.pages[index];
    return {
      id: subPage.id,
      title: subPage.header.title,
      icon: subPage.header.icon,
      subPagesId:subPage.subPagesId,
      parentsId: subPage.parentsId,
      editTime:subPage.editTime
    };
  };
  const makeTargetList =(ids:string[]):listItem[]=>{
    const listItemArry:listItem[] = ids.map((id:string)=>findSubPage(id));
    return listItemArry
  };
  return(
    <ul>
    {targetList.map((item:listItem)=> 
      <li       
        id={`item_${item.id}`} 
        key={item.id}
      >
        <div className='mainPage'>
          <ItemTemplate 
            item={item}
            setTargetPageId={setTargetPageId}
          />
        </div>
        {
        item.subPagesId !==null ?
        <div className="subPage">
          <ListTemplate
            notion={notion}     
            targetList={makeTargetList(item.subPagesId)}
            setTargetPageId={setTargetPageId}     
          />
        </div>
        :
        <div className='subPage no'>
          <span>No page inside</span>
        </div>
        }
      </li> 
    )}
  </ul>
  )
};

const SideBar =({notion, user ,pages,firstPages ,lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage ,setTargetPageId 
}:SideBarProps)=>{
  const recordIcon =user.userName.substring(0,1);
  const editTime =JSON.stringify(Date.now());
  const pagesId: string[] = pages.map((page:Page)=> (page.id));
  const favorites:listItem[] = user.favorites.map((id: string)=> {
    const page =findPage(pagesId,pages,id);
    const listItem ={
    id:page.id,
    title:page.header.title,
    icon:page.header.icon,
    subPagesId: page.subPagesId,
    parentsId: page.parentsId,
    editTime:editTime};
    return listItem
});
  const list:listItem[] = firstPages
                                    .filter((page:Page)=> page.parentsId ==null)
                                    .map((page:Page)=> (
                                      { id:page.id,
                                        icon:page.header.icon,
                                        title: page.header.title,
                                        subPagesId: page.subPagesId,
                                        parentsId: page.parentsId,
                                        editTime:editTime
                                      })) ;                              
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
              <ListTemplate 
                notion ={notion}
                setTargetPageId={setTargetPageId}
                targetList={favorites}
              />
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
              <ListTemplate 
                notion={notion}
                targetList={list}
                setTargetPageId={setTargetPageId}
              />
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