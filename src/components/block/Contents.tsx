import React, { MouseEvent, useCallback } from "react";

import BlockContentEditable, {
  BlockContendEditableProps,
} from "./BlockContentEditable";

type ContentsProps = BlockContendEditableProps & {
  isOpenComments: boolean;
};
const Contents = ({ ...props }: ContentsProps) => {
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
      <BlockContentEditable {...props} />
    </div>
  );
};

export default React.memo(Contents);
