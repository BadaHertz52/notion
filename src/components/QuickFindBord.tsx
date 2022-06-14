import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { findPage, Page } from "../modules/notion";

//icon
import { AiOutlineCheck } from "react-icons/ai";
import {  BsChevronDown, BsSearch } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";

type QuickFindBordProps ={
  userName:string,
  recentPagesId: string[]|null,
  pages:Page[],
  pagesId:string[],
  search: string | null,
  setTargetPageId: Dispatch<SetStateAction<string>>,
  cleanRecentPage: ()=>void,
};
type resultType ={
  id:string,
  title:string,
  icon:string|null,
  createTime:string,
  editTime:string,
  path:string |null,
};
type ResultProps={
  item:resultType,
  setTargetPageId:Dispatch<SetStateAction<string>>,
};

const Result =({item,setTargetPageId}:ResultProps)=>{
  return(
    <button 
    className="result"
    onClick={()=>setTargetPageId(item.id)}
  >
    <div className="pageIcon">
      {item.icon !==null ?
      item.icon:
      < GrDocumentText/>
      }
    </div>
    <div className="pageTitle">
      {item.title}
    </div>
    {item.path !==null &&
      <div className="path">
        <span>—</span>
        {item.path}
      </div>
    }
  </button>
  )
}
const QuickFindBord =({userName,recentPagesId, pages,pagesId,search ,setTargetPageId, cleanRecentPage }:QuickFindBordProps)=>{
  const bestMatches= "Best matches";
  const lastEditedNewest ="Last edited:Nwest first";
  const lastEditedOldest ="Last edited:Oldest first";
  const createdNewest ="Created:Newest first";
  const createdOldest ="Created:Oldest first";
  const [selectedOption, setSelectedOption] =useState<string>(bestMatches);
  const [result, setResult]=useState<resultType[]|null|"noResult">(null);
  const [bestMatchesResult, setBestMatchesResult]=useState<resultType[]|null|"noResult">(null);
  const sortOptions  =useRef<HTMLDivElement>(null);
  const openSortOptionsBtn  =useRef<HTMLButtonElement>(null);
  const recentPagesList  =recentPagesId?.map((id:string)=> {
    console.log(recentPagesId, id)
    const page =findPage(pagesId, pages, id);
    return {
      id: page.id,
      title: page.header.title,
      icon: page.header.icon,
      createTime: page.createTime,
      editTime: page.editTime,
      path: page.parentsId !==null? makePath(page.parentsId):null
    }
    });
  function makePath (parentsId:string[]):string{
    let path ="";
    parentsId.forEach((id:string)=>
    { const title =findPage(pagesId,pages,id).header.title;
      if(parentsId.indexOf(id)===0){
        path= title;
      }else{
        path.concat(`/${title}`)
      }
    });
    return path
  };
  const onChangeQuickFindInput =(event: React.ChangeEvent<HTMLInputElement>)=>{
    const value =event.target.value.toLowerCase();
    if(value ===""){
      setResult(null);
    }else{
      const resultPage = pages.filter((page:Page)=>page.header.title.toLowerCase().includes(value));

    if(resultPage[0]===undefined){
      setResult("noResult")
    }else{
      const listItems :resultType[]= resultPage.map((page:Page)=>({
        id: page.id,
        title: page.header.title,
        icon: page.header.icon,
        editTime: page.editTime,
        createTime: page.createTime,
        path : page.parentsId==null? null : makePath(page.parentsId)
      }) ); 
      setResult(listItems);
      setBestMatchesResult(listItems)
    }
    }
    
  };
  const openSortOptions =()=>{
    if(sortOptions.current !==null){
      sortOptions.current.classList.toggle("on");
    };
  };
  const onClickOption =(event:React.MouseEvent)=>{
    const selected =document.getElementById("quickFindBord")?.getElementsByClassName("selected")[0];
    if(selected !==null){
      selected?.classList.remove("selected");
    };
    const target =event.target as HTMLElement;
    let option:string ="";
    switch (target.tagName.toLocaleLowerCase()) {
      case "button":
        option = target.firstChild?.textContent as string;
        target.classList.add("selected");
        break;
      case "div":
        target.parentElement?.classList.add("selected");
        if(target.className==="optionName"){
          option =target.textContent as string ;
        }else{
          option = target.previousElementSibling?.textContent as string ;
        }
        break;
      case "svg":
        option = target.parentElement?.previousElementSibling?.textContent as string; 
        target.parentElement?.parentElement?.classList.add("selected");
        break; 
      case "path":
        option = target.parentElement?.parentElement?.previousElementSibling?.textContent as string; 
        target.parentElement?.parentElement?.parentElement?.classList.add("selected");
        break; 
      default:
        break;
    };

    setSelectedOption(option);
    if(result !== null && result !== "noResult" ){
      if(bestMatchesResult !==null && bestMatchesResult !=="noResult"){
        const compareResult =(a:resultType,b:resultType, what:"editTime"|"createTime", sort:"newest"|"oldest")=>{
          const A = what==="createTime"? Number(a.createTime):Number(a.editTime);
          const B = what==="createTime"? Number(b.createTime):Number(b.editTime);
          let value :number =0 ;
          switch (sort) {
            case "newest":
              value= A-B;
              break;
            case "oldest":
              value= B-A;
              break;
            default:
              break;
          };
          return value ;
        };
        let sortedResult:resultType[]|null = null;
        switch (option) {
          case bestMatches:
            setResult(bestMatchesResult);
            break;
          case lastEditedNewest:
              sortedResult = bestMatchesResult.sort((a,b)=>compareResult(a,b,"editTime","newest"));
            break;
          case lastEditedOldest:
            sortedResult = bestMatchesResult.sort((a,b)=>compareResult(a,b,"editTime","oldest"));
            break;
          case createdNewest:
            sortedResult = bestMatchesResult.sort((a,b)=>compareResult(a,b,"createTime","newest"));
            break;
          case createdOldest:
            sortedResult = bestMatchesResult.sort((a,b)=>compareResult(a,b,"createTime","oldest"));
            break;
          default:
            break;
        };
        setResult(sortedResult);
      }else{
        setResult(bestMatchesResult)
      };
    };
    openSortOptions();
  }
  return(
    <div 
    id='quickFindBord'
  >
    <div className='inner'>
      <div className ="qf_search">
        <BsSearch/>
        <input 
        id="quickFinBordInput"
        type="text"
        onChange={onChangeQuickFindInput}
        placeholder={`Search ${userName}'s Notion`}
        />
      </div>

      <div className="qf_results" >
        <div className='header'>
          {result !==null ?
            (result !=="noResult" &&
            <>
            <div className="sort">
                <div>Sort :</div>
                <button 
                onClick={openSortOptions}
                ref={openSortOptionsBtn}
                >
                  <div>{selectedOption}</div>
                  <BsChevronDown/>
                </button>
              <div 
                className="sort_options"
                ref={sortOptions}
              >
                <button
                  onClick ={onClickOption}
                  className="selected"
                >
                  <div className="optionName">
                    {bestMatches}
                  </div>
                  <div className="checkIcon">
                    <AiOutlineCheck/>
                  </div>
                </button>
                <button  
                  onClick ={onClickOption}
                >
                  <div className="optionName">
                    {lastEditedNewest}
                  </div>
                  <div className="checkIcon">
                    <AiOutlineCheck/>
                  </div>
                </button>
                <button  
                  onClick ={onClickOption}
                >
                  <div className="optionName">
                    {lastEditedOldest}
                  </div>
                  
                  <div className="checkIcon" >
                    <AiOutlineCheck/>
                  </div>
                </button>
                <button
                onClick ={onClickOption}
                >
                  <div className="optionName">
                    {createdNewest}
                  </div>
                  <div className="checkIcon">
                    <AiOutlineCheck/>
                  </div>
                </button>
                <button 
                  onClick ={onClickOption}
                >
                  <div className="optionName">
                    {createdOldest}
                  </div>
                  <div className="checkIcon">
                    <AiOutlineCheck/>
                  </div>
                </button>
              </div>
            </div>
            </>
              )
          :
          <>
            <p>RECENT PAGES</p>
            <button
              className="clearBtn"
              onClick={cleanRecentPage}
            >
              Clear
            </button>
          </>
          }

        </div>
        <div className="body">
          {result !==null ?
          (result !== "noResult"?
          result.map((item:resultType)=>
            <Result 
              item={item}
              setTargetPageId={setTargetPageId}
            />
          )
          :
          <div className="noResult">
            <p>No result</p>
            <p>Some results may be in your deleted pages</p>
            <button>
              Search deleted pages
            </button>
          </div>
          )
          :
          (recentPagesList !== undefined?
            recentPagesList.map((item:resultType)=>
            <Result
              item={item}
              setTargetPageId={setTargetPageId}
            />)
            :
            <div className="noRecentPages">
              There are no pages visited recently.
            </div>
          )
          }
        </div>
      </div>
      <div className="filter">
        <div className="closeBtn">

        </div>
        <div className="fliterContents">
        </div>
      </div>
    </div>
  </div>
  )
};

export default React.memo(QuickFindBord);