import React from "react";
import EditableBlock, {
  changeFontSizeBySmallText,
  EditableBlockProps,
} from "./EditableBlock";

const MoveTargetBlock = ({
  pages,
  pagesId,
  page,
  block,
  fontSize,
  isMoved,
  setMoveTargetBlock,
  pointBlockToMoveBlock,
  command,
  setCommand,
  openComment,
  setOpenComment,
  setCommentBlock,
  setOpenLoader,
  setLoaderTargetBlock,
  closeMenu,
  templateHtml,
  setSelection,
  setMobileMenuTargetBlock,
  mobileMenuTargetBlock,
  measure,
}: EditableBlockProps) => {
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
                  <div id={block.id} className="blockComponent">
                    <div
                      className={`${block.type}-blockComponent blockComponent`}
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
        <EditableBlock
          key={block.id}
          pages={pages}
          pagesId={pagesId}
          page={page}
          block={block}
          fontSize={fontSize}
          isMoved={isMoved}
          setMoveTargetBlock={setMoveTargetBlock}
          pointBlockToMoveBlock={pointBlockToMoveBlock}
          command={command}
          setCommand={setCommand}
          openComment={openComment}
          setOpenComment={setOpenComment}
          setCommentBlock={setCommentBlock}
          setOpenLoader={setOpenLoader}
          setLoaderTargetBlock={setLoaderTargetBlock}
          closeMenu={closeMenu}
          templateHtml={templateHtml}
          setSelection={setSelection}
          setMobileMenuTargetBlock={setMobileMenuTargetBlock}
          mobileMenuTargetBlock={mobileMenuTargetBlock}
          measure={measure}
        />
      )}
    </div>
  );
};

export default React.memo(MoveTargetBlock);
