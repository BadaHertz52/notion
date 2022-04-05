import React from 'react';
import EditorContainer from './EditorContainer';
import SideBarContainer from './SideBarContainer';

const NotionRouter =()=>{
  return(
    <div id="inner">
      <SideBarContainer/>
      <EditorContainer/>
    </div>
  )
};

export default React.memo(NotionRouter)