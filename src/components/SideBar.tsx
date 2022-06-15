import React, { ChangeEvent, CSSProperties, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Block, blockSample, findPage, listItem, Notion, Page, pageSample } from '../modules/notion';
import { detectRange } from './BlockFn';
import { useNavigate } from 'react-router-dom';
import { UserState } from '../modules/user';

//react-icon
import {FiCode ,FiChevronsLeft} from 'react-icons/fi';
import {AiOutlineClockCircle, AiOutlinePlus, AiOutlineStar} from 'react-icons/ai';
import {BiSearchAlt2} from 'react-icons/bi';
import {BsFillTrash2Fill, BsPencilSquare, BsThreeDots} from 'react-icons/bs';
import {IoIosSettings} from 'react-icons/io';
import {HiDownload, HiOutlineDuplicate, HiTemplate} from 'react-icons/hi';
import { MdPlayArrow } from 'react-icons/md';
import Time from './Time';
import PageMenu from './PageMenu';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoArrowRedoOutline } from 'react-icons/io5';
import { SideAppear } from '../modules/side';
import { GrDocumentText } from 'react-icons/gr';
import Trash from './Trash';

type hoverType={
  hover:boolean, 
  target:HTMLElement|null,
  targetItem:listItem |null,
};
type SideBarProps ={
  notion : Notion,
  user:UserState,

  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  deleteBlock: (pageId: string, block: Block) => void,

  addPage : ( newPage:Page, )=>void,
  duplicatePage: (targetPageId: string) => void,
  editPage : (pageId:string , newPage:Page, )=>void,
  deletePage : (pageId:string , )=>void,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,

  addFavorites: (itemId: string) => void,
  removeFavorites: (itemId: string) => void,
  cleanTrash: (itemId: string) => void,
  restorePage: (pageId: string) => void
  changeSide: (appear: SideAppear) => void,

  setTargetPageId: Dispatch<SetStateAction<string>>,

  setOpenQF: Dispatch<React.SetStateAction<boolean>>
};

type ItemTemplageProp ={
  item: listItem,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  hover:hoverType,
  setHover: Dispatch<SetStateAction<hoverType>>,
};
type ListTemplateProp ={
  notion:Notion,
  targetList: listItem[] |null,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  hover:hoverType,
  setHover: Dispatch<SetStateAction<hoverType>>,

};
const ItemTemplate =({item,setTargetPageId ,setHover, hover }:ItemTemplageProp)=>{
  const [toggleStyle ,setToggleStyle]=useState<CSSProperties>({
    transform : "rotate(0deg)" 
  });
  const itemInner =useRef<HTMLDivElement>(null);
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
  const showPageFn=()=>{
    
    if(hover.hover){
      setHover({
        hover:false,
        target:null,
        targetItem:null,
      })
    }else{
      itemInner.current !==null &&
        setHover({
          hover:true,
          target:itemInner.current,
          targetItem:item
        })
    }
    
  }
  return (
  <div 
    className='itemInner pageLink'
    ref={itemInner}
    onMouseOver={showPageFn}
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
        {item.icon !==null ?
          <span>
            {item.icon}
          </span>
          :
          <span>
            < GrDocumentText/>
          </span>
          }
        <span>{item.title}</span>
      </button>
    </div>
  </div>
  )
};

const ListTemplate =({notion,targetList ,setTargetPageId ,hover ,setHover}:ListTemplateProp)=>{
  const findSubPage =(id:string):listItem=>{
    const index =notion.pagesId.indexOf(id);
    const subPage:Page =notion.pages[index];
    return {
      id: subPage.id,
      title: subPage.header.title,
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
            hover={hover}
            setHover={setHover}
          />
        </div>
        {
        item.subPagesId !==null ?
        <div className="subPage">
          <ListTemplate
            notion={notion}     
            targetList={makeTargetList(item.subPagesId)}
            setTargetPageId={setTargetPageId} 
            hover={hover} 
            setHover={setHover}
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

const SideBar =({notion, user ,addBlock,editBlock,deleteBlock,addPage ,duplicatePage,editPage,deletePage,movePageToPage, cleanTrash, restorePage, addFavorites, removeFavorites, changeSide,setTargetPageId ,setOpenQF
}:SideBarProps)=>{
  const inner =document.getElementById("inner");
  const pages =notion.pages;
  const pagesId =notion.pagesId;
  const trashPages=notion.trash.pages;
  const firstPages:Page[] = notion.firstPagesId.map((id:string)=>findPage(notion.pagesId, pages, id));
  const firstlist:listItem[] = firstPages.map((page:Page)=>{
    return {
      id: page.id,
      title: page.header.title,
      icon: page.header.icon,
      subPagesId: page.subPagesId,
      parentsId: page.parentsId,
      editTime: page.editTime,
      createTime:page.createTime
    }
  });
  const trashBtn =useRef<HTMLButtonElement>(null);
  const [hover ,setHover] =useState<hoverType>({
    hover:false,
    target:null,
    targetItem:null,
  });
  const [targetItem,setTargetItem]=useState<listItem|null>(null);
  const [openTrash, setOpenTrash]=useState<boolean>(false);
  const [openSideMoreMenu ,setOpenSideMoreMenu] =useState<boolean>(false);
  const [openPageMenu ,setOpenPageMenu] =useState<boolean>(false);
  const [openRename, setOpenRename]=useState<boolean>(false);
  const [pageFnStyle, setPageFnStyle] =useState<CSSProperties|undefined>(undefined);
  const [trashStyle, setTrashStyle] =useState<CSSProperties|undefined>(undefined);
  const [moreFnStyle, setMoreFnStyle] =useState<CSSProperties|undefined>(undefined);
  const [renameStyle, setRenameStyle]=useState<CSSProperties>();
  const [pageMenuStyle, setPageMenuStyle]=useState<CSSProperties>();
  const [title, setTitle] =useState<string>(targetItem!==null? targetItem.title:"");
  const [icon, setIcon] =useState<string |null>
  (targetItem!==null? targetItem.icon:"");
  const recordIcon =user.userName.substring(0,1);
  const editTime =JSON.stringify(Date.now());

  const makeFavoriteList =(favorites:string[] |null):listItem[]|null=>{
    const list :listItem[]|null =favorites !==null? 
                                favorites.map((id: string)=> {
                                const page =findPage(pagesId,pages,id);
                                const listItem ={
                                id:page.id,
                                title:page.header.title,
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
                                      icon:page.header.icon,
                                      title: page.header.title,
                                      subPagesId: page.subPagesId,
                                      parentsId: page.parentsId,
                                      editTime:page.editTime,
                                      createTime:page.createTime,
                                    })) ;
  const navigate =useNavigate();  
  const addNewPage=()=>{
  };
  const renamePage =(title:string|null, icon:string| null)=>{
    if(targetItem !==null){
      const page =findPage(pagesId,pages, targetItem.id);
      const renamedPage:Page ={
        ...page,
        header:{
          ...page.header,
          title: title !==null ? title :page.header.title,
          icon: icon !== null ? icon : page.header.icon,
        },
        editTime:editTime
      };
      editPage(renamedPage.id, renamedPage );
    };
  };
  const changeIcon =(event:ChangeEvent<HTMLInputElement> )=>{
    const value = event.target.value;
    setIcon(value);
    if(targetItem!==null){
      value !== targetItem.icon &&
      renamePage( null, value );
    }

  }
  const changeTitle =(event:ChangeEvent<HTMLInputElement> )=>{
    const value = event.target.value;
    setTitle(value);
    if(targetItem !==null){
      value !== targetItem.title &&
      renamePage(value, null );
    };
  };
  const addNewSubPage =()=>{
    if(targetItem!==null){
      const targetPage = findPage(pagesId ,pages,targetItem.id);
      const editedTargetPage:Page ={
        ...targetPage,
        subPagesId: targetPage.subPagesId ==null? [...pageSample.id] : targetPage.subPagesId.concat([pageSample.id]),
        editTime:editTime
      };
      const newPageBlock :Block ={
        ...blockSample,
        type:"page",
        parentBlocksId:null,
      };
      addPage(pageSample);
      editPage(targetPage.id, editedTargetPage);
      addBlock(targetPage.id,newPageBlock, targetPage.blocksId.length, targetPage.blocks==null? null: targetPage.blocksId[targetPage.blocksId.length-1]);
    };
  };
  const onClickMoreBtn=()=>{
    setOpenSideMoreMenu(true); 
    if( pageFnStyle !==undefined){
      setMoreFnStyle({
        position: "absolute",
        top: pageFnStyle.top,
        left: pageFnStyle.left,
      });
    }
  };
  const closePopup =(elementId:string ,setState:Dispatch<SetStateAction<boolean>> , event:MouseEvent)=>{
    const element = document.getElementById(elementId);
    const elementDomRect = element?.getClientRects()[0];
    const isInElement = detectRange(event, elementDomRect);
    !isInElement && setState(false);
  };
  inner?.addEventListener("click", (event)=>{
    openSideMoreMenu && closePopup("moreFn",setOpenSideMoreMenu, event );
    openPageMenu && closePopup("pageMenu", setOpenPageMenu, event);
    openRename && closePopup("rename", setOpenRename ,event);
  } );
  const onClickToDelete=()=>{
    setOpenSideMoreMenu(false);
    const changePage =(pageId:string)=>{
      setTargetPageId(pageId);
      navigate(`/${pageId}`);
      const hash = window.location.hash;
      console.log("hash", hash)
      targetItem!==null && 
      deletePage(targetItem.id)
    };
    if(targetItem!==null){
      const hash =window.location.hash;
      const lastSlash =hash.lastIndexOf("/");
      const currentPageId = hash.slice(lastSlash+1);
      if(targetItem.id ===currentPageId){
        if((user.favorites==null)||
        (user.favorites[0]===targetItem.id && user.favorites.length ===1)){
          const firstPageId= firstlist[0].id;
          (firstPageId ===targetItem.id )?
          changePage(firstlist[1].id):
          changePage(firstPageId);
        }else{
          console.log("move to", user.favorites[0]);
          changePage(user.favorites[0])
          setTargetPageId(user.favorites[0]);
      };
      }else{
        deletePage(targetItem.id);
      };
      
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
    if(hover.target !==null && targetItem!==null){
      setIcon(targetItem.icon);
      setTitle(targetItem.title);
      const domRect =hover.target.getClientRects()[0];
      setRenameStyle({
        position:"absolute",
        top: domRect.bottom,
        left:domRect.left +10,
        width:domRect.width + 50
      })
    }
  };
  const onClickTrashBtn=(event:React.MouseEvent)=>{
    setOpenTrash(true);
    if(trashBtn.current){
      const domRect =trashBtn.current.getClientRects()[0];
      setTrashStyle({
        position:"absolute",
        top: domRect.top - 50,
        left: domRect.right,
      })
    }
  }
  useEffect(()=>{
    if(hover.hover){
      setTargetItem(hover.targetItem);
      const sideBarPageFn =document.getElementById("sideBarPageFn");
      const sideBarPageFnDomRect =sideBarPageFn?.getClientRects()[0];
      const domRect =hover.target?.getClientRects()[0];
      if(domRect !==undefined && sideBarPageFnDomRect !==undefined){
        setPageFnStyle({
          position:"absolute",
          top: domRect.top ,
          left: domRect.right - sideBarPageFnDomRect.width - 10,
          height:domRect.height,
        });
      }
    }
  },[hover.hover]);

  useEffect(()=>{
    
  },[openSideMoreMenu]);

  return(
    <>
    <div id="sideBar">
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
                hover={hover}
                setHover={setHover}
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
              >
                <AiOutlinePlus/>
              </button>
            </div>
            <div className="list">
              <ListTemplate 
                notion={notion}
                targetList={list}
                setTargetPageId={setTargetPageId}
                hover={hover}
                setHover={setHover}
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
        <div className= "addNewPage">
          <button
            onClick={addNewPage}
          >
            <AiOutlinePlus/>
            <span>New page</span>
          </button>
        </div>
      </div>
      {hover.hover &&
          <div 
            id="sideBarPageFn"
            style={pageFnStyle}
          >
          <button  
            className='moreBtn'
            title='delete, duplicate, and more'
            onClick={onClickMoreBtn}
          >
            <BsThreeDots/>
          </button>
          <button 
            className='addPageBtn'
            title="Quickly add a page inside"
            onClick={addNewSubPage}
          >
            <AiOutlinePlus/>
          </button>
          </div>
    }
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
        editBlock={editBlock}
        addPage={addPage}
        movePageToPage={movePageToPage}
        setMenuOpen={setOpenSideMoreMenu}
      />
    </div>
    }
    {openRename &&
      <div 
        id='rename'
        style={renameStyle}
      >
          <input
            className="rename_icon"
            type="text"
            onChange={changeIcon}
            value={icon !== null? icon :""}
          />
          <input
            className="rename_title"
            onChange={changeTitle}
            type="text"
            value ={title}
          />
      </div>
    }
    {openTrash && trashPages!==null &&
      <Trash
        style={trashStyle}
        trashPages={trashPages}
        cleanTrash={cleanTrash}
        restorePage={restorePage}
        setTargetPageId={setTargetPageId}
        setOpenTrash={setOpenTrash}
      />
    }
    </div>
    </>
  )
};

export default React.memo(SideBar)