import React, { Dispatch, SetStateAction } from 'react';
import {useDispatch } from 'react-redux';
import Frame from '../components/Frame';
import TopBar from '../components/TopBar';
import {  Block, Page,  change_to_sub, raise_block } from '../modules/notion';
import { SideAppear } from '../modules/side';
import { pathType } from './NotionRouter';

type EditorContainerProps ={
  sideAppear:SideAppear,
  page:Page,
  isInTrash:boolean,
  pagePath : pathType[]|null,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  deleteBlock: (pageId: string, block: Block , isInMenu:boolean) => void,
  
  addPage : ( newPage:Page, )=>void
  editPage : (pageId:string , newPage:Page, )=>void,
  deletePage : (pageId:string )=>void,
  restorePage: (pageId: string) => void,
  cleanTrash: (pageId: string) => void,

  changeSide: (appear: SideAppear) => void,
  setTargetPageId:Dispatch<SetStateAction<string>>,

  setOpenComment: Dispatch<SetStateAction<boolean>>,
  setCommentBlock: React.Dispatch<React.SetStateAction<Block | null>>
};

const EditorContainer =({sideAppear,page,isInTrash, pagePath ,changeSide,addBlock,editBlock,deleteBlock,addPage,editPage,restorePage, cleanTrash, setTargetPageId ,setOpenComment ,setCommentBlock}:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const changeToSub =(pageId: string, block: Block,  newParentBlockId: string)=> dispatch(change_to_sub(pageId, block, newParentBlockId));
  const raiseBlock =(pageId: string, block: Block) =>dispatch((raise_block(pageId, block)));

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
        targetPage={page}
        firstBlocksId={page.firstBlocksId}
        addBlock={addBlock}
        editBlock={editBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
        editPage={editPage}
        setOpenComment={setOpenComment}
        setCommentBlock ={setCommentBlock}
      />

    </div>
  )
};

export default React.memo(EditorContainer)