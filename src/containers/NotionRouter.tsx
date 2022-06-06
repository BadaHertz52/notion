import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../modules';
import { Page } from '../modules/notion';
import { closeNewPage, closeSide, leftSide, lockSide, openNewPage } from '../modules/side';
import EditorContainer from './EditorContainer';
import SideBarContainer from './SideBarContainer';
export type pathType={
  id:string,
  title:string,
  icon:string|null
};
const NotionRouter =()=>{
  const dispatch =useDispatch();
  const notion = useSelector((state:RootState)=> state.notion);
  const pages=notion.pages;
  const user = useSelector((state:RootState)=> state.user);
  const firstPage = notion.pages[0];
  const [targetPageId, setTargetPageId]= useState<string|null>(firstPage.id);
  const side =useSelector((state:RootState)=> state.side);
  
  const lockSideBar =() => {dispatch(lockSide())} ;
  const leftSideBar =()=>{dispatch(leftSide())} ;
  const closeSideBar =()=>{dispatch(closeSide())} ;
  const open_newPage =()=>{dispatch(openNewPage())};
  const close_newPage =()=>{dispatch(closeNewPage())};
  const param =useParams();
  const navigate= useNavigate();
  const findPage=(id:string):Page=>{
    const index =notion.pagesId.indexOf(id);
    const page = pages[index];
    return page
  };
  const makePagePath=(page:Page):pathType[]|null=>{
    if(page.parentsId !==null){
      const parentPages:Page[] = page.parentsId.map((id:string)=>findPage(id));
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
    if(targetPageId === firstPage.id){
      navigate(`/${firstPage.id}`)
    }
  },[])


  useEffect(()=>{
    if(targetPageId!==null){
      const page = findPage(targetPageId);
      const path =makeRoutePath(page);
      navigate(path);
    }
    
  },[targetPageId]);
  return(
    <div id="inner">
      <SideBarContainer 
        notion={notion}
        user={user}
        lockSideBar ={lockSideBar}
        leftSideBar ={leftSideBar}
        closeSideBar ={closeSideBar}
        openNewPage ={open_newPage}
        closeNewPage={close_newPage}
        setTargetPageId={setTargetPageId}
      />
      <Routes>
        {pages.map((page:Page)=>
                  <Route
                    path={makeRoutePath(page)} 
                    element={<EditorContainer 
                              pagePath ={makePagePath(page)}
                              page={page}
                              side={side}
                              lockSideBar ={lockSideBar}
                              leftSideBar ={leftSideBar}
                              closeSideBar ={closeSideBar}
                              openNewPage ={open_newPage}
                              closeNewPage={close_newPage}
                              />
                            }
                    />
                  )
        }
      </Routes>

    </div>
  )
};

export default React.memo(NotionRouter)