import React from 'react';
import { useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { Block, Page } from '../modules/notion';

type SideBarContainerProp ={
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage : ( newPage:Page, block:null)=>void,
  editPage : (pageId:string , newPage:Page, block:null)=>void,
  deletePage : (pageId:string , block:null)=>void,
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void ,
  setTargetPageId: React.Dispatch<React.SetStateAction<string>>,
};
const SideBarContainer =({addBlock,editBlock,deleteBlock,addPage,editPage,deletePage,lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage ,setTargetPageId }:SideBarContainerProp)=>{
  const notion =useSelector((state:RootState)=> state.notion);
  const user = useSelector((state:RootState)=> state.user);
  return(
    <SideBar 
    notion={notion}
    user={user} 
    lockSideBar ={lockSideBar}
    leftSideBar ={leftSideBar}
    closeSideBar ={closeSideBar}
    openNewPage ={openNewPage}
    closeNewPage={closeNewPage}
    addBlock={addBlock}
    editBlock={editBlock}
    deleteBlock={deleteBlock}
    addPage={addPage}
    editPage={editPage}
    deletePage={deletePage}
    setTargetPageId={setTargetPageId}
    />
  )
};

export default React.memo (SideBarContainer);
