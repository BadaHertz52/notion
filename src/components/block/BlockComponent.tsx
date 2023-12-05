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

import { BlockContents, PageBlock } from "../index";

import { ActionContext } from "../../contexts";
import { Block, MainCommentType } from "../../types";
import { makeRoutePath } from "../../utils";
import { SESSION_KEY } from "../../constants";
import { BlockContendEditableProps } from "./BlockContentEditable";
import ImageBlock from "./ImageBlock";

export type BlockComponentProps = BlockContendEditableProps & {
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
  setLoaderTargetBlock: Dispatch<SetStateAction<Block | null>>;
  closeMenu: (event: globalThis.MouseEvent | MouseEvent) => void;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
  measure?: () => void;
};

const BlockComponent = ({ ...props }: BlockComponentProps) => {
  const { editBlock } = useContext(ActionContext).actions;

  const { block, closeMenu, templateHtml, setMoveTargetBlock } = props;

  const navigate = useNavigate();
  const isOpenComments = useMemo(() => {
    return block.comments
      ? block.comments.some((i) => i.type === "open") &&
          block.comments.some((m: MainCommentType) => !m.selectedText)
      : false;
  }, [block.comments]);
  /**
   * 모바일 브라우저에서, element을 터치 할때 사용자가 element을 이동하기 위해 touch 한 것인지 판별하기 위한 조건 중 하나
   */
  const startMarkMoveBlock = useRef<boolean>(false);
  //show blockFn ---
  /**
   *   blockFn에 대한 sessionStorage 관리
   */
  const manageSessionAboutBlockFn = useCallback(
    (blockFnEl: Element) => {
      blockFnEl.classList.contains("on")
        ? sessionStorage.setItem(
            SESSION_KEY.blockFnTarget,
            JSON.stringify(block)
          )
        : sessionStorage.removeItem(SESSION_KEY.blockFnTarget);
    },
    [block]
  );

  const toggleBlockFn = useCallback(
    (blockFnEl: Element) => {
      blockFnEl.classList.toggle("on");
      manageSessionAboutBlockFn(blockFnEl);
    },
    [manageSessionAboutBlockFn]
  );

  const setStyleOfBlockFn = useCallback(
    (mainBlockEl: HTMLElement, blockFn: Element) => {
      const mainBlockDomRect = mainBlockEl.getClientRects()[0];

      if (!templateHtml) {
        const frameHtml = document.querySelector(".frame");
        const frameDomRect = frameHtml?.getClientRects()[0];

        if (frameDomRect) {
          const top =
            mainBlockDomRect.top - frameDomRect.top + frameHtml.scrollTop;
          const left = mainBlockDomRect.x - frameDomRect.x - 45;
          const blockFnStyle = `top:${top}px; left:${left}px`;

          blockFn.setAttribute("style", blockFnStyle);
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

          blockFn.setAttribute("style", `top:${top}px; left:${left}px`);
        }
      }
    },
    [templateHtml]
  );
  /**
   * 마우스가 block위를 움직일 경우, 해당 block의 element 옆에 blockFn component를 보여주는 함수
   */
  const showBlockFn = useCallback(
    (event: MouseEvent) => {
      closeMenu(event);

      const currentTarget = event.currentTarget;
      const editor = document.getElementsByClassName("editor")[0];
      const mainBlockEl =
        currentTarget.parentElement?.parentElement?.parentElement;
      const blockFnEl = !templateHtml
        ? editor.querySelector(".blockFn")
        : templateHtml.querySelector(".blockFn");

      if (mainBlockEl && blockFnEl) {
        toggleBlockFn(blockFnEl);
        setStyleOfBlockFn(mainBlockEl, blockFnEl);
      }
    },
    [closeMenu, templateHtml, setStyleOfBlockFn, toggleBlockFn]
  );
  //--show blockFn
  const onClickBlockContents = useCallback(() => {
    // block type이 page인 block에 대한 BlockComponent를 클릭 할 경우, 해당 page로 이동
    if (block.type === "page") {
      navigate(makeRoutePath(block.id));
    }
    // block.contents ===""일때, contentEditable이 가능하도록 포커스를 줌
    if (!block.contents) {
      const contentEditableEl = document
        .querySelector(`#${block.id}__contents`)
        ?.querySelector(".contentEditable") as HTMLElement | null | undefined;

      contentEditableEl?.focus();
    }
  }, [block.type, block.id, block.contents, navigate]);

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
        <PageBlock
          pagesId={props.pagesId}
          pages={props.pages}
          page={props.page}
          block={block}
          templateHtml={templateHtml}
          command={props.command}
          setCommand={props.setCommand}
          setOpenComment={props.setOpenComment}
          setSelection={props.setSelection}
          setMobileMenuTargetBlock={props.setMobileMenuTargetBlock}
          onClickCommentBtn={props.onClickCommentBtn}
        />
      ) : block.type === "image" ? (
        <ImageBlock
          page={props.page}
          block={block}
          editBlock={editBlock}
          measure={props.measure}
          setOpenLoader={props.setOpenLoader}
          setLoaderTargetBlock={props.setLoaderTargetBlock}
        />
      ) : (
        <BlockContents
          isOpenComments={isOpenComments}
          pagesId={props.pagesId}
          pages={props.pages}
          page={props.page}
          block={block}
          templateHtml={templateHtml}
          command={props.command}
          setCommand={props.setCommand}
          setOpenComment={props.setOpenComment}
          setSelection={props.setSelection}
          setMobileMenuTargetBlock={props.setMobileMenuTargetBlock}
          onClickCommentBtn={props.onClickCommentBtn}
        />
      )}
    </div>
  );
};

export default React.memo(BlockComponent);
