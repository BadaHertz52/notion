import React from 'react';
import { Block, Page } from '../modules/notion';
import BlockComponent from './BlockComponent';
//icon

type EditorProps ={
  page:Page,
  editBlock : (pageId:string , block:Block)=> void
}

const Editor =({page, editBlock}:EditorProps)=>{

  const TopBar =()=>{
    return(
      <div className="topbar">

      </div>
    )
  };

  const Frame =()=>{
    return(
      <div className='frame'>
        <div className='cover'></div>
        <div className='pageHeader'></div>
        <div className="pageContent">
          <div className='pageContent_inner'>
            {page.blocks.map((block:Block)=>
            <BlockComponent 
              key={block.id}
              page ={page}
              block={block}
              editBlock={editBlock}
            />)}
          </div>
        </div>
      </div>
    )
  };

  return(
    <div className='editor'>
      <TopBar/>
      <Frame/>
    </div>
  )
}

export default React.memo(Editor)