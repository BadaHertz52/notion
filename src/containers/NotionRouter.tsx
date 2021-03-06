import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  Route, Routes, useNavigate} from 'react-router-dom';
import QuickFindBord from '../components/QuickFindBord';
import { RootState } from '../modules';
import { add_block, add_page, Block, change_to_sub, clean_trash, delete_block, delete_page, duplicate_page, edit_block, edit_page, findPage,  move_page_to_page, Page, raise_block, restore_page, } from '../modules/notion';
import { change_side, SideAppear } from '../modules/side';
import { add_recent_page, clean_recent_page, remove_favorites } from '../modules/user';
import EditorContainer from './EditorContainer';
import SideBarContainer from './SideBarContainer';
export type pathType={
  id:string,
  title:string,
  icon:string|null
};
const NotionRouter =()=>{
  const navigate= useNavigate();
  const dispatch =useDispatch();
  const notion = useSelector((state:RootState)=> state.notion);
  const pagesId =notion.pagesId;
  const pages =notion.pages;
  const trashPagesId =notion.trash.pagesId;
  const trashPages =notion.trash.pages;
  const user =useSelector((state:RootState)=> state.user);
  const location =window.location;
  const hash=location.hash;
  const firstPage =user.favorites!==null? findPage(pagesId, pages,user.favorites[0]) : notion.pages[0];

  const [targetPageId, setTargetPageId]= useState<string>(firstPage.id);
  const [routePage, setRoutePage]=useState<Page>(firstPage);
  const [openQF, setOpenQF]=useState<boolean>(false);
  //---action.function 
    //--block
  const editBlock = (pageId:string, block:Block)=> {dispatch(edit_block(pageId, block ))};
  const addBlock =(pageId:string , block:Block , newBlockIndex:number ,previousBlockId:string|null)=>{
    dispatch(add_block(pageId,block ,newBlockIndex ,previousBlockId))
  };
  const deleteBlock=(pageId:string,block:Block)=>{dispatch(delete_block(pageId,block))};
  const changeToSub =(pageId:string, block:Block , first:boolean ,newParentBlock:Block)=>{dispatch(change_to_sub(pageId,block,first,newParentBlock));
  };
  const raiseBlock=(pageId:string, block:Block)=>{dispatch(raise_block(pageId,block))};
  //block--

  //--page
  const addPage=(newPage:Page)=>{
    dispatch(add_page( newPage));
    setRoutePage(newPage);  };
  const duplicatePage =(targetPageId:string)=>{dispatch(duplicate_page(targetPageId))};
  const editPage=(pageId:string,newPage:Page )=>{dispatch(edit_page(pageId, newPage))};
  const deletePage =(pageId:string )=>{
    dispatch(delete_page(pageId));
    if(user.favorites !==null){
      user.favorites?.includes(pageId) && dispatch(remove_favorites(pageId));
    };
  };
  const movePageToPage =(targetPageId:string, destinationPageId:string)=>{dispatch(move_page_to_page(targetPageId, destinationPageId))};
  const restorePage=(pageId:string)=> {
    dispatch(restore_page(pageId))
  };
  const cleanTrash=(pageId:string)=>{
    dispatch(clean_trash(pageId));
    if(routePage.id === pageId){
      setRoutePage(firstPage);
    }
  };
  //page---

  //--user
  const addRecentPage=(itemId:string)=>{dispatch(add_recent_page(itemId))};
  const cleanRecentPage=()=>{dispatch(clean_recent_page())};
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
  } 
  useEffect(()=>{
        const path =makeRoutePath(routePage);
        navigate(path);
  },[routePage]);

  useEffect(()=>{
    //url ????????? 
    const lastSlash =hash.lastIndexOf("/");
    const id = hash.slice(lastSlash+1);
    findRoutePage(id);
  },[hash]);

  useEffect(()=>{
    //sideBar ?????? ????????? ?????? ??? 
    findRoutePage(targetPageId);
    if(notion.pagesId.includes(targetPageId)){
      addRecentPage(targetPageId);
    }
    
  },[targetPageId]);
  
  return(
    <div id="inner">
      <SideBarContainer 
        setTargetPageId={setTargetPageId}
        addBlock={addBlock}
        editBlock={editBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}

        addPage={addPage}
        editPage={editPage}
        deletePage={deletePage}
        movePageToPage={movePageToPage}
        duplicatePage={duplicatePage}
        restorePage={restorePage}
        cleanTrash={cleanTrash}
        changeSide={changeSide}

        setOpenQF={setOpenQF}
      />
      <Routes>
        <Route
          path={makeRoutePath(routePage)} 
          element={<EditorContainer 
                  page={routePage}
                  isInTrash={!notion.pagesId.includes(routePage.id)}
                  pagePath ={makePagePath(routePage)}
                  setTargetPageId={setTargetPageId}

                  addBlock={addBlock}
                  editBlock={editBlock}
                  changeToSub={changeToSub}
                  raiseBlock={raiseBlock}
                  deleteBlock={deleteBlock}

                  addPage={addPage}
                  duplicatePage={duplicatePage}
                  editPage={editPage}
                  deletePage={deletePage}
                  movePageToPage={movePageToPage}
                  cleanTrash={cleanTrash}
                  restorePage={restorePage}

                  changeSide={changeSide}
                  />
                } 
        />
      </Routes>
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
    </div>
  )
};

export default React.memo(NotionRouter)