import React, { CSSProperties } from "react";
import EditableBlock, { EditableBlockProps } from "./EditableBlock";
import { changeFontSizeBySmallText } from "../../utils";

type MovingTargetBlockProps = EditableBlockProps & {
  style: CSSProperties | undefined;
};
const MovingTargetBlock = ({ ...props }: MovingTargetBlockProps) => {
  const { block, fontSize } = props;
  return (
    <div id="moving-target-block" style={props.style}>
      {block.type.includes("List") && !block.firstBlock ? (
        <div className="editableBlock">
          <div className="inner">
            <div
              id={`moving-target-block-${block.id}`}
              className={`${block.type} block`}
              style={changeFontSizeBySmallText(block, fontSize)}
            >
              <div className="mainBlock">
                <div className="mainBlock__block">
                  <div id={block.id} className="block__contents">
                    <div
                      className={`${block.type}-block__contents block__contents`}
                    >
                      <div className="editable">
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

export default React.memo(MovingTargetBlock);
