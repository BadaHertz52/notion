import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useCallback,
} from "react";

import { AiOutlinePlus } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";

import { ScreenOnly } from "../index";

import { ActionContext } from "../../contexts";
import { Block, Page, ModalType } from "../../types";
import { makeNewBlock, setTemplateItem } from "../../utils";
import { SESSION_KEY } from "../../constants";

type BlockFnProp = {
  page: Page;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
  moveTargetBlock: Block | null;
  modal: ModalType;
  setModal: Dispatch<SetStateAction<ModalType>>;
};

const BlockFn = ({
  page,
  setMoveTargetBlock,
  moveTargetBlock,
  modal,
  setModal,
}: BlockFnProp) => {
  const { addBlock } = useContext(ActionContext).actions;

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
      moveTargetBlock === null && setMoveTargetBlock(targetBlock);
    }
  }, [setMoveTargetBlock, moveTargetBlock]);

  const onClickMenu = useCallback(() => {
    moveTargetBlock && setMoveTargetBlock(null);
    const sessionItem = sessionStorage.getItem(SESSION_KEY.blockFnTarget);
    if (sessionItem && !modal.open && setModal) {
      const targetBlock = JSON.parse(sessionItem);
      setModal({
        open: true,
        target: "menu",
        block: targetBlock,
      });
    } else {
      console.error("BlockFn-openMenu error: there is no session item");
    }
  }, [moveTargetBlock, modal.open, setMoveTargetBlock, setModal]);

  return (
    <>
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
    </>
  );
};

export default React.memo(BlockFn);
