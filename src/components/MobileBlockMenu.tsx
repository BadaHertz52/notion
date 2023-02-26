import  React, { Dispatch, SetStateAction, useState ,useEffect , useRef } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TiArrowSortedDown } from 'react-icons/ti';
import { CSSProperties } from 'styled-components';
import { PopupType } from '../containers/EditorContainer';
import { mobileSideMenuType, msmWhatType, ms_color, ms_moreMenu, ms_turnInto, selectionType } from '../containers/NotionRouter';
import { Block, findBlock, makeNewBlock, Page} from '../modules/notion';
import MobileBlockStyler from './MobileBlockStyler';
export   type mobileSelectionType = selectionType & {
  selection: Selection
}; 
type MobileBlockMenuProps = {
  page:Page
  addBlock:(pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  deleteBlock:(pageId: string, block: Block, isInMenu: boolean) => void,
  setPopup:Dispatch<SetStateAction<PopupType>>, 
  setCommentBlock :Dispatch<SetStateAction<Block | null>>,
  setPopupStyle :Dispatch<SetStateAction<CSSProperties | undefined>>,
  frameHtml:HTMLElement|null ,
  setMobileSideMenu:Dispatch<SetStateAction<mobileSideMenuType>>, 
  setMobileSideMenuOpen: Dispatch<SetStateAction<boolean>>,
  setOpenMM :Dispatch<SetStateAction<boolean>>,
  initialInnerHeight:number
};

const MobileBlockMenu =({ page, addBlock,deleteBlock,setPopup, setCommentBlock,setPopupStyle, frameHtml ,setMobileSideMenu, setMobileSideMenuOpen, setOpenMM , initialInnerHeight }:MobileBlockMenuProps)=>{
  const pageHtml = frameHtml?.querySelector('.page');
  const item = sessionStorage.getItem('mobileMenuBlock');
  const [mbmStyle,setMBMstyle]=useState<CSSProperties|undefined>(undefined);
  const [mobileSelection ,setMobileSelection]= useState<mobileSelectionType|null>(null) ;
  const [block, setBlock]= useState<Block|null>(null);
  const inner = document.getElementById('inner');
  inner?.addEventListener('click', (event)=>{
    const target =event.target as HTMLElement|null;
    const contentEditableElement =   target?.closest('.contentEditable');
    if((contentEditableElement ===null ||contentEditableElement===undefined ) && target?.className !== "contentEditable"){
      closeMM();
    }
  });

  const changeMBMstyle =(targetBlock:Block)=>{
    const innerHeight = window.innerHeight;
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
      const top = blockElementDomRect.bottom + 8 ;
      const left = pageContentInnerDomRect.left - frameDomRect.left ;
      let newTop = top;
      /**
       * 가상 키보드롤 인해 가려지는 부분의 y축 시작점
       */
      const pointBlinding = frameDomRect.height - heightGap;
      if(pageHtml !==null && pageHtml !==undefined){
        if(top >= pointBlinding){
          const widthOfMovement = top - pointBlinding + 32;
          pageHtml.setAttribute("style", `transform:translateY( -${widthOfMovement}px)`);
          newTop = blockElement.getClientRects()[0].bottom + 8;
        };
          setMBMstyle({
            top:`${newTop}px`,
            left:`${left}px`,
            width: pageContentInnerDomRect.width > 260 ? "260px" : `${pageContentInnerDomRect.width  }px`
          })
      }
    };
  };
  window.addEventListener('resize', ()=>{
    const innerHeight =window.innerHeight;
    if(innerHeight === initialInnerHeight && pageHtml !==null && pageHtml!==undefined){
      pageHtml.setAttribute("style", 'transform:traslateY(0)');
      block !==null && changeMBMstyle(block);
    }
  });
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
    if(notSelect && SELECTION !==null){
      detectSelectionInMobile(SELECTION)
    }
    if(SELECTION !==null && !notSelect && block !==null){
        setMobileSelection({
          block:block,
          change:false,
          selection:SELECTION
        })
      }
  };
  function detectSelectionInMobile (SELECTION :Selection){
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
 useEffect(()=>{
  if(item !==null){
    const targetBlock = JSON.parse(item);
    setBlock(targetBlock);
    changeMBMstyle(targetBlock);
    sessionStorage.removeItem('mobileMenuBlock')
  }
 },[item])
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
              {block?.type !== "page" &&
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
                page={page}
              mobileSelection={mobileSelection}
              setMobileSelection={setMobileSelection}
            />
        }
      </div>

    </>
  )
};

export default React.memo(MobileBlockMenu);