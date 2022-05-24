import React, { ChangeEvent, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrDocumentText } from 'react-icons/gr';
import { Block, listItem, Page } from '../modules/notion';

type PageMenuProps ={
  pages:Page[],
  firstlist:listItem[],
  existingPage: Page,
  block:Block,
}
const PageMenu =({pages, firstlist, existingPage, block}:PageMenuProps)=>{

  type PageButtonProps={
    item: listItem
  };

  const [search , setSearch]= useState<boolean>(false);
  const [result, setResult]= useState<listItem[]|null>(null);

  const page =(id:string)=>{
  };
  const PageButton =({item}:PageButtonProps)=>{
    return(
      <button
        className="page"
        onClick={()=>page(item.id)}
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
  };
  const findResult=(event:ChangeEvent<HTMLInputElement>)=>{
    setSearch(true) ;
    const value = event.target.value;
    const filteredPages:Page[] = pages.filter((page:Page)=> page.header.title?.includes(value));
    const RESULT:listItem[] = filteredPages.map((page:Page)=>({
      id: page.id,
      title: page.header.title,
      icon: page.header.icon,
    })) ;
    setResult(RESULT);
  };

  return(
    <div id="pageMenu">
      <div className="inner">
        <div className='search'>
          <input
            type="search"
            onChange={findResult}
          />
        </div>
        { search? 
        ( result !==null? 
          <div className='pages'>
          {result.map((item:listItem)=>
          <PageButton 
            key={`list_${item.id}`} 
            item={item}
          />
          )}
          </div>
          :
          <div className='pages no_result'>
            No result 
          </div>
          )
        :
        <>
        <div className='pages'>
          <header 
            id="pageSugested"
          >
            Sugested
          </header>
          {firstlist.map((item:listItem)=>
            <PageButton 
            key={`list_${item.id}`} 
            item={item}/>
          )}
        </div>
        <button 
          id="new_sub_page"
        >
          <AiOutlinePlus/>
          <span>
            New sub-page
          </span>
        </button>
        </>
        }
      </div>
    </div>
  )
};

export default React.memo(PageMenu)