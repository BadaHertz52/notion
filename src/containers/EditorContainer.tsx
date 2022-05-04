import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '../components/Editor';
import { RootState } from '../modules';
import { addBlock, Block, deleteBlock, editBlock, changeToSub, Page, raiseBlock } from '../modules/notion';
import { Side } from '../modules/side';

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

  const editBlock_action = (pageId:string, block:Block)=> {dispatch(editBlock(pageId, block ))};

  const addBlock_action =(pageId:string , block:Block , nextBlockIndex:number ,previousBlockId:string)=>{dispatch(addBlock(pageId,block ,nextBlockIndex ,previousBlockId))};

  const deleteBlock_action =(pageId:string,block:Block)=>{dispatch(deleteBlock(pageId,block))};

  const changeToSub_action =(pageId:string, block:Block , first:boolean ,previousBlockId:string)=>{dispatch(changeToSub(pageId,block,first ,previousBlockId));
  };

  const raiseBlock_action =(pageId:string, block:Block)=>{dispatch(raiseBlock(pageId,block))};

  return(
    <Editor 
      userName ={userName}
      page={page}
      pagePath ={pagePath}
      editBlock ={editBlock_action}
      addBlock ={addBlock_action}
      deleteBlock={deleteBlock_action}
      changeToSub={changeToSub_action}
      raiseBlock ={raiseBlock_action}
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