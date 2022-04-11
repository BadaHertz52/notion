import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Editor from '../components/Editor';
import { RootState } from '../modules';
import { Block, editBlock, Page } from '../modules/notion';

type EditorContainerProps ={
  page: Page
}
const EditorContainer =({page}:EditorContainerProps)=>{
  const dispatch =useDispatch();
  const editBlock_action = (pageId:string, block:Block)=> {dispatch(editBlock(pageId, block))};

  return(
    <Editor 
      page={page}
      editBlock ={editBlock_action}
    />
  )
};

export default React.memo(EditorContainer)