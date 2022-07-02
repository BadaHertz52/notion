import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiOutlineMenu} from 'react-icons/ai';
import { FiChevronsLeft } from 'react-icons/fi';
import { pathType } from '../containers/NotionRouter';
import {   Page } from '../modules/notion';
import {  SideAppear } from '../modules/side';
import PageFun from './PageFun';

type TopBarProps ={
  favorites:string[]|null,
  sideAppear:SideAppear,
  page:Page,
  pagePath: pathType[] |null ,
  changeSide: (appear: SideAppear) => void,
  removeFavorites: (itemId: string) => void,
  addFavorites: (itemId: string) => void
  setTargetPageId:Dispatch<SetStateAction<string>>,
  showAllComments:boolean,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
}
const TopBar =({favorites,sideAppear,page,pagePath, changeSide ,addFavorites,removeFavorites ,setTargetPageId  , showAllComments, setShowAllComments}:TopBarProps)=>{
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
    const width =window.outerWidth;
    console.log("width,", width);
    if(showAllComments && width <1000 ){
      setShowAllComments(false);
    }
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
      {!showAllComments &&
        <PageFun
          favorites={favorites}
          page={page}
          removeFavorites={removeFavorites}
          addFavorites={addFavorites}
          setShowAllComments={setShowAllComments}
        />
      }
    </div>
  )
};

export default React.memo(TopBar);