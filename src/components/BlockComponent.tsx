import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  TouchEvent,
  useRef,
  useContext,
  useCallback,
} from "react";

import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { Block, MainCommentType, Page } from "../modules/notion";
import { Command } from "./Frame";
import ImageContent from "./ImageContent";
import { ActionContext, selectionType } from "../containers/NotionRouter";
import ScreenOnly from "./ScreenOnly";

import BlockContentEditable from "./BlockContentEditable";

type BlockComponentProps = {
  pages: Page[];
  pagesId: string[];
  block: Block;
  page: Page;
  command: Command;
  setCommand: Dispatch<SetStateAction<Command>>;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  setTargetPageId: Dispatch<SetStateAction<string>>;
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
  setLoaderTargetBlock: Dispatch<SetStateAction<Block | null>>;
  closeMenu: (event: globalThis.MouseEvent | MouseEvent) => void;
  templateHtml: HTMLElement | null;
  setSelection: Dispatch<SetStateAction<selectionType | null>>;
  setMobileMenuTargetBlock: Dispatch<SetStateAction<Block | null>>;
  onClickCommentBtn: (block: Block) => void;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
  moveBlock: React.MutableRefObject<boolean>;
};

export type itemType = {
  block: Block;
  blockIndex: number;
};

const BlockComponent = ({
  pages,
  pagesId,
  block,
  page,
  command,
  setCommand,
  setOpenComment,
  setTargetPageId,
  setOpenLoader,
  setLoaderTargetBlock,
  closeMenu,
  templateHtml,
  setSelection,
  setMobileMenuTargetBlock,
  onClickCommentBtn,
  setMoveTargetBlock,
  moveBlock,
}: BlockComponentProps) => {
  const { editBlock } = useContext(ActionContext).actions;
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
        const blockFn =
          templateHtml === null
            ? editor.querySelector(".blockFn")
            : templateHtml.querySelector(".blockFn");
        blockFn?.classList.toggle("on");
        blockFn?.classList.contains("on")
          ? sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block))
          : sessionStorage.removeItem("blockFnTargetBlock");
        if (mainBlockDomRect) {
          if (templateHtml === null) {
            const editorDomRect = editor.getClientRects()[0];
            const top = mainBlockDomRect.top + editor.scrollTop;
            const left = mainBlockDomRect.x - editorDomRect.x - 45;
            const blockFnStyle = `top:${top}px; left:${left}px`;
            blockFn?.setAttribute("style", blockFnStyle);
          } else {
            const templateDomRect = templateHtml.getClientRects()[0];
            const top = mainBlockDomRect.top - templateDomRect.top;
            const left = mainBlockDomRect.x - templateDomRect.x - 45;
            blockFn?.setAttribute("style", `top:${top}px; left:${left}px`);
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
    block.type === "page" && setTargetPageId(block.id);
  }, [block.type, block.id, setTargetPageId]);
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
   * [moveBlock - mobile] readyToMoveBlock 을 통해 위치를 변경시킬 블럭으로 해당 요소에 touch move 이벤트가 감지 되었을때,
   * moveTargetBlock을 설정하고 해당 요소의 클래스를 원래대로 복귀하는 함수
   * @param event TouchEvent
   */
  const markMoveTargetBlock = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (event.currentTarget.classList.contains("on")) {
        setMoveTargetBlock(block);
        const target = event.target as HTMLDivElement;
        target.classList.remove("on");
      }
    },
    [block, setMoveTargetBlock]
  );
  /**
   *[moveBlock - mobile]  moveBlock.current 로 Frame 내에서 움직임이 감지 되었다면, startMarkMoveBlock.current 를 true로 변환하고,  블록 위치변경을 위한 블록 선택임을 구별하기 위해 setTimeOut 을 사용해서 일정 시간이 지난후에도 startMoveBlock.current가 참일 때 event의 타켓인 요소의 클래스에 on을 추가해 moveTargetBlock을 설정할 준비를 하는 함수
   * @param event ToucheEvent
   */
  const readyToMoveBlock = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (!moveBlock.current) {
        startMarkMoveBlock.current = true;
      }
      setTimeout(() => {
        if (startMarkMoveBlock.current) {
          const target = event.target as HTMLElement;
          target.classList.add("on");
        }
      }, 2000);
    },
    [moveBlock]
  );
  return (
    <div
      className={`${block.type}-blockComponent blockComponent`}
      onClick={onClickBlockContents}
      onMouseOver={showBlockFn}
      onTouchStart={(event) => readyToMoveBlock(event)}
      onTouchEnd={() => {
        if (!moveBlock.current) startMarkMoveBlock.current = false;
      }}
      onTouchCancel={() => (startMarkMoveBlock.current = false)}
      onTouchMove={(event) => markMoveTargetBlock(event)}
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
            <ImageContent page={page} block={block} editBlock={editBlock} />
          </>
        )
      ) : (
        <div
          id={`${block.id}__contents`}
          className={`contents 
          ${
            block.comments &&
            block.comments
              .map((m: MainCommentType) => m.selectedText === null)
              .includes(true)
              ? "btn-comment"
              : ""
          }`}
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
