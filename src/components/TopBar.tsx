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
import PageIcon from './PageIcon';
import { detectRange } from './BlockFn';

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
  setAllCommentsStyle:Dispatch<SetStateAction<CSSProperties>>,
  smallText:boolean,
  setSmallText:Dispatch<SetStateAction<boolean>>,
  fullWidth:boolean,
  setFullWidth:Dispatch<SetStateAction<boolean>>,
  setOpenExport :Dispatch<SetStateAction<boolean>>,
};
export const defaultFontFamily ='ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"' ;
const TopBar =({ firstlist,favorites,sideAppear,page , pages ,pagePath, addBlock, editBlock ,changeBlockToPage ,deleteBlock ,addPage,deletePage, movePageToPage, changeSide ,addFavorites,removeFavorites ,setTargetPageId  , showAllComments, setShowAllComments ,setAllCommentsStyle , smallText, setSmallText ,fullWidth, setFullWidth ,setOpenExport}:TopBarProps)=>{
  const inner =document.getElementById("inner");
  const [title, setTitle]= useState<string>("");
  const [openPageMoreFun, setOpenPageMoreFun] =useState<boolean>(false);
  const [openPageMenu, setOpenPageMenu]=useState<boolean>(false);
  const pageInFavorites = favorites?.includes(page.id); 

  const onClickSideBarBtn =(event:React.MouseEvent)=>{
    const target =event.target as HTMLElement;
    const targetTag =target.tagName.toLowerCase();
    const width =window.outerWidth;
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
    //changeAllCommentAndTopBarStyle()
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
  };
  const changeFontSize=()=>{
    setSmallText(!smallText);
  };

  const changeWidth=(event:React.MouseEvent)=>{
    const width= window.innerWidth;
    !(width<1024 && sideAppear ==="lock") && setFullWidth(!fullWidth);
  };
  const onClickMoveTo=()=>{
    setOpenPageMoreFun(false);
    setOpenPageMenu(!openPageMenu);
  };
  
  function changeAllCommentAndTopBarStyle(){
    const innerWidth =window.innerWidth;
    const topbar_left =document.querySelector(".topbar_left");
    const pageFun =document.querySelector(".pageFun");
    const pagePath =document.querySelectorAll(".pagePath");
    const changePathWidth=(topbarLeftWidth:number)=>{
      const width :number =((topbarLeftWidth -32) / pagePath.length);
      pagePath.forEach((e:Element)=> e.setAttribute("style",`max-width:${width}px`));
    };
    if(showAllComments){
      setAllCommentsStyle({transform:"translateX(0)"});
      if(innerWidth >= 385){
        const newWidth =innerWidth -(12+385+5);
        topbar_left?.setAttribute("style", `width: ${newWidth}px`);
        pageFun?.setAttribute("style", "width:385px");
        changePathWidth(newWidth);
      }else{
        changePathWidth(innerWidth * 0.5);
        topbar_left?.setAttribute("style", "width:50%");
        pageFun?.setAttribute("style", "width:50%");
      }
    }else{
      setAllCommentsStyle({transform:`translateX(${innerWidth}px)`});
      topbar_left?.setAttribute("style", "width:50%");
      changePathWidth( (innerWidth * 0.5) -26);
    };
  }
  window.onresize= changeAllCommentAndTopBarStyle;

  useEffect(()=>{
    if(sideAppear ==="float"){
      setTitle("Lock sideBar open")
    }
    if(sideAppear ==="close"){
      setTitle("Float sideBar ")
    }
  },[]);

  inner?.addEventListener("click", function(event:MouseEvent){
    if(openPageMenu){
      const pageMenu = document.getElementById("pageMenu");
      const pageMenuDomRect =pageMenu?.getClientRects()[0]; 
      const isInnnerMenu =detectRange(event, pageMenuDomRect);
      !isInnnerMenu && setOpenPageMenu(false);
    }
  });
  return(
    <div 
      className="topbar"
    >
      <div className='topbar_left'>
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
              <PageIcon
                icon={page.header.icon}
                iconType={page.header.iconType}
                style={undefined}
              />
              <div>
                {page.header.title? 
                page.header.title 
                : 
                ""}
              </div>
            </button>
          :
            pagePath.map((path:pathType )=>
            <button 
              className="pagePath" 
              key={pagePath.indexOf(path)}
              onClick={()=>setTargetPageId(path.id)}
              >
              {pagePath.indexOf(path)!==0 &&
              <div className='pathSlash'>
                /
              </div> 
              }
              <div className='pageLink'>
                <a 
                  href='path'
                  onClick={()=>setTargetPageId(path.id)}
                >
                  <div className='pathIcon'>
                    <PageIcon
                      icon={path.icon}
                      iconType={path.iconType}
                      style={undefined}
                    />
                  </div>
                  <div className='pathTitle'
                  >
                    <div>{path.title}</div>
                  </div>
                </a>
              </div>
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
                      <span className={smallText? "slider on": "slider"}></span>
                    </label>
                  </button>
                  <button
                    onClick={changeWidth}
                  >
                    <div>Full width</div>
                    <label className='switchBtn'>
                      <span className={fullWidth? "slider on":"slider"}></span>
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
                    onClick={onClickMoveTo}
                  >
                    <IoArrowRedoOutline/>
                    <span className='label'>
                      Move to
                    </span>
                  </button>
                  <button
                    onClick={()=>{setOpenExport(true); setOpenPageMoreFun(false)}}
                  >
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