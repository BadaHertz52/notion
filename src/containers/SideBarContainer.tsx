import React from 'react';
import { useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { findPage, Notion, Page } from '../modules/notion';
import { UserState } from '../modules/user';

type SideBarContainerProp ={
  notion:Notion,
  user:UserState,
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void ,
  setTargetPageId: React.Dispatch<React.SetStateAction<string|null>>,
};
const SideBarContainer =({notion, user, lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage ,setTargetPageId }:SideBarContainerProp)=>{
  const pages = notion.pages;
  const firstPages:Page[] = notion.firstPagesId.map((id:string)=>findPage(notion.pagesId, pages, id));

  return(
    <SideBar 
    notion={notion}
    pages={pages}
    firstPages ={firstPages}
    user={user} 
    lockSideBar ={lockSideBar}
    leftSideBar ={leftSideBar}
    closeSideBar ={closeSideBar}
    openNewPage ={openNewPage}
    closeNewPage={closeNewPage}
    setTargetPageId={setTargetPageId}
    />
  )
};

export default React.memo (SideBarContainer);
