import { NodeHtmlMarkdown } from "node-html-markdown";
import React, { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Block, findPage, Page } from "../modules/notion";
import Frame from "./Frame";
import ReactDOMServer from 'react-dom/server';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const root =document.getElementById("root");
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
    printWindow?.close();
  };
  function convertPdf(frame:HTMLElement, title:string){
    const frameCopy = frame.cloneNode(true);
    const printFrame =document.createElement("div");
    printFrame.id ="printFrame";
    const frameHeight =frame.scrollHeight;
    printFrame.setAttribute("style","position:absolute; left:-99999999px");
    printFrame.append(frameCopy);
    root?.append(printFrame);
    html2canvas(printFrame, {
      width:window.innerWidth,
      height:frameHeight,
      useCORS:true,
    }).then(function(canvas){
      const imgData = canvas.toDataURL('image/png');
      const a = document.createElement("a");
      a.href = imgData;
      exportHtml?.append(a);
      const imgWidth= 210;
      const pageHeight = imgWidth * 1.414;
      const imgHeight = (canvas.height * imgWidth) / canvas.width ; 
      let heightLeft =imgHeight;
      const doc =new jsPDF("p","mm", "a4");
      let position =0;

      doc.addImage(imgData, "PNG", 0 , position, imgWidth , imgHeight, "","FAST");
      heightLeft -=pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight ;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight , "","FAST");
        heightLeft -= pageHeight;
    };
      doc.save(`${title}.pdf`);
      printFrame.remove();
      frame.classList.contains("subFrame") && frame.remove();
    })
  };
  const onClickExportBtn=()=>{
    const includeSubpagesSlider =document.getElementById("includeSubPagesSlider");
    const createSubPageFolderSlider =document.getElementById("createSubPageFolderSlider");
    if( includeSubpagesSlider !==null &&
        createSubPageFolderSlider !==null 
      ){
        const frame =document.getElementsByClassName("frame")[0] as HTMLElement;
        const styleTag= [...document.querySelectorAll("style")];
        const styleCode= styleTag[1].outerHTML;
        const includeSubPage :boolean=  includeSubpagesSlider.classList.contains("on");
        const createSubPageFolder :boolean =createSubPageFolderSlider.classList.contains("on");
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
        }
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
                firstBlocksId={subPage.firstBlocksId}
                addBlock={addBlock}
                editBlock={editBlock}
                changeBlockToPage={changeBlockToPage}
                changePageToBlock={changePageToBlock}
                changeToSub={changeToSub}
                raiseBlock={raiseBlock}
                deleteBlock={deleteBlock}
                addPage={addPage}
                editPage={editPage}
                setTargetPageId={setTargetPageId}
                setOpenComment={setOpenComment}
                setCommentBlock ={setCommentBlock}
                smallText={smallText}
                fullWidth={fullWidth}
                discardEdit={discardEdit}
              />;
              return { jsx:frameComponent, title:subPage.header.title};
          });
          return subPageFrames;
        };
        type GetSubPageFrameHtmlReturn ={
          html:string,
          title:string
        }
        function getSubPageFrameHtml(subPagesId:string[]):GetSubPageFrameHtmlReturn[]{
            const subPageFrames = getSubPageFrame(subPagesId).map(({jsx,title}:GetSubPageFrameReturn)=>(
              {frameHtml:ReactDOMServer.renderToString(jsx),
              title:title
              }));
            const subPageHtmls = subPageFrames.map(({frameHtml, title}:{frameHtml:string, title:string}) => ({ html:convertHtml(title, frameHtml), title: title}
            ));
            return subPageHtmls;
        };

        function convertSubPageToPdf(subPageId:string[]){
          const makeFrameElement=(jsx:JSX.Element, title:string)=>{
            const subFrame = document.createElement("div");
            subFrame.className="editor subFrame";
            const subFrmaeHtml = ReactDOMServer.renderToString(jsx);
            subFrame.innerHTML =subFrmaeHtml;
            root?.appendChild(subFrame);
            convertPdf(subFrame,title );
          };
          getSubPageFrame(subPageId).forEach(({jsx,title}:GetSubPageFrameReturn)=> makeFrameElement(jsx, title))
        };
        switch (format) {
          case html:
            exportDocument(page.header.title,currentPageFrameHtml, "text/html",format);
            if(includeSubPage && page.subPagesId!==null){
              getSubPageFrameHtml(page.subPagesId).forEach(({html, title}:GetSubPageFrameHtmlReturn)=>exportDocument(title,html, "text/html", format));
            };
            break;
          case pdf:
            convertPdf(frame,page.header.title);
            //printPdf(currentPageFrameHtml);
            if(includeSubPage && page.subPagesId!==null){
              //getSubPageFrameHtml(page.subPagesId).forEach((html)=>printPdf(html));
              convertSubPageToPdf(page.subPagesId);
            };
            break;
          case markdown:
            const markdownText = NodeHtmlMarkdown.translate(currentPageFrameHtml);
            exportDocument(page.header.title,markdownText,"text/markdown", format);
            if(includeSubPage && page.subPagesId!==null){
              getSubPageFrameHtml(page.subPagesId).forEach(({html, title}:GetSubPageFrameHtmlReturn)=>{
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