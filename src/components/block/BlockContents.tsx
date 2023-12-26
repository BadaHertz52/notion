import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  TouchEvent,
  useRef,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

import { Contents, PageBlockContents, ImageBlockContents } from "../index";
import { BlockContendEditableProps } from "./BlockContentEditable";

import { ActionContext, ModalContext } from "../../contexts";
import { INITIAL_MODAL, SESSION_KEY } from "../../constants";
import { Block } from "../../types";
import { getBlockContentsStyle, isMobile, makeRoutePath } from "../../utils";

export type BlockContentsProps = BlockContendEditableProps & {
  setMovingTargetBlock?: Dispatch<SetStateAction<Block | null>>;
  measure?: () => void;
};

const BlockContents = ({ ...props }: BlockContentsProps) => {
  const { block, setMovingTargetBlock } = props;

  const { editBlock } = useContext(ActionContext).actions;
  const { changeModalState, changeBlockQuickMenuModal } =
    useContext(ModalContext);

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

  //blockQuickMenu--
  const getBlockQuickMenuTargetId = () =>
    sessionStorage.getItem(SESSION_KEY.blockQuickMenuTarget);
  /**
   * 마우스가 block위를 움직일 경우, 해당 block의 element 옆에 blockQuickMenu component를 보여주는 함수
   */
  const openBlockQuickMenu = useCallback(() => {
    if (!isMobile()) {
      const blockQuickMenuTarget = getBlockQuickMenuTargetId();

      if (blockQuickMenuTarget !== block.id)
        changeBlockQuickMenuModal({
          open: true,
          target: "blockQuickMenu",
          block: block,
        });
    }
  }, [block, changeBlockQuickMenuModal]);

  //--blockQuickMenu

  const onClickContents = useCallback(() => {
    // block type이 page인 block에 대한 BlockComponent를 클릭 할 경우, 해당 page로 이동
    if (block.type === "page") {
      navigate(makeRoutePath(block.id));
    }
    // block.contents ===""일때, contentEditable이 가능하도록 포커스를 줌
    if (!block.contents) {
      const contentEditableEl = document
        .querySelector(`#${block.id}__contents`)
        ?.querySelector(".editable") as HTMLElement | null | undefined;
      contentEditableEl?.focus();
    }
  }, [block.type, block.id, block.contents, navigate]);

  //mobile menu
  const onFocusContents = useCallback(() => {
    if (window.innerWidth <= 768) {
      changeModalState({
        open: true,
        target: "mobileMenu",
        block: block,
      });
    }
  }, [block, changeModalState]);

  //moving block ---
  /**
   * [isMoved - mobile] handleTouchStart 을 통해 위치를 변경시킬 블럭으로 해당 요소에 touch move 이벤트가 감지 되었을때,  일정 시간이 경과하면 모바일 환경에서 터치를 통한 블럭 이동을 위한 환경을 준비하는 함수
   *
   */
  const markMovingTargetBlock = useCallback(
    () =>
      setTimeout(() => {
        startMarkMovingBlock.current = true;
        blockContentsRef.current?.classList.add("on");
      }, 1000),
    []
  );

  const readyForMoving = (event: TouchEvent<HTMLDivElement>) => {
    return (
      event.currentTarget === event.target &&
      !document.querySelector("#moving-target-block")
    );
  };

  const handleTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const selection = document.getSelection();
      if (
        readyForMoving(event) &&
        selection?.anchorNode?.nodeName !== "#text" &&
        selection?.focusNode?.nodeName !== "#text"
      ) {
        if (!startMarkMovingBlock.current) {
          markMovingTargetBlock();
        }
      }
    },
    [markMovingTargetBlock]
  );
  const handleTouchMove = () => {
    if (
      startMarkMovingBlock.current &&
      blockContentsRef.current?.classList.contains("on") &&
      setMovingTargetBlock
    ) {
      setMovingTargetBlock(block);
    }
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (readyForMoving(event) && !startMarkMovingBlock.current) {
      // 블럭 이동으로 인식하는 시간 보다 먼저 터치가 끝나면, moveTargetBlock으로 지정하는 setTimeOut 함수를 지움
      clearTimeout(markMovingTargetBlock());
    }
  };
  //---moving
  useEffect(() => {
    document.addEventListener("touchend", () => {
      if (blockContentsRef.current?.classList.contains("on")) {
        blockContentsRef.current.classList.remove("on");
      }
    });
  });

  return (
    <div
      id={`${props.block.id}__contents`}
      className={`${block.type}-block__contents block__contents`}
      ref={blockContentsRef}
      style={block.type !== "image" ? getBlockContentsStyle(block) : undefined}
      onClick={onClickContents}
      onFocus={onFocusContents}
      onMouseEnter={openBlockQuickMenu}
    >
      <div
        className="moving-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
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
    </div>
  );
};

export default React.memo(BlockContents);
