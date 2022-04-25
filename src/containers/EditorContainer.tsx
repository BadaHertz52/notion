import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '../components/Editor';
import { RootState } from '../modules';
import { addBlock, Block, deleteBlock, editBlock, makeSubBlock, Notion, Page } from '../modules/notion';
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
  const userName =useSelector((state:RootState)=> state.user.userName) ;

  const dispatch =useDispatch();

  const editBlock_action = (pageId:string, block:Block)=> {dispatch(editBlock(pageId, block))};

  const addBlock_action =(pageId:string , block:Block , nextBlockIndex:number)=>{dispatch(addBlock(pageId,block ,nextBlockIndex))};

  const deleteBlock_action =(pageId:string,block:Block)=>{dispatch(deleteBlock(pageId,block))};

  const makeSubBlock_action =(pageId:string, mainBlock:Block, subBlock:Block)=>{dispatch(makeSubBlock(pageId, mainBlock, subBlock));
  }
  return(
    <Editor 
      userName ={userName}
      page={page}
      pagePath ={pagePath}
      editBlock ={editBlock_action}
      addBlock ={addBlock_action}
      deleteBlock={deleteBlock_action}
      makeSubBlock={makeSubBlock_action}
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