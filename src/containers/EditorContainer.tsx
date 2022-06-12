import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import Frame from '../components/Frame';
import TopBar from '../components/TopBar';
import { RootState } from '../modules';
import {  Block, Page,  findPage, listItem, Notion, change_to_sub, raise_block } from '../modules/notion';
import { SideAppear } from '../modules/side';
import { pathType } from './NotionRouter';

type EditorContainerProps ={
  pagePath : pathType[]|null,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage : ( newPage:Page, )=>void,
  duplicatePage: (targetPageId: string) => void,
  editPage : (pageId:string , newPage:Page, )=>void,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  deletePage : (pageId:string )=>void,
  changeSide: (appear: SideAppear) => void,
  setTargetPageId:Dispatch<SetStateAction<string>>
};

export type Command ={
  boolean:boolean,
  command:string | null
};
const EditorContainer =({ pagePath ,changeSide,addBlock,duplicatePage,editBlock,deleteBlock,addPage,editPage,deletePage,movePageToPage, setTargetPageId}:EditorContainerProps)=>{
  const notion :Notion = useSelector((state:RootState)=> state.notion);
  const dispatch =useDispatch();
  const changeToSub =(pageId: string, block: Block, first: boolean, newParentBlock: Block) => dispatch((change_to_sub(pageId, block, first ,newParentBlock)));
  const raiseBlock =(pageId: string, block: Block) =>dispatch((raise_block(pageId, block)));
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
      createTime:JSON.stringify(Date.now()),
      subPagesId:PAGE.subPagesId,
      parentsId:PAGE.parentsId
    }
  });
  const userName :string  =useSelector((state:RootState)=> state.user.userName) ;

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
      changeSide={changeSide}
      setTargetPageId={setTargetPageId}
      />
      <Frame
        pages={pages}
        firstlist={firstlist}
        userName ={userName}
        page={page}
        addBlock={addBlock}
        editBlock={editBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
        duplicatePage={duplicatePage}
        editPage={editPage}
        movePageToPage={movePageToPage}
        deletePage={deletePage}
        setTargetPageId={setTargetPageId}
      />
      </>
      }
    </div>
  )
};

export default React.memo(EditorContainer)