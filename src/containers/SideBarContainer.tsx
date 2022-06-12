import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { Block, Page } from '../modules/notion';
import { SideAppear } from '../modules/side';
import { add_favorites, add_trash, clean_trash, delete_favorites } from '../modules/user';

type SideBarContainerProp ={
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,

  addPage : ( newPage:Page, )=>void,
  duplicatePage: (targetPageId: string) => void,
  editPage : (pageId:string , newPage:Page, )=>void,
  deletePage : (pageId:string , )=>void,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,

  changeSide: (appear: SideAppear) => void,

  setTargetPageId: React.Dispatch<React.SetStateAction<string>>,
};
const SideBarContainer =({addBlock,editBlock,deleteBlock,addPage,duplicatePage,editPage,deletePage,movePageToPage, changeSide,setTargetPageId }:SideBarContainerProp)=>{
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
    addBlock={addBlock}
    editBlock={editBlock}
    deleteBlock={deleteBlock}
    
    addPage={addPage}
    duplicatePage={duplicatePage}
    editPage={editPage}
    deletePage={deletePage}
    movePageToPage={movePageToPage}

    addFavorites={addFavorites}
    deleteFavorites={deleteFavorites}
    addTrash={addTrash}
    cleanTrash={cleanTrash}

    changeSide={changeSide}
    setTargetPageId={setTargetPageId}
    />
  )
};

export default React.memo (SideBarContainer);
