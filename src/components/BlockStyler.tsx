import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { BsChatLeftText, BsThreeDots } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { ImArrowUpRight2 } from "react-icons/im";
import { CSSProperties } from "styled-components";
import ColorMenu from "./ColorMenu";
import { Command } from "./Frame";
import {
  ActionContext,
  MobileSideMenuWhatType,
  SelectionType,
} from "../containers/NotionRouter";
import Menu, { MenuAndBlockStylerCommonProps } from "./Menu";
import { Block, Page } from "../modules/notion/type";
import LinkLoader from "./LinkLoader";
import { mobileSideMenuType } from "../containers/NotionRouter";
import { getContent, isMobile, removeSelected, selectContent } from "../fn";
import ScreenOnly from "./ScreenOnly";

export type StylerCommonProps = MenuAndBlockStylerCommonProps & {
  pagesId: string[];
  recentPagesId: string[] | null;
  setModalStyle: Dispatch<
    React.SetStateAction<React.CSSProperties | undefined>
  >;
  setCommand: React.Dispatch<React.SetStateAction<Command>>;
  command: Command;
  setMobileSideMenu: Dispatch<SetStateAction<mobileSideMenuType>>;
  setMobileMenuTargetBlock: Dispatch<SetStateAction<Block | null>>;
};
export type BlockStylerProps = StylerCommonProps & {
  selection: SelectionType | null;
  setSelection: Dispatch<SetStateAction<SelectionType | null>> | null;
  setOpenMobileBlockStyler: Dispatch<SetStateAction<boolean>> | null;
};
const BlockStyler = ({
  pages,
  pagesId,
  firstList,
  userName,
  page,
  recentPagesId,
  block,
  modal,
  setModal,
  setCommentBlock,
  selection,
  setSelection,
  setModalStyle,
  command,
  setCommand,
  frameHtml,
  setMobileSideMenu,
  setMobileMenuTargetBlock,
  setOpenMobileBlockStyler,
}: BlockStylerProps) => {
  const { editBlock } = useContext(ActionContext).actions;
  const bold = "bold";
  const initial = "initial";
  const italic = "italic";
  const underline = "underline";
  const lineThrough = "lineThrough";
  type BlockFontWeightType = typeof bold | typeof initial;
  type BlockFontStyleType = typeof italic | typeof initial;
  type TextDecoType = typeof underline | typeof lineThrough;
  const getBlockType = () => {
    const blockType = block.type;
    switch (blockType) {
      case "bulletList":
        return "Bullet list";
      case "h1":
        return "Heading 1";
      case "h2":
        return "Heading 2";
      case "h3":
        return "Heading 3";
      case "numberList":
        return "Number list";
      case "page":
        return "Page";
      case "text":
        return "Text";
      case "todo":
        return "To-do list";
      case "todo_done":
        return "To-do list";
      case "toggle":
        return "Toggle list";
      default:
        break;
    }
  };
  const inner = document.getElementById("inner");
  const pageContentEl = frameHtml?.querySelector(".page__contents__inner");
  const blockStyler = document.getElementById("blockStyler");
  const [blockStylerStyle, setBlockStylerStyle] = useState<
    CSSProperties | undefined
  >(undefined);
  const [menuStyle, setMenuStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [openLink, setOpenLink] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openColor, setOpenColor] = useState<boolean>(false);
  const color = "color";
  const menu = "menu";
  type menuType = typeof color | typeof menu;
  const colorMenuHtmlId = "block-styler__color";
  const commandBlockHtmlId = "block__commandBlock";
  const linkLoaderHtmlId = "linkLoader";
  const mainMenuHtmlId = "menu__main";

  type sideMenuIdType =
    | typeof colorMenuHtmlId
    | typeof commandBlockHtmlId
    | typeof linkLoaderHtmlId
    | typeof mainMenuHtmlId;

  /**
   * BlockStyler의 타켓인 block에 대한 내용을 담고 있는 element중 mainBlock element의 domRect을 반환하는 함수
   * @returns DOMRect | undefined
   */
  const getMainBlockDomRect = useCallback(
    (frameHtml: HTMLDivElement | null, block: Block): DOMRect | undefined => {
      const blockHtml = frameHtml?.querySelector(`#block-${block.id}`);
      const mainBlockHtml = block.type.includes("List")
        ? blockHtml?.parentElement?.parentElement
        : blockHtml?.querySelector(".mainBlock");
      const mainBlockDomRect = mainBlockHtml?.getClientRects()[0];
      return mainBlockDomRect;
    },
    []
  );
  const changeStylerStyle = useCallback(
    (
      frameHtml: HTMLDivElement | null,
      block: Block,
      setStyle: Dispatch<SetStateAction<CSSProperties | undefined>>
    ) => {
      const mainBlockDomRect = getMainBlockDomRect(frameHtml, block);
      const pageContentInner = frameHtml?.querySelector(
        ".page__contents__inner"
      );
      const pageContentDomRect = pageContentInner?.getClientRects()[0];
      if (frameHtml && mainBlockDomRect && pageContentDomRect) {
        const frameDomRect = frameHtml.getClientRects()[0];
        const top = mainBlockDomRect.top - frameDomRect.top;
        const left = mainBlockDomRect.left - frameDomRect.left;
        setStyle({
          top: `${top}px`,
          left: `${left}px`,
          width:
            window.innerWidth < 768
              ? `${pageContentDomRect.width}px`
              : "fit-content",
        });
      }
    },
    [getMainBlockDomRect]
  );

  const closeOtherBtn = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (target && !isMobile()) {
        const clickTypeBtn = target.closest(".blockStyler__btn-type");
        const clickLinkBtn = target.closest(".blockStyler__btn-link");
        const clickMenuBtn = target.closest(".blockStyler__btn-menu");
        const clickColorBtn = target.closest(".blockStyler__btn-color");
        !clickTypeBtn &&
          setCommand({
            open: false,
            command: null,
            targetBlock: null,
          });

        !clickLinkBtn && setOpenLink(false);
        !clickMenuBtn && setOpenMenu(false);
        !clickColorBtn && setOpenColor(false);
      }
    },
    [setCommand]
  );

  const onClickTypeBtn = useCallback(() => {
    command.open
      ? setCommand({
          open: false,
          command: null,
          targetBlock: null,
        })
      : setCommand({
          open: true,
          command: null,
          targetBlock: block,
        });
  }, [block, command.open, setCommand]);

  const changeCommentStyle = useCallback(() => {
    const mainBlockDomRect = getMainBlockDomRect(frameHtml, block);
    if (mainBlockDomRect && frameHtml) {
      const pageContentDomRect = pageContentEl?.getClientRects()[0];
      const frameDomRect = frameHtml.getClientRects()[0];
      const top = mainBlockDomRect.bottom + 8;
      const innerHeight = window.innerHeight;
      const remainHeight = innerHeight - (top + 50);

      if (pageContentDomRect) {
        const left = pageContentDomRect.left - frameDomRect.left;
        const bottom = innerHeight - mainBlockDomRect.top + 8;
        remainHeight > 10 || isMobile()
          ? setModalStyle({
              top: `${top}px`,
              left: `${left}px`,
            })
          : setModalStyle({
              bottom: `${bottom}px`,
              left: `${left}px`,
            });
      }

      if (isMobile()) {
        const pageHtml = frameHtml?.querySelector(".page");
        if (pageHtml && frameHtml) {
          pageHtml?.setAttribute(
            "style",
            `translateY(${pageHtml.clientTop - frameHtml.clientTop - 50}px)`
          );
        }
      }
    }
  }, [block, frameHtml, getMainBlockDomRect, pageContentEl, setModalStyle]);
  const onClickCommentBtn = useCallback(() => {
    changeCommentStyle();
    setModal({
      open: true,
      what: "modalComment",
    });
    setCommentBlock(block);
    setSelection && setSelection(null);
    isMobile() && setMobileMenuTargetBlock(null);
  }, [
    block,
    changeCommentStyle,
    setCommentBlock,
    setMobileMenuTargetBlock,
    setModal,
    setSelection,
  ]);

  const changeMenuStyle = useCallback(
    (param: menuType) => {
      if (blockStyler && frameHtml) {
        const blockStylerDomRect = blockStyler.getClientRects()[0];
        const frameHtmlDomRect = frameHtml.getClientRects()[0];
        const top = blockStylerDomRect.bottom + 5;
        const left =
          param === menu
            ? blockStylerDomRect.right - frameHtmlDomRect.left - 240
            : blockStylerDomRect.right - frameHtmlDomRect.left - 200;
        const bottom = window.innerHeight - top + blockStylerDomRect.height;
        const remainHeight = bottom - 50;
        const style: CSSProperties =
          remainHeight > 300
            ? {
                top: `${top}px`,
                left: `${left}px`,
                maxHeight: `${remainHeight}px`,
                overflowY: "scroll",
              }
            : {
                bottom: `${bottom}px`,
                left: `${left}px`,
                maxHeight: `${top - 50}px`,
                overflowY: "scroll",
              };
        if (param === menu) {
          const STYLE: CSSProperties = {
            ...style,
            overflowY: initial,
          };
          setMenuStyle(STYLE);
        } else {
          setMenuStyle(style);
        }
      }
    },
    [blockStyler, frameHtml]
  );

  const onClickColorBtn = useCallback(() => {
    if (openColor) {
      setOpenColor(false);
    } else {
      changeMenuStyle(color);
      setOpenColor(true);
    }
  }, [openColor, setOpenColor, changeMenuStyle]);
  const onClickMenuBtn = useCallback(() => {
    if (openMenu) {
      setOpenMenu(false);
    } else {
      changeMenuStyle(menu);
      setOpenMenu(true);
    }
  }, [changeMenuStyle, openMenu]);
  const handleResize = useCallback(() => {
    if (isMobile()) {
      changeStylerStyle(frameHtml, block, setBlockStylerStyle);
      openMenu && changeMenuStyle(menu);
      openColor && changeMenuStyle(color);
    }
  }, [
    changeMenuStyle,
    openMenu,
    frameHtml,
    block,
    setBlockStylerStyle,
    openColor,
    changeStylerStyle,
  ]);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  /**
   *  textDeco 스타일을 지정할 경우, 기존에 textDeco가 지정된 element의 클래스를 변경하거나, outerHtml의 값을 변경하는 함수
   * @param deco  삭제하고자 하는 , 기존에 지정된 textDeco 스타일
   * * @param selectedHtml : 선택된 node
   */
  const removeOtherTextDeco = useCallback(
    (deco: TextDecoType, selectedHtml: HTMLElement) => {
      const decoSpan = selectedHtml.querySelectorAll(`.${deco}`);
      if (decoSpan[0]) {
        decoSpan.forEach((e: Element) => {
          if (e.classList.length === 1) {
            e.outerHTML = e.innerHTML;
          } else {
            e.classList.remove(deco);
          }
        });
      }
    },
    []
  );
  /**
   * 클릭한 버튼에 따라, 선택된 내용의 fontWeight, fontstyle , textDeco를 변경하는 함수
   * @param btnName 클릭한 버튼의 이름
   */
  const onClickFontStyleBtn = useCallback(
    (btnName: BlockFontWeightType | BlockFontStyleType | TextDecoType) => {
      const listOfSelected = document.querySelectorAll(
        ".selected"
      ) as NodeListOf<HTMLElement>;
      if (listOfSelected[0]) {
        listOfSelected.forEach((selectedHtml: HTMLElement) => {
          const selectedSpan = selectedHtml.querySelectorAll(`.${btnName}`);
          if (selectedSpan[0]) {
            //btnName과 같은 스타일이 지정된 span 이 있으므로 selectedHtml의 class를 변경하기 전에 같은 스타일이 있는 span을 정리해줌
            selectedSpan.forEach((span: Element) => {
              if (span.classList.length === 1) {
                // span의 class 가 btnName인 경우
                span.outerHTML = span.innerHTML;
              } else {
                span.classList.remove(btnName);
              }
            });
          }

          if (btnName === "lineThrough") {
            removeOtherTextDeco("underline", selectedHtml);
          }
          if (btnName === "underline") {
            removeOtherTextDeco("lineThrough", selectedHtml);
          }
          //class 변경 : 버튼을 눌러서 새로 스타일을 지정하거나, 지정했던 스타일을 없애는 기능
          if (selectedHtml.className.includes(btnName)) {
            selectedHtml.classList.remove(btnName);
          } else {
            selectedHtml.classList.add(btnName);
          }
        });

        const editedBlock = getContent(block);
        editBlock(page.id, editedBlock);
        setSelection &&
          setSelection({
            block: editedBlock,
            change: true,
          });
      }
    },
    [block, editBlock, page.id, removeOtherTextDeco, setSelection]
  );

  /**
   * 유저가 blockStyler를 통해 여는 sideMenu의 영역 밖을을 클릭 할 경우 열려있는 sideMenu 창을 닫는 함수
   * @param target event.target <HTMLElement>
   * @param htmlId
   */
  const closeSideMenu = useCallback(
    (target: HTMLElement, htmlId: sideMenuIdType) => {
      const isIn = target.id === htmlId ? true : target.closest(`#${htmlId}`);
      if (!isIn) {
        switch (htmlId) {
          case "block-styler__color":
            setOpenColor(false);
            break;
          case "block__commandBlock":
            setCommand({
              open: false,
              command: null,
              targetBlock: null,
            });
            break;
          case "linkLoader":
            setOpenLink(false);
            break;
          case "menu__main":
            const isInSideMenu =
              target.id === "sideMenu" ? true : target.closest("#sideMenu");
            !isInSideMenu && setOpenMenu(false);
            break;
          default:
            break;
        }
      }
    },
    [setCommand]
  );
  /**
   * 화면상에서 클릭한 곳이 blockStyler외의 곳일 경우, blockStyler 에 의한 변경사항의 여부에 따라 변경 사항이 있으면 블록의 contents 중 선택된 영역을 가리키는 selected 클래스를 제거하고, 변경이 없는 경우 원래의 블록으로 되돌린 후, selection 값은 null로 변경하여 BlockStyler component의 실행을 종료하는 함수
   * @param event globalThis.MouseEvent
   */
  const closeBlockStyler = useCallback(
    (event: globalThis.MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const isInBlockStyler = target.closest("#blockStyler");
        const isInMenuComponent = target.closest(".menu");
        const isInMobileBlockMenu = target.closest("#mobileBlockMenu");
        const isInContents = target.closest(".contents");
        if (
          !isInBlockStyler &&
          !isInMenuComponent &&
          !isInMobileBlockMenu &&
          !isInContents
        ) {
          const colorMenuHtml = document.getElementById("block-styler__color");
          const commandBlockHtml = document.getElementById(
            "block__commandBlock"
          );
          const mainMenu = document.getElementById("mainMenu");
          const linkLoaderHtml = document.getElementById("linkLoader");

          if (
            colorMenuHtml === null &&
            commandBlockHtml === null &&
            mainMenu === null &&
            linkLoaderHtml === null
          ) {
            // 조건 : web에서 sideMenu가 닫혀 있을 경우
            removeSelected(frameHtml, block, editBlock, page, setSelection);
            setSelection && setSelection(null);
            openMenu && setMobileMenuTargetBlock(null);
          } else {
            const eventTarget = event.target as HTMLElement | null;
            if (eventTarget) {
              openColor && closeSideMenu(eventTarget, "block-styler__color");
              openLink && closeSideMenu(eventTarget, "linkLoader");
              openMenu && closeSideMenu(eventTarget, "menu__main");
              command.open && closeSideMenu(eventTarget, "block__commandBlock");
            }
          }
        }
      }
    },
    [
      block,
      closeSideMenu,
      command.open,
      editBlock,
      frameHtml,
      openColor,
      openLink,
      openMenu,
      page,
      setMobileMenuTargetBlock,
      setSelection,
    ]
  );
  const executeCloseBlockStyler = useCallback(
    (event: globalThis.MouseEvent | TouchEvent) => {
      const commentInputHtml = document
        .getElementById("modal__menu")
        ?.querySelector(".commentInput");
      if (
        document.getElementById("blockStyler") &&
        (commentInputHtml === null || commentInputHtml === undefined) &&
        document.getElementById("mobileSideMenu") === null
      ) {
        closeBlockStyler(event);
      }
    },
    [closeBlockStyler]
  );

  useEffect(() => {
    inner?.addEventListener("click", executeCloseBlockStyler);
    inner?.addEventListener("touchend", executeCloseBlockStyler, {
      passive: true,
    });

    return () => {
      inner?.removeEventListener("click", executeCloseBlockStyler);
      inner?.removeEventListener("touchend", executeCloseBlockStyler);
    };
  }, [inner, executeCloseBlockStyler]);

  //mobile
  const prepareForChange = useCallback(() => {
    const mobileSelection = document.getSelection();
    const contentEditableHtml = document.getElementById(`${block.id}__contents`)
      ?.firstElementChild as HTMLElement | null | undefined;

    if (mobileSelection && contentEditableHtml) {
      selectContent(
        mobileSelection,
        block,
        contentEditableHtml,
        editBlock,
        page,
        null
      );
    }
  }, [block, editBlock, page]);
  const openMobileSideMenu = useCallback(
    (what: MobileSideMenuWhatType) => {
      setMobileSideMenu({
        block: block,
        what: what,
      });
    },
    [setMobileSideMenu, block]
  );
  document.onselectionchange = () => {
    if (isMobile()) {
      const SELECTION = document.getSelection();
      const notSelect =
        SELECTION?.anchorNode === SELECTION?.focusNode &&
        SELECTION?.anchorOffset === SELECTION?.focusOffset;
      if (notSelect) {
        setOpenMobileBlockStyler && setOpenMobileBlockStyler(false);
        setMobileMenuTargetBlock(null);
      }
    }
  };

  useEffect(() => {
    if (!isMobile()) {
      changeStylerStyle(frameHtml, block, setBlockStylerStyle);
      if (selection?.change) {
        openColor && setOpenColor(false);
        openLink && setOpenLink(false);
        openMenu && setOpenMenu(false);
        command.open &&
          setCommand({
            command: null,
            targetBlock: null,
            open: false,
          });
      }
    }
  }, [
    selection,
    block,
    changeStylerStyle,
    command.open,
    frameHtml,
    openColor,
    openLink,
    openMenu,
    setCommand,
  ]);
  return (
    <>
      <div id="blockStyler" style={blockStylerStyle} onClick={closeOtherBtn}>
        <div className="inner">
          <button
            title="button to change type"
            className="blockStyler__btn-type btn"
            onClick={onClickTypeBtn}
          >
            <ScreenOnly text="button to change type and value is current type" />
            <span>{getBlockType()}</span>
            <IoIosArrowDown className="arrow-down" />
          </button>
          <button
            title="button to add link "
            className="blockStyler__btn-link btn"
            onClick={() => {
              if (!isMobile()) setOpenLink(!openLink);
            }}
            onTouchStart={prepareForChange}
            onTouchEnd={() => openMobileSideMenu("ms_link")}
          >
            <ImArrowUpRight2 />
            <span>Link</span>
            <IoIosArrowDown className="arrow-down" />
          </button>
          <button
            title="button to comment"
            className="btn-comment btn"
            onClick={onClickCommentBtn}
            onTouchStart={prepareForChange}
            onTouchEnd={onClickCommentBtn}
          >
            <BsChatLeftText />
            <span>Comment</span>
          </button>
          <div className="style">
            <button
              title="button to change bold  style"
              className="style__btn-bold btn"
              onClick={() => {
                if (!isMobile()) onClickFontStyleBtn(bold);
              }}
              onTouchStart={prepareForChange}
              onTouchEnd={() => onClickFontStyleBtn(bold)}
            >
              B
            </button>
            <button
              title="button to change italic style "
              className="style__btn-italic btn"
              onClick={() => {
                if (!isMobile()) onClickFontStyleBtn(italic);
              }}
              onTouchStart={prepareForChange}
              onTouchEnd={() => onClickFontStyleBtn("italic")}
            >
              i
            </button>
            <button
              title="button to change underline style "
              className="style__btn-underline btn"
              onClick={() => {
                if (!isMobile()) onClickFontStyleBtn(underline);
              }}
              onTouchStart={prepareForChange}
              onTouchEnd={() => onClickFontStyleBtn(underline)}
            >
              U
            </button>
            <button
              title="button to change lineThrough"
              className="style__btn-lineThrough btn"
              onClick={() => {
                if (!isMobile()) onClickFontStyleBtn(lineThrough);
              }}
              onTouchStart={prepareForChange}
              onTouchEnd={() => onClickFontStyleBtn(lineThrough)}
            >
              S
            </button>
          </div>
          <button
            title="button to change color of content "
            className="blockStyler__btn-color btn"
            onClick={() => {
              if (!isMobile()) onClickColorBtn();
            }}
            onTouchStart={prepareForChange}
            onTouchEnd={() => {
              openMobileSideMenu("ms_color");
            }}
          >
            <span>A</span>
            <IoIosArrowDown className="arrow-down" />
          </button>
          <button
            title="button to open menu "
            className="blockStyler__btn-menu btn"
            onClick={() => {
              if (!isMobile()) onClickMenuBtn();
            }}
            onTouchStart={prepareForChange}
            onTouchEnd={() => {
              openMobileSideMenu("ms_moreMenu");
            }}
          >
            <ScreenOnly text="button to open menu" />
            <BsThreeDots />
          </button>
        </div>
      </div>
      {openLink && (
        <LinkLoader
          recentPagesId={recentPagesId}
          pages={pages}
          pagesId={pagesId}
          page={page}
          block={selection ? selection.block : block}
          closeLink={() => setOpenLink(false)}
          blockStylerStyle={blockStylerStyle}
          setSelection={setSelection}
        />
      )}
      {openColor && (
        <div id="block-styler__color" style={menuStyle}>
          <ColorMenu
            page={page}
            block={selection ? selection.block : block}
            selection={selection}
            setSelection={setSelection}
          />
        </div>
      )}
      {openMenu && (
        <Menu
          pages={pages}
          firstList={firstList}
          page={page}
          block={selection ? selection.block : block}
          userName={userName}
          setOpenMenu={setOpenMenu}
          modal={modal}
          setModal={setModal}
          setCommentBlock={setCommentBlock}
          setOpenRename={null}
          setSelection={setSelection}
          frameHtml={frameHtml}
          style={menuStyle}
        />
      )}
    </>
  );
};

export default React.memo(BlockStyler);
