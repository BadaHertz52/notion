import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from "react";
import { BsChatLeftText, BsThreeDots } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { ImArrowUpRight2 } from "react-icons/im";
import { CSSProperties } from "styled-components";
import ColorMenu from "./ColorMenu";
import { Command } from "./Frame";
import {
  ActionContext,
  msmWhatType,
  selectionType,
} from "../containers/NotionRouter";
import Menu, { MenuAndBlockStylerCommonProps } from "./Menu";
import { Block, Page } from "../modules/notion";
import LinkLoader from "./LinkLoader";
import { mobileSideMenuType } from "../containers/NotionRouter";
import { isMobile, selectContent } from "./BlockComponent";
/**
 * block의 content에서 selected class를 삭제하는 함수
 */
export function removeSelected(
  frameHtml: HTMLElement | null,
  block: Block,
  editBlock: (pageId: string, block: Block) => void,
  page: Page,
  setSelection: React.Dispatch<
    React.SetStateAction<selectionType | null>
  > | null
) {
  // 변경된 내용이 있고, selected 만 제거하면 되는 경우
  const blockContentHtml = frameHtml?.querySelector(`#${block.id}-contents`);
  const listOfSelected = blockContentHtml?.querySelectorAll(".selected");
  if (listOfSelected !== undefined && listOfSelected[0] !== undefined) {
    listOfSelected.forEach((selectedHtml: Element) => {
      if (selectedHtml.classList.length > 1) {
        selectedHtml?.classList.remove("selected");
      } else {
        selectedHtml.outerHTML = selectedHtml.innerHTML;
      }
    });
  } else {
    const spanElements = blockContentHtml?.querySelectorAll("span");
    if (spanElements !== undefined) {
      spanElements.forEach((element: HTMLSpanElement) => {
        if (element.className === "") {
          element.outerHTML = element.innerHTML;
        }
      });
    }
  }
  const editedBlock = getContent(block);
  editBlock(page.id, editedBlock);
  setSelection !== null && setSelection(null);
}
/**
 * BlockStyler의 타켓인 block에 대한 내용을 담고 있는 element중 mainBlock element의 domRect을 반환하는 함수
 * @returns DOMRect | undefined
 */
export const getMainBlockDomRect = (
  frameHtml: HTMLDivElement | null,
  block: Block
): DOMRect | undefined => {
  const blockHtml = frameHtml?.querySelector(`#block-${block.id}`);
  const mainBlockHtml = block.type.includes("List")
    ? blockHtml?.parentElement?.parentElement
    : blockHtml?.querySelector(".mainBlock");
  const mainBlockDomRect = mainBlockHtml?.getClientRects()[0];
  return mainBlockDomRect;
};
export const changeStylerStyle = (
  frameHtml: HTMLDivElement | null,
  block: Block,
  setStyle: Dispatch<SetStateAction<CSSProperties | undefined>>
) => {
  const mainBlockDomRect = getMainBlockDomRect(frameHtml, block);
  const pageContentInner = frameHtml?.querySelector(".page__contents__inner");
  const pageContentDomRect = pageContentInner?.getClientRects()[0];
  if (
    frameHtml !== null &&
    mainBlockDomRect !== undefined &&
    pageContentDomRect !== undefined
  ) {
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
};
/**
 *  select 하거나, 이를 취소한 경우, 변경된 블럭의 contents를 가져오는  함수로 만약 BlockStyler로 스타일을 변경하다면, 스타일 변경 후에 해당 함수를 사용해야 한다.
 * @param block
 * @returns
 */
export const getContent = (block: Block): Block => {
  const contentEditableHtml = document.getElementById(
    `${block.id}-contents`
  )?.firstElementChild;
  let newBlock = block;
  if (contentEditableHtml !== null && contentEditableHtml !== undefined) {
    const children = contentEditableHtml.childNodes;
    let contentsArr: string[] = [];
    children.forEach((c: Node) => {
      if (c.nodeType === 3) {
        c.nodeValue !== null && contentsArr.push(c.nodeValue);
      }
      //span
      if (c.nodeType === 1) {
        const element = c as Element;
        contentsArr.push(element.outerHTML);
      }
    });
    const newBlockContents = contentsArr.join("");
    newBlock = {
      ...block,
      contents: newBlockContents,
      editTime: JSON.stringify(Date.now()),
    };
  }
  return newBlock;
};
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
  selection: selectionType | null;
  setSelection: Dispatch<SetStateAction<selectionType | null>> | null;
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
  setTargetPageId,
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
  type fontWeightType = typeof bold | typeof initial;
  type fontStyleType = typeof italic | typeof initial;
  type textDecoType = typeof underline | typeof lineThrough;
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
      case "todo done":
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

  const closeOtherBtn = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target !== null && !isMobile()) {
      const clickTypeBtn = target.closest(".blockStyler__btn-type");
      const clickLinkBtn = target.closest(".blockStyler__btn-link");
      const clickMenuBtn = target.closest(".blockStyler__btn-menu");
      const clickColorBtn = target.closest(".blockStyler__btn-color");
      !clickTypeBtn &&
        setCommand({
          boolean: false,
          command: null,
          targetBlock: null,
        });

      !clickLinkBtn && setOpenLink(false);
      !clickMenuBtn && setOpenMenu(false);
      !clickColorBtn && setOpenColor(false);
    }
  };

  const onClickTypeBtn = () => {
    command.boolean
      ? setCommand({
          boolean: false,
          command: null,
          targetBlock: null,
        })
      : setCommand({
          boolean: true,
          command: null,
          targetBlock: block,
        });
  };
  const changeCommentStyle = () => {
    const mainBlockDomRect = getMainBlockDomRect(frameHtml, block);
    if (
      mainBlockDomRect !== undefined &&
      frameHtml !== null &&
      frameHtml !== undefined
    ) {
      const pageContentDomRect = pageContentEl?.getClientRects()[0];
      const frameDomRect = frameHtml.getClientRects()[0];
      const top = mainBlockDomRect.bottom + 8;
      const innerHeight = window.innerHeight;
      const remainHeight = innerHeight - (top + 50);

      if (pageContentDomRect !== undefined) {
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
        if (pageHtml !== null && frameHtml !== null) {
          pageHtml?.setAttribute(
            "style",
            `translateY(${pageHtml.clientTop - frameHtml.clientTop - 50}px)`
          );
        }
      }
    }
  };
  const onClickCommentBtn = () => {
    changeCommentStyle();
    setModal({
      open: true,
      what: "modalComment",
    });
    setCommentBlock(block);
    setSelection !== null && setSelection(null);
    isMobile() && setMobileMenuTargetBlock(null);
  };

  const changeMenuStyle = (param: menuType) => {
    if (blockStyler !== null && frameHtml !== null && frameHtml !== undefined) {
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
  };
  const onClickColorBtn = () => {
    if (openColor) {
      setOpenColor(false);
    } else {
      changeMenuStyle(color);
      setOpenColor(true);
    }
  };
  const onClickMenuBtn = () => {
    if (openMenu) {
      setOpenMenu(false);
    } else {
      changeMenuStyle(menu);
      setOpenMenu(true);
    }
  };

  window.onresize = () => {
    if (isMobile()) {
      changeStylerStyle(frameHtml, block, setBlockStylerStyle);
      openMenu && changeMenuStyle(menu);
      openColor && changeMenuStyle(color);
    }
  };

  /**
   *  textDeco 스타일을 지정할 경우, 기존에 textDeco가 지정된 element의 클래스를 변경하거나, outerHtml의 값을 변경하는 함수
   * @param deco  삭제하고자 하는 , 기존에 지정된 textDeco 스타일
   * * @param selectedHtml : 선택된 node
   */
  const removeOtherTextDeco = (
    deco: textDecoType,
    selectedHtml: HTMLElement
  ) => {
    const decoSpan = selectedHtml.querySelectorAll(`.${deco}`);
    if (decoSpan[0] !== undefined) {
      decoSpan.forEach((e: Element) => {
        if (e.classList.length === 1) {
          e.outerHTML = e.innerHTML;
        } else {
          e.classList.remove(deco);
        }
      });
    }
  };
  /**
   * 클릭한 버튼에 따라, 선택된 내용의 fontWeight, fontstyle , textDeco를 변경하는 함수
   * @param btnName 클릭한 버튼의 이름
   */
  const onClickFontStyleBtn = (
    btnName: fontWeightType | fontStyleType | textDecoType
  ) => {
    const listOfSelected = document.querySelectorAll(
      ".selected"
    ) as NodeListOf<HTMLElement>;
    if (listOfSelected[0] !== undefined) {
      listOfSelected.forEach((selectedHtml: HTMLElement) => {
        const selectedSpan = selectedHtml.querySelectorAll(`.${btnName}`);
        if (selectedSpan[0] !== undefined) {
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
      setSelection !== null &&
        setSelection({
          block: editedBlock,
          change: true,
        });
    }
  };
  const executeCloseBlockStyler = (
    event: globalThis.MouseEvent | TouchEvent
  ) => {
    const commentInputHtml = document
      .getElementById("modal__menu")
      ?.querySelector(".commentInput");
    if (
      document.getElementById("blockStyler") !== null &&
      (commentInputHtml == null || commentInputHtml === undefined) &&
      document.getElementById("mobileSideMenu") === null
    ) {
      closeBlockStyler(event);
    }
  };
  inner?.addEventListener("click", (event) => {
    executeCloseBlockStyler(event);
  });
  inner?.addEventListener("touchend", (event) => {
    executeCloseBlockStyler(event);
  });

  /**
   * 유저가 blockStyler를 통해 여는 sideMenu의 영역 밖을을 클릭 할 경우 열려있는 sideMenu 창을 닫는 함수
   * @param target event.target <HTMLElement>
   * @param htmlId
   */
  const closeSideMenu = (target: HTMLElement, htmlId: sideMenuIdType) => {
    const isIn =
      target.id === htmlId ? true : target.closest(`#${htmlId}`) !== null;
    if (!isIn) {
      switch (htmlId) {
        case "block-styler__color":
          setOpenColor(false);
          break;
        case "block__commandBlock":
          setCommand({
            boolean: false,
            command: null,
            targetBlock: null,
          });
          break;
        case "linkLoader":
          setOpenLink(false);
          break;
        case "menu__main":
          const isInSideMenu =
            target.id === "sideMenu"
              ? true
              : target.closest("#sideMenu") !== null;
          !isInSideMenu && setOpenMenu(false);
          break;
        default:
          break;
      }
    }
  };
  /**
   * 화면상에서 클릭한 곳이 blockStyler외의 곳일 경우, blockStyler 에 의한 변경사항의 여부에 따라 변경 사항이 있으면 블록의 contents 중 선택된 영역을 가리키는 selected 클래스를 제거하고, 변경이 없는 경우 원래의 블록으로 되돌린 후, selection 값은 null로 변경하여 BlockStyler component의 실행을 종료하는 함수
   * @param event globalThis.MouseEvent
   */
  function closeBlockStyler(event: globalThis.MouseEvent | TouchEvent) {
    const target = event.target as HTMLElement | null;
    if (target !== null) {
      const isInBlockStyler = target.closest("#blockStyler") !== null;
      const isInMenuComponent = target.closest(".menu") !== null;
      const isInMobileBlockMenu = target.closest("#mobileBlockMenu") !== null;
      const isInContents = target.closest(".contents") !== null;
      if (
        !isInBlockStyler &&
        !isInMenuComponent &&
        !isInMobileBlockMenu &&
        !isInContents
      ) {
        const colorMenuHtml = document.getElementById("block-styler__color");
        const commandBlockHtml = document.getElementById("block__commandBlock");
        const mainMenu = document.getElementById("mainMenu");
        const linkLoaderHtml = document.getElementById("linkLoader");

        if (
          colorMenuHtml == null &&
          commandBlockHtml === null &&
          mainMenu === null &&
          linkLoaderHtml == null
        ) {
          // 조건 : web에서 sideMenu가 닫혀 있을 경우
          removeSelected(frameHtml, block, editBlock, page, setSelection);
          setSelection !== null && setSelection(null);
          openMenu && setMobileMenuTargetBlock(null);
        } else {
          const eventTarget = event.target as HTMLElement | null;
          if (eventTarget !== null) {
            openColor && closeSideMenu(eventTarget, "block-styler__color");
            openLink && closeSideMenu(eventTarget, "linkLoader");
            openMenu && closeSideMenu(eventTarget, "menu__main");
            command.boolean &&
              closeSideMenu(eventTarget, "block__commandBlock");
          }
        }
      }
    }
  }
  //mobile
  const prepareForChange = () => {
    const mobileSelection = document.getSelection();
    const contentEditableHtml = document.getElementById(`${block.id}-contents`)
      ?.firstElementChild as HTMLElement | null | undefined;

    if (
      mobileSelection !== null &&
      contentEditableHtml !== null &&
      contentEditableHtml !== undefined
    ) {
      selectContent(
        mobileSelection,
        block,
        contentEditableHtml,
        editBlock,
        page,
        null
      );
    }
  };
  const openMobileSideMenu = (what: msmWhatType) => {
    setMobileSideMenu({
      block: block,
      what: what,
    });
  };
  document.onselectionchange = () => {
    if (isMobile()) {
      const SELECTION = document.getSelection();
      const notSelect =
        SELECTION?.anchorNode === SELECTION?.focusNode &&
        SELECTION?.anchorOffset === SELECTION?.focusOffset;
      if (notSelect) {
        setOpenMobileBlockStyler !== null && setOpenMobileBlockStyler(false);
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
        command.boolean &&
          setCommand({
            command: null,
            targetBlock: null,
            boolean: false,
          });
      }
    }
  }, [selection]);
  return (
    <>
      <div
        id="blockStyler"
        style={blockStylerStyle}
        onClick={(event) => closeOtherBtn(event)}
      >
        <div className="inner">
          <button
            className="blockStyler__btn-type btn"
            onClick={onClickTypeBtn}
          >
            <span>{getBlockType()}</span>
            <IoIosArrowDown className="arrow-down" />
          </button>
          <button
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
            className="blockStyler__btn-menu btn"
            onClick={() => {
              if (!isMobile()) onClickMenuBtn();
            }}
            onTouchStart={prepareForChange}
            onTouchEnd={() => {
              openMobileSideMenu("ms_moreMenu");
            }}
          >
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
          setTargetPageId={setTargetPageId}
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
