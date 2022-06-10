import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { Block, Page } from '../modules/notion';
import { add_favorites, add_trash, clean_trash, delete_favorites } from '../modules/user';

type SideBarContainerProp ={
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage : ( newPage:Page, block:null)=>void,
  duplicatePage: (targetPageId: string, block: null) => void,
  editPage : (pageId:string , newPage:Page, block:null)=>void,
  deletePage : (pageId:string , block:null)=>void,
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void ,
  setTargetPageId: React.Dispatch<React.SetStateAction<string>>,
};
const SideBarContainer =({addBlock,editBlock,deleteBlock,addPage,duplicatePage,editPage,deletePage,lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage ,setTargetPageId }:SideBarContainerProp)=>{
  const notion =useSelector((state:RootState)=> state.notion);
  const user = useSelector((state:RootState)=> state.user);
  const dispatch =useDispatch();
  const addFavorites =(itemId:string)=>{dispatch(add_favorites(itemId))};
  const deleteFavorites =(itemId:string)=>{dispatch((delete_favorites(itemId)))};
  const addTrash =(itemId:string)=>{dispatch(add_trash(itemId))};
  const cleanTrash =(itemId:string)=>{dispatch(clean_trash(itemId))};

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
    duplicatePage={duplicatePage}
    editPage={editPage}
    deletePage={deletePage}
    addFavorites={addFavorites}
    deleteFavorites={deleteFavorites}
    addTrash={addTrash}
    cleanTrash={cleanTrash}
    setTargetPageId={setTargetPageId}
    />
  )
};

export default React.memo (SideBarContainer);
