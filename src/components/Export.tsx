import React, { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Page } from "../modules/notion";
type ExportProps={
  page:Page,
  setOpenExport:Dispatch<SetStateAction<boolean>>,
}
const Export =({page,setOpenExport}:ExportProps)=>{
  const html ="HTML";
  const pdf="PDF";
  const markdown="Markdown";
  const everything="Everything";
  const noFileImage = 'No files or images';
  type Format = typeof html| typeof pdf | typeof markdown;
  type Content = typeof everything| typeof noFileImage;
  const [format, setFormat]=useState<Format>(html);
  const [content, setContent]=useState<Content>(everything);
  const openOptions=(event:MouseEvent)=>{
    const currentTarget =event.currentTarget;
    const targetOptions =currentTarget.nextElementSibling;
    const options =document.querySelectorAll(".options");
    options.forEach((element:Element)=>{
      if(element !==targetOptions){
        element.classList.contains("on")&& element.classList.remove("on")
      }
    }) ;
    currentTarget.nextElementSibling?.classList.toggle("on");
  };
  const changeFormat=(event:MouseEvent,FORMAT:Format)=>{
    event.currentTarget.parentElement?.classList.toggle("on");
    setFormat(FORMAT);
  };
  const changeContent=(event:MouseEvent, CONTENT:Content)=>{
    event.currentTarget.parentElement?.classList.toggle("on");
    setContent(CONTENT);  
  }
  const onClickSwitchBtn=(event:MouseEvent)=>{
    const currentTarget= event.currentTarget;
    const span =currentTarget.querySelector("span");
    if(span !==null){
      span.classList.toggle("on");
    };
  };
  const onClickExportBtn=()=>{
    const includeSubpagesSlider =document.getElementById("includeSubPagesSlider");
    const createSubPageFolderSlider =document.getElementById("createSubPageFolderSlider");
    if( includeSubpagesSlider !==null &&
        createSubPageFolderSlider !==null 
      ){
        const includeSubPage :boolean=  includeSubpagesSlider.classList.contains("on");
        const createSubPageFolder :boolean =createSubPageFolderSlider.classList.contains("on");
        console.log("onclick export", format,content, includeSubPage, createSubPageFolder);
      }
  };
  return(
    <div 
      id="export"
      >
      <div className="inner">
        <div className="selects">
          <div className="select">
            <div className="select_label">
                Export format
            </div>
            <div className="select_form">
              <button onClick={(event)=>openOptions(event)}>
                {format}
                <MdKeyboardArrowDown/>
              </button>
              <div className="options">
                <button onClick={(event)=>changeFormat(event,html)}>
                  {html}
                </button>
                <button onClick={(event)=>changeFormat(event,pdf)}>
                  {pdf}
                </button>
                <button onClick={(event)=>changeFormat(event,markdown)}>
                  {markdown}
                </button>
              </div>
            </div>
          </div>
          <div className="select">
            <div className="select_label">
              Include content
            </div>
            <div className="select_form">
              <button onClick={(event)=>openOptions(event)}>
                {content}
                <MdKeyboardArrowDown/>
              </button>
              <div className="options">
                <button onClick={(event)=>changeContent(event,everything)}>
                  {everything}
                </button>
                <button onClick={(event)=>changeContent(event,noFileImage)}>
                  {noFileImage}
                </button>
              </div>
            </div>
          </div>
          <div className="select switch">
            <div className="select_label">
              Include subpages
            </div>
            <button 
              onClick={onClickSwitchBtn}
              className='switchBtn'
            >
                <span 
                  id="includeSubPagesSlider"
                  className="slider"
                  >
                  </span>
            </button>
          </div>
          <div className="select switch">
            <div className="select_label">
              Create folders for subPages
            </div>
            <button 
              className='switchBtn'
              onClick={onClickSwitchBtn}
            >
                <span 
                  id="createSubPageFolderSlider"
                  className="slider"
                  >
                  </span>
            </button>
          </div>
        </div>
        <div className="btns">
          <button
            onClick={()=>setOpenExport(false)}
          >
            Cancel
          </button>
          <button
            onClick={onClickExportBtn}
          >
            Export
          </button>

        </div>
      </div>
    </div>
  )
};

export default React.memo(Export)