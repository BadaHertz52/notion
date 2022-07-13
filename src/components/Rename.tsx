import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { GrDocumentText } from "react-icons/gr";
import { CSSProperties } from "styled-components";
import { Page } from "../modules/notion";
import IconPoup from "./IconPoup";
import { closePopup } from "./SideBar";
type RenameProps = {
  page:Page,
  editPage: (pageId: string, newPage: Page) => void,
  renameStyle:CSSProperties|undefined,
  setOpenRename: Dispatch<SetStateAction<boolean>>,
}
const Rename =({page, editPage,renameStyle, setOpenRename}:RenameProps)=>{
  const inner =document.getElementById("inner");
  const rename = document.getElementById("rename");
  const [iconPopupStyle, setIconPopupStyle]=useState<CSSProperties>();
  const [openIconPopup, setOpenIconPopup]=useState<boolean>(false);
  inner?.addEventListener('click', (event)=>{
    openIconPopup && closePopup("iconPopup", setOpenIconPopup, event);
    closePopup("rename", setOpenRename, event);
    
  });
  const onClickRenameIcon =()=>{
    setOpenIconPopup(true);
    const renameDomRect = rename?.getClientRects()[0];
    if(renameDomRect !==undefined){
      setIconPopupStyle({
        position:"absolute" ,
        top: renameDomRect.bottom,
        left :renameDomRect.left ,
      })
    }
  };
  const changeTitle =(event:ChangeEvent<HTMLInputElement> )=>{
    const value = event.target.value;
    const editTime =JSON.stringify(Date.now());
    if( value !== page.header.title){
        const renamedPage:Page ={
          ...page,
          header:{
            ...page.header,
            title:  value,
          },
          editTime:editTime
        };
        editPage(renamedPage.id, renamedPage );
    };
  };
  return(
    <>
    <div 
        id='rename'
        style={renameStyle}
      >
          <button 
            className="rename_icon"
            onClick={onClickRenameIcon}
          >
            {page.header.iconType===null &&
              <div>
                <GrDocumentText/>
              </div>
            }
            {page.header.iconType ==="string" ?
            <div>
              {page.header.icon}
            </div>
            :
            page.header.icon !==null&& 
            <img
              src={page.header.icon}
              alt="page icon"
            />
            }
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
            editPage={editPage}
            style={iconPopupStyle}
            setOpenIconPopup={setOpenIconPopup}
          />
      }
    </>
  )
};

export default React.memo(Rename)