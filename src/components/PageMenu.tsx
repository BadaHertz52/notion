import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Block,  listItem,  Page} from '../modules/notion';
import { setTemplateItem } from './BlockComponent';
import PageIcon from './PageIcon';

type PageMenuProps ={
  what:"page"|"block",
  currentPage:Page,
  pages:Page[],
  firstlist:listItem[],
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void
  addBlock:(pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void,
  setOpenMenu:Dispatch<SetStateAction<boolean>> |null,
  movePageToPage: (targetPageId:string, destinationPageId:string)=>void,
  setTargetPageId: Dispatch<SetStateAction<string>>,
};

const PageMenu =({ what, currentPage,pages, firstlist,deleteBlock,changeBlockToPage, addBlock, movePageToPage ,setOpenMenu ,setTargetPageId}:PageMenuProps)=>{

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
  },[sessionItem, what]);
  const templateHtml= document.getElementById("template");
  const moveBlockToPage =(destinationPageId:string ,block:Block)=>{
    setTemplateItem(templateHtml, currentPage);
    // 기존 페이지에서 블록 삭제
      deleteBlock(currentPage.id, block, true);
      // 블록을 다른 페이지로 이동
      const newBlock:Block ={
        ...block,
        firstBlock:true,
        parentBlocksId:null,
        editTime: JSON.stringify(Date.now())
      };
      const destinationPage = pages.filter((page:Page)=> page.id === destinationPageId)[0];
      //set origin destinationPage
      if(templateHtml!==null){
        const item= JSON.stringify(destinationPage);
        sessionStorage.setItem("originMoveTargetPage", item);
      }
      if(destinationPage.blocksId==null){
        addBlock(destinationPageId, newBlock, 0 , null);
      }else{  
        const blocksIdLength = destinationPage.blocksId.length;
        addBlock(destinationPageId, newBlock, blocksIdLength , null);
      };
    // close Menu and recovery Menu state
    setOpenMenu !==null && setOpenMenu(false);
  };
  const onClickToMove =(id:string)=>{
    switch (what) {
      case "block":
        if(block !==null){
          if(block.type ==="page"){
            movePageToPage(block.id,id);
          }else{
            moveBlockToPage(id ,block)
          }
        }
        break;
      case "page":
        movePageToPage(currentPage.id, id);
        setTargetPageId(id);
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
          <PageIcon
            icon={item.icon}
            iconType={item.iconType}
            style={undefined}
          />
          <div className='pageTitle'>
            <span>
                {item.title}
            </span>
          </div>
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
      iconType:page.header.iconType,
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
      setTemplateItem(templateHtml,currentPage);
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