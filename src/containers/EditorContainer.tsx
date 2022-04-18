import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '../components/Editor';
import { RootState } from '../modules';
import { addBlock, Block, editBlock, Notion, Page } from '../modules/notion';
import side, { Side } from '../modules/side';

type EditorContainerProps ={
  page: Page,
  pagePath : string [] | null,
  side : Side,
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void 
}
const EditorContainer =({page , pagePath ,side, lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage }:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const editBlock_action = (pageId:string, block:Block)=> {dispatch(editBlock(pageId, block))};
  const addBlock_action =(pageId:string , block:Block , nextBlockIndex:number)=>{dispatch(addBlock(pageId,block ,nextBlockIndex))};
  const userName =useSelector((state:RootState)=> state.user.userName) ;

  return(
    <Editor 
      userName ={userName}
      page={page}
      pagePath ={pagePath}
      editBlock ={editBlock_action}
      addBlock ={addBlock_action}
      side ={side}
      lockSideBar ={lockSideBar}
      leftSideBar ={leftSideBar}
      closeSideBar ={closeSideBar}
      openNewPage ={openNewPage}
      closeNewPage={closeNewPage}
      
    />
  )
};

export default React.memo(EditorContainer)