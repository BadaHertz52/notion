import  React, { Dispatch, SetStateAction, useState ,useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TiArrowSortedDown } from 'react-icons/ti';
import { CSSProperties } from 'styled-components';
import { msmWhatType, ms_color, ms_moreMenu, ms_turnInto, selectionType } from '../containers/NotionRouter';
import { Block, makeNewBlock} from '../modules/notion';
import  BlockStyler, { StylerCommonProps } from './BlockStyler';
import MobileBlockStyler from './MobileBlockStyler';


type MobileBlockMenuProps = StylerCommonProps & {
  setMobileMenuBlock:Dispatch<SetStateAction<Block|null>>,
  setOpenMM :Dispatch<SetStateAction<boolean>>,
};

const MobileBlockMenu =({pages, pagesId, firstlist, userName, page,recentPagesId, block, addBlock, editBlock, changeBlockToPage, changePageToBlock,deleteBlock,duplicatePage,movePageToPage, editPage,popup,setPopup, setCommentBlock,setTargetPageId,setPopupStyle,command ,setCommand, frameHtml ,setMobileSideMenu, setMobileSideMenuOpen, setMobileMenuBlock, setOpenMM  }:MobileBlockMenuProps)=>{
  const [mbmStyle,setMBMstyle]=useState<CSSProperties|undefined>(undefined);
  type mobileSelectionType = selectionType & {
    selection: Selection
  }; 
  const [mobileSelection ,setMobileSelection]= useState<mobileSelectionType|null>(null) ;
  const inner = document.getElementById('inner');
  inner?.addEventListener('click', (event)=>{
    const target =event.target as HTMLElement|null;
    const contentEditableElement =   target?.closest('.contentEditable');
    if((contentEditableElement ===null ||contentEditableElement===undefined ) && target?.className !== "contentEditable"){
      closeMM();
    }
  });

  const changeMBMstyle =()=>{
    const blockElement = document.getElementById(`${block.id}_contents`);
    const blockElementDomRect =blockElement?.getClientRects()[0];
    const pageContentInner =frameHtml?.querySelector(".pageContent_inner") ;
    const pageContentInnerDomRect =pageContentInner?.getClientRects()[0];
    const frameDomRect = frameHtml?.getClientRects()[0];
    if(frameDomRect !==undefined && pageContentInnerDomRect !==undefined&&  blockElementDomRect !==undefined ){
      const top = blockElementDomRect.bottom + 8 ;
      const left = pageContentInnerDomRect.left - frameDomRect.left ;
      setMBMstyle({
        top:`${top}px`,
        left:`${left}px`,
        width: pageContentInnerDomRect.width > 260 ? "260px" : `${pageContentInnerDomRect.width  }px`
      })
    }
  };
  const openMobileSideMenu =(what:msmWhatType)=>{
    setMobileSideMenu({
      block:block,
      what:what
    });
    setMobileSideMenuOpen(true);
    sessionStorage.setItem("msm_block", JSON.stringify(block));
    closeMM();
  }
  /**
   * MobileBlockMenu 창을 닫는 함수 
   */
  const closeMM =()=>{
    setMobileMenuBlock(null);
    setOpenMM(false);
  };
  const addNewBlock =()=>{
    if(page.blocksId!==null){
      const blockIndex = page.blocksId.indexOf(block.id);
      const newBlock =makeNewBlock(page, block,"");
      addBlock(page.id, newBlock, blockIndex+1, block.id);
      closeMM();
    };
  };
  const removeBlock =()=>{
    deleteBlock(page.id, block, true);
    closeMM();
  };
  const onClickCommentBtn =()=>{
    setCommentBlock(block);
    setPopup({
      popup:true,
      what:'popupComment'
    });
    setPopupStyle(mbmStyle);
    closeMM();
  };
  document.onselectionchange = (event)=>{
    const SELECTION = document.getSelection();
    const notSelect = (SELECTION?.anchorNode === SELECTION?.focusNode && SELECTION?.anchorOffset === SELECTION?.focusOffset);
    if(SELECTION !==null && !notSelect){
      setMobileSelection({
        block:block,
        change:false,
        selection:SELECTION
      })
    }
  };

  useEffect(()=>{
    changeMBMstyle();
  },[block.id]);

  
  return(
    <>
      <div id="mobileBlockMenu" style={mbmStyle}>
        {mobileSelection ==null ?
            <div className='inner'>
              <button
                onClick={addNewBlock}
                title="Click  to add a block below"
                >
                <div className='btn_inner'>
                  <AiOutlinePlus/>
                </div>
              </button>
              {block.type !== "page" &&
                <button
                  name="comment"
                  onClick={onClickCommentBtn}
                >
                  <div className="btn_inner">
                    <BiCommentDetail/>
                  </div>
                </button>
                }
              <button
                  onMouseOver={()=>openMobileSideMenu(ms_turnInto)}
                  name="turn into"
                >
                  <div className="btn_inner">
                    <div className='text'>Turn into</div>
                    <div className='arrowDown'>
                        <TiArrowSortedDown/>
                    </div>
                  </div>
                </button>
              <button
                  onClick ={removeBlock}
                  name="delete"
                >
                  <div className="btn_inner">
                    <RiDeleteBin6Line/>
                  </div>
              </button>
              <button 
                  name='color'
                  className='underline menu_editBtn'
                  onMouseOver={()=>openMobileSideMenu(ms_color)}
                >
                  <div className="btn_inner">
                    <div className='text'>Color</div>
                    <div
                      className="arrowDown"
                    >
                    <TiArrowSortedDown/>
                    </div>
                  </div>
                </button>
              <button
                aria-details='open menu'
                onClick={()=>openMobileSideMenu(ms_moreMenu)}
              >
                <div className="btn_inner">
                  <div className='text'> 
                    more
                  </div>
                </div>
              </button>
            </div>
          : 
            <MobileBlockStyler
                
            
            />
        }
      </div>

    </>
  )
};

export default React.memo(MobileBlockMenu);