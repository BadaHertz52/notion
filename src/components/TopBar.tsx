import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { pathType } from '../containers/NotionRouter';
import {   Block, listItem, Page } from '../modules/notion';
import {  SideAppear } from '../modules/side';
import PageMenu from './PageMenu';

import { AiOutlineMenu} from 'react-icons/ai';
import { FiChevronsLeft } from 'react-icons/fi';
import { AiFillStar, AiOutlineClockCircle, AiOutlineStar } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowRedoOutline } from 'react-icons/io5';
import { GrDocumentUpload } from 'react-icons/gr';
import { CSSProperties } from 'styled-components';

type TopBarProps ={
  firstlist:listItem[],
  favorites:string[]|null,
  sideAppear:SideAppear,
  page:Page,
  pages:Page[],
  pagePath: pathType[] |null ,

  addBlock:(pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  editBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block, isInMenu: boolean) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,

  addPage: (newPage: Page) => void
  deletePage: (pageId: string) => void,
  movePageToPage: (targetPageId: string, destinationPageId: string) => void,

  changeSide: (appear: SideAppear) => void,
  
  removeFavorites: (itemId: string) => void,

  addFavorites: (itemId: string) => void
  setTargetPageId:Dispatch<SetStateAction<string>>,
  showAllComments:boolean,
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
};
export const defaultFontFamily ='ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"' ;
const TopBar =({ firstlist,favorites,sideAppear,page , pages ,pagePath, addBlock, editBlock ,changeBlockToPage ,deleteBlock ,addPage,deletePage, movePageToPage, changeSide ,addFavorites,removeFavorites ,setTargetPageId  , showAllComments, setShowAllComments}:TopBarProps)=>{
  const [title, setTitle]= useState<string>("");
  const [openPageMoreFun, setOpenPageMoreFun] =useState<boolean>(false);
  const [openPageMenu, setOpenPageMenu]=useState<boolean>(false);
  const pageInFavorites = favorites?.includes(page.id); 

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
    };
    
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

  const addOrRemoveFavorite=()=>{
    pageInFavorites ?
    removeFavorites(page.id):
    addFavorites(page.id);
  }
  const onClickViewAllComments=()=>{
    setShowAllComments(!showAllComments)
  };
  const defaultStyle ="default";
  const serif ="serif"; 
  const mono ="mono";
  type fontStyle =typeof defaultStyle | typeof serif |typeof mono; 
  const returnFontFamily =(font:fontStyle)=>{
    const style:CSSProperties ={
      fontFamily: font
    };
    return style
  };
  const changeFontStyle=(event:React.MouseEvent ,font: fontStyle )=>{
    const currentTarget =event.currentTarget;
    const targetFontSample = currentTarget.firstElementChild;
    const fontSample =[...document.getElementsByClassName("fontSample")];
    fontSample.forEach((element:Element)=>{
      element.classList.contains("on") && 
      element.classList.remove("on"); 
    });
    targetFontSample!==null && targetFontSample.classList.add("on");
    const frame_inner = [...document.getElementsByClassName("frame_inner")];
    const serifFontFamily ='Lyon-Text, Georgia, ui-serif, serif';
    const monoFontFamily ='iawriter-mono, Nitti, Menlo, Courier, monospace'; 

    let fontFamily =defaultFontFamily;
    
    switch (font) {
      case "default":
        fontFamily =defaultFontFamily;
        break;
      case "serif":
        fontFamily =serifFontFamily;
        break;
      case "mono":
        fontFamily =monoFontFamily;
        break;
      default:
        break;
    };
    frame_inner.forEach((content:Element)=> content.setAttribute("style",`font-family:${fontFamily}` ))
  }
  
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
          onClick={onClickViewAllComments}
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
          onClick={()=>setOpenPageMoreFun(!openPageMoreFun)}
        >
          <BsThreeDots/>
        </button>
        {openPageMoreFun &&
          <div
            className="pageMoreFun"
          >
            <div className='inner'>
                <div className='fontStyle'>
                  <div className='fontStyleHeader'>
                    STYLE
                  </div>
                  <div className='fontStyleBtns'>
                    <button
                      onClick={(event)=>changeFontStyle( event,"default")}
                    >
                      <div 
                        className='fontSample on'
                        style={returnFontFamily("default")}>
                        Ag
                      </div>
                      <div className='fontName'>
                        Default
                      </div>
                    </button>
                    <button
                      onClick={(event)=>changeFontStyle( event,"serif")}
                    >
                      <div
                        className='fontSample'
                        style={returnFontFamily("serif")}
                      >
                        Ag
                      </div>
                      <div className='fontName'>
                        Serif
                      </div>
                    </button>
                    <button
                      onClick={(event)=>changeFontStyle(event,"mono")}
                    >
                      <div
                        className='fontSample'
                        style={returnFontFamily("mono")}
                      >
                        Ag
                      </div>
                      <div className='fontName'>
                        Mono
                      </div>
                    </button>
                  </div>
                </div>
                <div className="size">
                  <button
                    onClick={changeFontSize}
                  >
                    <div>Small text</div>
                    <label className='switchBtn'>
                      <span className='slider'></span>
                    </label>
                  </button>
                  <button>
                    <div>Full with</div>
                    <label className='switchBtn'>
                      <span className='slider'></span>
                    </label>
                  </button>
                  <div></div>
                </div>
                <div className="function">
                  <button
                    className={pageInFavorites?"favoriteBtn on" : 
                    "favoriteBtn"}
                    onClick={addOrRemoveFavorite}
                  >
                    {pageInFavorites ?
                      <AiFillStar/>
                      :
                      <AiOutlineStar/>
                    }
                    <span className='label'>
                    {pageInFavorites ?
                      "Remove from Favorites"
                      :
                      "Add to Favorites"
                    }
                    </span>
                  </button>
                  <button
                    onClick={()=>deletePage(page.id)}
                  >
                    <RiDeleteBin6Line/>
                    <span className='label'>
                      Delete
                    </span>
                  </button>
                  <button
                    onClick={()=>setOpenPageMenu(!openPageMenu)}
                  >
                    <IoArrowRedoOutline/>
                    <span className='label'>
                      Move to
                    </span>
                  </button>
                  <button>
                    <GrDocumentUpload/>
                    <div>
                      <span className='label'>Export</span>
                      <span>PDF,HTML,Markdown</span>
                    </div>
                  </button>
                </div>
            </div>
          </div>
        }
        {openPageMenu &&
        <PageMenu
          what="page"
          currentPage={page}
          firstlist={firstlist}
          pages={pages}
          addBlock={addBlock}
          editBlock={editBlock}
          changeBlockToPage={changeBlockToPage}
          deleteBlock={deleteBlock}
          addPage={addPage}
          movePageToPage={movePageToPage}
          setMenuOpen={setOpenPageMenu}
          setTargetPageId={setTargetPageId}
        />
        }
      </div>
    </div>
  )
};

export default React.memo(TopBar);