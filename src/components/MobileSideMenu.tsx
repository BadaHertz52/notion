import React , {Dispatch, SetStateAction , useEffect, useState} from 'react';
import { CSSProperties } from 'styled-components';
import { mobileSideMenuType } from '../containers/NotionRouter';
import ColorMenu from './ColorMenu';
import CommandBlock from './CommandBlock';

import Menu, { MenuAndBlockStylerCommonProps } from './Menu';
type MobileSideMenuProps = MenuAndBlockStylerCommonProps & {
  mobileSideMenu:mobileSideMenuType
  setMobileSideMenu:Dispatch<SetStateAction<mobileSideMenuType>>,
  mobileSideMenuOpen:boolean,
  setMobileSideMenuOpen:Dispatch<SetStateAction<boolean>>
}
const MobileSideMenu =({pages,firstlist, block, userName, page,  addBlock,changeBlockToPage,changePageToBlock ,editBlock, deleteBlock ,duplicatePage,movePageToPage,editPage ,setPopup ,popup  ,setCommentBlock , setTargetPageId ,frameHtml, mobileSideMenu  ,setMobileSideMenu,mobileSideMenuOpen, setMobileSideMenuOpen}:MobileSideMenuProps)=>{

  const [mobileSideMenuStyle, setMobileSideMenuStyle]=useState<CSSProperties>({transform:'translateY(110vh'});
  const getTitle = ()=>{
    switch (mobileSideMenu.what) {
      case "ms_color":
        return "Color";
      case "ms_moreMenu":
        return "Menu";
      case "ms_turnInto":
        return "Turn into";
      default:
        return "Menu"
    }
  }
  const closeSideMenu =()=>{
    setMobileSideMenu({
      block:null,
      what:undefined
    });
    setMobileSideMenuOpen(false);
  };
  useEffect(()=>{
    if(!mobileSideMenuOpen){
      setMobileSideMenu({
        block:null,
        what:undefined
      });
      setMobileSideMenuStyle({
        transform:'translateY(110%)'
      })
    }else{
      setMobileSideMenuStyle({transform:'translateY(0)'})
    };
  },[mobileSideMenuOpen]);
  return(
      <div id="mobileSideMenu" style={mobileSideMenuStyle}>
        <div className="inner">
          <div className="top">
            <div>{getTitle()}</div>
            <button
              onClick={closeSideMenu}
            >
              close
            </button>
          </div>
          <div className="content">
            
            { mobileSideMenu.what === 'ms_moreMenu' &&
              <Menu
              pages={pages}
              block={block}
              firstlist={firstlist}
              page={page}
              userName={userName}
              setOpenMenu={setMobileSideMenuOpen}
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
            }
            {mobileSideMenu.what === 'ms_color' &&
                <ColorMenu
                page={page}
                block={block}
                editBlock={editBlock}
                selection={null}
                setSelection={null}
                setOpenMenu={setMobileSideMenuOpen}
              />
            }
            {mobileSideMenu.what === 'ms_turnInto' &&
                <CommandBlock
                  style={undefined}
                  page={page}
                  block={block}
                  editBlock={editBlock}
                  changeBlockToPage={changeBlockToPage}
                  changePageToBlock={changePageToBlock}
                  editPage={editPage}
                  command={null}
                  setCommand={null}
                  setTurnInto={setMobileSideMenuOpen}
                  setSelection={null}
                />
            }
          </div>
        </div>

      </div>
  )
};

export default React.memo(MobileSideMenu);