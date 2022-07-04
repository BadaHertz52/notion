import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { pathType } from '../containers/NotionRouter';
import {   Block, listItem, Page } from '../modules/notion';
import {  SideAppear } from '../modules/side';

import { AiOutlineMenu} from 'react-icons/ai';
import { FiChevronsLeft } from 'react-icons/fi';
import { AiFillStar, AiOutlineClockCircle, AiOutlineStar } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowRedoOutline } from 'react-icons/io5';
import PageMenu from './PageMenu';

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
}
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
            id="pageMoreFun"
          >
            <div className='inner'>
                <div className='fontStyle'>
                  <div>
                    STYLE
                  </div>
                  <button>
                    <div>Ag</div>
                    <div>Default</div>
                  </button>
                  <button>
                    <div>Ag</div>
                    <div>Serif</div>
                  </button>
                  <button>
                    <div>Ag</div>
                    <div>Mono</div>
                  </button>
                </div>
                <div className="size">
                  <button>
                    <div>Small text</div>
                    <div className='switchBtn'>
                      <span className='circleBtn'></span>
                    </div>
                  </button>
                  <button>
                    <div>Full with</div>
                    <div className='switchBtn'>
                      <span className='circleBtn'></span>
                    </div>
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
                    <span className='icon'></span>
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