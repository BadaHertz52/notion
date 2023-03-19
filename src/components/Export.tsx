import { NodeHtmlMarkdown } from "node-html-markdown";
import React, { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import {  findPage,Page } from "../modules/notion";
import Frame, { FrameProps } from "./Frame";
import ReactDOMServer from 'react-dom/server';

type ExportProps= FrameProps &{
  setOpenExport:Dispatch<SetStateAction<boolean>>
}
const Export =({page,pagesId,pages,firstlist, recentPagesId ,setOpenExport, userName,commentBlock,openComment ,setTargetPageId, setRoutePage, 
  setOpenComment,setCommentBlock , modal,setModal, showAllComments,smallText,fullWidth,discardEdit,setDiscardEdit, openTemplates , setOpenTemplates, fontStyle ,mobileSideMenuOpen, setMobileSideMenuOpen, setMobileSideMenu}:ExportProps)=>{
  const html ="HTML";
  const pdf="PDF";
  const markdown="Markdown";
  const everything="Everything";
  const noFileImage = 'No files or images';
  type Format = typeof html| typeof pdf | typeof markdown;
  type Content = typeof everything| typeof noFileImage;
  const [format, setFormat]=useState<Format>(html);
  const [content, setContent]=useState<Content>(everything);
  const exportHtml =document.getElementById("export");
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
  function exportDocument (targetPageTitle:string,targetHtml:string, type:string, format:Format){
    const blob = new Blob([targetHtml], {type:type});
    const url = URL.createObjectURL(blob);
    const  a = document.createElement("a");
    const extension =format.toLowerCase();
    a.href =url;
    a.download =`${targetPageTitle}.${extension}`;
    exportHtml?.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
  function printPdf(targetHtml:string){
    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow?.document.write(targetHtml);
    printWindow?.document.close();
    printWindow?.print();
    if(printWindow!==null){
      printWindow.onload =function(){
        printWindow.close();
      }
    }
  };
  const onClickExportBtn=()=>{
    const includeSubpagesSlider =document.getElementById("includeSubPagesSlider");
    if( includeSubpagesSlider !==null){
        const frame =document.getElementsByClassName("frame")[0] as HTMLElement;
        const styleTag= [...document.querySelectorAll("style")];
        const styleCode= styleTag[1].outerHTML;
        const includeSubPage :boolean=  includeSubpagesSlider.classList.contains("on");
        const convertHtml =(title:string, frameHtml:string)=>{
          const html =`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
            ${styleCode}
            <style>
              body{
                display:flex;
                flex-direction:column;
                align-items:center;
              }
              ${content === noFileImage &&
              'img, .pageCover, .pageIcon, .media, .pageImgIcon{display:none}'
            }
            </style>
          </head>
          <body>
            ${frameHtml}
          </body>
          </html>`;
          return html;
        };
        const currentPageFrameHtml = convertHtml(page.header.title, frame.outerHTML);
        type GetSubPageFrameReturn ={
          jsx:JSX.Element,
          title:string,
        }
        function getSubPageFrame(subPagesId:string[]):GetSubPageFrameReturn[]{
          const subPages = subPagesId.map((id:string)=> findPage(pagesId,pages,id));
          const subPageFrames= subPages.map((subPage:Page)=>{
            const frameComponent = 
              <Frame
                page={subPage}
                userName={userName}
                pages={pages}
                pagesId={pagesId}
                firstlist={firstlist}
                recentPagesId={recentPagesId}
                commentBlock={commentBlock}
                openComment={openComment}
                modal={modal}
                setModal={setModal}
                setRoutePage={setRoutePage}
                setTargetPageId={setTargetPageId}
                setOpenComment={setOpenComment}
                setCommentBlock ={setCommentBlock}
                showAllComments={showAllComments}
                smallText={smallText}
                fullWidth={fullWidth}
                discardEdit={discardEdit}
                setDiscardEdit={setDiscardEdit}
                openTemplates={openTemplates}
                setOpenTemplates={setOpenTemplates}
                fontStyle={fontStyle}
                setMobileSideMenu={setMobileSideMenu}
                setMobileSideMenuOpen={setMobileSideMenuOpen}
                mobileSideMenuOpen={mobileSideMenuOpen}
              />;
              return { jsx:frameComponent, title:subPage.header.title};
          });
          return subPageFrames;
        };
        type ConvertSubPageFrameIntoHtmlReturn ={
          html:string,
          title:string
        }
        function convertSubPageFrameIntoHtml(subPagesId:string[]):ConvertSubPageFrameIntoHtmlReturn[]{
            const subPageFrames = getSubPageFrame(subPagesId).map(({jsx,title}:GetSubPageFrameReturn)=>(
              {frameHtml:ReactDOMServer.renderToString(jsx),
              title:title
              }));
            const subPageHtmls = subPageFrames.map(({frameHtml, title}:{frameHtml:string, title:string}) => ({ html:convertHtml(title, frameHtml), title: title}
            ));
            return subPageHtmls;
        };

        switch (format) {
          case html:
            exportDocument(page.header.title,currentPageFrameHtml, "text/html",format);
            if(includeSubPage && page.subPagesId!==null){
              convertSubPageFrameIntoHtml(page.subPagesId).forEach(({html, title}:ConvertSubPageFrameIntoHtmlReturn)=>exportDocument(title,html, "text/html", format));
            };
            break;
          case pdf:
            printPdf(currentPageFrameHtml);
            if(includeSubPage && page.subPagesId!==null){
              convertSubPageFrameIntoHtml(page.subPagesId).forEach(({html,title}:ConvertSubPageFrameIntoHtmlReturn)=>printPdf(html));
            };
            break;
          case markdown:
            const markdownText = NodeHtmlMarkdown.translate(currentPageFrameHtml);
            exportDocument(page.header.title,markdownText,"text/markdown", format);
            if(includeSubPage && page.subPagesId!==null){
              convertSubPageFrameIntoHtml(page.subPagesId).forEach(({html, title}:ConvertSubPageFrameIntoHtmlReturn)=>{
                const subPageMarkdownText = NodeHtmlMarkdown.translate(html);
                exportDocument(title,subPageMarkdownText, "text/markdown", format)});
            };
            break;
          default:
            break;
        };

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