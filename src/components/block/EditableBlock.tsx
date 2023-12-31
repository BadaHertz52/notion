import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  TouchEvent,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";

import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { MdPlayArrow } from "react-icons/md";

import {
  BlockContents,
  PageIcon,
  BlockComment,
  ScreenOnly,
  ListSub,
  MainBlock,
} from "../index";

import { ActionContext } from "../../contexts";
import { Block, Page } from "../../types";
import {
  changeFontSizeBySmallText,
  findBlock,
  getEditTime,
  setOriginTemplateItem,
} from "../../utils";
import { SESSION_KEY } from "../../constants";

export type EditableBlockProps = {
  pages: Page[];
  pagesId: string[];
  page: Page;
  block: Block;
  fontSize: number;
  setMovingTargetBlock?: Dispatch<SetStateAction<Block | null>>;
  onClickCommentBtn?: (block: Block) => void;
  measure?: () => void;
  isExport?: boolean;
};

const EditableBlock = ({ ...props }: EditableBlockProps) => {
  const { block, page } = props;
  const { editBlock } = useContext(ActionContext).actions;
  const className =
    block.type !== "toggle"
      ? `${block.type} block `
      : `${block.type} block ${block.subBlocksId ? "on" : ""}`;
  const subBlocks = block.subBlocksId?.map(
    (id: string) => findBlock(page, id).BLOCK
  );

  useEffect(() => {
    const newBlockItem = sessionStorage.getItem(SESSION_KEY.newBlock);
    if (newBlockItem) {
      const newContentsDoc = document.getElementById(
        `${newBlockItem}__contents`
      );
      if (newContentsDoc) {
        const newBlockContentEditableDoc =
          newContentsDoc.firstElementChild as HTMLElement;
        newBlockContentEditableDoc.focus();
      }
      sessionStorage.removeItem(SESSION_KEY.newBlock);
    }
  }, [block]);

  return (
    <div className="editableBlock">
      <div className="inner">
        <div
          id={`block-${block.id}`}
          className={className}
          style={changeFontSizeBySmallText(block, props.fontSize)}
        >
          {block.type.includes("ListArr") ? (
            <ListSub {...props} subBlocks={subBlocks} />
          ) : (
            <>
              <MainBlock {...props} />
              {subBlocks && subBlocks[0] && (
                <div className="subBlock-group">
                  {subBlocks.map((subBlock: Block) => (
                    <EditableBlock
                      {...props}
                      key={subBlocks.indexOf(subBlock)}
                      block={subBlock}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableBlock;
