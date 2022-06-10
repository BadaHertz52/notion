import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  Route, Routes, useNavigate, useParams, } from 'react-router-dom';
import { RootState } from '../modules';
import { add_block, add_page, Block, change_to_sub, delete_block, delete_page, duplicate_page, edit_block, edit_page, findPage, Page, raise_block } from '../modules/notion';
import { closeNewPage, closeSide, leftSide, lockSide, openNewPage } from '../modules/side';
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
  const location =window.location;
  const hash=location.hash;
  const firstPage = notion.pages[0];
  const [targetPageId, setTargetPageId]= useState<string>(firstPage.id);
  const [routePage, setRoutePage]=useState<Page>(firstPage);
  const editBlock = (pageId:string, block:Block)=> {dispatch(edit_block(pageId, block ))};
  const addBlock =(pageId:string , block:Block , newBlockIndex:number ,previousBlockId:string|null)=>{dispatch(add_block(pageId,block ,newBlockIndex ,previousBlockId))};
  const deleteBlock=(pageId:string,block:Block)=>{dispatch(delete_block(pageId,block))};
  const changeToSub =(pageId:string, block:Block , first:boolean ,newParentBlock:Block)=>{dispatch(change_to_sub(pageId,block,first,newParentBlock));
  };
  const raiseBlock=(pageId:string, block:Block)=>{dispatch(raise_block(pageId,block))};
  const addPage=(newPage:Page ,block:null)=>{dispatch(add_page( newPage, block))};
  const duplicatePage =(targetPageId:string, block:null)=>{dispatch(duplicate_page(targetPageId, block))};
  const editPage=(pageId:string,newPage:Page ,block:null)=>{dispatch(edit_page(pageId, newPage, block))};
  const deletePage=(pageId:string,block:null)=>{dispatch(delete_page(pageId, block))};
  const lockSideBar =() => {dispatch(lockSide())} ;
  const leftSideBar =()=>{dispatch(leftSide())} ;
  const closeSideBar =()=>{dispatch(closeSide())} ;
  const open_newPage =()=>{dispatch(openNewPage())};
  const close_newPage =()=>{dispatch(closeNewPage())};

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
                console.log(PATH, pagePath[i] ,pagePath);
                path =PATH;
              };
            }
        };
      };
    };
    console.log("path", path)
    return path;
  };
  useEffect(()=>{
        const path =makeRoutePath(routePage);
        navigate(path);
  },[routePage]);

  useEffect(()=>{
    //url 변경시 
    const lastSlash =hash.lastIndexOf("/");
    const id = hash.slice(lastSlash+1);
    const page =findPage(notion.pagesId, notion.pages, id);
    setRoutePage(page); 
  },[hash]);

  useEffect(()=>{
    //sideBar 에서 페이지 이동 시 
  const page = findPage(notion.pagesId, notion.pages,targetPageId);
    setRoutePage(page);
  },[targetPageId]);
  
  return(
    <div id="inner">
      <SideBarContainer 
        lockSideBar ={lockSideBar}
        leftSideBar ={leftSideBar}
        closeSideBar ={closeSideBar}
        openNewPage ={open_newPage}
        closeNewPage={close_newPage}
        setTargetPageId={setTargetPageId}
        addBlock={addBlock}
        duplicatePage={duplicatePage}
        editBlock={editBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
        editPage={editPage}
        deletePage={deletePage}
      />
      <Routes>
        <Route
          path={makeRoutePath(routePage)} 
          element={<EditorContainer 
                  pagePath ={makePagePath(routePage)}
                  lockSideBar ={lockSideBar}
                  leftSideBar ={leftSideBar}
                  closeSideBar ={closeSideBar}
                  openNewPage ={open_newPage}
                  closeNewPage={close_newPage}
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
                  />
                } 
        />
      </Routes>


    </div>
  )
};

export default React.memo(NotionRouter)