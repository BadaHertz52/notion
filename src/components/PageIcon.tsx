import React from 'react';
import { GrDocumentText } from 'react-icons/gr';
import { CSSProperties } from 'styled-components';
import { IconType } from '../modules/notion';
type PageItemProps={
  icon:string|null,
  iconType:IconType,
  style:CSSProperties|undefined
}
const PageIcon=({icon, iconType, style}:PageItemProps)=>{
  return(
    <div 
      className="pageIcon"
      style={style}
    >
      {icon !==null ?
      <span>
        {iconType==="img" ?
          <img
            className='pageImgIcon'
            alt="pageImgIcon"
            src={icon}
          />
        :
          <img
            className='pageImgIcon'
            alt="pageImgIcon"
            src={`https://raw.githubusercontent.com/BadaHertz52/notion/master/image/emoji/${icon}.png`}
          />
        }
        </span>
    :
        <span>
          <GrDocumentText/>
        </span>
    }
    </div>
  )
};


export default React.memo(PageIcon)

