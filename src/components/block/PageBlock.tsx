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
      <BlockContentEditable {...props} />
    </button>
  );
};

export default React.memo(PageBlock);
