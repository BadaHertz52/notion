import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GrDocumentText } from "react-icons/gr";
import { findPage, Page } from "../modules/notion";
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
    <div>
      {item.icon !==null ?
      item.icon:
      < GrDocumentText/>
      }
    </div>
    <div>
      {item.title}
    </div>
    {item.path !==null &&
      <div className="path">
        {item.path}
      </div>
    }
  </button>
  )
}
const QuickFindBord =({userName,recentPagesId, pages,pagesId,search ,setTargetPageId, cleanRecentPage }:QuickFindBordProps)=>{
  const [result, setResult]=useState<resultType[]|null|"noResult">(null);
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
  const makePath =(parentsId:string[]):string=>{
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
  const onChangeQuikFindInput =(event: React.ChangeEvent<HTMLInputElement>)=>{
    const value =event.target.value ;
    const resultPage = pages.filter((page:Page)=>page.header.title.includes(value));

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
    }
  };
  return(
    <div 
    id='quickFindBord'
  >
    <div className='inner'>
      <input 
        type="text"
        onChange={onChangeQuikFindInput}
        placeholder={`Search ${userName}'s Notion`}
      >
      </input>
      <div className="inner_body" >
        <div className='header'>
          {result !==null ?
            (result !=="noResult" &&
            <>
            <div>
              <span>Sort</span>
              <select>
                <option value="bestMatch">
                  Best matches
                  </option>
                <option value="editedNewsest">
                  Last edited:Newest first
                </option>
                <option value="editedOldest">
                  Last edited: Oldest first
                </option>
                <option value="createdNewst">
                  Created:Newest first
                </option>
                <option value="createdOldest">
                  Created:Oldest first
                </option>
              </select>
            </div>
            </>
              )
          :
          <>
            <p>RECENT PAGES</p>
            <button
              //onClick={cleanRecentPage}
            >
              Clear
            </button>
          </>
          }

        </div>
        <div className="results">
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