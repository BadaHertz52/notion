import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import { Block, listItem, Page } from "../modules/notion";
import CommandBlock from "./CommandBlock";
import { CSSProperties } from "styled-components";
import ColorMenu from "./ColorMenu";
import { HiOutlineDuplicate, HiOutlinePencilAlt } from "react-icons/hi";
import PageMenu from "./PageMenu";
import {
  modalComment,
  modalMoveToPage,
  ModalType,
} from "../containers/EditorContainer";
import Time from "./Time";

//icon
import { BiCommentDetail } from "react-icons/bi";
import { BsArrowClockwise } from "react-icons/bs";
import { MdOutlineRestorePage } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";
import { IoArrowRedoOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineFormatPainter } from "react-icons/ai";
import { isMobile, setTemplateItem } from "./BlockComponent";
import {
  ActionContext,
  mobileSideMenuType,
  selectionType,
} from "../containers/NotionRouter";

export type MenuAndBlockStylerCommonProps = {
  pages: Page[];
  firstList: listItem[];
  page: Page;
  block: Block;
  userName: string;
  setModal: Dispatch<SetStateAction<ModalType>>;
  modal: ModalType;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  setTargetPageId: Dispatch<SetStateAction<string>>;
  frameHtml: HTMLDivElement | null;
};

export type MenuProps = MenuAndBlockStylerCommonProps & {
  setOpenMenu?: Dispatch<SetStateAction<boolean>>;
  setOpenRename: Dispatch<SetStateAction<boolean>> | null;
  setSelection: Dispatch<SetStateAction<selectionType | null>> | null;
  style: CSSProperties | undefined;
  setMobileSideMenu?: Dispatch<SetStateAction<mobileSideMenuType>>;
};

const Menu = ({
  pages,
  firstList,
  page,
  block,
  userName,
  setOpenMenu,
  setModal,
  modal,
  setCommentBlock,
  setTargetPageId,
  setOpenRename,
  frameHtml,
  setSelection,
  style,
  setMobileSideMenu,
}: MenuProps) => {
  const { addBlock, deleteBlock, duplicatePage } =
    useContext(ActionContext).actions;
  const templateHtml = document.getElementById("template");
  const blockFnElement = templateHtml
    ? (templateHtml.querySelector(".blockFn") as HTMLElement | null)
    : (document.querySelector(".blockFn") as HTMLElement | null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [editBtnGroup, setEditBtnGroup] = useState<Element[] | null>(null);
  const [turnInto, setTurnInto] = useState<boolean>(false);
  const [color, setColor] = useState<boolean>(false);
  const [turnInToPage, setTurnIntoPage] = useState<boolean>(false);
  const blockStylerHtml = document.getElementById("blockStyler");
  const [menuStyle, setMenuStyle] = useState<CSSProperties | undefined>(
    style === undefined ? changeMenuStyle() : style
  );
  const [sideMenuStyle, setSideMenuStyle] = useState<CSSProperties | undefined>(
    isMobile()
      ? {
          transform: "translateY(110%)",
        }
      : undefined
  );

  function changeMenuStyle() {
    const menu = document.querySelector(".menu");
    const menuHeight = menu ? menu.clientHeight : 400;
    const innerWidth = window.innerWidth;
    const frameDomRect = frameHtml?.getClientRects()[0];
    let style: CSSProperties = {};
    if (blockFnElement && frameDomRect) {
      const blockFnDomRect = blockFnElement.getClientRects()[0];
      const blockFnTop = blockFnDomRect.top as number;
      const overHeight = blockFnTop + menuHeight >= frameDomRect.height + 100;
      const bottom = blockFnElement.offsetHeight * 0.5;
      const top = blockFnElement.offsetHeight;
      style = overHeight
        ? {
            bottom: `${bottom}px`,
            left: innerWidth > 767 ? "2rem" : "1rem",
            maxHeight: `${blockFnDomRect.top - frameDomRect.top}px`,
          }
        : {
            top: `${top}px`,
            left: innerWidth > 767 ? "2rem" : "1rem",
            maxHeight: `${frameDomRect.bottom - blockFnDomRect.bottom}px`,
          };
    }

    return style;
  }
  function changeSideMenuStyle() {
    if (!isMobile() && menuRef.current) {
      const mainMenu = menuRef.current.firstElementChild;
      const innerWidth = window.innerWidth;
      if (mainMenu && frameHtml) {
        const menuTop = menuRef.current.getClientRects()[0].top;
        const frameBottom = frameHtml.getClientRects()[0].bottom;
        const maxHeight = frameBottom - menuTop - 32;
        const left = mainMenu?.clientWidth * 0.7;
        const style: CSSProperties = {
          top: innerWidth > 767 ? "-10px" : "10px",
          left:
            innerWidth > 767
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
  }
  window.onresize = () => {
    if (!isMobile()) {
      if (blockStylerHtml === null) {
        const style = changeMenuStyle();
        setMenuStyle(style);
      }
      if (turnInToPage || turnInto || color) {
        changeSideMenuStyle();
      }
    }
  };
  useEffect(() => {
    if (turnInToPage || turnInto || color) {
      changeSideMenuStyle();
    }
  }, [turnInToPage, turnInto, color]);

  let modalStyle = blockFnElement?.getAttribute("style");

  const recoveryMenuState = () => {
    turnInto && setTurnInto(false);
    turnInToPage && setTurnIntoPage(false);
    color && setColor(false);
    modal.open &&
      setModal({
        open: false,
        what: null,
      });
  };
  const showTurnInto = () => {
    setTurnInto(true);
    setColor(false);
    setTurnIntoPage(false);
  };
  const showColorMenu = () => {
    setColor(true);
    setTurnInto(false);
    setTurnIntoPage(false);
    recoveryMenuState();
  };
  const showPageMenu = () => {
    setTurnIntoPage(true);
    setTurnInto(false);
    setColor(false);
    recoveryMenuState();
  };
  const showPageMenuInMobile = () => {
    if (setMobileSideMenu) {
      sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block));
      setMobileSideMenu({
        block: block,
        what: "ms_movePage",
      });
    }
  };
  const closeMenu = () => {
    setOpenMenu
      ? setOpenMenu(false)
      : setMobileSideMenu &&
        setMobileSideMenu({ block: null, what: undefined });
  };
  const onClickMoveTo = () => {
    sessionStorage.setItem("modalStyle", JSON.stringify(modalStyle));
    setModal({
      open: true,
      what: modalMoveToPage,
    });
    closeMenu();
  };
  const onOpenCommentInput = () => {
    setCommentBlock(block);
    closeMenu();
    setSelection && setSelection(null);
    sessionStorage.setItem("modalStyle", JSON.stringify(modalStyle));
    setModal({
      open: true,
      what: modalComment,
    });
  };
  const removeBlock = () => {
    setSelection && setSelection(null);
    setTemplateItem(templateHtml, page);
    deleteBlock(page.id, block, true);
    closeMenu();
  };

  const duplicateBlock = () => {
    setSelection && setSelection(null);
    if (page.blocks && page.blocksId) {
      setTemplateItem(templateHtml, page);
      const blockIndex = page.blocksId.indexOf(block.id);
      const previousBlockId = page.blocksId[blockIndex - 1];
      const editTime = JSON.stringify(Date.now());
      const number = page.blocksId.length.toString();
      const newBlock: Block = {
        ...block,
        id: `${page.id}_${number}_${editTime}`,
        editTime: editTime,
      };
      addBlock(
        page.id,
        newBlock,
        blockIndex + 1,
        block.parentBlocksId === null ? null : previousBlockId
      );

      setTemplateItem(templateHtml, page);
      if (block.type === "page") {
        duplicatePage(block.id);
      }
      closeMenu();
    }
  };

  const onSetEditBtnGroup = () => {
    setEditBtnGroup([...document.getElementsByClassName("menu__editBtn")]);
  };
  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    editBtnGroup?.forEach((btn: Element) => {
      const name = btn.getAttribute("name") as string;
      if (name.includes(value)) {
        btn.classList.remove("off");
      } else {
        btn.classList.add("off");
      }
    });
  };
  const onClickRename = () => {
    setSelection && setSelection(null);
    setOpenRename && setOpenRename(true);
    closeMenu();
  };
  useEffect(() => {
    if (!turnInto && !color && !turnInToPage && isMobile()) {
      setSideMenuStyle({
        transform: "translateY(110%)",
      });
    }
  }, [turnInto, color, turnInToPage]);
  return (
    <div className="menu" ref={menuRef} style={menuStyle}>
      <div id="menu__main" className="mainMenu">
        <div className="menu__inner">
          <div className="menu__search">
            <input
              type="search"
              id="menu__search_input"
              title="search input in menu"
              name="search"
              placeholder="Search actions"
              onClick={onSetEditBtnGroup}
              onChange={onSearch}
            />
          </div>
          <div className="menu__edit">
            <div className="menu__editBtnGroup">
              <button
                className="menu__editBtn"
                onClick={removeBlock}
                name="delete"
              >
                <div>
                  <RiDeleteBin6Line />
                  <span>Delete</span>
                </div>
              </button>
              <button
                className="menu__editBtn"
                onClick={duplicateBlock}
                name="duplicate"
              >
                <div>
                  <HiOutlineDuplicate />
                  <span>Duplicate</span>
                </div>
              </button>
              <button
                className="menu__editBtn"
                onMouseOver={showTurnInto}
                name="turn into"
                style={{
                  display:
                    document.querySelector("#blockStyler") || isMobile()
                      ? "none"
                      : "flex",
                }}
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
                className="menu__editBtn"
                name="turn into page in"
                onMouseOver={showPageMenu}
                onTouchEnd={showPageMenuInMobile}
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
                <button className="menu__editBtn" onClick={onClickRename}>
                  <div>
                    <HiOutlinePencilAlt />
                    <span>Rename</span>
                  </div>
                </button>
              )}
              <button
                className="underline menu__editBtn"
                name="move to"
                onClick={onClickMoveTo}
                style={{ display: isMobile() ? "none" : "block" }}
              >
                <div>
                  <IoArrowRedoOutline />
                  <span>Move to</span>
                </div>
              </button>
              {block.type !== "page" && (
                <button
                  className="underline menu__editBtn"
                  name="comment"
                  onClick={onOpenCommentInput}
                  style={{ display: isMobile() ? "none" : "flex" }}
                >
                  <div>
                    <BiCommentDetail />
                    <span>Comment</span>
                  </div>
                </button>
              )}
              <button
                name="color"
                className="underline menu__editBtn"
                onMouseOver={showColorMenu}
                style={{
                  display:
                    document.querySelector("#blockStyler") || isMobile()
                      ? "none"
                      : "flex",
                }}
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
      <div id="sideMenu" className="menu__sideMenu" style={sideMenuStyle}>
        {turnInto && (
          <CommandBlock
            style={undefined}
            page={page}
            block={block}
            command={null}
            setCommand={null}
            closeCommand={() => setTurnInto(false)}
            setSelection={setSelection}
          />
        )}
        {color && (
          <ColorMenu
            page={page}
            block={block}
            selection={null}
            setSelection={null}
          />
        )}
        {turnInToPage && (
          <PageMenu
            what="block"
            currentPage={page}
            pages={pages}
            firstList={firstList}
            closeMenu={setOpenMenu ? () => setOpenMenu(false) : undefined}
            setTargetPageId={setTargetPageId}
          />
        )}
        {}
      </div>
    </div>
  );
};

export default React.memo(Menu);
