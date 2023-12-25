import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useCallback,
  useState,
  CSSProperties,
  useEffect,
} from "react";

import { AiOutlinePlus } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";

import { ScreenOnly } from "../index";

import { ActionContext, ModalContext } from "../../contexts";
import { Block, Page, ModalType } from "../../types";
import { isInTarget, makeNewBlock, setOriginTemplateItem } from "../../utils";
import { INITIAL_MODAL, SESSION_KEY } from "../../constants";

type BlockQuickMenuProp = {
  page: Page;
  block: Block;
  setMovingTargetBlock: Dispatch<SetStateAction<Block | null>>;
  movingTargetBlock: Block | null;
  modal: ModalType;
};

const BlockQuickMenu = ({
  page,
  block,
  setMovingTargetBlock,
  movingTargetBlock,
  modal,
}: BlockQuickMenuProp) => {
  const { addBlock } = useContext(ActionContext).actions;
  const { changeModalState, changeBlockQuickMenuModal } =
    useContext(ModalContext);

  const QUICK_MENU_WIDTH = 32;

  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

  const changeStyle = useCallback(() => {
    const domRect = document
      .querySelector(`#block-${block.id}`)
      ?.querySelector(".mainBlock")
      ?.getClientRects()[0];

    if (domRect) {
      const { top, left, height } = domRect;
      const blockQuickMenuTop = top;

      setStyle({
        height: height,
        display: "flex",
        alignItems: "center",
        top: blockQuickMenuTop,
        left: left - QUICK_MENU_WIDTH - 10,
      });
    }
  }, [block]);

  const makeBlock = useCallback(() => {
    setOriginTemplateItem(page);
    const sessionItem = sessionStorage.getItem(
      SESSION_KEY.blockQuickMenuTarget
    );
    if (sessionItem && page.blocksId) {
      const targetBlock = JSON.parse(sessionItem);
      const targetBlockIndex = page.blocksId.indexOf(targetBlock.id);
      const newBlock = makeNewBlock(page, targetBlock);
      addBlock(page.id, newBlock, targetBlockIndex + 1, targetBlock.id);
    } else {
      console.error("BlockQuickMenu-makeBlock error: there is no session item");
    }
  }, [addBlock, page]);

  const onMouseDownMenu = useCallback(() => {
    !movingTargetBlock && setMovingTargetBlock(block);
  }, [setMovingTargetBlock, movingTargetBlock, block]);

  const onClickMenu = useCallback(() => {
    movingTargetBlock && setMovingTargetBlock(null);
    if (!modal.open) {
      changeModalState({
        open: true,
        target: "menu",
        block: block,
      });
    } else {
      console.error("BlockQuickMenu-openMenu error: there is no session item");
    }
  }, [
    movingTargetBlock,
    modal.open,
    setMovingTargetBlock,
    changeModalState,
    block,
  ]);

  const closeBlockQuickMenu = useCallback(
    (event: globalThis.MouseEvent) => {
      const TARGET = [
        ".block__contents",
        "#block-quick-menu",
        "#menu",
        ".block",
      ];

      if (!TARGET.map((v) => isInTarget(event, v)).some((v) => v)) {
        changeBlockQuickMenuModal(INITIAL_MODAL);
      }
    },
    [changeBlockQuickMenuModal]
  );

  useEffect(() => {
    document.addEventListener("mousemove", closeBlockQuickMenu);
    if (!style) changeStyle();
    sessionStorage.setItem(SESSION_KEY.blockQuickMenuTarget, block.id);

    return () => {
      document.removeEventListener("mousemove", closeBlockQuickMenu);
      sessionStorage.removeItem(SESSION_KEY.blockQuickMenuTarget);
    };
  }, [block.id, style, changeStyle, closeBlockQuickMenu]);

  return (
    <div id="block-quick-menu" className="block-quick-menu" style={style}>
      <div className="block-quick-menu__btn-container">
        <button onClick={makeBlock} title="Click  to add a block below">
          <ScreenOnly text="button  to add a block below" />
          <AiOutlinePlus />
        </button>
      </div>
      <div className="block-quick-menu__btn-container">
        <button
          onClick={onClickMenu}
          onMouseDown={onMouseDownMenu}
          title="Click to open menu"
        >
          <CgMenuGridO />
        </button>
      </div>
    </div>
  );
};

export default React.memo(BlockQuickMenu);
