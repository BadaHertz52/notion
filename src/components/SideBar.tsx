import React, {  CSSProperties, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Block, blockSample, findPage, listItem, Notion, Page, pageSample } from '../modules/notion';
import { detectRange } from './BlockFn';
import { UserState } from '../modules/user';
import Trash from './Trash';
import Rename from './Rename';
import Time from './Time';
import PageMenu from './PageMenu';

//react-icon
import {FiCode ,FiChevronsLeft} from 'react-icons/fi';
import {AiOutlineClockCircle,  AiOutlinePlus, AiOutlineStar} from 'react-icons/ai';
import {BiSearchAlt2} from 'react-icons/bi';
import {BsFillTrash2Fill, BsPencilSquare, BsThreeDots} from 'react-icons/bs';
import {IoIosSettings} from 'react-icons/io';
import {HiDownload, HiOutlineDuplicate, HiTemplate} from 'react-icons/hi';
import { MdPlayArrow } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowRedoOutline } from 'react-icons/io5';
import PageIcon from './PageIcon';
import { SideBarContainerProp } from '../containers/SideBarContainer';

export const closePopup =(elementId:string ,setState:Dispatch<SetStateAction<boolean>> , event:MouseEvent)=>{
  const element = document.getElementById(elementId);
  const elementDomRect = element?.getClientRects()[0];
  const isInElement = detectRange(event, elementDomRect);
  !isInElement && setState(false);
};

type SideBarProps = SideBarContainerProp & {
  notion : Notion,
  user:UserState
};

type ItemTemplageProp ={
  item: listItem,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  onClickMoreBtn :(item: listItem, target: HTMLElement) => void, 
  addNewSubPage : (item: listItem) => void,
};
type ListTemplateProp ={
  notion:Notion,
  targetList: listItem[] |null,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  onClickMoreBtn :(item: listItem, target: HTMLElement) => void, 
  addNewSubPage : (item: listItem) => void,
};
const ItemTemplate =({item,setTargetPageId ,onClickMoreBtn, addNewSubPage  }:ItemTemplageProp)=>{
  const [toggleStyle ,setToggleStyle]=useState<CSSProperties>({
    transform : "rotate(0deg)" 
  });
  const sideBarPageFn = useRef<HTMLDivElement>(null);
  const onToggleSubPage =(event:React.MouseEvent)=>{
    const target =event.target as HTMLElement ;
    const toggleSubPage=(subPageElement:null|undefined|Element)=>{
      if(subPageElement !==null && subPageElement !== undefined){
        subPageElement.classList.toggle("on");
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
  const showPageFn =()=>{
    if(sideBarPageFn.current!==null){
      sideBarPageFn.current.classList.toggle("on");
    }
  };
  const removeOn =()=>{
    if(sideBarPageFn.current!==null){
      sideBarPageFn.current.classList.contains("on")&&
      sideBarPageFn.current.classList.remove("on")
    }
  }
  return (
  <div 
    className='itemInner pageLink'
    onMouseOver ={showPageFn}
    onMouseOut ={removeOn}
  >
    <div className='pageItem'>
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
        <PageIcon
          icon ={item.icon}
          iconType={item.iconType}
          style={undefined}
        />
        <div>{item.title}</div>
      </button>

    </div>
    <div 
      className="sideBarPageFn"
      ref={sideBarPageFn}
    >
      <button  
        className='moreBtn'
        title='delete, duplicate, and more'
        onClick={()=>{
          sideBarPageFn.current!==null &&
          onClickMoreBtn(item,sideBarPageFn.current );
        }}
      >
        <BsThreeDots/>
      </button>
      <button 
        className='addPageBtn'
        title="Quickly add a page inside"
        onClick={()=>{
          addNewSubPage(item);
        }}
      >
        <AiOutlinePlus/>
      </button>
    </div>
  </div>
  )
};

const ListTemplate =({notion,targetList ,setTargetPageId , onClickMoreBtn, addNewSubPage}:ListTemplateProp)=>{
  const findSubPage =(id:string):listItem=>{
    const index =notion.pagesId.indexOf(id);
    const subPage:Page =notion.pages[index];
    return {
      id: subPage.id,
      title: subPage.header.title,
      iconType:subPage.header.iconType,
      icon: subPage.header.icon,
      subPagesId:subPage.subPagesId,
      parentsId: subPage.parentsId,
      editTime:subPage.editTime,
      createTime:subPage.createTime,
    };
  };
  const makeTargetList =(ids:string[]):listItem[]=>{
    const listItemArry:listItem[] = ids.map((id:string)=>findSubPage(id));
    return listItemArry
  };
  return(
    <ul>
    {targetList?.map((item:listItem)=> 
      <li       
        id={`item_${item.id}`} 
        key={item.id}
      >
        <div className='mainPage'>
          <ItemTemplate 
            item={item}
            setTargetPageId={setTargetPageId}
            onClickMoreBtn={onClickMoreBtn}
            addNewSubPage={addNewSubPage}
          />
        </div>
        {
        item.subPagesId !==null ?
        <div className="subPage">
          <ListTemplate
            notion={notion}     
            targetList={makeTargetList(item.subPagesId)}
            setTargetPageId={setTargetPageId} 
            onClickMoreBtn={onClickMoreBtn}
            addNewSubPage={addNewSubPage}
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

const SideBar =({notion, user,sideAppear  ,addBlock,editBlock,deleteBlock ,changeBlockToPage,addPage ,duplicatePage,editPage,deletePage,movePageToPage, cleanTrash, restorePage, addFavorites, removeFavorites, changeSide,setTargetPageId ,setOpenQF 
}:SideBarProps)=>{
  const inner =document.getElementById("inner");
  const pages =notion.pages;
  const pagesId =notion.pagesId;
  const trashPages=notion.trash.pages;
  const trashPagesId=notion.trash.pagesId;
  const firstPages:Page[] = notion.firstPagesId.map((id:string)=>findPage(notion.pagesId, pages, id));
  const firstlist:listItem[] = firstPages.map((page:Page)=>{
    return {
      id: page.id,
      title: page.header.title,
      iconType:page.header.iconType,
      icon: page.header.icon,
      subPagesId: page.subPagesId,
      parentsId: page.parentsId,
      editTime: page.editTime,
      createTime:page.createTime
    }
  });
  const trashBtn =useRef<HTMLButtonElement>(null);
  const [target ,setTarget] =useState<HTMLElement|null>(null);
  const [targetItem,setTargetItem]=useState<listItem|null>(null);
  const [targetPage, setTargetPage] =useState<Page|null>(null);
  const [openTrash, setOpenTrash]=useState<boolean>(false);
  const [openSideMoreMenu ,setOpenSideMoreMenu] =useState<boolean>(false);
  const [openPageMenu ,setOpenPageMenu] =useState<boolean>(false);
  const [openRename, setOpenRename]=useState<boolean>(false);
  const [trashStyle, setTrashStyle] =useState<CSSProperties|undefined>(undefined);
  const [moreFnStyle, setMoreFnStyle] =useState<CSSProperties|undefined>(undefined);
  const [renameStyle, setRenameStyle]=useState<CSSProperties>();
  const [pageMenuStyle, setPageMenuStyle]=useState<CSSProperties>();

  const recordIcon =user.userName.substring(0,1);
  const makeFavoriteList =(favorites:string[] |null):listItem[]|null=>{
    const list :listItem[]|null =favorites !==null? 
                                favorites.map((id: string)=> {
                                const page =findPage(pagesId,pages,id);
                                const listItem ={
                                id:page.id,
                                title:page.header.title,
                                iconType:page.header.iconType,
                                icon:page.header.icon,
                                subPagesId: page.subPagesId,
                                parentsId: page.parentsId,
                                editTime:page.editTime,
                                createTime:page.createTime,
                              };
                                return listItem
                                }) 
                                :
                                null;
  return list
} ;
  const list:listItem[] = firstPages.filter((page:Page)=> page.parentsId ==null)
                                    .map((page:Page)=> (
                                    { id:page.id,
                                      iconType:page.header.iconType,
                                      icon:page.header.icon,
                                      title: page.header.title,
                                      subPagesId: page.subPagesId,
                                      parentsId: page.parentsId,
                                      editTime:page.editTime,
                                      createTime:page.createTime,
                                    })) ; 
  const addNewPage=()=>{
    addPage(pageSample)
  };

  const addNewSubPage =(item:listItem)=>{
    const targetPage = findPage(pagesId ,pages,item.id);
    const newPageBlock :Block ={
      ...blockSample,
      type:"page",
      parentBlocksId:null,
    };
    addBlock(targetPage.id,newPageBlock, targetPage.blocksId.length, targetPage.blocks==null? null: targetPage.blocksId[targetPage.blocksId.length-1]);
  };
  
  const onClickMoreBtn=(item:listItem, target:HTMLElement)=>{
    setOpenSideMoreMenu(true); 
    setTargetItem(item);
    setTarget(target);
      const position = target.getClientRects()[0];
      setMoreFnStyle({
        position: "absolute",
        top: position.top,
        left: position.right,
      });
  };


  inner?.addEventListener("click", (event)=>{
    openSideMoreMenu && closePopup("moreFn",setOpenSideMoreMenu, event );
    openPageMenu && closePopup("pageMenu", setOpenPageMenu, event);
    openRename && closePopup("rename", setOpenRename ,event);

    openTrash && closePopup("trash",setOpenTrash, event );
  } );

  const onClickToDelete=()=>{
    setOpenSideMoreMenu(false);
    if(targetItem!==null){
      deletePage(targetItem.id);
    };
  };
  const onClickMoveToBtn =()=>{
    setOpenPageMenu(true); 
    setOpenSideMoreMenu(false);
    if(moreFnStyle!==undefined){
      setPageMenuStyle({
        position:"absolute",
        top: moreFnStyle.top,
        left: moreFnStyle.left
      })
    }
  };
  const onClickToAddFavorite=()=>{ 
    setOpenSideMoreMenu(false);
    targetItem!==null && 
    addFavorites(targetItem.id);
  };
  const onClickToRemoveFavorite=()=>{
    setOpenSideMoreMenu(false);
    targetItem!==null &&
    removeFavorites(targetItem.id);
  };
  const onClickToDuplicate=()=>{
    setOpenSideMoreMenu(false);
    targetItem!==null &&
    duplicatePage(targetItem.id);
  };
  const  onClickToRename=()=>{
    setOpenSideMoreMenu
    (false);
    setOpenRename(true);
    if(targetItem!==null && 
      target !==null &&
      target?.parentElement !==null){
      const domRect =target.parentElement.getClientRects()[0];
      setRenameStyle({
        position:"absolute",
        top: domRect.bottom,
        left:domRect.left +10,
        width:domRect.width 
      })
    }
  };
  const changeTrashStyle =()=>{
    if(trashBtn.current){
      const domRect =trashBtn.current.getClientRects()[0];
      setTrashStyle({
        position:"absolute",
        top: domRect.top - 100,
        left: window.innerWidth >=768? domRect.right + 50 : window.innerWidth * 0.2
      })
    }
  };
  window.onresize =changeTrashStyle;
  const onClickTrashBtn=(event:React.MouseEvent)=>{
    setOpenTrash(true);
    changeTrashStyle();
  };
  const onMouseOutSideBar =()=>{
    sideAppear ==="float" && changeSide("floatHide"); 
  };

  useEffect(()=>{
    if(targetItem!==null){
      const page =findPage(pagesId,pages, targetItem.id);
      setTargetPage(page);
    }
  },[targetItem]);
  return(
  <div
  onMouseLeave={onMouseOutSideBar}
  >
    <div 
      className="sideBar"

    >
    <div className="sideBar_inner">
      <div>
        <div className="switcher">
          <div className='itemInner'>
            <div>
              <div className="record-icon">
                <div>
                  {recordIcon}
                </div>

              </div>
              <div className='user'>
                <div>{user.userName}'s Notion</div>
                <div><FiCode/></div>
              </div>
            </div>
            <button 
              className='closeSideBarBtn sideBarBtn' 
              onClick={()=>changeSide("close")}
            >
              <FiChevronsLeft/>
            </button>
          </div>
        </div>
        <div className="fun1">
          <button
            onClick={()=>setOpenQF(true)}
          >
            <div className='itemInner'>
              <BiSearchAlt2/>
              <span>Quick Find</span>
            </div>
          </button>
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
            {user.favorites!==null &&
            <div className="list">
              <ListTemplate  
                notion ={notion}
                targetList={makeFavoriteList(user.favorites)}
                setTargetPageId={setTargetPageId}
                onClickMoreBtn={onClickMoreBtn}
                addNewSubPage={addNewSubPage}
              />
            </div>
            }
          </div>
          <div className="private">
            <div className="header">
              <span>PRIVATE</span>
              <button 
                className='addPageBtn'
                title="Quickly add a page inside"
                onClick={addNewPage}
              >
                <AiOutlinePlus/>
              </button>
            </div>
            <div className="list">
              {notion.pages[0]!==undefined &&
              <ListTemplate 
                notion={notion}
                targetList={list}
                setTargetPageId={setTargetPageId}
                onClickMoreBtn={onClickMoreBtn}
                addNewSubPage={addNewSubPage}
              /> }
            </div>
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
            <button
              onClick={onClickTrashBtn}
              ref={trashBtn}
            >
              <div className="itemInner">
                <BsFillTrash2Fill/>
                <span>Trash</span>
              </div>
            </button>
          </div>
      </div>
      {/* <a href="https://icons8.com/icon/11732/페이지-개요">페이지 개요 icon by Icons8</a> */}
      <div className= "addNewPageBtn">
        <button
          onClick={addNewPage}
        >
          <AiOutlinePlus/>
          <span>New page</span>
        </button>
      </div>
    </div>
    </div>
    {openSideMoreMenu && targetItem !==null &&
      <div 
        id='moreFn'
        style={moreFnStyle}
      >
        <button
          className='moreFn_fn'
          onClick={onClickToDelete}
        >
          <div>
            <RiDeleteBin6Line/>
            <span className=''>
              Delete
            </span>
          </div>
        </button>
        {user.favorites?.includes(targetItem.id) ?
            <button
            className='moreFn_fn'
            onClick={onClickToRemoveFavorite}
          >  
            <div>
              <AiOutlineStar/>
              <span>Remove to Favorites</span>
            </div>
          </button>
        :
          <button
          className='moreFn_fn'
          onClick={onClickToAddFavorite}
          >  
            <div>
              <AiOutlineStar/>
              <span>Add to Favorites</span>
            </div>
          </button>
        }

        <button
          className='moreFn_fn'
          onClick={onClickToDuplicate}
        >
          <div>
            <HiOutlineDuplicate/>
            <span>Duplicate</span>
            <span></span>
          </div>
        </button>
        <button
          className='moreFn_fn'
          onClick={onClickToRename}
        >
          <div>
            <BsPencilSquare/>
            <span>Rename</span>
            <span className="">
              Ctrl+Shift+R
            </span>
          </div>
        </button>
        <button 
          className='moreFn_fn'
          onClick={onClickMoveToBtn}
        >
          <div> 
            <IoArrowRedoOutline/>
            <span>Move to</span>
            <span>Ctrl+Shift+P</span>
          </div>
        </button>
        <div className='edit_inform'>
          <p>
            Last edited by {user.userName} 
          </p>
            <Time 
              editTime={targetItem.editTime}
            />
        </div>
      </div>
    }
    {openPageMenu && targetItem !==null &&
    <div 
      id ="sideBar_pageMenu"
      style={pageMenuStyle}
    >
      <PageMenu
        what="page"
        currentPage={findPage(pagesId, pages, targetItem.id)}
        pages={pages}
        firstlist={firstlist}
        addBlock={addBlock}
        deleteBlock={deleteBlock}
        changeBlockToPage={changeBlockToPage}
        editBlock={editBlock}
        addPage={addPage}
        movePageToPage={movePageToPage}
        setMenuOpen={setOpenSideMoreMenu}
        setTargetPageId={setTargetPageId}
      />
    </div>
    }
    {openRename && targetPage !==null &&
      <Rename
        currentPageId={null}
        block={null}
        page={targetPage}
        editBlock={editBlock}
        editPage={editPage}
        renameStyle={renameStyle}
        setOpenRename={setOpenRename}
      />
    }
    {openTrash && 
      <Trash
        style={trashStyle}
        trashPagesId={trashPagesId}
        trashPages={trashPages}
        pages={pages}
        pagesId={pagesId}
        cleanTrash={cleanTrash}
        restorePage={restorePage}
        setTargetPageId={setTargetPageId}
        setOpenTrash={setOpenTrash}
      />
    }
  </div>
  )
};

export default React.memo(SideBar)