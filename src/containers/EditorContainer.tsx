import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import Frame from '../components/Frame';
import TopBar from '../components/TopBar';
import { RootState } from '../modules';
import {  Block, Page,  findPage, listItem, Notion, change_to_sub, raise_block } from '../modules/notion';
import { SideAppear } from '../modules/side';
import { pathType } from './NotionRouter';

type EditorContainerProps ={
  sideAppear:SideAppear,
  page:Page,
  isInTrash:boolean,
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
  restorePage: (pageId: string) => void,
  cleanTrash: (pageId: string) => void,

  changeSide: (appear: SideAppear) => void,
  setTargetPageId:Dispatch<SetStateAction<string>>,
};

export type Command ={
  boolean:boolean,
  command:string | null
};
const EditorContainer =({sideAppear,page,isInTrash, pagePath ,changeSide,addBlock,duplicatePage,editBlock,deleteBlock,addPage,editPage,deletePage,movePageToPage,restorePage, cleanTrash, setTargetPageId}:EditorContainerProps)=>{
  const notion :Notion = useSelector((state:RootState)=> state.notion);
  const dispatch =useDispatch();
  const changeToSub =(pageId: string, block: Block, first: boolean, newParentBlock: Block) => dispatch((change_to_sub(pageId, block, first ,newParentBlock)));
  const raiseBlock =(pageId: string, block: Block) =>dispatch((raise_block(pageId, block)));
  const pages:Page[] =notion.pages;
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

  return(
    <div className='editor'>
      {isInTrash &&
      <div className='isInTrash'>
        <div>
          This is page is in Trash.
        </div>
        <div className="isInTrashBtns">
          <button
            onClick={()=>restorePage(page.id)}
          >
            Restore page
          </button>
          <button
            onClick={()=>cleanTrash(page.id)}
          >
            Delete permanently
          </button>
        </div>
      </div>
      }
      <TopBar
      sideAppear={sideAppear}
      page={page}
      pagePath ={pagePath}
      changeSide={changeSide}
      setTargetPageId={setTargetPageId}
      />
      <Frame
        pages={pages}
        firstlist={firstlist}
        userName ={userName}
        targetPage={page}
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

    </div>
  )
};

export default React.memo(EditorContainer)