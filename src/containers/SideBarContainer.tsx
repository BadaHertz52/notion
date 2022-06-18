import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { Block,Page, } from '../modules/notion';
import { SideAppear } from '../modules/side';
import { add_favorites, remove_favorites } from '../modules/user';

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
  restorePage: (pageId: string) => void,
  cleanTrash: (pageId: string) => void,

  changeSide: (appear: SideAppear) => void,

  setTargetPageId: Dispatch<React.SetStateAction<string>>,
  setOpenQF: Dispatch<React.SetStateAction<boolean>>
};
const SideBarContainer =({addBlock,editBlock,deleteBlock,addPage,duplicatePage,editPage,deletePage,movePageToPage,restorePage, cleanTrash, changeSide,setTargetPageId ,setOpenQF }:SideBarContainerProp)=>{
  const notion =useSelector((state:RootState)=> state.notion);
  
  const user = useSelector((state:RootState)=> state.user);
  const dispatch =useDispatch();
  const addFavorites =(itemId:string)=>{dispatch(add_favorites(itemId))};
  const removeFavorites =(itemId:string)=>{dispatch((remove_favorites(itemId)))};

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
    restorePage={restorePage}
    cleanTrash={cleanTrash}

    addFavorites={addFavorites}
    removeFavorites={removeFavorites}

    changeSide={changeSide}
    setTargetPageId={setTargetPageId}
    setOpenQF={setOpenQF}
    />
  )
};

export default React.memo (SideBarContainer);
