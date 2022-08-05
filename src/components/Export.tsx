import React, { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { Page } from "../modules/notion";
type ExportProps={
  page:Page,
  setOpenExport:Dispatch<SetStateAction<boolean>>,
}
const Export =({page,setOpenExport}:ExportProps)=>{
  const html ="HTMLO";
  const pdf="PDF";
  const markdown="Markdwon";
  const everything="Everything";
  const noFileImage = 'No files or images';
  type Format = typeof html| typeof pdf | typeof markdown;
  type Content = typeof everything| typeof noFileImage;

  const onClickSwitchBtn=(event:MouseEvent)=>{
    const currentTarget= event.currentTarget;
    const span =currentTarget.querySelector("span");
    if(span !==null){
      span.classList.toggle("on");
    };
  };
  const onClickExportBtn=()=>{
    const formatSelect =document.getElementById("formatSelect") as HTMLSelectElement | null;
    const contentSelect =document.getElementById("contentSelect")  as HTMLSelectElement | null;
    const includeSubpagesSlider =document.getElementById("includeSubPagesSlider");
    const createSubPageFolderSlider =document.getElementById("createSubPageFolderSlider");
    if(formatSelect !==null &&
        contentSelect !==null &&
        includeSubpagesSlider !==null &&
        createSubPageFolderSlider !==null 
      ){
        const format:Format =formatSelect.value as Format;
        const content:Content =contentSelect.value as Content;
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
            <select id="formatSelect">
              <option value={html}>
                {html}
              </option>
              <option value={pdf}>
                {pdf}
              </option>
              <option value={markdown}>
                {markdown}
              </option>
            </select>
          </div>
          <div className="select">
            <div className="select_label">
              Include content
            </div>
            <select id="contentSelect">
              <option value={everything}>
                {everything}
              </option>
              <option value={noFileImage}>
                {noFileImage}
              </option>
            </select>
          </div>
          <div className="select">
            <div className="select_label">
              Include subpages
            </div>
            <button 
              onClick={onClickSwitchBtn}
            >
              <label className='switchBtn'>
                <span 
                  id="includeSubPagesSlider"
                  className="slider"
                  >
                  </span>
              </label>
            </button>
          </div>
          <div className="select">
            <div className="select_label">
              Create folders for subPages
            </div>
            <button 
              onClick={onClickSwitchBtn}
            >
              <label className='switchBtn'>
                <span 
                  id="createSubPageFolderSlider"
                  className="slider"
                  >
                  </span>
              </label>
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