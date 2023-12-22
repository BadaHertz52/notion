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

import { Contents, PageBlockContents } from "../index";

import { ActionContext } from "../../contexts";
import { Block } from "../../types";
import { getBlockContentsStyle, makeRoutePath } from "../../utils";
import { SESSION_KEY } from "../../constants";
import { BlockContendEditableProps } from "./BlockContentEditable";
import ImageBlockContents from "./ImageBlockContents";

export type BlockContentsProps = BlockContendEditableProps & {
  setMovingTargetBlock?: Dispatch<SetStateAction<Block | null>>;
  measure?: () => void;
};

const BlockContents = ({ ...props }: BlockContentsProps) => {
  const { editBlock } = useContext(ActionContext).actions;

  const { block, setMovingTargetBlock } = props;

  const navigate = useNavigate();

  const isOpenComments = useMemo(
    () =>
      block.comments
        ? block.comments.some(
            (comment) => comment.type === "open" && !comment.selectedText
          )
        : false,
    [block.comments]
  );
  /**
   * 모바일 브라우저에서, element을 터치 할때 사용자가 element을 이동하기 위해 touch 한 것인지 판별하기 위한 조건 중 하나
   */
  const startMarkMovingBlock = useRef<boolean>(false);
  const blockContentsRef = useRef<HTMLDivElement>(null);
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
    (mainBlockEl: HTMLElement, blockFnEl: Element) => {
      if (blockContentsRef.current) {
        const mainBlockDomRect = mainBlockEl.getClientRects()[0];
        const { top, left } = mainBlockDomRect;
        const heightOfBlock = blockContentsRef.current.clientHeight;
        const heightOfBlockFn = blockFnEl.clientHeight;
        const blockFnTop =
          heightOfBlock > heightOfBlockFn
            ? (heightOfBlock - heightOfBlockFn) / 2 + top
            : top;
        const blockFnStyle = `top:${blockFnTop}px; left:${
          left - blockFnEl.clientWidth
        }px`;

        blockFnEl.setAttribute("style", blockFnStyle);
      }
    },
    []
  );

  /**
   * 마우스가 block위를 움직일 경우, 해당 block의 element 옆에 blockFn component를 보여주는 함수
   */
  const showBlockFn = useCallback(
    (event: MouseEvent) => {
      const currentTarget = event.currentTarget;

      const mainBlockEl =
        currentTarget.parentElement?.parentElement?.parentElement;
      const blockFnEl = document.querySelector("#blockFn");

      if (mainBlockEl && blockFnEl) {
        toggleBlockFn(blockFnEl);
        setStyleOfBlockFn(mainBlockEl, blockFnEl);
      }
    },
    [setStyleOfBlockFn, toggleBlockFn]
  );

  const openLink = useCallback((event: MouseEvent) => {
    const target = event.target as Element;
    if (target.tagName.toLowerCase() === "a") {
      const { href } = target as HTMLLinkElement;
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.location.href = href;
      }
    }
  }, []);

  //--show blockFn
  const onClickContents = useCallback(
    (event: MouseEvent) => {
      // block type이 page인 block에 대한 BlockComponent를 클릭 할 경우, 해당 page로 이동
      if (block.type === "page") {
        navigate(makeRoutePath(block.id));
      }
      if (block.contents.includes('class="link"')) {
        openLink(event);
      }
      // block.contents ===""일때, contentEditable이 가능하도록 포커스를 줌
      if (!block.contents) {
        const contentEditableEl = document
          .querySelector(`#${block.id}__contents`)
          ?.querySelector(".editable") as HTMLElement | null | undefined;
        contentEditableEl?.focus();
      }
    },
    [block.type, block.id, block.contents, navigate, openLink]
  );

  /**
   * [isMoved - mobile] handleTouchStart 을 통해 위치를 변경시킬 블럭으로 해당 요소에 touch move 이벤트가 감지 되었을때,  일정 시간이 경과하면 모바일 환경에서 터치를 통한 블럭 이동을 위한 환경을 준비하는 함수
   *
   */
  const markMovingTargetBlock = useCallback(
    (target: HTMLDivElement | null) =>
      setTimeout(() => {
        startMarkMovingBlock.current = true;
        target?.classList.add("on");
        if (setMovingTargetBlock) setMovingTargetBlock(block);
      }, 1000),
    [block, setMovingTargetBlock]
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (event.currentTarget !== event.target) return;
      const selection = document.getSelection();
      if (
        selection?.anchorNode?.nodeName !== "#text" &&
        selection?.focusNode?.nodeName !== "#text"
      ) {
        if (!startMarkMovingBlock.current) {
          markMovingTargetBlock(event.currentTarget);
        }
      }
    },
    [markMovingTargetBlock]
  );

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) return;
    if (startMarkMovingBlock.current) {
      clearTimeout(markMovingTargetBlock(event.currentTarget));
      startMarkMovingBlock.current = false;
      event.currentTarget?.classList.remove("on");
      if (setMovingTargetBlock) setMovingTargetBlock(null);
    }
  };

  return (
    <div
      id={`${props.block.id}__contents`}
      className={`${block.type}-block__contents block__contents`}
      ref={blockContentsRef}
      style={getBlockContentsStyle(block)}
      onClick={onClickContents}
      onMouseOver={showBlockFn}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {block.type === "page" ? (
        <PageBlockContents {...props} />
      ) : block.type === "image" ? (
        <ImageBlockContents {...props} editBlock={editBlock} />
      ) : (
        <Contents {...props} isOpenComments={isOpenComments} />
      )}
    </div>
  );
};

export default React.memo(BlockContents);
