import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  TouchEvent,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";

import { ImageContent, ScreenOnly, BlockContentEditable } from "../index";

import { ActionContext } from "../../contexts";
import {
  Block,
  MainCommentType,
  Page,
  Command,
  SelectionType,
} from "../../types";
import { makeRoutePath } from "../../utils";

export type BlockComponentProps = {
  pages: Page[];
  pagesId: string[];
  block: Block;
  page: Page;
  command: Command;
  setCommand: Dispatch<SetStateAction<Command>>;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
  setLoaderTargetBlock: Dispatch<SetStateAction<Block | null>>;
  closeMenu: (event: globalThis.MouseEvent | MouseEvent) => void;
  templateHtml: HTMLElement | null;
  setSelection: Dispatch<SetStateAction<SelectionType | null>>;
  setMobileMenuTargetBlock: Dispatch<SetStateAction<Block | null>>;
  onClickCommentBtn: (block: Block) => void;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
  measure?: () => void;
};

const BlockComponent = ({
  pages,
  pagesId,
  block,
  page,
  command,
  setCommand,
  setOpenComment,
  setOpenLoader,
  setLoaderTargetBlock,
  closeMenu,
  templateHtml,
  setSelection,
  setMobileMenuTargetBlock,
  onClickCommentBtn,
  setMoveTargetBlock,
  measure,
}: BlockComponentProps) => {
  const { editBlock } = useContext(ActionContext).actions;
  const navigate = useNavigate();
  const showBlockComment = useMemo(() => {
    return block.comments
      ? block.comments.some((i) => i.type === "open") &&
          block.comments.some((m: MainCommentType) => !m.selectedText)
      : false;
  }, [block.comments]);

  /**
   * 모바일 브라우저에서, element을 터치 할때 사용자가 element을 이동하기 위해 touch 한 것인지 판별하기 위한 조건 중 하나
   */
  const startMarkMoveBlock = useRef<boolean>(false);
  /**
   * 마우스가 block위를 움직일 경우, 해당 block의 element 옆에 blockFn component를 보여주는 함수
   * @param event mouseEvent
   */
  const showBlockFn = useCallback(
    (event: MouseEvent) => {
      closeMenu(event);
      const currentTarget = event.currentTarget;
      const mainBlock =
        currentTarget.parentElement?.parentElement?.parentElement;
      if (mainBlock && mainBlock) {
        const mainBlockDomRect = mainBlock?.getClientRects()[0];
        const editor = document.getElementsByClassName("editor")[0];
        const blockFn = !templateHtml
          ? editor.querySelector(".blockFn")
          : templateHtml.querySelector(".blockFn");
        blockFn?.classList.toggle("on");
        blockFn?.classList.contains("on")
          ? sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block))
          : sessionStorage.removeItem("blockFnTargetBlock");
        if (mainBlockDomRect) {
          if (!templateHtml) {
            const frameHtml = document.querySelector(".frame");
            const frameDomRect = frameHtml?.getClientRects()[0];
            if (frameDomRect) {
              const top =
                mainBlockDomRect.top - frameDomRect.top + frameHtml.scrollTop;
              const left = mainBlockDomRect.x - frameDomRect.x - 45;
              const blockFnStyle = `top:${top}px; left:${left}px`;
              blockFn?.setAttribute("style", blockFnStyle);
            }
          } else {
            const targetFrameEl = templateHtml.querySelector(".frame");
            if (targetFrameEl) {
              const targetFrameDomRect = targetFrameEl.getBoundingClientRect();
              const top =
                mainBlockDomRect.top -
                targetFrameDomRect.top +
                targetFrameEl?.scrollTop;
              const left = mainBlockDomRect.x - targetFrameDomRect.x - 45;
              blockFn?.setAttribute("style", `top:${top}px; left:${left}px`);
            }
          }
        }
      }
    },
    [block, closeMenu, templateHtml]
  );

  /**
   * block type이 page인 block에 대한 BlockComponent를 클릭 할 경우, 해당 page로 이동하는 함수
   */
  const onClickBlockContents = useCallback(() => {
    block.type === "page" && navigate(makeRoutePath(block.id));
  }, [block.type, block.id, navigate]);
  /**
   * image type의 block에 넣은 이미지 파일을 선택하기 위한 버튼을 클릭한 경우 작동하는 함수로, Loader component를 엶
   */
  const onClickAddFileBtn = useCallback(() => {
    setOpenLoader(true);
    setLoaderTargetBlock(block);
  }, [setOpenLoader, setLoaderTargetBlock, block]);

  const onClickContent = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.currentTarget.classList.contains("btn-comment")) {
        onClickCommentBtn(block);
      }
    },
    [block, onClickCommentBtn]
  );
  /**
   * [isMoved - mobile] handleTouchStart 을 통해 위치를 변경시킬 블럭으로 해당 요소에 touch move 이벤트가 감지 되었을때,  일정 시간이 경과하면 모바일 환경에서 터치를 통한 블럭 이동을 위한 환경을 준비하는 함수
   *
   */
  const markMoveTargetBlock = useCallback(
    (target: HTMLDivElement | null) =>
      setTimeout(() => {
        startMarkMoveBlock.current = true;
        target?.classList.add("on");
        setMoveTargetBlock(block);
      }, 1000),
    [block, setMoveTargetBlock]
  );
  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (event.currentTarget !== event.target) return;
      const selection = document.getSelection();
      if (
        selection?.anchorNode?.nodeName !== "#text" &&
        selection?.focusNode?.nodeName !== "#text"
      ) {
        if (!startMarkMoveBlock.current) {
          markMoveTargetBlock(event.currentTarget);
        }
      }
    },
    [markMoveTargetBlock]
  );
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) return;
    if (startMarkMoveBlock.current) {
      clearTimeout(markMoveTargetBlock(event.currentTarget));
      startMarkMoveBlock.current = false;
      event.currentTarget?.classList.remove("on");
      setMoveTargetBlock(null);
    }
  };
  return (
    <div
      className={`${block.type}-blockComponent blockComponent`}
      onClick={onClickBlockContents}
      onMouseOver={showBlockFn}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {block.type === "page" ? (
        <button
          className="contents page__title"
          title="open contents of which type page"
          id={`${block.id}__contents`}
        >
          <ScreenOnly text="open contents of which type page" />
          <BlockContentEditable
            pagesId={pagesId}
            pages={pages}
            page={page}
            block={block}
            templateHtml={templateHtml}
            command={command}
            setCommand={setCommand}
            setOpenComment={setOpenComment}
            setSelection={setSelection}
            setMobileMenuTargetBlock={setMobileMenuTargetBlock}
            onClickCommentBtn={onClickCommentBtn}
          />
        </button>
      ) : block.type === "image" ? (
        block.contents === "" ? (
          <button
            className="btn-addBlockFile"
            title="btn to add image"
            onClick={onClickAddFileBtn}
          >
            <ScreenOnly text="btn to add image" />
            <span className="icon-addBlockFile">
              <MdOutlinePhotoSizeSelectActual />
            </span>
            <span>
              Add a {block.type.slice(0, block.type.indexOf("media"))}
            </span>
          </button>
        ) : (
          <>
            <ImageContent
              page={page}
              block={block}
              editBlock={editBlock}
              measure={measure}
            />
          </>
        )
      ) : (
        <div
          id={`${block.id}__contents`}
          className={`contents 
          ${showBlockComment ? "btn-comment" : ""}`}
          onClick={onClickContent}
        >
          <BlockContentEditable
            pagesId={pagesId}
            pages={pages}
            page={page}
            block={block}
            templateHtml={templateHtml}
            command={command}
            setCommand={setCommand}
            setOpenComment={setOpenComment}
            setSelection={setSelection}
            setMobileMenuTargetBlock={setMobileMenuTargetBlock}
            onClickCommentBtn={onClickCommentBtn}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(BlockComponent);
