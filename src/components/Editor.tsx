import React from 'react';
import { Block, Notion, Page } from '../modules/notion';
import BlockComponent from './BlockComponent';
//icon



type EditorProps ={
  block:Block,
  page:Page,
  notion:Notion,
  editBlock : ()=> void
}

const Editor =({page,block ,editBlock}:EditorProps)=>{

  const TopBar =()=>{
    return(

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