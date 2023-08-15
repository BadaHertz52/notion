import { NodeHtmlMarkdown } from "node-html-markdown";
import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Page } from "../modules/notion/type";
import { findPage } from "../fn";
import Frame, { FrameProps } from "./Frame";
import ReactDOMServer from "react-dom/server";
import ScreenOnly from "./ScreenOnly";

type ExportProps = FrameProps & {
  setOpenExport: Dispatch<SetStateAction<boolean>>;
};
const Export = ({
  page,
  pagesId,
  pages,
  firstList,
  recentPagesId,
  setOpenExport,
  userName,
  commentBlock,
  openComment,
  setOpenComment,
  setCommentBlock,
  modal,
  setModal,
  showAllComments,
  smallText,
  fullWidth,
  discardEdit,
  setDiscardEdit,
  openTemplates,
  setOpenTemplates,
  fontStyle,
  mobileSideMenu,
  setMobileSideMenu,
}: ExportProps) => {
  const html = "HTML";
  const pdf = "PDF";
  const markdown = "Markdown";
  const everything = "Everything";
  const noFileImage = "No files or images";
  type Format = typeof html | typeof pdf | typeof markdown;
  type Content = typeof everything | typeof noFileImage;
  const [format, setFormat] = useState<Format>(html);
  const [content, setContent] = useState<Content>(everything);
  const exportHtml = document.getElementById("export");
  const openOptions = useCallback((event: MouseEvent) => {
    const currentTarget = event.currentTarget;
    const targetOptions = currentTarget.nextElementSibling;
    const selectBtnGroup = document.querySelectorAll(".select__btn-group");
    selectBtnGroup.forEach((element: Element) => {
      if (element !== targetOptions) {
        element.classList.contains("on") && element.classList.remove("on");
      }
    });
    currentTarget.nextElementSibling?.classList.toggle("on");
  }, []);
  const changeFormat = useCallback((event: MouseEvent, FORMAT: Format) => {
    event.currentTarget.parentElement?.classList.toggle("on");
    setFormat(FORMAT);
  }, []);

  const changeContent = useCallback((event: MouseEvent, CONTENT: Content) => {
    event.currentTarget.parentElement?.classList.toggle("on");
    setContent(CONTENT);
  }, []);

  const onClickSwitchBtn = useCallback((event: MouseEvent) => {
    const currentTarget = event.currentTarget;
    const span = currentTarget.querySelector("span");
    if (span) {
      span.classList.toggle("on");
    }
  }, []);

  const exportDocument = useCallback(
    (
      targetPageTitle: string,
      targetHtml: string,
      type: string,
      format: Format
    ) => {
      const blob = new Blob([targetHtml], { type: type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const extension = format.toLowerCase();
      a.href = url;
      a.download = `${targetPageTitle}.${extension}`;
      exportHtml?.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    [exportHtml]
  );

  function printPdf(targetHtml: string) {
    const printWindow = window.open("", "", "height=400,width=800");
    printWindow?.document.write(targetHtml);
    printWindow?.document.close();
    printWindow?.print();
    if (printWindow) {
      printWindow.onload = function () {
        printWindow.close();
      };
    }
  }

  const onClickExportBtn = useCallback(() => {
    const includeSubPagesSliderEl = document.getElementById(
      "includeSubPagesSlider"
    );
    if (includeSubPagesSliderEl) {
      const frame = document.getElementsByClassName("frame")[0] as HTMLElement;
      const styleCode = [...document.querySelectorAll("style")]
        .map((e) => e.outerHTML)
        .join(" ");
      const includeSubPage: boolean =
        includeSubPagesSliderEl.classList.contains("on");
      const convertHtml = (title: string, frameHtml: string) => {
        const html = `
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
              ${
                content === noFileImage &&
                "img, .page__header__cover, .page__icon-outBox, .media, .page__icon__img{display:none}"
              }
            </style>
          </head>
          <body>
            ${frameHtml}
          </body>
          </html>`;
        return html;
      };
      const currentPageFrameHtml = convertHtml(
        page.header.title,
        frame.outerHTML
      );
      type GetSubPageFrameReturn = {
        jsx: JSX.Element;
        title: string;
      };
      function getSubPageFrame(subPagesId: string[]): GetSubPageFrameReturn[] {
        const subPages = subPagesId.map((id: string) =>
          findPage(pagesId, pages, id)
        );
        const subPageFrames = subPages.map((subPage: Page) => {
          const frameComponent = (
            <Frame
              page={subPage}
              userName={userName}
              pages={pages}
              pagesId={pagesId}
              firstList={firstList}
              recentPagesId={recentPagesId}
              commentBlock={commentBlock}
              openComment={openComment}
              modal={modal}
              setModal={setModal}
              setOpenComment={setOpenComment}
              setCommentBlock={setCommentBlock}
              showAllComments={showAllComments}
              smallText={smallText}
              fullWidth={fullWidth}
              discardEdit={discardEdit}
              setDiscardEdit={setDiscardEdit}
              openTemplates={openTemplates}
              setOpenTemplates={setOpenTemplates}
              fontStyle={fontStyle}
              mobileSideMenu={mobileSideMenu}
              setMobileSideMenu={setMobileSideMenu}
            />
          );
          return { jsx: frameComponent, title: subPage.header.title };
        });
        return subPageFrames;
      }
      type ConvertSubPageFrameIntoHtmlReturn = {
        html: string;
        title: string;
      };
      function convertSubPageFrameIntoHtml(
        subPagesId: string[]
      ): ConvertSubPageFrameIntoHtmlReturn[] {
        const subPageFrames = getSubPageFrame(subPagesId).map(
          ({ jsx, title }: GetSubPageFrameReturn) => ({
            frameHtml: ReactDOMServer.renderToString(jsx),
            title: title,
          })
        );
        const subPageHtml = subPageFrames.map(
          ({ frameHtml, title }: { frameHtml: string; title: string }) => ({
            html: convertHtml(title, frameHtml),
            title: title,
          })
        );
        return subPageHtml;
      }

      switch (format) {
        case html:
          exportDocument(
            page.header.title,
            currentPageFrameHtml,
            "text/html",
            format
          );
          if (includeSubPage && page.subPagesId) {
            convertSubPageFrameIntoHtml(page.subPagesId).forEach(
              ({ html, title }: ConvertSubPageFrameIntoHtmlReturn) =>
                exportDocument(title, html, "text/html", format)
            );
          }
          break;
        case pdf:
          printPdf(currentPageFrameHtml);
          if (includeSubPage && page.subPagesId) {
            convertSubPageFrameIntoHtml(page.subPagesId).forEach(
              ({ html, title }: ConvertSubPageFrameIntoHtmlReturn) =>
                printPdf(html)
            );
          }
          break;
        case markdown:
          const markdownText = NodeHtmlMarkdown.translate(currentPageFrameHtml);
          exportDocument(
            page.header.title,
            markdownText,
            "text/markdown",
            format
          );
          if (includeSubPage && page.subPagesId) {
            convertSubPageFrameIntoHtml(page.subPagesId).forEach(
              ({ html, title }: ConvertSubPageFrameIntoHtmlReturn) => {
                const subPageMarkdownText = NodeHtmlMarkdown.translate(html);
                exportDocument(
                  title,
                  subPageMarkdownText,
                  "text/markdown",
                  format
                );
              }
            );
          }
          break;
        default:
          break;
      }
    }
  }, [
    commentBlock,
    content,
    discardEdit,
    exportDocument,
    firstList,
    fontStyle,
    format,
    fullWidth,
    mobileSideMenu,
    modal,
    openComment,
    openTemplates,
    page.header.title,
    page.subPagesId,
    pages,
    pagesId,
    recentPagesId,
    setCommentBlock,
    setDiscardEdit,
    setMobileSideMenu,
    setModal,
    setOpenComment,
    setOpenTemplates,
    showAllComments,
    smallText,
    userName,
  ]);
  useEffect(() => {
    const aTags = document.querySelectorAll("a");
    if (aTags[0]) {
      aTags.forEach((a: Element) => a.remove());
    }
  }, []);
  return (
    <div id="export">
      <div className="inner">
        <div className="select-group">
          <div className="select">
            <div className="select__label">Export format</div>
            <div className="select__form">
              <button onClick={openOptions}>
                {format}
                <MdKeyboardArrowDown />
              </button>
              <div className="select__btn-group">
                <button onClick={(event) => changeFormat(event, html)}>
                  {html}
                </button>
                <button onClick={(event) => changeFormat(event, pdf)}>
                  {pdf}
                </button>
                <button onClick={(event) => changeFormat(event, markdown)}>
                  {markdown}
                </button>
              </div>
            </div>
          </div>
          <div className="select">
            <div className="select__label">Include content</div>
            <div className="select__form">
              <button onClick={openOptions}>
                {content}
                <MdKeyboardArrowDown />
              </button>
              <div className="select__btn-group">
                <button onClick={(event) => changeContent(event, everything)}>
                  {everything}
                </button>
                <button onClick={(event) => changeContent(event, noFileImage)}>
                  {noFileImage}
                </button>
              </div>
            </div>
          </div>
          <div className="select switch">
            <div className="select__label">Include sub pages</div>
            <button
              title="switch button to select whether or not to include subpages"
              onClick={onClickSwitchBtn}
              className="btn-switch"
            >
              <ScreenOnly text="switch button to select whether or not to include subpages" />
              <span id="includeSubPagesSlider" className="slider"></span>
            </button>
          </div>
        </div>
        <div className="btn-group">
          <button title="cancel button" onClick={() => setOpenExport(false)}>
            Cancel
          </button>
          <button title="export button" onClick={onClickExportBtn}>
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Export);
