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

  return(
    <div id="inner">
      <SideBarContainer />
      <EditorContainer page={targetPage}/>
    </div>
  )
};

export default React.memo(NotionRouter)