import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { CSSProperties } from "styled-components";
import { Block, Page } from "../modules/notion";
import { setTemplateItem } from "./BlockComponent";
import IconPoup from "./IconPopup";
import PageIcon from "./PageIcon";
import { closePopup } from "./SideBar";
type RenameProps = {
  currentPageId:string|null,
  block:Block|null,
  page:Page,
  editBlock:(pageId: string, block: Block) => void,
  editPage: (pageId: string, newPage: Page) => void,
  renameStyle:CSSProperties|undefined,
  setOpenRename: Dispatch<SetStateAction<boolean>>,
}
const Rename =({currentPageId,block ,page,editBlock ,editPage,renameStyle, setOpenRename}:RenameProps)=>{
  const inner =document.getElementById("inner");
  const [openIconPopup, setOpenIconPopup]=useState<boolean>(false);
  inner?.addEventListener('click', (event)=>{
    const target =event.target as null|Element ;
    if(target===null || target?.id !=="imageIconInput"){
      openIconPopup && closePopup("iconPopup", setOpenIconPopup, event);
      closePopup("rename", setOpenRename, event);
    }

  });
  const onClickRenameIcon =()=>{
    setOpenIconPopup(true);
  };
  const changeTitle =(event:ChangeEvent<HTMLInputElement> )=>{
    const value = event.target.value;
    const editTime =JSON.stringify(Date.now());
    if( value !== page.header.title){
      const templateHtml =document.getElementById("template");
      setTemplateItem(templateHtml,page);
        const renamedPage:Page ={
          ...page,
          header:{
            ...page.header,
            title:  value,
          },
          editTime:editTime
        };
        editPage(renamedPage.id, renamedPage );
        if(block!==null && currentPageId !==null){
          const editedBlock:Block={
            ...block,
            contents:value,
            editTime:editTime
          };
          editBlock(currentPageId, editedBlock);
        }
    };
  };
  return(
    < div 
      id='rename'
      style={renameStyle}>
    <div 
      className="inner"
      >
          <button 
            className="rename_icon"
            onClick={onClickRenameIcon}
          >
            <PageIcon
              icon={page.header.icon}
              iconType={page.header.iconType}
              style={undefined}
            />
          </button>
          <input
            className="rename_title"
            onChange={changeTitle}
            type="text"
            value ={page.header.title}
          />
      </div>
      {openIconPopup && 
          <IconPoup
            page={page}
            currentPageId={currentPageId}
            block= {block}
            editBlock={editBlock}
            editPage={editPage}
            style={undefined}
            setOpenIconPopup={setOpenIconPopup}
          />
      }
    </div>
  )
};

export default React.memo(Rename)