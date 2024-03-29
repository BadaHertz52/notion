import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
  CSSProperties,
} from "react";

import { HiOutlineDuplicate, HiOutlinePencilAlt } from "react-icons/hi";
import { BiCommentDetail } from "react-icons/bi";
import { BsArrowClockwise } from "react-icons/bs";
import { MdOutlineRestorePage } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineFormatPainter } from "react-icons/ai";

import { CommandMenu, PageMenu, Time, ColorMenu, ScreenOnly } from "../index";

import { ActionContext } from "../../contexts";
import {
  Block,
  ModalTargetType,
  ModalType,
  MenuAndBlockStylerCommonProps,
} from "../../types";
import { getEditTime, isMobile, setOriginTemplateItem } from "../../utils";

import "../../assets/menu.scss";

export type MenuProps = Omit<
  MenuAndBlockStylerCommonProps,
  "setCommentBlock"
> & {
  setModal?: Dispatch<SetStateAction<ModalType>>;
  closeModal?: () => void;
};

const Menu = ({
  pages,
  firstList,
  page,
  block,
  userName,
  frameHtml,
  setModal,
  closeModal,
}: MenuProps) => {
  const { addBlock, deleteBlock, duplicatePage } =
    useContext(ActionContext).actions;

  const COLOR = "color";
  const TURN_INTO = "turnInto";
  const TURN_INTO_PAGE = "turnIntoPage";
  //mobile side menu와 중복되어서 숨김
  const HIDDEN_STYLE: CSSProperties = {
    display:
      document.querySelector("#block-styler") || isMobile() ? "none" : "flex",
  };
  const templateHtml = document.getElementById("template");

  const menuRef = useRef<HTMLDivElement>(null);
  const [editBtnGroup, setEditBtnGroup] = useState<Element[] | null>(null);
  type SideMenuType =
    | typeof COLOR
    | typeof TURN_INTO
    | typeof TURN_INTO_PAGE
    | undefined;
  const [sideMenu, setSideMenu] = useState<SideMenuType>();
  const [sideMenuStyle, setSideMenuStyle] = useState<CSSProperties | undefined>(
    isMobile()
      ? {
          transform: "translateY(110%)",
        }
      : undefined
  );

  const changeSideMenuStyle = useCallback(() => {
    if (!isMobile() && menuRef.current) {
      const mainMenu = menuRef.current.firstElementChild;
      const innerWidth = window.innerWidth;
      if (mainMenu && frameHtml) {
        const menuTop = menuRef.current.getClientRects()[0].top;
        const frameBottom = frameHtml.getClientRects()[0].bottom;
        const maxHeight = frameBottom - menuTop - 32;
        const left = mainMenu?.clientWidth * 0.7;
        const style: CSSProperties = {
          top: innerWidth > 768 ? "-10px" : "10px",
          left:
            innerWidth > 768
              ? left
              : `${mainMenu.clientWidth * (innerWidth >= 375 ? 0.5 : 0.3)}px`,
          maxHeight: `${maxHeight}px`,
        };
        setSideMenuStyle(style);
      }
    } else {
      //mobile
      setSideMenuStyle({
        transform: "translateY(0)",
      });
    }
  }, [frameHtml]);

  const handleResize = useCallback(() => {
    if (!isMobile()) {
      if (sideMenu) {
        changeSideMenuStyle();
      }
    }
  }, [changeSideMenuStyle, sideMenu]);

  const showTurnInto = () => {
    setSideMenu(TURN_INTO);
  };
  const showColorMenu = () => {
    setSideMenu(COLOR);
  };
  const showPageMenu = () => {
    setSideMenu(TURN_INTO_PAGE);
  };

  const closeMenu = useCallback(() => {
    if (closeModal) closeModal();
  }, [closeModal]);

  const openPopUpMenu = useCallback(
    (target: ModalTargetType) => {
      if (setModal)
        setModal({
          open: true,
          target: target,
          block: block,
        });
    },
    [setModal, block]
  );

  const handleCloseModal = useCallback(() => {
    if (closeModal) closeModal();
  }, [closeModal]);

  const onOpenCommentInput = useCallback(() => {
    handleCloseModal();
    openPopUpMenu("commentInput");
  }, [openPopUpMenu, handleCloseModal]);

  const removeBlock = useCallback(() => {
    handleCloseModal();
    setOriginTemplateItem(page);
    deleteBlock(page.id, block, true);
    closeMenu();
  }, [block, closeMenu, deleteBlock, page, handleCloseModal]);

  const duplicateBlock = useCallback(() => {
    handleCloseModal();
    if (page.blocks && page.blocksId) {
      setOriginTemplateItem(page);
      const blockIndex = page.blocksId.indexOf(block.id);
      const previousBlockId = page.blocksId[blockIndex - 1];
      const editTime = getEditTime();
      const number = page.blocksId.length.toString();
      const newBlock: Block = {
        ...block,
        id: `block_${page.id}_${number}_${editTime}`,
        editTime: editTime,
      };
      addBlock(
        page.id,
        newBlock,
        blockIndex + 1,
        block.parentBlocksId === null ? null : previousBlockId
      );

      setOriginTemplateItem(page);
      if (block.type === "page") {
        duplicatePage(block.id);
      }
      closeMenu();
    }
  }, [addBlock, block, closeMenu, duplicatePage, page, handleCloseModal]);

  const onSetEditBtnGroup = useCallback(() => {
    setEditBtnGroup([...document.getElementsByClassName("menu__btn-edit")]);
  }, []);

  const onSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      editBtnGroup?.forEach((btn: Element) => {
        const name = btn.getAttribute("name") as string;
        if (name.includes(value)) {
          btn.classList.remove("off");
        } else {
          btn.classList.add("off");
        }
      });
    },
    [editBtnGroup]
  );

  const onClickRename = useCallback(() => {
    handleCloseModal();
    openPopUpMenu("rename");
  }, [openPopUpMenu, handleCloseModal]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (sideMenu) {
      changeSideMenuStyle();
    } else {
      isMobile() &&
        setSideMenuStyle({
          transform: "translateY(110%)",
        });
    }
  }, [sideMenu, changeSideMenuStyle]);

  return (
    <div id="menu" ref={menuRef}>
      <div id="menu__main-menu" className="menu__main-menu">
        <div className="menu__inner">
          <div className="menu__search">
            <label>
              <ScreenOnly text="search input in menu" />
              <input
                type="search"
                id="menu__search_input"
                title="search input in menu"
                name="search"
                placeholder="Search actions"
                onClick={onSetEditBtnGroup}
                onChange={onSearch}
              />
            </label>
          </div>
          <div className="menu__edit">
            <div className="menu__btn-group">
              <button
                title="button to remove"
                className="menu__btn-edit"
                onClick={removeBlock}
                name="delete"
              >
                <div>
                  <RiDeleteBin6Line />
                  <span>Delete</span>
                </div>
              </button>
              <button
                title="button to duplicate"
                className="menu__btn-edit"
                onClick={duplicateBlock}
                name="duplicate"
              >
                <div>
                  <HiOutlineDuplicate />
                  <span>Duplicate</span>
                </div>
              </button>
              <button
                title="button to turn into type"
                className="menu__btn-edit"
                onMouseOver={showTurnInto}
                name="turn into"
                style={HIDDEN_STYLE}
              >
                <div>
                  <BsArrowClockwise />
                  <span>Turn into</span>
                  <span className="arrow-down">
                    <TiArrowSortedDown />
                  </span>
                </div>
              </button>
              <button
                title="button to turn in to page "
                className="menu__btn-edit"
                name="turn into page in"
                style={HIDDEN_STYLE}
                onMouseOver={showPageMenu}
              >
                <div>
                  <MdOutlineRestorePage />
                  <span>Turn into Page in</span>
                  <span className="arrow-down">
                    <TiArrowSortedDown />
                  </span>
                </div>
              </button>
              {block.type === "page" && (
                <button
                  title="button to rename"
                  className="menu__btn-edit"
                  onClick={onClickRename}
                >
                  <div>
                    <HiOutlinePencilAlt />
                    <span>Rename</span>
                  </div>
                </button>
              )}
              {block.type !== "page" && (
                <button
                  title="button to comment"
                  className="underline menu__btn-edit"
                  name="comment"
                  onClick={onOpenCommentInput}
                  style={HIDDEN_STYLE}
                >
                  <div>
                    <BiCommentDetail />
                    <span>Comment</span>
                  </div>
                </button>
              )}
              <button
                title="button to change color"
                name="color"
                className="underline menu__btn-edit"
                onMouseOver={showColorMenu}
                style={HIDDEN_STYLE}
              >
                <div>
                  <AiOutlineFormatPainter />
                  <span>Color</span>
                  <span className="arrow-down">
                    <TiArrowSortedDown />
                  </span>
                </div>
              </button>
            </div>
            <div className="edit__inform">
              <p>Last edited by {userName} </p>
              <Time editTime={block.editTime} />
            </div>
          </div>
        </div>
      </div>
      <div
        id="menu__side-menu"
        className="menu__side-menu"
        style={sideMenuStyle}
        onClick={closeMenu}
      >
        {sideMenu === TURN_INTO && (
          <CommandMenu
            page={page}
            block={block}
            closeCommand={() => setSideMenu(undefined)}
            closeModal={closeModal}
          />
        )}
        {sideMenu === COLOR && <ColorMenu page={page} block={block} />}
        {sideMenu === TURN_INTO_PAGE && (
          <PageMenu
            what="block"
            currentPage={page}
            pages={pages}
            block={block}
            firstList={firstList}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(Menu);
