import React, { Dispatch, SetStateAction } from 'react';
import {  useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { SideAppear } from '../modules/side';

export type SideBarContainerProp = {
  sideAppear:SideAppear,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  setOpenQF: Dispatch<SetStateAction<boolean>>,
  setOpenTemplates :Dispatch<SetStateAction<boolean>>,
  showAllComments:boolean,
};
const SideBarContainer =({sideAppear,setTargetPageId , setOpenQF ,setOpenTemplates, showAllComments  }:SideBarContainerProp)=>{
  const notion =useSelector((state:RootState)=> state.notion);
  
  const user = useSelector((state:RootState)=> state.user);

  return(
    <SideBar 
    notion={notion}
    user={user}
    sideAppear={sideAppear}
    setTargetPageId={setTargetPageId}
    setOpenQF={setOpenQF}
    setOpenTemplates={setOpenTemplates}
    showAllComments={showAllComments}
    />
  )
};

export default React.memo (SideBarContainer);
