import React from 'react';
import { CSSProperties } from 'styled-components';
import { emojiPath, IconType } from '../modules/notion';
import  pageDefultImg from '../assests/img/icons8-페이지-개요-100.png'
type PageItemProps={
  icon:string|null,
  iconType:IconType,
  style:CSSProperties|undefined
}
const PageIcon=({icon, iconType, style}:PageItemProps)=>{
  const imgSrc = icon!==null? 
  (
    iconType ==="img"?
    icon:
    `${emojiPath}${icon}.png`
  ) 
  : 
  pageDefultImg ;
  return(
    <div 
      className="pageIcon"
      style={style}
    >
      <span>
          <img
            className='pageImgIcon'
            alt="pageImgIcon"
            src={imgSrc}
          />
        </span>

    </div>
  )
};


export default React.memo(PageIcon)

