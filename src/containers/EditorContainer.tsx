import React, { Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '../components/Editor';
import { RootState } from '../modules';
import { Block, editBlock, Notion, Page } from '../modules/notion';

type EditorContainerProps ={
  page: Page,
  pagePath : string [] | null,
  newPage:boolean,
  setNewPage:Dispatch<SetStateAction<boolean>>
}
const EditorContainer =({page , pagePath , newPage, setNewPage}:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const editBlock_action = (pageId:string, block:Block)=> {dispatch(editBlock(pageId, block))};

  return(
    <Editor 
      page={page}
      pagePath ={pagePath}
      editBlock ={editBlock_action}
      newPage ={newPage}
      setNewPage ={setNewPage}
    />
  )
};

export default React.memo(EditorContainer)