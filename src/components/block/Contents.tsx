import React from "react";

import BlockContentEditable, {
  BlockContendEditableProps,
} from "./BlockContentEditable";

type ContentsProps = BlockContendEditableProps & {
  isOpenComments: boolean;
};
const Contents = ({ ...props }: ContentsProps) => {
  const { block, onClickCommentBtn } = props;
  const handleClick = () => {
    if (onClickCommentBtn) onClickCommentBtn(block);
  };
  return (
    <>
      {props.isOpenComments ? (
        <button className="btn-comment" onClick={handleClick}>
          <BlockContentEditable {...props} />
        </button>
      ) : (
        <BlockContentEditable {...props} />
      )}
    </>
  );
};

export default React.memo(Contents);
