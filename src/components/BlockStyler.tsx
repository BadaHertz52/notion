import React, { Dispatch, SetStateAction } from 'react';
import ColorMenu from './ColorMenu';
import CommandBlock from './CommandBlock';
import { selectionType } from './Frame';
import Menu, { MenuProps } from './Menu';

type BlockStylerProps = MenuProps & {
  selection:selectionType,
  setSelection:Dispatch<SetStateAction<selectionType|null>>,
  openTemplates: boolean
}
const BlockStyler=({pages, firstlist, userName, page, addBlock, editBlock, changeBlockToPage, changePageToBlock,deleteBlock,addPage,duplicatePage,movePageToPage,popup,setPopup, setMenuOpen, setOpenRename,setCommentBlock,setTargetPageId,selection,setSelection, openTemplates}:BlockStylerProps)=>{
  const bold="bold";
  const initial="initial";
  const italic= "italic";
  const underline="underline";
  const lineThrough="line-through";
  const none="none";

  type fontWeightType =typeof bold|typeof initial;
  type fontStyleType= typeof italic| typeof initial;
  type textDecoType= typeof underline| typeof lineThrough | typeof none; 

  return(
    <div id="blockStyler">
      <div className='inner'>
        <div className='typeBtn'>
          <button className='blockType'>
            {selection.block.type}
          </button>
          <CommandBlock
            page ={page}
            block={selection.block}
            editBlock={editBlock}
            changeBlockToPage={changeBlockToPage}
            changePageToBlock={changePageToBlock}
            setCommand ={null}
            command ={null}
            setPopup ={null}
            setCommandTargetBlock ={null}
          />
        </div>
        <div className='linkBtn'>
          <button>
            Link
          </button>
        </div>
        <div className='commentBtn'>
          <button>
            Comment
          </button>
        </div>
        <div className='styles'>
          <button className='boldBtn'>
            B
          </button>
          <button className='italicBtn'>
            i
          </button>
          <button className='underlineBtn'>
            U
          </button>
          <button className='lineThroughBtn'>
            S
          </button>
        </div>
        <div className='colorBtn'>
          <button>
            A
          </button>
          <ColorMenu
            page={page}
            block={selection.block}
            editBlock={editBlock}
            selection={selection}
          />
        </div>
        <div className='openMenuBtn'>
          <Menu
            pages={pages}
            firstlist={firstlist}
            page={page}
            block={selection.block}
            userName={userName}
            setMenuOpen={setMenuOpen}
            addBlock={addBlock}
            editBlock={editBlock}
            changeBlockToPage={changeBlockToPage}
            changePageToBlock={changePageToBlock}
            deleteBlock={deleteBlock}
            addPage={addPage}
            duplicatePage={duplicatePage}
            movePageToPage={movePageToPage}
            popup={popup}
            setPopup={setPopup}
            setCommentBlock={setCommentBlock}
            setTargetPageId={setTargetPageId}
            setOpenRename= {setOpenRename}
          />
        </div>
      </div>
    </div>
  )
};

export default React.memo(BlockStyler)