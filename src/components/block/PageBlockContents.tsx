import React from "react";

import { ScreenOnly, BlockContentEditable } from "../index";
import { BlockContendEditableProps } from "./BlockContentEditable";

const PageBlockContents = ({ ...props }: BlockContendEditableProps) => {
  return (
    <button className="page__title" title="open contents of which type page">
      <ScreenOnly text="open contents of which type page" />
      <BlockContentEditable {...props} />
    </button>
  );
};

export default React.memo(PageBlockContents);
