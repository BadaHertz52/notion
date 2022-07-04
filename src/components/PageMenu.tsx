import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrDocumentText } from 'react-icons/gr';
import {  Block,  listItem, Page, pageSample } from '../modules/notion';

type PageMenuProps ={
  what:"page"|"block",
  currentPage:Page,
  pages:Page[],
  firstlist:listItem[],
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void
  addBlock:(pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void,
  editBlock: (pageId: string, block: Block) => void,
  setMenuOpen:Dispatch<SetStateAction<boolean>> |null,
  addPage:( newPage: Page) => void,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
};

const PageMenu =({ what, currentPage,pages, firstlist,deleteBlock,changeBlockToPage, addBlock, editBlock,addPage , movePageToPage ,setMenuOpen ,setTargetPageId}:PageMenuProps)=>{

  type PageButtonProps={
    item: listItem
  };
  const [search , setSearch]= useState<boolean>(false);
  const [result, setResult]= useState<listItem[]|null>(null);
  const [block, setBlock]=useState<Block|null>(null);
  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;
  useEffect(()=>{
    if(sessionItem !==null && what ==="block"){
      const block:Block= JSON.parse(sessionItem);
      setBlock(block);
    };
  },[sessionItem]);

  const moveBlockToPage =(pageId:string ,block:Block)=>{
    // 기존 페이지에서 블록 삭제
      deleteBlock(currentPage.id, block, true);
      // 블록을 다른 페이지로 이동
      const newBlock:Block ={
        ...block,
        firstBlock:true,
        parentBlocksId:null,
        editTime: JSON.stringify(Date.now())
      };
      const moveTargetPage = pages.filter((page:Page)=> page.id === pageId)[0];
      const firstBlockId =moveTargetPage.blocksId[0];
      const blocksIdLength = moveTargetPage.blocksId.length; 

      if(blocksIdLength===1 && firstBlockId.includes("blockSample")){
        addBlock(pageId, newBlock, 0 , null);
      }else{  
        addBlock(pageId, newBlock, blocksIdLength , null);
      }
    
    // close Menu and recovery Menu state
    setMenuOpen !==null && setMenuOpen(false);
  };
  const onClickToMove =(id:string)=>{
    switch (what) {
      case "block":
        block!==null &&  
        moveBlockToPage(id ,block);
        break;
      case "page":
        
        break;
      default:
        break;
    }


  };
  const PageButton =({item}:PageButtonProps)=>{
    return(
      <button
        className="page"
        onClick={()=>onClickToMove(item.id)}
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
      subPagesId:page.subPagesId,
      parentsId:page.parentsId,
      editTime:JSON.stringify(Date.now()),
      createTime:JSON.stringify(Date.now()),
    })) ;
    setResult(RESULT);
  };
  const makeNewSubPage =()=>{
    if(block !==null){
      changeBlockToPage(currentPage.id, block);
    } 
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
          <div className='pages noResult'>
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
          onClick={makeNewSubPage}
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