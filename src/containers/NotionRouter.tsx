import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { Page } from '../modules/notion';
import EditorContainer from './EditorContainer';
import SideBarContainer from './SideBarContainer';

const NotionRouter =()=>{
  const notion = useSelector((state:RootState)=> state.notion);
  const firstPage = notion.pages[0];
  const [targetPage, setTargetPage]= useState<Page>(firstPage);

  const [pagePath, setPagePath]= useState<string []|null>(targetPage.parentId);

  const [newPage, setNewPage] =useState<boolean>(true);

  return(
    <div id="inner">
      <SideBarContainer 
        setNewPage ={setNewPage}
      />
      <EditorContainer 
      pagePath ={pagePath}
      page={targetPage}
      newPage ={newPage}
      setNewPage={setNewPage}/>
    </div>
  )
};

export default React.memo(NotionRouter)