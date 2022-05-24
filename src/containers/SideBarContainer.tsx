import React from 'react';
import { useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { findPage, Page } from '../modules/notion';

type SideBarContainerProp ={
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void 
};
const SideBarContainer =({ lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage }:SideBarContainerProp)=>{
  const user = useSelector((state:RootState)=> state.user);
  const notion =useSelector((state:RootState)=> state.notion);
  const pages = notion.pages;
  const firstPages:Page[] = notion.firstPagesId.map((id:string)=>findPage(notion.pagesId, pages, id));

  return(
    <SideBar 
    pages={pages}
    firstPages ={firstPages}
    user={user} 
    lockSideBar ={lockSideBar}
    leftSideBar ={leftSideBar}
    closeSideBar ={closeSideBar}
    openNewPage ={openNewPage}
    closeNewPage={closeNewPage}
    />
  )
};

export default React.memo (SideBarContainer);
