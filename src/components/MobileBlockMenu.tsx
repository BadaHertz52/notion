import  React, { useState ,useEffect  ,useContext } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TiArrowSortedDown } from 'react-icons/ti';
import { CSSProperties } from 'styled-components';
import {  ActionContext, msmWhatType, ms_color, ms_moreMenu, ms_turnInto } from '../containers/NotionRouter';
import { Block, findBlock, makeNewBlock} from '../modules/notion';
import BlockStyler, { removeSelected, StylerCommonProps } from './BlockStyler';


type MobileBlockMenuProps = Omit<StylerCommonProps , 'block'> & {
  initialInnerHeight:number
};

const MobileBlockMenu =({
  pages, pagesId, firstlist, userName, page,recentPagesId,modal,setModal, setCommentBlock,setTargetPageId,setModalStyle,command ,setCommand, frameHtml ,openMobileBlockMenu ,setMobileSideMenu, setMobileSideMenuOpen, setOpenMM  , initialInnerHeight }:MobileBlockMenuProps)=>{
  const {addBlock, editBlock, deleteBlock} =useContext(ActionContext).actions;
  const item = sessionStorage.getItem('mobileMenuBlock');
  const [mbmStyle,setMBMstyle]=useState<CSSProperties|undefined>(undefined);
  const [block, setBlock]= useState<Block|null>(null);
  const [openMobileBlockStyler, setOpenMobileBlockStyler]= useState<boolean>(false);
  const inner = document.getElementById('inner');
  // mobileBlockMenu 창이 열려있을 때, mobileBlockMenu 나 contentEditable 이외의 영역을 클릭 시, moblileBlockMenu 창을 닫는  동작 (+ Selection 이 있는 경우, 이를 해제 )
  inner?.addEventListener('click', (event)=>{
    const target =event.target as HTMLElement|null;
    const mobileBlockMenuElement =target?.closest("#mobileBlockMenu");
    const contentEditableElement =   target?.closest('.contentEditable');
    const conditionForClosing_notMobileBlock = (mobileBlockMenuElement === null || mobileBlockMenuElement === undefined) ;

    const conditionForClosing_notContentEidtable =
    (contentEditableElement ===null ||contentEditableElement===undefined )&& target?.className !== "contentEditable";
    if( conditionForClosing_notMobileBlock && conditionForClosing_notContentEidtable){
      closeMM();
    }
  });

  const changeMBMstyle =(targetBlock:Block)=>{
    const innerHeight = window.innerHeight;
    /**
     *Select event로 인해 가상키보드가 나타날 때 줄어든 window.innerHeight 의 값이자
     */
    const heightGap = initialInnerHeight - innerHeight; 
    const blockElement = document.getElementById(`${targetBlock.id}_contents`);
    const blockElementDomRect =blockElement?.getClientRects()[0];
    const pageContentInner =frameHtml?.querySelector(".pageContent_inner") ;
    const pageContentInnerDomRect =pageContentInner?.getClientRects()[0];
    const frameDomRect = frameHtml?.getClientRects()[0];
    
    if(frameHtml !==null && frameDomRect !==undefined && 
      pageContentInnerDomRect !==undefined&&  
      blockElement !==null &&
      blockElementDomRect !==undefined ){
      const top = blockElementDomRect.bottom + 16 ;
      const left = pageContentInnerDomRect.left - frameDomRect.left ;
      let newTop = top;
      /**
       * 가상 키보드롤 인해 가려지는 부분의 y축 시작점 (기준: window)
       */
      const pointBlinding = frameDomRect.height - heightGap;
      const gap =  blockElementDomRect.bottom + (16 + 32) - pointBlinding;
      if( gap >=0){
        frameHtml.scrollTo(0 ,blockElementDomRect.bottom + 10 )
        newTop = blockElement.getClientRects()[0].bottom + 16;
      };
        setMBMstyle({
          top:`${newTop}px`,
          left:`${left}px`,
          maxWidth: pageContentInnerDomRect.width > 260 ? "280px" : `${pageContentInnerDomRect.width  }px`
        })
    };
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
  function closeMM (){
    setOpenMM(false);
  };
  const addNewBlock =()=>{
    if(page.blocksId!==null && block !==null){
      const blockIndex = page.blocksId.indexOf(block.id);
      const newBlock =makeNewBlock(page, block,"");
      addBlock(page.id, newBlock, blockIndex+1, block.id);
      closeMM();
    };
  };
  const removeBlock =()=>{
    block !==null && deleteBlock(page.id, block, true);
    closeMM();
  };
  const onTouchCommentBtn =()=>{
    setCommentBlock(block);
    setModal({
      open:true,
      what:'modalComment'
    });
    setModalStyle(mbmStyle);
    const pageHtml =frameHtml?.querySelector(".page");
    if(pageHtml !== null && frameHtml !==null){
      pageHtml?.setAttribute("style", 
      `translateY(${ ( pageHtml.clientTop - frameHtml.clientTop) - 50}px)`);
    };

    closeMM();
  };

const detectSelectionInMobile =(SELECTION :Selection)=>{
    const anchorNode =SELECTION.anchorNode;
    let contentEditableElement : HTMLElement|null|undefined = null ;
    switch (anchorNode?.nodeType) {
      case 3 :
        //text node
        const parentElement = anchorNode.parentElement;
        contentEditableElement = parentElement?.closest('.contentEditable');

        break;
      case 1:
        //element node
        break;
      default:
        break;
    };
    if(contentEditableElement !==null && contentEditableElement !==undefined){
      const blockContnetElement = contentEditableElement?.closest('.contents');
      if(blockContnetElement!==null){
        const id =blockContnetElement.id;
        const index= id.indexOf('_contents');
        const blockId = id.slice(0, index);
        const targetBlock= findBlock(page, blockId).BLOCK;
        setBlock(targetBlock);
        changeMBMstyle(targetBlock);
      } ;
    }
};
document.onselectionchange = (event)=>{
  const SELECTION = document.getSelection();
  const notSelect = (SELECTION?.anchorNode === SELECTION?.focusNode && SELECTION?.anchorOffset === SELECTION?.focusOffset);
  if(SELECTION===null){
    closeMM();
  }
  if(notSelect && SELECTION !==null){
    detectSelectionInMobile(SELECTION)
  }
  if(SELECTION !==null && !notSelect && !openMobileBlockStyler){
      setOpenMobileBlockStyler(true)
    }
};
useEffect(()=>{
  if(item !==null){
    if(openMobileBlockStyler && block !==null){
      setOpenMobileBlockStyler(false);
      removeSelected(frameHtml,block,editBlock,page, null)
    }
    const targetBlock = JSON.parse(item);
    setBlock(targetBlock);
    changeMBMstyle(targetBlock);
    sessionStorage.removeItem('mobileMenuBlock');

  }
},[item]);
  return(
    <>
      <div id="mobileBlockMenu" style={mbmStyle}>
        {!openMobileBlockStyler ?
            <div className='inner'>
              <button
                onTouchEnd={addNewBlock}
                title="Click  to add a block below"
                >
                <div className='btn_inner'>
                  <AiOutlinePlus/>
                </div>
              </button>
              {block?.type !== "page" &&
                <button
                  name="comment"
                  onTouchEnd={onTouchCommentBtn}
                >
                  <div className="btn_inner">
                    <BiCommentDetail/>
                  </div>
                </button>
                }
              <button
                  onTouchEnd={()=>openMobileSideMenu(ms_turnInto)}
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
                  onTouchEnd={removeBlock}
                  name="delete"
                >
                  <div className="btn_inner">
                    <RiDeleteBin6Line/>
                  </div>
              </button>
              <button 
                  name='color'
                  className='underline menu_editBtn'
                  onTouchEnd={()=>openMobileSideMenu(ms_color)}
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
                onTouchEnd={()=>openMobileSideMenu(ms_moreMenu)}
              >
                <div className="btn_inner">
                  <div className='text'> 
                    more
                  </div>
                </div>
              </button>
            </div>
          : 
          block !==null &&
          <BlockStyler
          pages={pages}
          pagesId={pagesId}
          firstlist={firstlist}
          userName={userName}
          page={page}
          recentPagesId={recentPagesId}
          block={block}
          modal={modal}
          setModal={setModal}
          setModalStyle={setModalStyle}
          command={command}
          setCommand={setCommand}
          setCommentBlock={setCommentBlock}
          setTargetPageId={setTargetPageId}
          selection={null}
          setSelection={null}
          frameHtml={frameHtml}
          openMobileBlockMenu={openMobileBlockMenu}
          setMobileSideMenu={setMobileSideMenu}
          setMobileSideMenuOpen={setMobileSideMenuOpen}
          setOpenMM={setOpenMM}
          setOpenMobileBlockStyler={setOpenMobileBlockStyler}
          />
        }
      </div>

    </>
  )
};

export default React.memo(MobileBlockMenu);