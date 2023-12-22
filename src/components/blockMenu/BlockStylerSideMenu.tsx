import { memo, CSSProperties, useCallback, useEffect, useState } from "react";

import { ColorMenu, LinkLoader, CommandMenu, CommentInput } from "../index";
import { BlockStylerProps, BlockStylerSideMenuType } from "./BlockStyler";

type BlockStylerSideMenuProps = BlockStylerProps & {
  sideMenu: BlockStylerSideMenuType;
  closeSideMenu: () => void;
};
const BlockStylerSideMenu = ({ ...props }: BlockStylerSideMenuProps) => {
  const { sideMenu, closeSideMenu } = props;

  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

  const changeStyle = useCallback(() => {
    if (sideMenu === "commentInput") {
      setStyle({ position: "absolute", left: 0, top: 0 });
      return;
    }
    const blockStylerEl = document.querySelector("#styler-block");
    const domRect = blockStylerEl?.getClientRects()[0];
    const topBarBottom = document.querySelector(".topBar")?.clientHeight;
    if (domRect && topBarBottom) {
      const GAP = 20;
      const { bottom, top } = domRect;
      const gapFromBottom = window.innerHeight - topBarBottom - bottom - GAP;
      const gapFromTopBar = top - topBarBottom - GAP;
      const isDropDown = gapFromBottom >= gapFromTopBar;

      isDropDown
        ? setStyle({
            position: "absolute",
            left: 0,
            top: 45,
            maxHeight: gapFromBottom,
          })
        : setStyle({
            position: "absolute",
            left: 0,
            bottom: GAP,
            maxHeight: gapFromTopBar,
          });
    }
  }, [sideMenu]);

  useEffect(() => {
    changeStyle();
  }, [changeStyle]);

  return (
    <div id="styler-block__side-menu">
      <div className="inner" style={style}>
        {sideMenu === "command" && (
          <CommandMenu
            {...props}
            closeCommand={closeSideMenu}
            closeModal={undefined}
          />
        )}
        {sideMenu === "link" && (
          <LinkLoader {...props} closeLink={closeSideMenu} />
        )}
        {sideMenu === "color" && <ColorMenu {...props} />}
        {sideMenu === "commentInput" && (
          <CommentInput
            {...props}
            pageId={props.page.id}
            commentBlock={props.block}
            addOrEdit="add"
            mainComment={null}
            subComment={null}
            allComments={props.block.comments}
          />
        )}
      </div>
    </div>
  );
};

export default memo(BlockStylerSideMenu);
