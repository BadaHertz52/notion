import React, { MouseEvent, useCallback } from "react";

import BlockContentEditable, {
  BlockContendEditableProps,
} from "./BlockContentEditable";

type BlockContentsProps = BlockContendEditableProps & {
  isOpenComments: boolean;
};
const BlockContents = ({ ...props }: BlockContentsProps) => {
  const { block, onClickCommentBtn } = props;

  const onClickContent = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.currentTarget.classList.contains("btn-comment")) {
        onClickCommentBtn(block);
      }
    },
    [block, onClickCommentBtn]
  );

  return (
    <div
      id={`${block.id}__contents`}
      className={`contents 
    ${props.isOpenComments ? "btn-comment" : ""}`}
      onClick={onClickContent}
    >
      <BlockContentEditable
        pagesId={props.pagesId}
        pages={props.pages}
        page={props.page}
        block={props.block}
        templateHtml={props.templateHtml}
        command={props.command}
        setCommand={props.setCommand}
        setOpenComment={props.setOpenComment}
        setSelection={props.setSelection}
        setMobileMenuTargetBlock={props.setMobileMenuTargetBlock}
        onClickCommentBtn={onClickCommentBtn}
      />
    </div>
  );
};

export default React.memo(BlockContents);
