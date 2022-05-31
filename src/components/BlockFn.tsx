import React, { useState } from 'react';
import Menu from './Menu';
import {Block, listItem, Page} from '../modules/notion';

import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { makeNewBlock } from './EditableBlock';
import PageMenu from './PageMenu';
import { CommentInput } from './Comments';

type BlockFnProp ={
  pages:Page[],
  firstlist:listItem[],
  page:Page,
  userName:string,
  addBlock: (pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void, 
  editBlock: (pageId: string, block: Block) => void,
  deleteBlock :(pageId: string, block: Block) => void,
  addPage : (pageId:string , newPage:Page, block:null)=>void,
  editPage : (pageId:string , newPage:Page, block:null)=>void,
  deletePage : (pageId:string , block:null)=>void,
};
export const popupMoveToPage= "popupMoveToPage" ;
export const popupComment ="popupComment" ;
export type PopupType ={
  popup: boolean,
  what: typeof popupMoveToPage | typeof popupComment | null,
};
const BlockFn =({pages,firstlist, page,userName, addBlock, editBlock, deleteBlock ,addPage, editPage, deletePage}:BlockFnProp)=>{
  const editTime = JSON.stringify(Date.now());
  const newContents:string ="";
  const [menuOpen, setMenuOpen]= useState<boolean>(false);
  const [popup, setPopup]=useState<PopupType>({
    popup:false,
    what:null
  });

  const sessionItem = sessionStorage.getItem("blockFnTargetBlock") as string;

  const makeBlock =()=>{
    const targetBlock= JSON.parse(sessionItem);
    const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
    makeNewBlock(page, editTime,addBlock, editBlock, targetBlock, targetBlockIndex, newContents);
  };

  const openMenu=()=>{
    setMenuOpen(!menuOpen);
  };

  
  return (
    <div 
      id="blockFn"
      className='blockFn'
    >
      <div className='blockFnIcon'>
        <button
        onClick={makeBlock}
        title="Click  to add a block below"
        >
          <AiOutlinePlus/>
        </button>
      </div>
      <div className='blockFnIcon'> 
        <button
          onClick={openMenu}
          title ="Click to open menu"
        >
          <CgMenuGridO/>
        </button>
        {menuOpen &&
          <Menu
            pages={pages}
            firstlist={firstlist}
            page={page}
            userName={userName}
            setMenuOpen={setMenuOpen}
            addBlock={addBlock}
            editBlock={editBlock}
            deleteBlock={deleteBlock}
            addPage={addPage}
            editPage={editPage}
            deletePage={deletePage}
            setPopup={setPopup}
          />
        }
      {popup.popup && (
            popup.what === popupMoveToPage ?
              <div id="popupMenu">
                <PageMenu
                  pages={pages}
                  firstlist={firstlist}
                  existingPage={page}
                  deleteBlock={deleteBlock}
                  addBlock={addBlock}
                  setMenuOpen={setMenuOpen}
                  //recoveryMenuState={recoveryMenuState}
                /> 
              </div>
              :
              <div id="popupMenu">
                <CommentInput
                  pageId={page.id}
                  userName={userName}
                  editBlock={editBlock}
                />
              </div>
          )
          }
      </div>

  </div>
  )
};

export default React.memo(BlockFn)