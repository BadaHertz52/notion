import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { CSSProperties } from "styled-components";

import { AiOutlinePlus } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";

import { ScreenOnly, Rename, Menu } from "../index";

import { ActionContext } from "../../contexts";
import { Block, ListItem, Page, ModalType } from "../../types";
import { findPage, makeNewBlock, setTemplateItem } from "../../utils";
import { SESSION_KEY } from "../../constants";

type BlockFnProp = {
  pages: Page[];
  pagesId: string[];
  firstList: ListItem[];
  page: Page;
  userName: string;
  commentBlock: Block | null;
  frameHtml: HTMLDivElement | null;
  setMoveTargetBlock: Dispatch<SetStateAction<Block | null>>;
  moveTargetBlock: Block | null;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  modal: ModalType;
  setModal: Dispatch<SetStateAction<ModalType>>;
  menuOpen: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
  setModalStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
};

const BlockFn = ({
  pages,
  pagesId,
  firstList,
  page,
  userName,
  setMoveTargetBlock,
  moveTargetBlock,
  frameHtml,
  setCommentBlock,
  modal,
  setModal,
  menuOpen,
  setOpenMenu,
  setModalStyle,
}: BlockFnProp) => {
  const { addBlock } = useContext(ActionContext).actions;

  const [openRename, setOpenRename] = useState<boolean>(false);

  const [blockFnTargetBlock, setBlockFnTargetBlock] = useState<Block | null>(
    null
  );
  const [renameTargetPage, setRenameTargetPage] = useState<Page | null>(null);

  const makeBlock = useCallback(() => {
    const templateHtml = document.getElementById("template");
    setTemplateItem(templateHtml, page);
    const sessionItem = sessionStorage.getItem(SESSION_KEY.blockFnTarget);
    if (sessionItem && page.blocksId) {
      const targetBlock = JSON.parse(sessionItem);
      const targetBlockIndex = page.blocksId.indexOf(targetBlock.id);
      const newBlock = makeNewBlock(page, targetBlock, "");
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
    menuOpen && setOpenMenu(false);
    modal.open &&
      setModal({
        open: false,
        what: null,
      });
    if (sessionItem && !menuOpen) {
      const targetBlock = JSON.parse(sessionItem);
      setBlockFnTargetBlock(targetBlock);
      setOpenMenu(true);
    } else {
      console.error("BlockFn-openMenu error: there is no session item");
    }
  }, [
    menuOpen,
    modal.open,
    moveTargetBlock,
    setModal,
    setMoveTargetBlock,
    setOpenMenu,
  ]);
  useEffect(() => {
    if (openRename && blockFnTargetBlock) {
      const page = findPage(pagesId, pages, blockFnTargetBlock.id) as Page;
      setRenameTargetPage(page);
    }
  }, [openRename, blockFnTargetBlock, pagesId, pages]);

  useEffect(() => {
    const modalStyleItem = sessionStorage.getItem(SESSION_KEY.modalStyle);
    if (modal.open && modalStyleItem) {
      const firstPoint = modalStyleItem.indexOf("px;");
      const secondPoint = modalStyleItem.indexOf("left:");
      const lastPoint = modalStyleItem.lastIndexOf("px");
      const top = Number(modalStyleItem.slice(5, firstPoint)) + 24;
      const left =
        Number(modalStyleItem.slice(secondPoint + 5, lastPoint)) + 45;
      setModalStyle({
        top: `${top}px`,
        left: `${left}px`,
      });
      sessionStorage.removeItem(SESSION_KEY.modalStyle);
    }
  }, [modal.open, setModalStyle]);

  useEffect(() => {
    const innerHeight = window.innerHeight;
    const inner = document.getElementById("inner");
    if (menuOpen) {
      if (inner) {
        if (inner.offsetHeight > innerHeight) {
          inner.setAttribute("style", "overflow-y:scroll");
        } else {
          inner.setAttribute("style", "overflow-y:initial");
        }
      }
    } else {
      if (inner) {
        inner.setAttribute("style", "overflow-y:initial");
      }
    }
  }, [menuOpen]);
  return (
    <>
      <div className="blockFn">
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
          {menuOpen && blockFnTargetBlock && (
            <Menu
              pages={pages}
              block={blockFnTargetBlock}
              firstList={firstList}
              page={page}
              userName={userName}
              setOpenMenu={setOpenMenu}
              modal={modal}
              setModal={setModal}
              setCommentBlock={setCommentBlock}
              setOpenRename={setOpenRename}
              frameHtml={frameHtml}
              style={undefined}
            />
          )}
          {openRename && renameTargetPage && (
            <Rename
              currentPageId={page.id}
              block={blockFnTargetBlock}
              page={renameTargetPage}
              renameStyle={undefined}
              setOpenRename={setOpenRename}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(BlockFn);
