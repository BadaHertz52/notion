import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  Route, Routes, useNavigate} from 'react-router-dom';
import { CSSProperties } from 'styled-components';
import AllComments from '../components/AllComments';
import Export from '../components/Export';
import Loading from '../components/Loading';
import QuickFindBord from '../components/QuickFindBord';
import Templates from '../components/Templates';
import { RootState } from '../modules';
import { add_block, add_page, add_template, Block, cancle_edit_template, change_block_to_page, change_page_to_block, change_to_sub, clean_trash, delete_block, delete_page, delete_template, duplicate_page, edit_block, edit_page,  emojiPath,  findPage,  IconType,  listItem,  move_page_to_page, Page, pageSample, raise_block, restore_page } from '../modules/notion';
import { change_side, SideAppear } from '../modules/side';
import { add_favorites, add_recent_page, clean_recent_page, remove_favorites } from '../modules/user';
import EditorContainer from './EditorContainer';
import SideBarContainer from './SideBarContainer';
export type pathType={
  id:string,
  title:string,
  icon:string|null,
  iconType:IconType
};
export   type DiscardItemType ={
  discard:boolean
}
export const defaultFontFamily ='ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"' ;
export const serifFontFamily ='Lyon-Text, Georgia, ui-serif, serif';
export const monoFontFamily ='iawriter-mono, Nitti, Menlo, Courier, monospace'; 
export type fontStyleType =typeof serifFontFamily| typeof monoFontFamily|typeof defaultFontFamily;

export const makePagePath=(page:Page ,pagesId:string[], pages:Page[]):pathType[]|null=>{
  if(page.parentsId !==null){
    const parentPages:Page[] = page.parentsId.map((id:string)=>findPage(pagesId,pages,id));
    const pagePath:pathType[] =parentPages.concat(page).map((p:Page)=>({
      id:p.id,
      title:p.header.title,
      icon:p.header.icon,
      iconType:p.header.iconType,
    }));
    return pagePath;
  }else{
    return (
      [{
        id:page.id,
        title:page.header.title,
        icon:page.header.icon,
        iconType:page.header.iconType
        }])
  }
};
export const makeRoutePath=(page:Page ,pagesId:string[], pages:Page[]):string=>{
  let path ="";
  if(page.parentsId ==null){
    path =`/${page.id}`;
  }else{
    const pagePath=makePagePath(page, pagesId, pages);
    if(pagePath!==null){
      let PATH ="";
        for (let i = 0; i <= pagePath.length; i++) {
          if(i<pagePath.length){
            const element:pathType = pagePath[i];
            const id :string =element.id;
            PATH =PATH.concat(`/${id}`);
            if(i=== pagePath.length-1){
              path =PATH;
            };
          }
      };
    };
  };
  return path;
};
const NotionRouter =()=>{
  const navigate= useNavigate();
  const dispatch =useDispatch();
  const notion = useSelector((state:RootState)=> state.notion);
  const pagesId =notion.pagesId;
  const pages =notion.pages;
  const firstPagesId= notion.firstPagesId;
  const [firstlist ,setFirstList]=useState<listItem[]|null>(null);
  const [firstPage, setFirstPage]=useState<Page|null>(null);
  const templatesId =notion.templatesId;
  const trashPagesId =notion.trash.pagesId;
  const trashPages =notion.trash.pages;
  const user =useSelector((state:RootState)=> state.user);
  const sideAppear =useSelector((state:RootState)=>state.side.appear);

  const location =window.location;
  const hash=location.hash;

  const [targetPageId, setTargetPageId]= useState<string>( "none");
  const [routePage, setRoutePage]=useState<Page|null>(null);
  const [openQF, setOpenQF]=useState<boolean>(false);
  const [showAllComments,setShowAllComments]=useState<boolean>(false);
  const [allCommentsStyle, setAllCommentsStyle]=useState<CSSProperties>({transform:`translateX(${window.innerWidth}px)`});
  const [discard_edit, setDiscardEdit]=useState<boolean>(false);
  const discardEdit =document.getElementById("discardEdit");
  const [openExport ,setOpenExport]=useState<boolean>(false);
  const [openComment, setOpenComment]=useState<boolean>(false);
  const [commentBlock, setCommentBlock]=useState<Block|null>(null);
  const [smallText, setSmallText]=useState<boolean>(false);
  const [fullWidth, setFullWidth]=useState<boolean>(false);
  const [openTemplates, setOpenTemplates]=useState<boolean>(false);
  const [fontStyle, setFontStyle]=useState<fontStyleType>(defaultFontFamily);
  const [loading, setLoading]=useState<boolean>(true);
    //---action.function 
    //--block
  const editBlock = (pageId:string, block:Block)=> {dispatch(edit_block(pageId, block ));
  };
  const changeBlockToPage=(currentPageId:string, block:Block)=>{dispatch(change_block_to_page(currentPageId, block))};
  const changePageToBlock=(currentPageId:string, block:Block)=>{dispatch(change_page_to_block(currentPageId, block))}
  const addBlock =(pageId:string , block:Block , newBlockIndex:number ,previousBlockId:string|null)=>{
    dispatch(add_block(pageId,block ,newBlockIndex ,previousBlockId));
  };
  const deleteBlock=(pageId:string,block:Block ,isInMenu:boolean)=>{dispatch(delete_block(pageId,block ,isInMenu));
  };
  const changeToSub =(pageId:string, block:Block ,newParentBlockId:string)=>{dispatch(change_to_sub(pageId,block,newParentBlockId));
  };
  const raiseBlock=(pageId:string, block:Block)=>{dispatch(raise_block(pageId,block))};
  //block--

  //--page
  function addPage(newPage:Page){
    dispatch(add_page( newPage));
    setRoutePage(newPage)  };
  function duplicatePage (targetPageId:string){dispatch(duplicate_page(targetPageId))};
  function editPage(pageId:string,newPage:Page ){dispatch(edit_page(pageId, newPage))};
  function deletePage (pageId:string ){
    const lastSlash =hash.lastIndexOf("/");
    const currentPageId = hash.slice(lastSlash+1);
    if(pageId === currentPageId && firstPagesId!==null){
      const openOtherFirstPage =()=>{
          firstPagesId[0]=== pageId ?
          (
            firstPagesId.length>1 ?
            setTargetPageId(firstPagesId[1]):
            setTargetPageId("none")
          )
          :
            setTargetPageId(firstPagesId[0])
      };
      if(user.favorites!==null){
        if(user.favorites.includes(pageId)){
          user.favorites[0]===pageId?
            (user.favorites.length>1?
              setTargetPageId(user.favorites[1])
            :
              openOtherFirstPage()
            ) 
          :
          setTargetPageId(user.favorites[0])
        }else{
          setTargetPageId(user.favorites[0])
        };
      }else{
        openOtherFirstPage();
      }
    }
    dispatch(delete_page(pageId));
    if(user.favorites !==null){
      user.favorites?.includes(pageId) && dispatch(remove_favorites(pageId));
    };

  };
  function movePageToPage(targetPageId:string, destinationPageId:string){dispatch(move_page_to_page(targetPageId, destinationPageId))};
  const restorePage=(pageId:string)=> {
    dispatch(restore_page(pageId))
  };
  const cleanTrash=(pageId:string)=>{
    dispatch(clean_trash(pageId));
    if(routePage?.id === pageId){
      setRoutePage(firstPage);
    }
  };
  const addTemplate =(template:Page)=>{
    dispatch(add_template(template))
  };
  const cancleEditTemplate =(templateId:string)=>{
    dispatch(cancle_edit_template(templateId))
  };
  const deleteTemplate =(templateId:string)=>{
    dispatch(delete_template(templateId));
  };
  //page---

  //--user
  const addRecentPage=(itemId:string)=>{dispatch(add_recent_page(itemId))};
  const cleanRecentPage=()=>{dispatch(clean_recent_page())};
  const addFavorites =(itemId:string)=>{dispatch(add_favorites(itemId))};
  const removeFavorites =(itemId:string)=>{dispatch((remove_favorites(itemId)))};
  //---user
  
  //--side
  const changeSide =(appear:SideAppear) => {dispatch(change_side(appear))} ;
  //side--
  //action.function ---

  const findRoutePage =(pageId: string )=>{
    if(pages!==null && pagesId!==null){
      if(pagesId.includes(pageId)){
        const page =findPage(pagesId, pages, pageId);
        setRoutePage(page);
        setTargetPageId(page.id);
        addRecentPage(pageId);
      }else if(trashPagesId !==null && trashPages !==null&& trashPagesId.includes(pageId)){
        const page =findPage(trashPagesId, trashPages, pageId);
        setRoutePage(page); 
        setTargetPageId(page.id);
        addRecentPage(pageId);
      }else{
        setRoutePage(firstPage);
        firstPage!==null &&
        !user.recentPagesId?.includes(firstPage.id) &&
        addRecentPage(firstPage.id);
      };
    }
  };
  const onClickDiscardEdit =()=>{
    discardEdit?.classList.remove("on");
    setDiscardEdit(true);
  };

  const onClickCloseEdit =()=>{
    discardEdit?.classList.remove("on");
  };
  const changeTitle=(title:string)=>{
    const titleHtml =document.querySelector("title");
    if(titleHtml !==null){
      titleHtml.innerText =title;
    }else{
      console.log("Can't find <title>")
    }
  };

  const changeFavicon =(icon:string|null, iconType:IconType)=>{
    const shortcutIcon =document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement|null;
    const changeHref=(href:string)=>shortcutIcon?.setAttribute("href",href);
    if(shortcutIcon!==null){
      switch (iconType) {
        case null:
          changeHref("./favicon.ico")
          break;
        case "img":
          if(icon !==null){
            changeHref(icon);
          }
          break;
        case "emoji":
          changeHref(`${emojiPath}${icon}.png`);
          break;
        default:
          break;
      }
    }else{
      console.log("Can't find shortcut icon")
    }
  };
  useEffect(()=>{
    if(firstPagesId!==null && pages!==null && pagesId!==null){
      const FIRSTLIST= firstPagesId.map((id:string)=> {
        const PAGE:Page = findPage(pagesId, pages,id);
        return {
          id:PAGE.id,
          title:PAGE.header.title,
          iconType:PAGE.header.iconType,
          icon :PAGE.header.icon,
          editTime:JSON.stringify(Date.now()),
          createTime:JSON.stringify(Date.now()),
          subPagesId:PAGE.subPagesId,
          parentsId:PAGE.parentsId
        }
      });
      setFirstList(FIRSTLIST);
      const FristPage =user.favorites!==null? findPage(pagesId, pages,user.favorites[0]) : pages[0];
      setFirstPage(FristPage);

    }else{
      setRoutePage(null);
      setLoading(false);
    }
  },[firstPagesId, pages, pagesId]);

  useEffect(()=>{
    if(firstPage!==null && routePage==null&& hash=== ""){
      setRoutePage(firstPage);
      setTargetPageId(firstPage.id);
    };
  },[firstPage]);

  useEffect(()=>{
    if(routePage!==null && pagesId!==null && pages !==null){
      const path =makeRoutePath(routePage, pagesId,pages);
      navigate(path);
      changeTitle(routePage.header.title);
      changeFavicon(routePage.header.icon, routePage.header.iconType);
      setLoading(false);
    }
  },[routePage]);
  useEffect(()=>{
    //url 변경시 
    const lastSlash =hash.lastIndexOf("/");
    const id = hash.slice(lastSlash+1);
    findRoutePage(id);
  },[hash]);

  useEffect(()=>{
    //sideBar 에서 페이지 이동 시 
    if(targetPageId!== "none"){
      findRoutePage(targetPageId);
    }else{
      setRoutePage(null);
      changeSide("lock")
    }
    
  },[targetPageId, notion.pagesId]);

  useEffect(()=>{
    if(showAllComments){
      setAllCommentsStyle({
        transform:`translateX(0)`,
      });
    }else{
      const allCommentsHtml =document.getElementById("allComments");
      const width =allCommentsHtml?.clientWidth;
      width !==undefined && 
      setAllCommentsStyle({
        transform:`translateX(${width + 50 }px)`,
      });
    }
  },[showAllComments])
  return(
    <div 
      id="inner"
      className='sideBar_lock'
    >

      {/* editor------ */}
      {loading ?
        <Loading/>
      :(
        <>
          <SideBarContainer  
            sideAppear ={sideAppear}
            setTargetPageId={setTargetPageId}
            addBlock={addBlock}
            editBlock={editBlock}
            deleteBlock={deleteBlock}
            changeBlockToPage={changeBlockToPage}

            addPage={addPage}
            editPage={editPage}
            deletePage={deletePage}
            movePageToPage={movePageToPage}
            duplicatePage={duplicatePage}
            restorePage={restorePage}
            cleanTrash={cleanTrash}
            changeSide={changeSide}
            addFavorites={addFavorites}
            removeFavorites ={removeFavorites}

            setOpenQF={setOpenQF}
            setOpenTemplates={setOpenTemplates}
            showAllComments={showAllComments}
          />
        {routePage!== null && pagesId!==null && pages !==null && firstlist!==null ?
        <>
          <Routes>
            <Route
              path={makeRoutePath(routePage,pagesId,pages)} 
              element={<EditorContainer 
                      sideAppear={sideAppear}
                      firstlist ={firstlist}
                      userName={user.userName}
                      recentPagesId={user.recentPagesId}
                      page={routePage}
                      pages={pages}
                      pagesId={pagesId}
                      isInTrash={!pagesId.includes(routePage.id)}
                      makePagePath={makePagePath}
                      addBlock={addBlock}
                      editBlock={editBlock}
                      changeBlockToPage={changeBlockToPage}
                      changePageToBlock={
                        changePageToBlock
                      }
                      changeToSub={changeToSub}
                      raiseBlock={raiseBlock}
                      deleteBlock={deleteBlock}
    
                      addPage={addPage}
                      editPage={editPage}
                      deletePage={deletePage}
                      duplicatePage={duplicatePage}
                      movePageToPage={movePageToPage}
                      cleanTrash={cleanTrash}
                      restorePage={restorePage}
  
                      addFavorites={addFavorites}
                      removeFavorites={removeFavorites}
                      changeSide={changeSide}
  
                      setTargetPageId={setTargetPageId}
                      setRoutePage={setRoutePage}
                      showAllComments={showAllComments}
                      setShowAllComments={setShowAllComments}
                      discardEdit={discard_edit}
                      setOpenExport={setOpenExport}
                      openComment={openComment}
                      setOpenComment={setOpenComment}
                      commentBlock={commentBlock}
                      setCommentBlock={setCommentBlock}
                      smallText={smallText}
                      setSmallText={setSmallText}
                      fullWidth={fullWidth}
                      setFullWidth={setFullWidth}
                      openTemplates={openTemplates}
                      setOpenTemplates={setOpenTemplates}
                      fontStyle={fontStyle}
                      setFontStyle={setFontStyle}
                      />
                    } 
            />
          </Routes>
          {openExport && 
          <Export
            page={routePage}
            pagesId={pagesId}
            pages={pages}
            firstlist={firstlist}
            userName={user.userName}
            recentPagesId ={user.recentPagesId}
            setOpenExport={setOpenExport}
            addBlock={addBlock}
            editBlock={editBlock}
            changeBlockToPage={changeBlockToPage}
            changePageToBlock={changePageToBlock}
            changeToSub={changeToSub}
            raiseBlock={raiseBlock}
            deleteBlock={deleteBlock}
            addPage={addPage}
            editPage={editPage}
            duplicatePage={duplicatePage}
            movePageToPage={movePageToPage}
            commentBlock={commentBlock}
            openComment={openComment}
            setTargetPageId={setTargetPageId}
            setRoutePage={setRoutePage}
            setOpenComment={setOpenComment}
            setCommentBlock ={setCommentBlock}
            smallText={smallText}
            fullWidth={fullWidth}
            discardEdit={discard_edit}
            openTemplates ={openTemplates}
            setOpenTemplates={setOpenTemplates}
            fontStyle={fontStyle}
          />
          }
          {openTemplates &&
            <Templates
              templatesId={templatesId}
              userName={user.userName}
              pagesId={pagesId}
              pages={pages}
              firstlist={firstlist}
              recentPagesId={user.recentPagesId}
              addBlock={addBlock}
              editBlock={editBlock}
              changeBlockToPage={changeBlockToPage}
              changePageToBlock={changePageToBlock}
              changeToSub={changeToSub}
              raiseBlock={raiseBlock}
              deleteBlock={deleteBlock}
              addPage={addPage}
              editPage={editPage}
              duplicatePage={duplicatePage}
              movePageToPage={movePageToPage}
              addTemplate={addTemplate}
              cancleEditTemplate ={cancleEditTemplate}
              deleteTemplate ={deleteTemplate}
              setRoutePage={setRoutePage}
              setTargetPageId={setTargetPageId}
              commentBlock={commentBlock}
              openComment={openComment}
              setOpenComment={setOpenComment}
              openTemplates={openTemplates}
              setOpenTemplates={setOpenTemplates}
              setCommentBlock ={setCommentBlock}
              smallText={smallText}
              fullWidth={fullWidth}
              discardEdit={discard_edit}
              fontStyle={fontStyle}

            />
          }
          {routePage !==null &&
            <AllComments
              page={routePage}
              userName={user.userName}
              favorites={user.favorites}
              editBlock={editBlock}
              showAllComments={showAllComments}
              setShowAllComments={setShowAllComments}
              discardEdit={discard_edit}
              style={allCommentsStyle}
            />
          }
          {openQF &&
          <QuickFindBord
            userName={user.userName}
            recentPagesId={user.recentPagesId}
            pages={pages}
            pagesId={pagesId}
            setTargetPageId={setTargetPageId}
            cleanRecentPage={cleanRecentPage}
            setOpenQF={setOpenQF}
          />
          }
        </>            
          :
            <div className='editor nonePage'>
              <p>
                Page doesn't existence
              </p>
              <p>
                Try make new Page 
              </p>
              <button
                onClick={()=>addPage(pageSample)}
              >
                Make new page
              </button>
            </div>
        }
        {/* ----editor */}
        </>
      )}
        <div 
          id ="discardEdit"
          className='discardEdit'
        >
          <div className='inner'>
            <div className='question'>
              <div>
                Do you want to discard this edit?
              </div>
            </div>
            <div className='btns'>
              <button
                onClick={onClickDiscardEdit}
              >
                Discard
              </button>
              <button
                onClick={onClickCloseEdit}
              >
                Close
              </button>
            </div>

          </div>
        </div>

    </div>
  )
};

export default React.memo(NotionRouter)