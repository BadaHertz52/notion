import React ,{Dispatch,SetStateAction, useRef} from 'react';
import { BsChatLeftText } from 'react-icons/bs';
import { Block, Page } from '../modules/notion';
import {  selectContent } from './BlockComponent';
import { fontStyleType, fontWeightType, italic, textDecoType } from './BlockStyler';
type MobileBlockStylerProps ={
  page:Page,
  block:Block,
  setOpenMobileStyler: Dispatch<SetStateAction<boolean>>,
}
const MobileBlockStyler =({page, block, setOpenMobileStyler}:MobileBlockStylerProps)=>{
  const selectedHtml = useRef<HTMLElement|null>(null);
  const onTouchCommentBtn =()=>{

  };
  const prepareForChange =()=>{
    const mobileSelection = document.getSelection();
    const contentEditableHtml = document.getElementById(`${block.id}_contents`)?.firstElementChild as HTMLElement|null|undefined;
    if(mobileSelection !==null && contentEditableHtml!==null && 
    contentEditableHtml !==undefined){
      selectContent(mobileSelection, block, contentEditableHtml, null, page, null);
    }
  };
  const onTouchFontStyleBtn =(btnName:fontWeightType|fontStyleType|textDecoType)=>{
    selectedHtml.current = document.getElementsByClassName('selected')[0] as HTMLElement|null;

  };
  document.onselectionchange =()=>{
    const SELECTION  =document.getSelection();
    const notSelect = (SELECTION?.anchorNode === SELECTION?.focusNode && SELECTION?.anchorOffset === SELECTION?.focusOffset);
    if(notSelect){
      setOpenMobileStyler(false);
      selectedHtml.current =null
    }
  };

  return(
    <div id="mobileBlockStyler">
      <div className="inner">
        <button
          name='commentBtn'
          onTouchEnd={onTouchCommentBtn}
        >
          <BsChatLeftText/>
        </button>
        <div className='styles'>
          <button 
            className='boldBtn btn'
            onTouchStart={prepareForChange}
            onTouchEnd={()=>onTouchFontStyleBtn('bold')}
          >
            B
          </button>
          <button 
          className='italicBtn btn'
          onTouchEnd={()=>onTouchFontStyleBtn(italic)}
          >
            i
          </button>
          <button 
            className='underlineBtn btn'
            onTouchEnd={()=>onTouchFontStyleBtn('underline')}
          >
            U
          </button>
          <button 
            className='lineThroughBtn btn'
            onTouchEnd={()=>onTouchFontStyleBtn('lineThrough')}
          >
            S
          </button>
        </div>
      </div>
    </div>
  )
};

export default React.memo(MobileBlockStyler);
