import { type } from '@testing-library/user-event/dist/type';
import React from 'react';
import { GrDocumentText } from 'react-icons/gr';
import { pathType } from '../containers/NotionRouter';
import { IconType } from '../modules/notion';
import { itemType } from './BlockComponent';
type PageItemProps={
  icon:string|null,
  iconType:IconType
}
const PageIcon=({icon, iconType}:PageItemProps)=>{

  return(
    <div className="pageIcon">
      {icon !==null ?
        <span>
          {iconType==="string"?
            icon
          :
            <img
              className='pageImgIcon'
              alt="pageImgIcon"
              src={icon}
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

