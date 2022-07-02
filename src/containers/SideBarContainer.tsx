import React, { Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { Block,Page, } from '../modules/notion';
import { SideAppear } from '../modules/side';
import { add_favorites, remove_favorites } from '../modules/user';

type SideBarContainerProp ={
  sideAppear:SideAppear,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,

  addPage : ( newPage:Page, )=>void,
  duplicatePage: (targetPageId: string) => void,
  editPage : (pageId:string , newPage:Page, )=>void,
  deletePage : (pageId:string , )=>void,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  restorePage: (pageId: string) => void,
  cleanTrash: (pageId: string) => void,

  addFavorites: (itemId: string) => void,
  removeFavorites: (itemId: string) => void,

  changeSide: (appear: SideAppear) => void,

  setTargetPageId: Dispatch<React.SetStateAction<string>>,
  setOpenQF: Dispatch<React.SetStateAction<boolean>>
};
const SideBarContainer =({sideAppear,addBlock,editBlock,deleteBlock,addPage,duplicatePage,editPage,deletePage,movePageToPage,restorePage, cleanTrash, addFavorites, removeFavorites, changeSide,setTargetPageId ,setOpenQF }:SideBarContainerProp)=>{
  const notion =useSelector((state:RootState)=> state.notion);
  
  const user = useSelector((state:RootState)=> state.user);
  return(
    <SideBar 
    notion={notion}
    user={user}
    sideAppear={sideAppear}
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
