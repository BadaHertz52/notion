import React, { useState } from 'react';
import { GrDocumentText } from 'react-icons/gr';
import { Block, listItem, Page } from '../modules/notion';

type MoveToPageMenuProps ={
  pages:Page[],
  firstlist:listItem[],
  existingPage: Page,
  block:Block,
}
const MoveToPageMenu =({pages, firstlist, existingPage, block}:MoveToPageMenuProps)=>{
  type headerType = {
    title: string | null;
    icon: string | null;
    cover: ImageData | null;
    comment: string | null;
  };
  type PageButtonProps={
    item: listItem
  };

  const [search , setSearch]= useState<string|null>(null);
  const [result, setResult]= useState<listItem[]|null>(null);

  const pageHeaders: headerType[] = pages.map((page:Page)=> page.header);
  const pageIds : string[]= pages.map((page:Page)=> page.id);

  const PageButton =({item}:PageButtonProps)=>{
    return(
      <button
        className="page"
        onClick={()=>moveToPage(item.id)}
      >
        <div className='page_inner'>
          <span>
            {item.icon == null?   
            < GrDocumentText/>
            : 
            item.icon}
          </span>
          <span>
            {item.title}
          </span>
        </div>
      </button>
    )
  }
  const moveToPage =(id:string)=>{
    
  };
  return(
    <div id="moveToPageMenu">
      <div id="moveToPageMenu_inner">
        <div className='search'>

        </div>
        <div className='pages'>
          { search !==null ? 
          ( result !==null? 
            result.map((item:listItem)=>
            <PageButton 
              key={`list_${item.id}`} 
              item={item}
            />
            )
            :
            <div className='no_result'>
              No result 
            </div>
            )
          :
          firstlist.map((item:listItem)=>
            <PageButton 
            key={`list_${item.id}`} 
            item={item}/>
          )
            }
        </div>
      </div>
    </div>
  )
};

export default React.memo(MoveToPageMenu)