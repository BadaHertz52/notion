import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiFillStar, AiOutlineClockCircle, AiOutlineMenu, AiOutlineStar } from 'react-icons/ai';
import { BiMessageDetail } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { FiChevronsLeft } from 'react-icons/fi';
import { pathType } from '../containers/NotionRouter';
import {  Page } from '../modules/notion';
import {  SideAppear } from '../modules/side';
type TopBarProps ={
  favorites:string[]|null,
  sideAppear:SideAppear,
  page:Page,
  pagePath: pathType[] |null ,
  changeSide: (appear: SideAppear) => void
  setTargetPageId:Dispatch<SetStateAction<string>>,
  addFavorites: (itemId: string) => void,
  removeFavorites: (itemId: string) => void,
}
const TopBar =({ favorites,sideAppear,page,pagePath, changeSide ,addFavorites, removeFavorites ,setTargetPageId}:TopBarProps)=>{
  const [title, setTitle]= useState<string>("");
  const pageInFavorites :boolean = favorites !==null && favorites.includes(page.id); 
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
  const addOrRemoveFavorite =()=>{
    if(pageInFavorites ){
      removeFavorites(page.id);
    }else{
      addFavorites(page.id)
    };
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
          //onClick={showAllComments}
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
          className={pageInFavorites?"favoriteBtn on" : "favoriteBtn"}
          onClick={addOrRemoveFavorite}
        >
          {pageInFavorites ?
          <AiFillStar/>
          :
          <AiOutlineStar/>
          }
          
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