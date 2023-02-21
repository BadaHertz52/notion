import  React, { Dispatch, SetStateAction, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { CSSProperties } from 'styled-components';
import { makeNewBlock } from '../modules/notion';
import { selectionType } from './Frame';
import Menu, {  MenuAndBlockStylerCommonProps} from './Menu';
import MobileStyler from './MobileStyler';

type MobileBlockMenuProps = MenuAndBlockStylerCommonProps & {
  setSelection : Dispatch<SetStateAction<selectionType|null>>,
  selection:selectionType,
  setOpenMM :Dispatch<SetStateAction<boolean>>
};

const MobileBlockMenu =({pages,firstlist, page, block, userName,addBlock,changeBlockToPage,changePageToBlock ,editBlock, deleteBlock ,duplicatePage,movePageToPage,editPage ,setPopup ,popup ,setCommentBlock ,setTargetPageId ,frameHtml,selection, setSelection, setOpenMM }:MobileBlockMenuProps)=>{
  const [moreStyle, setMoreStyle] =useState<CSSProperties>({
    transform: "translateY(-100vh)"
  });
  const [openStyler, setOpenStyler] =useState<boolean>(false);
  const [mobileSelection , setMobileSelection]= useState<Selection|null>(null)
  /**
   * MobileBlockMenu 창을 닫는 함수 
   */
  const closeMM =()=>{
    setSelection(null);
    setOpenMM(false);
  };
  const addNewBlock =()=>{
    if(page.blocksId!==null){
      const blockIndex = page.blocksId.indexOf(block.id);
      const newBlock =makeNewBlock(page, block,"");
      addBlock(page.id, newBlock, blockIndex+1, block.id);
      closeMM();
    };
  }
  const openMore =()=>{
    setMoreStyle({
      transform: 'translateY(0)'
    })
  };
  document.onselectionchange = (event)=>{
    const SELECTION = document.getSelection();
    const notSelect = (SELECTION?.anchorNode === SELECTION?.focusNode && SELECTION?.anchorOffset === SELECTION?.focusOffset);
    console.log("selectionchange", notSelect)
    if(!notSelect){
      setOpenStyler(true);
    }
  }
  return(
    <div id="mobileBlockMenu">
      <div className="inner">
        {!openStyler ?
          <>
            <button
              onClick={addNewBlock}
              title="Click  to add a block below"
              >
              <AiOutlinePlus/>
            </button>
            <Menu
              pages={pages}
              block={selection.block}
              firstlist={firstlist}
              page={page}
              userName={userName}
              setOpenMenu={setOpenMM}
              addBlock={addBlock}
              editBlock={editBlock}
              changeBlockToPage={changeBlockToPage}
              changePageToBlock={changePageToBlock}
              deleteBlock={deleteBlock}
              editPage={editPage}
              duplicatePage={duplicatePage}
              movePageToPage={movePageToPage}
              popup={popup}
              setPopup={setPopup}
              setCommentBlock={setCommentBlock}
              setTargetPageId={setTargetPageId}
              setOpenRename= {null}
              setSelection={null}
              frameHtml={frameHtml}
              style ={undefined}
            />
            <button
              aria-details='open menu'
              onClick={openMore}
            >
              more
            </button>
          </>
        :
          <MobileStyler/>
        }
      </div>
      <div className="more" style={moreStyle}>
        <Menu
          pages={pages}
          block={selection.block}
          firstlist={firstlist}
          page={page}
          userName={userName}
          setOpenMenu={setOpenMM}
          addBlock={addBlock}
          editBlock={editBlock}
          changeBlockToPage={changeBlockToPage}
          changePageToBlock={changePageToBlock}
          deleteBlock={deleteBlock}
          editPage={editPage}
          duplicatePage={duplicatePage}
          movePageToPage={movePageToPage}
          popup={popup}
          setPopup={setPopup}
          setCommentBlock={setCommentBlock}
          setTargetPageId={setTargetPageId}
          setOpenRename= {null}
          setSelection={null}
          frameHtml={frameHtml}
          style ={undefined}
        />
      </div>
    </div>
  )
};

export default React.memo(MobileBlockMenu);