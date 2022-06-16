import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { findPage, Page } from "../modules/notion";

//icon
import {AiOutlineCheck } from "react-icons/ai";
import {  BsChevronDown, BsSearch } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { detectRange } from "./BlockFn";
import Result, { makeResultType, resultType } from "./Result";

type QuickFindBordProps ={
  userName:string,
  recentPagesId: string[]|null,
  pages:Page[],
  pagesId:string[],
  setTargetPageId: Dispatch<SetStateAction<string>>,
  cleanRecentPage: ()=>void,
  setOpenQF: Dispatch<React.SetStateAction<boolean>>
};

const QuickFindBord =({userName,recentPagesId, pages,pagesId ,setTargetPageId, cleanRecentPage ,setOpenQF }:QuickFindBordProps)=>{
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
    const page =findPage(pagesId, pages, id);
    return makeResultType(page , pagesId,pages , null,null)
    });

  const onChangeQuickFindInput =(event: React.ChangeEvent<HTMLInputElement>)=>{
    const value =event.target.value.toLowerCase();
    if(value ===""){
      setResult(null);
    }else{
      const resultPage = pages.filter((page:Page)=>page.header.title.toLowerCase().includes(value));

    if(resultPage[0]===undefined){
      setResult("noResult")
    }else{
      const listItems :resultType[]= resultPage.map((page:Page)=>(makeResultType(page , pagesId,pages , null, null)) ); 
      setResult(listItems);
      setBestMatchesResult(listItems)
    }
    }
    
  };
  const openSortOptions =()=>{
    if(sortOptions.current !==null){
      sortOptions.current.classList.toggle("on");
      const qf_results =document.getElementsByClassName("qf_results")[0]; 
      sortOptions.current.classList.contains("on")?
      qf_results.setAttribute("style", "min-height:170px"):
      qf_results.setAttribute("style", "min-height:min-content")
    };
  };
  const onClickOption =(event:React.MouseEvent)=>{
    const selected =document.getElementById("quickFindBord")?.getElementsByClassName("selected")[0];
    if(selected !==null){
      selected?.classList.remove("selected");
    };
    const target =event.target as HTMLElement;
    let option:string ="";
    switch (target.tagName.toLowerCase()) {
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
  };
  const closeQuickFindBord=(event:React.MouseEvent)=>{
    const inner =document.getElementById
    ("quickFindBoard_inner");
    const innerDomRect =inner?.getClientRects()[0];

    if(innerDomRect !==undefined){
      const isInBord =detectRange(event, innerDomRect);
      console.log(isInBord)
      !isInBord && 
      setOpenQF(false)
    }
  }
  return(
    <div 
      id='quickFindBord'
      onClick={closeQuickFindBord}
    >
    <div 
      className='inner'
      id="quickFindBoard_inner"
    >
      <div>
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
              <div className="sort">
                <div className="sort_selecter">
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
              </div>
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
            <button
              onClick={()=> setTargetPageId(item.id)}
            >
              <Result 
                item={item}
              />
            </button>
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
              <button
                onClick={()=> setTargetPageId(item.id)}
              >
                <Result 
                  item={item}
                />
              </button>
              )
              :
              <div className="noRecentPages">
                There are no pages visited recently.
              </div>
            )
            }
          </div>
        </div>
      </div>
    </div>
  </div>
  )
};

export default React.memo(QuickFindBord);