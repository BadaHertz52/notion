import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useCallback,
} from "react";

import { AiOutlinePlus } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";

import { ScreenOnly } from "../index";

import { ActionContext, ModalContext } from "../../contexts";
import { Block, Page, ModalType } from "../../types";
import { makeNewBlock, setTemplateItem } from "../../utils";
import { SESSION_KEY } from "../../constants";

type BlockFnProp = {
  page: Page;
  setMovingTargetBlock: Dispatch<SetStateAction<Block | null>>;
  movingTargetBlock: Block | null;
  modal: ModalType;
};

const BlockFn = ({
  page,
  setMovingTargetBlock,
  movingTargetBlock,
  modal,
}: BlockFnProp) => {
  const { addBlock } = useContext(ActionContext).actions;
  const { changeModalState } = useContext(ModalContext);

  const makeBlock = useCallback(() => {
    const templateHtml = document.getElementById("template");
    setTemplateItem(templateHtml, page);
    const sessionItem = sessionStorage.getItem(SESSION_KEY.blockFnTarget);
    if (sessionItem && page.blocksId) {
      const targetBlock = JSON.parse(sessionItem);
      const targetBlockIndex = page.blocksId.indexOf(targetBlock.id);
      const newBlock = makeNewBlock(page, targetBlock);
      addBlock(page.id, newBlock, targetBlockIndex + 1, targetBlock.id);
    } else {
      console.error("BlockFn-makeBlock error: there is no session item");
    }
  }, [addBlock, page]);

  const onMouseDownMenu = useCallback(() => {
    const sessionItem = sessionStorage.getItem(SESSION_KEY.blockFnTarget);
    if (sessionItem) {
      const targetBlock = JSON.parse(sessionItem);
      movingTargetBlock === null && setMovingTargetBlock(targetBlock);
    }
  }, [setMovingTargetBlock, movingTargetBlock]);

  const onClickMenu = useCallback(() => {
    movingTargetBlock && setMovingTargetBlock(null);
    const sessionItem = sessionStorage.getItem(SESSION_KEY.blockFnTarget);
    if (sessionItem && !modal.open) {
      const targetBlock = JSON.parse(sessionItem);
      changeModalState({
        open: true,
        target: "menu",
        block: targetBlock,
      });
    } else {
      console.error("BlockFn-openMenu error: there is no session item");
    }
  }, [movingTargetBlock, modal.open, setMovingTargetBlock, changeModalState]);

  return (
    <div id="blockFn" className="blockFn">
      <div className="icon-blockFn">
        <button onClick={makeBlock} title="Click  to add a block below">
          <ScreenOnly text="button  to add a block below" />
          <AiOutlinePlus />
        </button>
      </div>
      <div className="icon-blockFn">
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

export default React.memo(BlockFn);
