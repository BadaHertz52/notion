import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Frame from '../components/Frame';
import TopBar from '../components/TopBar';
import { RootState } from '../modules';
import {  Block, Page, edit_block, add_block, delete_block, change_to_sub, raise_block } from '../modules/notion';
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
};

export type Command ={
  boolean:boolean,
  command:string | null
};
const EditorContainer =({page , pagePath ,side, lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage }:EditorContainerProps)=>{

  const userName =useSelector((state:RootState)=> state.user.userName) ;

  const dispatch =useDispatch();

  const editBlock = (pageId:string, block:Block)=> {dispatch(edit_block(pageId, block ))};

  const addBlock =(pageId:string , block:Block , nextBlockIndex:number ,previousBlockId:string|null)=>{dispatch(add_block(pageId,block ,nextBlockIndex ,previousBlockId))};

  const deleteBlock=(pageId:string,block:Block)=>{dispatch(delete_block(pageId,block))};

  const changeToSub =(pageId:string, block:Block , first:boolean ,newParentBlock:Block)=>{dispatch(change_to_sub(pageId,block,first,newParentBlock));
  };

  const raiseBlock=(pageId:string, block:Block)=>{dispatch(raise_block(pageId,block))};


  return(
    <div className='editor'>
      <TopBar
      page={page}
      pagePath ={pagePath}
      side ={side}
      lockSideBar ={lockSideBar}
      leftSideBar ={leftSideBar}
      closeSideBar ={closeSideBar}
      openNewPage ={openNewPage}
      closeNewPage={closeNewPage}
      />
      <Frame
        userName ={userName}
        page={page}
        side={side}
        addBlock={addBlock}
        editBlock={editBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}
      />
    </div>
  )
};

export default React.memo(EditorContainer)