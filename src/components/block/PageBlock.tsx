import React from "react";

import { ScreenOnly, BlockContentEditable } from "../index";
import { BlockContendEditableProps } from "./BlockContentEditable";

const PageBlock = ({ ...props }: BlockContendEditableProps) => {
  return (
    <button
      className="contents page__title"
      title="open contents of which type page"
      id={`${props.block.id}__contents`}
    >
      <ScreenOnly text="open contents of which type page" />
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
        onClickCommentBtn={props.onClickCommentBtn}
      />
    </button>
  );
};

export default React.memo(PageBlock);
