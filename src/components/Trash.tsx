import React, { Dispatch, SetStateAction, useState } from 'react';
import { GrDocumentText } from 'react-icons/gr';
import { IoTrashOutline } from 'react-icons/io5';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { CSSProperties } from 'styled-components';
import { Page } from '../modules/notion';
type trashListItem ={
  id:string,
  title:string,
  icon:string|null
};
import Result, { makeResultType,resultType } from './Result';
type ResultItemProps ={
  item:trashListItem,
  cleanTrash: (itemId: string) => void,
  restorePage: (pageId: string) => void,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  setOpenTrash :Dispatch<React.SetStateAction<boolean>>
};
type TrashProps={
  style:CSSProperties |undefined,
  trashPagesId:string[]|null,
  trashPages: Page[] |null,
  pagesId:string[],
  pages:Page[],
  cleanTrash: (itemId: string) => void,
  restorePage: (pageId: string) => void,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  setOpenTrash :Dispatch<React.SetStateAction<boolean>>
};
const ResultItem=({item , restorePage, cleanTrash ,setTargetPageId, setOpenTrash}:ResultItemProps)=>{
  const goPage=()=>{
    setTargetPageId(item.id);
    setOpenTrash(false)
  };
  return(
    <div 
    className='page'
    onClick={goPage}
  >
    <div className='content'>
      <p>
        {item.icon?
        < GrDocumentText/>:
        item.icon}
      </p>
      <p>{item.title}</p>
    </div>
    <div className='btns'>
      <button 
        className='restoreBtn'
        onClick={()=>restorePage(item.id)}
      >
        <RiArrowGoBackLine/>
      </button>
      <button 
        className='cleanBtn'
        onClick={()=>cleanTrash(item.id)}
      >
        <IoTrashOutline/>
      </button>
    </div>
  </div>
  )
};

const Trash=({style,trashPages , restorePage, cleanTrash ,setTargetPageId ,setOpenTrash}:TrashProps)=>{
  const trashList:trashListItem[]= trashPages.map((page:Page)=>({
    id: page.id,
    title: page.header.title,
    icon: page.header.icon
  }));
  const [result, setResult] =useState<trashListItem[]|null>(trashList);
  const trash =document.getElementById("trash");
  const inner =document.getElementById("inner");
  const onChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    const value =event.target.value.toLowerCase();
    const resultlist:trashListItem[] = trashList.filter((item:trashListItem)=> item.title.toLowerCase().includes(value));
    resultlist[0]!==undefined?
    setResult(resultlist):
    setResult(null);
  };
  return(
    <div 
      id="trash"
      style={style}
    >
      <div className='inner'>
        <div className='header'>
          <button>
            All Pages
          </button>
          <button>
            In current page
          </button>
        </div>
        <div className='search'>
          <input
            type="text"
            onChange={onChange}
            placeholder="Filter by page title..."
          />
        </div>
        <div className='result'>
          { result !==null?
            result.map((item:trashListItem)=>
            <ResultItem
              item={item}
              restorePage={restorePage}
              cleanTrash={cleanTrash}
              setTargetPageId={setTargetPageId}
              setOpenTrash={setOpenTrash}
            />
          )
          :
          <div className='noResult'>
              No matches found.
          </div>
          } 
        </div>
      </div>
    </div>
  )
};

export default React.memo(Trash)