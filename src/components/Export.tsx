import { NodeHtmlMarkdown } from "node-html-markdown";
import React, { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Block, findPage, Page } from "../modules/notion";
import Frame from "./Frame";
import ReactDOMServer from 'react-dom/server';
type ExportProps={
  page:Page,
  pagesId:string[],
  pages:Page[],
  setOpenExport:Dispatch<SetStateAction<boolean>>,
  //for frame
  userName:string,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,
  changePageToBlock:(currentPageId: string, block: Block) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  addPage :(newPage:Page ,)=>void,
  editPage :(pageId:string,newPage:Page ,)=>void,
  setTargetPageId: React.Dispatch<React.SetStateAction<string>>,
  setOpenComment: Dispatch<SetStateAction<boolean>>,
  setCommentBlock: Dispatch<SetStateAction<Block | null>>,
  smallText: boolean, 
  fullWidth: boolean, 
  discardEdit:boolean,
}
const Export =({page,pagesId,pages,setOpenExport, userName,editBlock,addBlock,changeBlockToPage,changePageToBlock,changeToSub,raiseBlock,deleteBlock,addPage,editPage,setTargetPageId,setOpenComment,setCommentBlock,smallText,fullWidth,discardEdit}:ExportProps)=>{
  const html ="HTML";
  const pdf="PDF";
  const markdown="Markdown";
  const everything="Everything";
  const noFileImage = 'No files or images';
  type Format = typeof html| typeof pdf | typeof markdown;
  type Content = typeof everything| typeof noFileImage;
  const [format, setFormat]=useState<Format>(html);
  const [content, setContent]=useState<Content>(everything);
  const [subPageFrameString, setSubPageFrameString] =useState<string|null>(null);
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
  function exportDocument (text:string, type:string, format:Format){
    const blob = new Blob([text], {type:type});
    const url = URL.createObjectURL(blob);
    const exportHtml =document.getElementById("export");
    const  exportA = document.createElement("a");
    exportA.href =url;
    exportA.download =`${page.header.title}.${format}`;
    exportHtml?.appendChild(exportA);
    exportA.click();
    exportA.remove();
    window.URL.revokeObjectURL(url);
  }
  function convertPdf(htmlDocument:string){
    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow?.document.write(htmlDocument);
    printWindow?.document.close();
    printWindow?.print();
  };

  const onClickExportBtn=()=>{
    const includeSubpagesSlider =document.getElementById("includeSubPagesSlider");
    const createSubPageFolderSlider =document.getElementById("createSubPageFolderSlider");
    if( includeSubpagesSlider !==null &&
        createSubPageFolderSlider !==null 
      ){
        const includeSubPage :boolean=  includeSubpagesSlider.classList.contains("on");
        const createSubPageFolder :boolean =createSubPageFolderSlider.classList.contains("on");

        const frame =document.getElementsByClassName("frame")[0];
        const frameHtml = frame.outerHTML;
        const styleTag= [...document.querySelectorAll("style")];
        const styleCode= styleTag[1].outerHTML;
        
        const htmlDocument =
        `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${page.header.title}</title>
          ${styleCode}
          <style>
            body{
              display:flex;
              align-items:centet;
            }
            ${content === "No files or images" &&
            'img, .pageCover, .pageIcon, .media, .pageImgIcon{display:none}'
          }
          </style>
        </head>
        <body>
          ${frameHtml}
        </body>
        </html>`;

        switch (format) {
          case html:
            exportDocument(htmlDocument, "text/html",format);
            break;
          case pdf:
            convertPdf(htmlDocument);
            break;
          case markdown:
            const markdownText = NodeHtmlMarkdown.translate(htmlDocument);
            exportDocument(markdownText,"text/markdown", format);
            break;
          default:
            break;
        }
      }
  };
  useEffect(()=>{
    const aTags=document.querySelectorAll("a");
    if(aTags[0]!==undefined){
      aTags.forEach((a:Element)=> a.remove());
    }
  },[])
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