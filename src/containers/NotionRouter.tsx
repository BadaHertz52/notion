import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  Route, Routes, useNavigate} from 'react-router-dom';
import { CSSProperties } from 'styled-components';
import AllComments from '../components/AllComments';
import BlockFn, { detectRange } from '../components/BlockFn';
import Comments from '../components/Comments';
import QuickFindBord from '../components/QuickFindBord';
import { RootState } from '../modules';
import { add_block, add_page, Block, blockSample, change_block_to_page, change_page_to_block, change_to_sub, clean_trash, delete_block, delete_page, duplicate_page, edit_block, edit_page, findBlock, findPage,  listItem,  move_page_to_page, Page, pageSample, raise_block, restore_page, } from '../modules/notion';
import { change_side, SideAppear } from '../modules/side';
import { add_favorites, add_recent_page, clean_recent_page, remove_favorites } from '../modules/user';
import EditorContainer from './EditorContainer';
import SideBarContainer from './SideBarContainer';
export type pathType={
  id:string,
  title:string,
  icon:string|null
};
export   type DiscardItemType ={
  discard:boolean
}
const NotionRouter =()=>{
  const navigate= useNavigate();
  const dispatch =useDispatch();
  const notion = useSelector((state:RootState)=> state.notion);
  const pagesId =notion.pagesId;
  const pages =notion.pages;
  const firstlist:listItem[] = notion.firstPagesId.map((id:string)=> {
    const PAGE:Page = findPage(notion.pagesId, pages,id);
    return {
      id:PAGE.id,
      title:PAGE.header.title,
      icon :PAGE.header.icon,
      editTime:JSON.stringify(Date.now()),
      createTime:JSON.stringify(Date.now()),
      subPagesId:PAGE.subPagesId,
      parentsId:PAGE.parentsId
    }
  });
  const trashPagesId =notion.trash.pagesId;
  const trashPages =notion.trash.pages;
  const user =useSelector((state:RootState)=> state.user);
  const sideAppear =useSelector((state:RootState)=>state.side.appear);

  const location =window.location;
  const hash=location.hash;
  const firstPage =user.favorites!==null? findPage(pagesId, pages,user.favorites[0]) : notion.pages[0];
  const [targetPageId, setTargetPageId]= useState<string>(firstPage !== undefined? firstPage.id: "none");
  const [routePage, setRoutePage]=useState<Page|null>(firstPage!==undefined? firstPage: null);
  const [openQF, setOpenQF]=useState<boolean>(false);
  const [showAllComments,setShowAllComments]=useState<boolean>(false);
  const [discard_edit, setDiscardEdit]=useState<boolean>(false);
  const discardEdit =document.getElementById("discardEdit");
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
    if(pageId === currentPageId){
      const openOtherFirstPage =()=>{
          notion.firstPagesId[0]=== pageId ?
          (
            notion.firstPagesId.length>1 ?
            setTargetPageId(notion.firstPagesId[1]):
            setTargetPageId("none")
          )
          :
            setTargetPageId(notion.firstPagesId[0])
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
        console.log(targetPageId)
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
  const makePagePath=(page:Page):pathType[]|null=>{
    if(page.parentsId !==null){
      const parentPages:Page[] = page.parentsId.map((id:string)=>findPage(notion.pagesId, notion.pages,id));
      const pagePath:pathType[] =parentPages.concat(page).map((p:Page)=>({
        id:p.id,
        title:p.header.title,
        icon:p.header.icon
      }));
      return pagePath;
    }else{
      return (
        [{
          id:page.id,
          title:page.header.title,
          icon:page.header.icon
          }])
    }
  };
  const makeRoutePath=(page:Page):string=>{
    let path ="";
    if(page.parentsId ==null){
      path =`/${page.id}`;
    }else{
      const pagePath=makePagePath(page);
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
  const findRoutePage =(pageId: string )=>{
    if(pagesId.includes(pageId)){
      const page =findPage(pagesId, pages, pageId);
      setRoutePage(page); 
    }else if(trashPagesId !==null && trashPages !==null&& trashPagesId.includes(pageId)){
      const page =findPage(trashPagesId, trashPages, pageId);
      setRoutePage(page); 
    }else{
      setRoutePage(firstPage)
    };
  };
  const onClickDiscardEdit =()=>{
    discardEdit?.classList.remove("on");
    setDiscardEdit(true);
  };

  const onClickCloseEdit =()=>{
    discardEdit?.classList.remove("on");
    
  };
  useEffect(()=>{
    if(routePage!==null){
      const path =makeRoutePath(routePage);
      navigate(path);
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
      if(notion.pagesId.includes(targetPageId)){
        addRecentPage(targetPageId);
      }
    }else{
      setRoutePage(null);
      changeSide("lock")
    }
    
  },[targetPageId]);
  return(
    <div 
      id="inner"
      className='sideBar_lock'
    >
      <SideBarContainer 
        sideAppear ={sideAppear}
        setTargetPageId={setTargetPageId}
        addBlock={addBlock}
        editBlock={editBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
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
      />
      {/* editor------ */}
      {routePage!== null?
      <>
        <Routes>
          <Route
            path={makeRoutePath(routePage)} 
            element={<EditorContainer 
                    sideAppear={sideAppear}
                    firstlist ={firstlist}
                    userName={user.userName}
                    page={routePage}
                    pages={pages}
                    isInTrash={!notion.pagesId.includes(routePage.id)}
                    pagePath ={makePagePath(routePage)}
                    setTargetPageId={setTargetPageId}
  
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

                    showAllComments={showAllComments}
                    setShowAllComments={setShowAllComments}
                    discardEdit={discard_edit}
                    />
                  } 
          />
        </Routes>         
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
      {routePage !==null &&
        <AllComments
          page={routePage}
          userName={user.userName}
          favorites={user.favorites}
          editBlock={editBlock}
          showAllComments={showAllComments}
          setShowAllComments={setShowAllComments}
          discardEdit={discard_edit}
        />
      }
      {openQF &&
      <QuickFindBord
        userName={user.userName}
        recentPagesId={user.recentPagesId}
        pages={notion.pages}
        pagesId={notion.pagesId}
        setTargetPageId={setTargetPageId}
        cleanRecentPage={cleanRecentPage}
        setOpenQF={setOpenQF}
      />
      }
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