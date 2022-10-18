import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { CSSProperties } from 'styled-components';
import { Page } from '../modules/notion';
import Result, { makeResultType,resultType } from './Result';
type ResultItemProps ={
  item:resultType,
  cleanTrash: (itemId: string) => void,
  restorePage: (pageId: string) => void,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  setOpenTrash :Dispatch<React.SetStateAction<boolean>>
};
type TrashProps={
  style:CSSProperties |undefined,
  trashPagesId:string[]|null,
  trashPages: Page[] |null,
  pagesId:string[] |null,
  cleanTrash: (itemId: string) => void,
  restorePage: (pageId: string) => void,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  setOpenTrash :Dispatch<React.SetStateAction<boolean>>
};
const ResultItem=({item , restorePage, cleanTrash ,setTargetPageId, setOpenTrash}:ResultItemProps)=>{
  const goPage=(event: React.MouseEvent)=>{
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    setOpenTrash(false);
    if(!["button","svg","path"].includes(tagName) ){
      setTargetPageId(item.id);
    }
  };

  return(
    <div 
    className='page'
    onClick={goPage}
  >
    <Result 
      item={item}
    />
    <div className='btns'>
      <button 
        className='restoreBtn'
        onClick={()=> restorePage(item.id)}
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

const Trash=({style,trashPages, trashPagesId ,pagesId, restorePage, cleanTrash ,setTargetPageId ,setOpenTrash}:TrashProps)=>{
  const [trashList ,setTrashList ]=useState<resultType[]|undefined>(undefined);
  //undefined 이면 trash가 없는것 
  const [result, setResult] =useState<resultType[]|null>(null);
  //null 이면 검색의 결과값이 없는것 
  const [sort , setSort]=useState<"all"|"current">("all");
  const onChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    if(trashList !==undefined){
    const value =event.target.value.toLowerCase();
        const resultlist= trashList.filter((item:resultType)=> item.title.toLowerCase().includes(value));
      resultlist?.[0]!==undefined?
      setResult(resultlist):
      setResult(null);
    }
  };

  useEffect(()=>{
    if(pagesId!==null){
      let filteringTargetList :resultType[]|undefined=undefined;
      const makeFilteringTargetList =(pages:Page[]|null) : resultType[]|undefined=> pages?.map((page:Page)=>(
        makeResultType(page,pagesId , pages ,trashPagesId,trashPages)));
  
      switch (sort) {
        case "all":
          filteringTargetList = makeFilteringTargetList(trashPages)
          break;
        case "current":
          const location =window.location;
          const path =location.hash;
          const lastSlash = path.lastIndexOf("/");
          const currentPageId = path.slice(lastSlash+1);
          const filteredTrashPages = trashPages?.filter((page:Page)=> page.parentsId?.includes(currentPageId));
          filteringTargetList = filteredTrashPages!==undefined 
                                ?
                                (filteredTrashPages[0]!==undefined
                                  ?
                                makeFilteringTargetList(filteredTrashPages)
                                  : 
                                undefined)
                                :
                                undefined;
          break;
        default:
          break;
          
      };
      setTrashList(filteringTargetList);
      filteringTargetList!==undefined && setResult(filteringTargetList)
    }else{
      setTrashList(undefined);
    }

  },[sort,pagesId,trashPages, trashPagesId]);

  return(
    <div 
      id="trash"
      style={style}
    >
      <div className='inner'>
        <div className='header'>
          <button
            onClick={()=>setSort("all")}
          >
            All Pages
          </button>
          <button
            onClick={()=>setSort("current")}
          >
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
        <div className='trashList'>
          { trashList !==undefined?
            (result !==null?
              result.map((item:resultType)=>
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
            )
          :
          <div className='noTrash'>
            Empty
          </div>
          } 
        </div>
      </div>
    </div>
  )
};

export default React.memo(Trash)