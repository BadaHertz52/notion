import React, {
  MouseEvent,
  TouchEvent,
  CSSProperties,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

import { BlockBtn, BlockComment, BlockContents } from "../index";

import { Page, Block } from "../../types";
import { getBlockContentsStyle } from "../../utils";

export type MainBlockProps = {
  pages: Page[];
  pagesId: string[];
  page: Page;
  subBlocks?: Block[];
  block: Block;
  fontSize: number;
  setMovingTargetBlock?: Dispatch<SetStateAction<Block | null>>;
  onClickCommentBtn?: (block: Block) => void;
  measure?: () => void;
  isExport?: boolean;
};

const MainBlock = ({ ...props }: MainBlockProps) => {
  const { block } = props;

  const isOpenComments = useMemo(
    () =>
      block.comments
        ? block.comments.some((comment) => comment.type === "open")
        : false,
    [block.comments]
  );

  const isMovingBlock = () => !!document.querySelector("#moving-target-block");

  /**
   * [isMoved] 현재 block을 movingTargetBlock (위치를 변경시킬 block)의 변경된 위치의 기준이 되는 pointBlock으로  지정하는 함수
   * @param event
   * @param targetBlock
   */
  const markPointBlock = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    if (isMovingBlock()) {
      event.currentTarget.classList.add("on");
    }
  };

  /**
   * [isMoved] 현재 block을  movingTargetBlock (위치를 변경시킬 block)의 위치변경의 기준이 되는 pointBlock 지정을 취소시키는 함수
   * @param event
   */
  const cancelPointBlock = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    if (isMovingBlock()) {
      event.currentTarget.classList.remove("on");
    }
  };

  const getListStyle = (block: Block): CSSProperties => {
    const blockContentStyle = getBlockContentsStyle(block);
    return {
      ...blockContentStyle,
      textDecoration: "none",
      fontStyle: "normal",
      fontWeight: "normal",
    };
  };

  return (
    <div
      className="mainBlock"
      onMouseEnter={markPointBlock}
      onMouseLeave={cancelPointBlock}
    >
      <div
        className="mainBlock__block"
        style={block.type.includes("List") ? getListStyle(block) : undefined}
      >
        <BlockBtn {...props} />
        <BlockContents {...props} />
      </div>
      {isOpenComments && props.onClickCommentBtn && (
        <BlockComment
          block={block}
          onClickCommentBtn={props.onClickCommentBtn}
        />
      )}
    </div>
  );
};

export default React.memo(MainBlock);
