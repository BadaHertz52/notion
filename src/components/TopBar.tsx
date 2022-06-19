import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiOutlineClockCircle, AiOutlineMenu, AiOutlineStar } from 'react-icons/ai';
import { BiMessageDetail } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { FiChevronsLeft } from 'react-icons/fi';
import { pathType } from '../containers/NotionRouter';
import {  Page } from '../modules/notion';
import {  SideAppear } from '../modules/side';
type TopBarProps ={
  sideAppear:SideAppear,
  page:Page,
  pagePath: pathType[] |null ,
  changeSide: (appear: SideAppear) => void
  setTargetPageId:Dispatch<SetStateAction<string>>
}
const TopBar =({sideAppear,page,pagePath, changeSide ,setTargetPageId}:TopBarProps)=>{
  const [title, setTitle]= useState<string>("");
  useEffect(()=>{
    if(sideAppear ==="float"){
      setTitle("Lock sideBar open")
    }
    if(sideAppear ==="close"){
      setTitle("Float sideBar ")
    }
  },[]);
  const onClickSideBarBtn =(event:React.MouseEvent)=>{
    const target =event.target as HTMLElement;
    const targetTag =target.tagName.toLowerCase();
    switch (targetTag) {
      case "button":
        target.id ==="sideBarBtn" && changeSide("lock");
        break;
      case "svg":
        target.parentElement?.id==="sideBarBtn" && changeSide("lock");
        break;
      case "path":
        target.parentElement?.parentElement?.id=== "sideBarBt" && changeSide("lock");
        break;
      default:
        break;
    }
  };
  const onMouseEnterSidBarBtn=()=>{
    (sideAppear ==="close" || sideAppear==="floatHide") ?
    changeSide("float"):
    changeSide("floatHide");
    
  };

  return(
    <div 
      className="topbar"
    >
      <div>
      {sideAppear !=="lock" &&
        <button 
          id="sideBarBtn"
          title ={title}
          aria-label ={title}
          onMouseEnter={onMouseEnterSidBarBtn}
          onClick={onClickSideBarBtn}
        >
          {sideAppear ==="float"
          ? 
          <FiChevronsLeft
          />
          :
          <AiOutlineMenu/>
          }
        </button>

      }
      <div className="pagePathes">
        {pagePath == null ? 
          <button 
            className="pagePath"
            onClick={()=>setTargetPageId(page.id)}
          >
            <span>
              {page.header.title? 
              page.header.title 
              : 
              ""}
            </span>
          </button>
        :
          pagePath.map((path:pathType )=>
          <button 
            className="pagePath" 
            key={pagePath.indexOf(path)}
            onClick={()=>setTargetPageId(path.id)}
            >
            <span>/</span> 
            <span className='pageLink'>
              <a href='path'>
                {path.icon && path.icon}
                {path.title}
              </a>
              </span>
          </button>
          )
        }
      </div>
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