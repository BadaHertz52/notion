import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import { Page } from '../modules/notion';
import { closeNewPage, closeSide, leftSide, lockSide, openNewPage } from '../modules/side';
import EditorContainer from './EditorContainer';
import SideBarContainer from './SideBarContainer';

const NotionRouter =()=>{
  const dispatch =useDispatch();
  const notion = useSelector((state:RootState)=> state.notion);
  
  const firstPage = notion.pages[0];
  const [targetPage, setTargetPage]= useState<Page>(firstPage);

  const [pagePath, setPagePath]= useState<string []|null>(targetPage.parentssId);

  const side =useSelector((state:RootState)=> state.side);
  
  const lockSideBar =() => {dispatch(lockSide())} ;
  const leftSideBar =()=>{dispatch(leftSide())} ;
  const closeSideBar =()=>{dispatch(closeSide())} ;
  
  const open_newPage =()=>{dispatch(openNewPage())};
  const close_newPage =()=>{dispatch(closeNewPage())};

  return(
    <div id="inner">
      <SideBarContainer 
        lockSideBar ={lockSideBar}
        leftSideBar ={leftSideBar}
        closeSideBar ={closeSideBar}
        openNewPage ={open_newPage}
        closeNewPage={close_newPage}
      />
      <EditorContainer 
      pagePath ={pagePath}
      page={targetPage}
      side={side}
      lockSideBar ={lockSideBar}
      leftSideBar ={leftSideBar}
      closeSideBar ={closeSideBar}
      openNewPage ={open_newPage}
      closeNewPage={close_newPage}
      />
    </div>
  )
};

export default React.memo(NotionRouter)