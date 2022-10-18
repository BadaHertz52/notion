import React, { Dispatch, SetStateAction } from 'react';
import {  useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';
import { SideAppear } from '../modules/side';
import { NotionActionProps } from './EditorContainer';

export type SideBarContainerProp = NotionActionProps &{
  sideAppear:SideAppear,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  setOpenQF: Dispatch<SetStateAction<boolean>>,
  setOpenTemplates :Dispatch<SetStateAction<boolean>>,
  showAllComments:boolean,
};
const SideBarContainer =({sideAppear,addBlock,editBlock,deleteBlock,changeBlockToPage,addPage,duplicatePage,editPage,deletePage,movePageToPage,restorePage, cleanTrash, addFavorites, removeFavorites, changeSide,setTargetPageId ,setOpenQF ,setOpenTemplates, showAllComments  }:SideBarContainerProp)=>{
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
    changeBlockToPage={changeBlockToPage}
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
    setOpenTemplates={setOpenTemplates}
    showAllComments={showAllComments}
    />
  )
};

export default React.memo (SideBarContainer);
