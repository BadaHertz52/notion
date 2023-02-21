import React from 'react';
import { Block, Page } from '../modules/notion';
import { BlockStylerProps } from './BlockStyler';

type MobileStylerProps = BlockStylerProps & {
  mobileSelection:Selection|null
}
const MobileStyler =()=>{

  return(
    <div id="mobileStyler">
      mobilestyler
    </div>
  )
};

export default React.memo(MobileStyler)