import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import { Block, ListItem, Page } from "../modules/notion/type";
import CommandBlock from "./CommandBlock";
import { CSSProperties } from "styled-components";
import ColorMenu from "./ColorMenu";
import { HiOutlineDuplicate, HiOutlinePencilAlt } from "react-icons/hi";
import PageMenu from "./PageMenu";
import { modalComment, ModalType } from "../containers/EditorContainer";
import Time from "./Time";

//icon
import { BiCommentDetail } from "react-icons/bi";
import { BsArrowClockwise } from "react-icons/bs";
import { MdOutlineRestorePage } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineFormatPainter } from "react-icons/ai";
import { isMobile, setTemplateItem } from "../fn";
import {
  ActionContext,
  mobileSideMenuType,
  SelectionType,
} from "../route/NotionRouter";
import ScreenOnly from "./ScreenOnly";

export type MenuAndBlockStylerCommonProps = {
  pages: Page[];
  firstList: ListItem[];
  page: Page;
  block: Block;
  userName: string;
  setModal: Dispatch<SetStateAction<ModalType>>;
  modal: ModalType;
  setCommentBlock: Dispatch<SetStateAction<Block | null>>;
  frameHtml: HTMLDivElement | null;
};

export type MenuProps = MenuAndBlockStylerCommonProps & {
  setOpenMenu?: Dispatch<SetStateAction<boolean>>;
  setOpenRename: Dispatch<SetStateAction<boolean>> | null;
  setSelection: Dispatch<SetStateAction<SelectionType | null>> | null;
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
  const COLOR = "color";
  const TURN_INTO = "turnInto";
  const TURN_INTO_PAGE = "turnIntoPage";
  type SideMenuType =
    | typeof COLOR
    | typeof TURN_INTO
    | typeof TURN_INTO_PAGE
    | undefined;
  const [sideMenu, setSideMenu] = useState<SideMenuType>();
  const blockStylerHtml = document.getElementById("blockStyler");
  const changeMenuStyle = useCallback(() => {
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
            left: innerWidth > 768 ? "2rem" : "1rem",
            maxHeight: `${blockFnDomRect.top - frameDomRect.top}px`,
          }
        : {
            top: `${top}px`,
            left: innerWidth > 768 ? "2rem" : "1rem",
            maxHeight: `${frameDomRect.bottom - blockFnDomRect.bottom}px`,
          };
    }

    return style;
  }, [blockFnElement, frameHtml]);

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
      if (blockStylerHtml === null) {
        const style = changeMenuStyle();
        setMenuStyle(style);
      }
      if (sideMenu) {
        changeSideMenuStyle();
      }
    }
  }, [blockStylerHtml, changeMenuStyle, changeSideMenuStyle, sideMenu]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  let modalStyle = blockFnElement?.getAttribute("style");

  const recoveryMenuState = () => {
    modal.open &&
      setModal({
        open: false,
        what: null,
      });
  };
  const showTurnInto = () => {
    setSideMenu(TURN_INTO);
    recoveryMenuState();
  };
  const showColorMenu = () => {
    setSideMenu(COLOR);
    recoveryMenuState();
  };
  const showPageMenu = () => {
    setSideMenu(TURN_INTO_PAGE);
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
  const closeMenu = useCallback(() => {
    setOpenMenu
      ? setOpenMenu(false)
      : setMobileSideMenu &&
        setMobileSideMenu({ block: null, what: undefined });
  }, [setOpenMenu, setMobileSideMenu]);

  const onOpenCommentInput = useCallback(() => {
    setCommentBlock(block);
    closeMenu();
    setSelection && setSelection(null);
    sessionStorage.setItem("modalStyle", JSON.stringify(modalStyle));
    setModal({
      open: true,
      what: modalComment,
    });
  }, [block, closeMenu, modalStyle, setCommentBlock, setModal, setSelection]);
  const removeBlock = useCallback(() => {
    setSelection && setSelection(null);
    setTemplateItem(templateHtml, page);
    deleteBlock(page.id, block, true);
    closeMenu();
  }, [block, closeMenu, deleteBlock, page, setSelection, templateHtml]);

  const duplicateBlock = useCallback(() => {
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
  }, [
    addBlock,
    block,
    closeMenu,
    duplicatePage,
    page,
    setSelection,
    templateHtml,
  ]);

  const onSetEditBtnGroup = useCallback(() => {
    setEditBtnGroup([...document.getElementsByClassName("menu__editBtn")]);
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
    setSelection && setSelection(null);
    setOpenRename && setOpenRename(true);
    closeMenu();
  }, [closeMenu, setOpenRename, setSelection]);

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
    <div className="menu" ref={menuRef} style={menuStyle}>
      <div id="menu__main" className="mainMenu">
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
            <div className="menu__editBtnGroup">
              <button
                title="button to remove"
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
                title="button to duplicate"
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
                title="button to turn into type"
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
                title="button to turn in to page "
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
                <button
                  title="button to rename"
                  className="menu__editBtn"
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
                title="button to change color"
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
        {sideMenu === TURN_INTO && (
          <CommandBlock
            style={undefined}
            page={page}
            block={block}
            command={null}
            setCommand={null}
            closeCommand={() => setSideMenu(undefined)}
            setSelection={setSelection}
          />
        )}
        {sideMenu === COLOR && (
          <ColorMenu
            page={page}
            block={block}
            selection={null}
            setSelection={null}
          />
        )}
        {sideMenu === TURN_INTO_PAGE && (
          <PageMenu
            what="block"
            currentPage={page}
            pages={pages}
            firstList={firstList}
            closeMenu={setOpenMenu ? () => setOpenMenu(false) : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(Menu);
