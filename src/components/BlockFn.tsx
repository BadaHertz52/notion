import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import Menu from "./Menu";
import { Block, ListItem, Page } from "../modules/notion/type";
import { findPage, makeNewBlock, setTemplateItem } from "../fn/index";
import { CSSProperties } from "styled-components";
import Rename from "./Rename";

import { AiOutlinePlus } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";
import { ModalType } from "../containers/EditorContainer";

import { ActionContext } from "../containers/NotionRouter";
import ScreenOnly from "./ScreenOnly";

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
  setTargetPageId: Dispatch<SetStateAction<string>>;
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
  setTargetPageId,
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
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock");
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
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock");
    if (sessionItem) {
      const targetBlock = JSON.parse(sessionItem);
      moveTargetBlock === null && setMoveTargetBlock(targetBlock);
    }
  }, [setMoveTargetBlock, moveTargetBlock]);
  const onClickMenu = useCallback(() => {
    moveTargetBlock && setMoveTargetBlock(null);
    const sessionItem = sessionStorage.getItem("blockFnTargetBlock");
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
    const modalStyleItem = sessionStorage.getItem("modalStyle");
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
      sessionStorage.removeItem("modalStyle");
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
              setTargetPageId={setTargetPageId}
              setOpenRename={setOpenRename}
              setSelection={null}
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
