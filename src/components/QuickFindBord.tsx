import React, { Dispatch, SetStateAction, useState } from "react";
import { GrDocumentText } from "react-icons/gr";
import { findPage, listItem, Page } from "../modules/notion";
type QuickFindBordProps ={
  userName:string,
  pages:Page[],
  pagesId:string[],
  search: string | null,
  setTargetPageId: Dispatch<SetStateAction<string>>
};
// type ParentPathProps ={
//   pages:Page[],
//   pagesId:string[],
//   parentsId: string[]
// }
// const ParentPath=({pages, pagesId, parentsId}:ParentPathProps)=>{
//   const parentsTitle:string[] = parentsId.map((id:string)=>{
//     const pageId= findPage(pagesId, pages, id).header.title; 
//     return pageId
//   });
//   const [path, setPath]=useState<string>("");
//   let PATH="";
//   for (let i = 0; i < parentsTitle.length; i++) {
//     const title = parentsTitle[i];
//     if(i===0){
//       PATH =`${title}`
//     }else{
//       PATH.concat(`/${title}`);
//     };
//     if(i===parentsTitle.length-1){
//       setPath(PATH);
//     }
//   }
  
//   return(
//     <div className="parentPath">
//       {path}
//     </div>
//   )
// };
type resultType ={
  id:string,
  title:string,
  icon:string|null,
  createTime:string,
  editTime:string,
  path:string |null,
}
const QuickFindBord =({userName, pages,pagesId,search ,setTargetPageId}:QuickFindBordProps)=>{
  const [result, setResult]=useState<resultType[]|undefined|null>(null);

  const onChangeQuikFindInput =(event: React.ChangeEvent<HTMLInputElement>)=>{
    const value =event.target.value ;
    const resultPage = pages.filter((page:Page)=>page.header.title.includes(value));
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
    if(resultPage[0]===undefined){
      setResult(undefined)
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
            (result !==undefined ?
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
          {result?.map((item:resultType)=>
          <div className="result">
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
          </div>)}
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