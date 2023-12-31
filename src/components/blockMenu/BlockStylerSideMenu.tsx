import { memo, CSSProperties, useCallback, useEffect, useState } from "react";

import { ColorMenu, LinkLoader, CommandMenu, CommentInput } from "../index";
import { BlockStylerProps } from "./BlockStyler";
import { ModalType } from "../../types";
import { isMobile } from "../../utils";

type BlockStylerSideMenuProps = BlockStylerProps & {
  sideMenuModal: ModalType;
  closeSideMenu: () => void;
};
const BlockStylerSideMenu = ({ ...props }: BlockStylerSideMenuProps) => {
  const { sideMenuModal, closeSideMenu } = props;

  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

  const changeStyle = useCallback(() => {
    if (sideMenuModal.target === "commentInput") {
      setStyle({ position: "absolute", left: 0, top: 0 });
      return;
    }
    const blockStylerModalEl = document.querySelector(
      "#modal-block-styler__menu"
    ) as HTMLElement | null;
    const style = blockStylerModalEl?.style;
    const topBarBottom = document.querySelector("#top-bar")?.clientHeight;

    if (style && topBarBottom) {
      const GAP = 20;
      const { bottom, top } = style;
      const y = bottom
        ? -Number(bottom.replace("px", ""))
        : Number(top.replace("px", ""));

      const gapFromBottom = window.innerHeight - y - GAP;
      const gapFromTopBar = y - topBarBottom - GAP;
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
  }, [sideMenuModal.target]);

  useEffect(() => {
    changeStyle();
  }, [changeStyle]);

  return (
    <div id="block-styler__side-menu">
      <div className="inner" style={isMobile() ? undefined : style}>
        {sideMenuModal.target === "command" && (
          <CommandMenu {...props} closeCommand={closeSideMenu} />
        )}
        {sideMenuModal.target === "linkLoader" && (
          <LinkLoader {...props} closeLink={closeSideMenu} />
        )}
        {sideMenuModal.target === "color" && <ColorMenu {...props} />}
      </div>
    </div>
  );
};

export default memo(BlockStylerSideMenu);
