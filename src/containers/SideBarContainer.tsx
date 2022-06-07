import React from 'react';
import { useSelector  ,useDispatch} from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { findPage, Page } from '../modules/notion';

type SideBarContainerProp ={
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void ,
  setTargetPageId: React.Dispatch<React.SetStateAction<string>>,
};
const SideBarContainer =({lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage ,setTargetPageId }:SideBarContainerProp)=>{
  const notion =useSelector((state:RootState)=> state.notion);
  const user = useSelector((state:RootState)=> state.user);
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
