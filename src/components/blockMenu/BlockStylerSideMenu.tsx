import { CSSProperties, useCallback, useEffect, useState } from "react";
import { BlockStylerProps, BlockStylerSideMenuType } from "./BlockStyler";
import LinkLoader from "../linkLoader/LinkLoader";
import ColorMenu from "../color/ColorMenu";
import Menu from "../menu/Menu";
import CommandMenu from "../command/CommandMenu";
import { isInTarget } from "../../utils";
import CommentInput from "../comment/CommentInput";

type BlockStylerSideMenuProps = BlockStylerProps & {
  sideMenu: BlockStylerSideMenuType;
  closeSideMenu: () => void;
};
const BlockStylerSideMenu = ({ ...props }: BlockStylerSideMenuProps) => {
  const { sideMenu, closeSideMenu } = props;

  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

  const handleCloseSideMenu = useCallback(
    (event: globalThis.MouseEvent) => {
      const target = ["#blockStyler__sideMenu", "#blockStyler"];
      if (!target.map((v) => isInTarget(event, v)).some((v) => v))
        closeSideMenu();
    },
    [closeSideMenu]
  );
  const changeStyle = useCallback(() => {
    if (sideMenu === "commentInput") {
      setStyle({ position: "absolute", left: 0, top: 0 });
      return;
    }
    const blockStylerEl = document.querySelector("#blockStyler");
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
    document.addEventListener("click", handleCloseSideMenu);
    return () => {
      document.removeEventListener("click", handleCloseSideMenu);
    };
  }, [handleCloseSideMenu]);

  return (
    <div id="blockStyler__sideMenu">
      <div className="inner" style={style}>
        {sideMenu === "command" && (
          <CommandMenu {...props} closeCommand={closeSideMenu} />
        )}
        {sideMenu === "link" && (
          <LinkLoader {...props} closeLink={closeSideMenu} />
        )}
        {sideMenu === "color" && <ColorMenu {...props} />}
        {sideMenu === "menu" && (
          //TODO - modal로 인한 수정
          <Menu
            {...props}
            //style={menuStyle}
          />
        )}
        {sideMenu === "commentInput" && (
          <CommentInput
            {...props}
            pageId={props.page.id}
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

export default BlockStylerSideMenu;
