import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { CSSProperties } from "styled-components";
import { BsChatLeftText, BsThreeDots } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { ImArrowUpRight2 } from "react-icons/im";

import { ScreenOnly, Menu, ColorMenu, LinkLoader } from "../index";
import { ActionContext } from "../../contexts";
import {
  Block,
  MenuAndBlockStylerCommonProps,
  MobileSideMenuWhat,
  ModalType,
  SelectionType,
  StylerCommonProps,
} from "../../types";
import {
  getContent,
  isMobile,
  removeSelected,
  selectContent,
} from "../../utils";
import { SESSION_KEY } from "../../constants";
import BlockStylerSideMenu from "./BlockStylerSideMenu";

import "../../assets/blockStyler.scss";

export type BlockStylerSideMenuType =
  | "command"
  | "link"
  | "color"
  | "menu"
  | "commentInput"
  | undefined;
export type BlockStylerProps = Omit<
  MenuAndBlockStylerCommonProps,
  "setCommentBlock"
> & {
  pagesId: string[];
  recentPagesId: string[] | null;
  setModal: Dispatch<SetStateAction<ModalType>>;
  closeModal: () => void;
  templateHtml: HTMLElement | null;
};
const BlockStyler = ({ ...props }: BlockStylerProps) => {
  const { editBlock } = useContext(ActionContext).actions;
  const {
    pages,
    pagesId,
    firstList,
    userName,
    page,
    recentPagesId,
    block,
    frameHtml,
    setModal,
  } = props;
  //selected 표시, 선택된 부분 수정 시 editBlock, setModal로 block을 업데이트하면 maxMim 렌더링 오류가 나는 것을 피하기 위해 따로 targetBlock을 사용
  const [targetBlock, setTargetBlock] = useState<Block>(block);
  const [sideMenu, setSideMenu] = useState<BlockStylerSideMenuType>(undefined);

  type BlockFontWeightType = "bold" | "initial";
  type BlockFontStyleType = "italic" | "initial";
  type TextDecoType = "underline" | "lineThrough";

  const closeSideMenu = () => setSideMenu(undefined);

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

  const openSideMenu = (sideMenu: BlockStylerSideMenuType) =>
    setSideMenu(sideMenu);

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

        const editedBlock = getContent(targetBlock);
        setTargetBlock(editedBlock);
      }
    },
    [block, editBlock, page.id, removeOtherTextDeco]
  );

  // /**
  //  * 유저가 blockStyler를 통해 여는 sideMenu의 영역 밖을을 클릭 할 경우 열려있는 sideMenu 창을 닫는 함수
  //  * @param target event.target <HTMLElement>
  //  * @param htmlId
  //  */
  // const closeSideMenu = useCallback(
  //   (target: HTMLElement, htmlId: sideMenuIdType) => {
  //     const isIn = target.id === htmlId ? true : target.closest(`#${htmlId}`);
  //     if (!isIn) {
  //       switch (htmlId) {
  //         case "block-styler__color":
  //           setOpenColor(false);
  //           break;
  //         case "block__commandMenu":
  //           // setCommand({
  //           //   open: false,
  //           //   command: null,
  //           //   targetBlock: null,
  //           // });
  //           break;
  //         case "linkLoader":
  //           setOpenLink(false);
  //           break;
  //         case "menu__main":
  //           const isInSideMenu =
  //             target.id === "sideMenu" ? true : target.closest("#sideMenu");
  //           !isInSideMenu && setOpenMenu(false);
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   },
  //   []
  // );
  // /**
  //  * 화면상에서 클릭한 곳이 blockStyler외의 곳일 경우, blockStyler 에 의한 변경사항의 여부에 따라 변경 사항이 있으면 블록의 contents 중 선택된 영역을 가리키는 selected 클래스를 제거하고, 변경이 없는 경우 원래의 블록으로 되돌린 후, selection 값은 null로 변경하여 BlockStyler component의 실행을 종료하는 함수
  //  * @param event globalThis.MouseEvent
  //  */
  // const closeBlockStyler = useCallback(
  //   (event: globalThis.MouseEvent | TouchEvent) => {
  //     const target = event.target as HTMLElement | null;
  //     if (target) {
  //       const isInBlockStyler = target.closest("#blockStyler");
  //       const isInMenuComponent = target.closest(".menu");
  //       const isInMobileMenu = target.closest("#mobileMenu");
  //       const isInContents = target.closest(".contents");
  //       if (
  //         !isInBlockStyler &&
  //         !isInMenuComponent &&
  //         !isInMobileMenu &&
  //         !isInContents
  //       ) {
  //         const colorMenuHtml = document.getElementById("block-styler__color");
  //         const commandBlockHtml =
  //           document.getElementById("block__commandMenu");
  //         const mainMenu = document.getElementById("mainMenu");
  //         const linkLoaderHtml = document.getElementById("linkLoader");

  //         if (
  //           !colorMenuHtml &&
  //           !commandBlockHtml &&
  //           !mainMenu &&
  //           !linkLoaderHtml
  //         ) {
  //           // 조건 : web에서 sideMenu가 닫혀 있을 경우
  //           //TODO -  수정
  //           //removeSelected(frameHtml, block, editBlock, page, setSelection);
  //           //setSelection && setSelection(null);
  //           if (openMenu) {
  //             //setMobileMenuTargetBlock(null);
  //           }
  //         } else {
  //           const eventTarget = event.target as HTMLElement | null;
  //           if (eventTarget) {
  //             openColor && closeSideMenu(eventTarget, "block-styler__color");
  //             openLink && closeSideMenu(eventTarget, "linkLoader");
  //             openMenu && closeSideMenu(eventTarget, "menu__main");
  //             //command.open && closeSideMenu(eventTarget, "block__commandMenu");
  //           }
  //         }
  //       }
  //     }
  //   },
  //   [
  //     block,
  //     closeSideMenu,

  //     editBlock,
  //     frameHtml,
  //     openColor,
  //     openLink,
  //     openMenu,
  //     page,
  //   ]
  // );

  // const executeCloseBlockStyler = useCallback(
  //   (event: globalThis.MouseEvent | TouchEvent) => {
  //     if (
  //       document.getElementById("blockStyler") &&
  //       !document.getElementById("mobileSideMenu")
  //     ) {
  //       closeBlockStyler(event);
  //     }
  //   },
  //   [closeBlockStyler]
  // );

  const prepareForChange = useCallback(() => {
    const selectedEl = document.querySelector(".selected");
    if (!selectedEl) {
      const selection = document.getSelection();
      const contentEditableHtml = document.getElementById(
        `${block.id}__contents`
      )?.firstElementChild as HTMLElement | null | undefined;

      if (selection && contentEditableHtml) {
        const editedBlock = selectContent(
          selection,
          block,
          contentEditableHtml
        );
        if (editedBlock) {
          setTargetBlock(editedBlock);
        }
      }
    }
  }, [block]);

  // useEffect(() => {
  //   // document.addEventListener("click", executeCloseBlockStyler);
  //   // document.addEventListener("touchend", executeCloseBlockStyler, {
  //   //   passive: true,
  //   // });

  //   return () => {
  //     // document.removeEventListener("click", executeCloseBlockStyler);
  //     // document.removeEventListener("touchend", executeCloseBlockStyler);
  //   };
  // }, [executeCloseBlockStyler, targetBlock, page, editBlock]);

  return (
    <>
      <div
        id="blockStyler"
        style={{ display: sideMenu === "commentInput" ? "none" : "block" }}
      >
        <div className="inner">
          <button
            title="button to change type"
            className="blockStyler__btn-type btn"
            onMouseDown={prepareForChange}
            onClick={() => openSideMenu("command")}
          >
            <ScreenOnly text="button to change type and value is current type" />
            <span>{getBlockType()}</span>
            <IoIosArrowDown className="arrow-down" />
          </button>
          <button
            title="button to add link "
            className="blockStyler__btn-link btn"
            onClick={() => openSideMenu("link")}
            onMouseDown={prepareForChange}
            onTouchStart={prepareForChange}
          >
            <ImArrowUpRight2 />
            <span>Link</span>
            <IoIosArrowDown className="arrow-down" />
          </button>
          <button
            title="button to comment"
            className="btn-comment btn"
            onClick={() => openSideMenu("commentInput")}
            onMouseDown={prepareForChange}
            onTouchStart={prepareForChange}
          >
            <BsChatLeftText />
            <span>Comment</span>
          </button>
          <div className="style">
            <button
              title="button to change bold  style"
              className="style__btn-bold btn"
              onClick={() => onClickFontStyleBtn("bold")}
              onMouseDown={prepareForChange}
              onTouchStart={prepareForChange}
            >
              B
            </button>
            <button
              title="button to change italic style "
              className="style__btn-italic btn"
              onClick={() => onClickFontStyleBtn("italic")}
              onMouseDown={prepareForChange}
              onTouchStart={prepareForChange}
            >
              i
            </button>
            <button
              title="button to change underline style "
              className="style__btn-underline btn"
              onClick={() => onClickFontStyleBtn("underline")}
              onMouseDown={prepareForChange}
              onTouchStart={prepareForChange}
            >
              U
            </button>
            <button
              title="button to change lineThrough"
              className="style__btn-lineThrough btn"
              onClick={() => onClickFontStyleBtn("lineThrough")}
              onMouseDown={prepareForChange}
              onTouchStart={prepareForChange}
            >
              S
            </button>
          </div>
          <button
            title="button to change color of content "
            className="blockStyler__btn-color btn"
            onClick={() => openSideMenu("color")}
            onMouseDown={prepareForChange}
            onTouchStart={prepareForChange}
          >
            <span>A</span>
            <IoIosArrowDown className="arrow-down" />
          </button>
          <button
            title="button to open menu "
            className="blockStyler__btn-menu btn"
            onClick={() => openSideMenu("menu")}
            onMouseDown={prepareForChange}
            onTouchStart={prepareForChange}
          >
            <ScreenOnly text="button to open menu" />
            <BsThreeDots />
          </button>
        </div>
      </div>
      <BlockStylerSideMenu
        {...props}
        block={targetBlock}
        sideMenu={sideMenu}
        closeSideMenu={closeSideMenu}
      />
    </>
  );
};

export default React.memo(BlockStyler);
