import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Frame from '../components/Frame';
import TopBar from '../components/TopBar';
import { RootState } from '../modules';
import {  Block, Page, edit_block, add_block, delete_block, change_to_sub, raise_block, Notion, add_page, delete_page, edit_page, findPage, listItem } from '../modules/notion';
import { pathType } from './NotionRouter';

type EditorContainerProps ={
  pagePath : pathType[]|null,
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
const EditorContainer =({ pagePath ,lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage }:EditorContainerProps)=>{
  const notion :Notion = useSelector((state:RootState)=> state.notion);
  const side =useSelector((state:RootState)=> state.side);
  const pages:Page[] =notion.pages;
  const pagesId :string[] =notion.pagesId;
  const [page, setPage]=useState<Page|null>(null);
  const firstlist:listItem[] = notion.firstPagesId.map((id:string)=> {
    const PAGE:Page = findPage(notion.pagesId, pages,id);
    return {
      id:PAGE.id,
      title:PAGE.header.title,
      icon :PAGE.header.icon,
      editTime:JSON.stringify(Date.now()),
      subPagesId:PAGE.subPagesId,
      parentsId:PAGE.parentsId
    }
  });
  const userName :string  =useSelector((state:RootState)=> state.user.userName) ;
  const dispatch =useDispatch();

  const editBlock = (pageId:string, block:Block)=> {dispatch(edit_block(pageId, block ))};
  const addBlock =(pageId:string , block:Block , nextBlockIndex:number ,previousBlockId:string|null)=>{dispatch(add_block(pageId,block ,nextBlockIndex ,previousBlockId))};
  const deleteBlock=(pageId:string,block:Block)=>{dispatch(delete_block(pageId,block))};
  const changeToSub =(pageId:string, block:Block , first:boolean ,newParentBlock:Block)=>{dispatch(change_to_sub(pageId,block,first,newParentBlock));
  };
  const raiseBlock=(pageId:string, block:Block)=>{dispatch(raise_block(pageId,block))};

  const addPage=(newPage:Page ,block:null)=>{dispatch(add_page( newPage, block))};
  const editPage=(pageId:string,newPage:Page ,block:null)=>{dispatch(edit_page(pageId, newPage, block))};
  const deletePage=(pageId:string,block:null)=>{dispatch(delete_page(pageId, block))};

  useEffect(()=>{
    if(pagePath !== null){
      const pageId = pagePath[pagePath.length-1].id;
      const PAGE =findPage(pagesId,pages,pageId);
      setPage(PAGE);
    }
  },[pagePath])
  return(
    <div className='editor'>
      {page !==null &&
      <>
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
        pages={pages}
        firstlist={firstlist}
        userName ={userName}
        page={page}
        side={side}
        addBlock={addBlock}
        editBlock={editBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
        editPage={editPage}
        deletePage={deletePage}
      />
      </>
      }
    </div>
  )
};

export default React.memo(EditorContainer)