import React from 'react';
import { GrDocumentText } from 'react-icons/gr';
import { findPage, IconType, Page } from '../modules/notion';
import PageIcon from './PageIcon';
export type resultType ={
  id:string,
  title:string,
  icon:string|null,
  iconType:IconType,
  createTime:string,
  editTime:string,
  path:string |null,
};
export type ResultProps={
  item:resultType,
};

export  function makePath (parentsId:string[], pagesId:string[],pages:Page[], trashParentPagesId:string[]|null, trashParentPages:Page[]|null ):string{
  let path ="";
  parentsId.forEach((id:string)=>
  { const title =parentsId.includes(id)? findPage(pagesId,pages,id).header.title : 
    (trashParentPages!==null && trashParentPagesId !==null )?
    findPage(trashParentPagesId, trashParentPages,id).header.title
    :""
    ;

    if(parentsId.indexOf(id)===0){
      path= title;
    }else{
      path.concat(`/${title}`)
    }
  });
  return path
};
export function makeResultType (page:Page ,
  pagesId:string[], pages:Page[] ,trashParentPagesId:string[]|null, trashParentPages:Page[]|null):resultType{
    console.log("mr", page)
  return {
    id: page.id,
    title: page.header.title,
    icon: page.header.icon,
    iconType:page.header.iconType,
    createTime: page.createTime,
    editTime: page.editTime,
    path: page.parentsId !==null? makePath(page.parentsId , pagesId, pages ,trashParentPagesId, trashParentPages):null
  }
}
const Result =({item}:ResultProps)=>{
  return(
    <div 
    className="result"
    >
      <PageIcon
        icon={item.icon}
        iconType={item.iconType}
        style={undefined}
      />
      <div>
        <div className="pageTitle">
          {item.title}
        </div>
        {item.path !==null &&
          <div className="path">
            <span>—</span>
            {item.path}
          </div>
        }
    </div>
  </div>
  )
};

export default React.memo(Result)