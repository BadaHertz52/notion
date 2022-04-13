import React, { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';

type SideBarContainerProp ={
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void 
};
const SideBarContainer =({lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage }:SideBarContainerProp)=>{
  const user = useSelector((state:RootState)=> state.user);

  const list = useSelector((state:RootState)=> state.list);

  const notion =useSelector((state:RootState)=> state.notion);
  return(
    <SideBar 
    user={user} 
    list={list} 
    notion={notion} 
    lockSideBar ={lockSideBar}
    leftSideBar ={leftSideBar}
    closeSideBar ={closeSideBar}
    openNewPage ={openNewPage}
    closeNewPage={closeNewPage}
    />
  )
};

export default React.memo (SideBarContainer);
