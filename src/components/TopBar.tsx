import React, { useEffect, useState } from 'react';
import { AiOutlineClockCircle, AiOutlineMenu, AiOutlineStar } from 'react-icons/ai';
import { BiMessageDetail } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { FiChevronsLeft } from 'react-icons/fi';
import { pathType } from '../containers/NotionRouter';
import { Page } from '../modules/notion';
import { Side } from '../modules/side';
type TopBarProps ={
  side:Side,
  page:Page,
  pagePath: pathType[] |null ,
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void 
}
const TopBar =({side,page,pagePath, lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage}:TopBarProps)=>{
  const [title, setTitle]= useState<string>("");
  useEffect(()=>{
    if(side.sideState ==="left"){
      setTitle("Lock sideBar open")
    }
  },[]);

  return(
    <div className="topbar">
      <button 
      className='sideBarBtn'
      onMouseMove={leftSideBar}
      onMouseOut={closeSideBar}
      onClick={lockSideBar}
      title ={title}
      aria-label ={title}
      >
        {side.sideState ==="close" && 
        <AiOutlineMenu/>}
        {side.sideState ==="left" &&
        <FiChevronsLeft/>}
      </button>
      <div className="pagePathes">
        {pagePath == null ? 
          <div className="pagePath">
            <span>
              {page.header.title? 
              page.header.title 
              : 
              ""}
            </span>
          </div>
        :
          pagePath.map((path:pathType )=>
          <div className="pagePath" key={pagePath.indexOf(path)}>
            <span>/</span> 
            <span className='pageLink'>
              <a href='path'>
                {path.icon && path.icon}
                {path.title}
              </a>
              </span>
          </div>
          )
        }
      </div>

      <div className="pageFun">
        <button
          title='Share or publish to the web'
        >
          Share
        </button>
        <button
          title='View all comments'
        >
          <BiMessageDetail/>
        </button>
        <button
          title="View all updates"
        >
          <AiOutlineClockCircle/>
        </button>
        <button
          title="Pin this page in your sidebar"
        >
          <AiOutlineStar/>
        </button>
        <button
          title=" Style, export, and more"
        >
          <BsThreeDots/>
        </button>
      </div>
    </div>
  )
};

export default React.memo(TopBar);