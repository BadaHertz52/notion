import React from "react";
import EditableBlock, { EditableBlockProps } from "./EditableBlock";
import { changeFontSizeBySmallText } from "../../utils";

const MoveTargetBlock = ({ ...props }: EditableBlockProps) => {
  const { block, fontSize } = props;
  return (
    <div id="moveTargetBlock">
      {block.type.includes("List") && !block.firstBlock ? (
        <div className="editableBlock">
          <div className="inner">
            <div
              id={`moveTargetBlock-${block.id}`}
              className={`${block.type} block`}
              style={changeFontSizeBySmallText(block, fontSize)}
            >
              <div className="mainBlock">
                <div className="mainBlock__block">
                  <div id={block.id} className="blockContents">
                    <div
                      className={`${block.type}-blockContents blockContents`}
                    >
                      <div className="contentEditable">
                        {block.contents !== ""
                          ? block.contents
                          : "type '/' for commands"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EditableBlock {...props} key={block.id} />
      )}
    </div>
  );
};

export default React.memo(MoveTargetBlock);
