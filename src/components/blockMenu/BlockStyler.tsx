import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";

import { BsChatLeftText } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { ImArrowUpRight2 } from "react-icons/im";

import {
  ScreenOnly,
  BlockStylerSideMenu,
  CommentInput,
  MobileSideMenuModal,
} from "../index";
import { ActionContext } from "../../contexts";
import {
  MenuAndBlockStylerCommonProps,
  ModalType,
  ModalTargetType,
} from "../../types";
import {
  findBlock,
  getContent,
  isInTarget,
  isMobile,
  removeSelected,
  selectContent,
} from "../../utils";

import "../../assets/blockStyler.scss";
import { INITIAL_MODAL } from "../../constants";

export type BlockStylerProps = MenuAndBlockStylerCommonProps & {
  pagesId: string[];
  recentPagesId: string[] | null;
  setModal: Dispatch<SetStateAction<ModalType>>;
  closeModal: () => void;
  templateHtml: HTMLElement | null;
};
const BlockStyler = ({ ...props }: BlockStylerProps) => {
  const { editBlock } = useContext(ActionContext).actions;
  const { page, block } = props;

  const [sideMenuModal, setSideMenuModal] = useState<ModalType>(INITIAL_MODAL);

  type BlockFontWeightType = "bold" | "initial";
  type BlockFontStyleType = "italic" | "initial";
  type TextDecoType = "underline" | "lineThrough";

  const closeSideMenu = () => setSideMenuModal(INITIAL_MODAL);

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
          editBlock(page.id, editedBlock);
        }
      }
    }
  }, [block, editBlock, page.id]);

  const getBlockType = () => {
    const { type } = findBlock(page, block.id).BLOCK;
    switch (type) {
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

  const openSideMenu = (sideMenu: ModalTargetType) =>
    setSideMenuModal({ open: true, target: sideMenu, block: block });

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

        const editedBlock = getContent(findBlock(page, block.id).BLOCK);
        editBlock(page.id, editedBlock);
      }
    },
    [block, page, editBlock, removeOtherTextDeco]
  );

  const isInBlockStyler = useCallback(
    (event: globalThis.MouseEvent) => {
      const target = [
        "#block-styler",
        `#${block.id}__contents`,
        "#menu",
        "#menu-command",
        "#menu-color",
        ".comment-input",
        "#loader-link",
        "#mobile-side-menu",
      ];

      return target.map((v) => isInTarget(event, v)).some((v) => v);
    },
    [block.id]
  );
  const closeBlockStyler = useCallback(() => {
    const editedBlock = findBlock(page, block.id).BLOCK;
    removeSelected(editedBlock, editBlock, page);
    props.closeModal();
  }, [block, editBlock, page, props]);

  const handleCloseBlockStyler = useCallback(
    (event: globalThis.MouseEvent) => {
      if (!isInBlockStyler(event)) {
        sideMenuModal.open ? closeSideMenu() : closeBlockStyler();
      }
    },
    [isInBlockStyler, sideMenuModal.open, closeBlockStyler]
  );

  useEffect(() => {
    document.addEventListener("click", handleCloseBlockStyler);
    return () => {
      document.removeEventListener("click", handleCloseBlockStyler);
    };
  }, [handleCloseBlockStyler]);

  return (
    <>
      <div
        id="block-styler"
        style={{
          display: sideMenuModal.target === "commentInput" ? "none" : "block",
        }}
      >
        <div className="inner">
          <button
            title="button to change type"
            className="blockStyler__btn-type btn"
            onMouseDown={prepareForChange}
            onTouchStart={prepareForChange}
            onClick={() => openSideMenu("command")}
          >
            <ScreenOnly text="button to change type and value is current type" />
            <span>{getBlockType()}</span>
            <IoIosArrowDown className="arrow-down" />
          </button>
          <button
            title="button to add link "
            className="blockStyler__btn-link btn"
            onClick={() => openSideMenu("linkLoader")}
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
        </div>
      </div>
      {sideMenuModal.target &&
        sideMenuModal.target !== "commentInput" &&
        (isMobile() ? (
          <MobileSideMenuModal
            sideMenuModal={sideMenuModal}
            setSideMenuModal={setSideMenuModal}
          >
            <BlockStylerSideMenu
              {...props}
              block={findBlock(page, block.id).BLOCK}
              sideMenuModal={sideMenuModal}
              closeSideMenu={() => {
                setSideMenuModal((prev) => ({ ...prev, open: false }));
              }}
            />
          </MobileSideMenuModal>
        ) : (
          <BlockStylerSideMenu
            {...props}
            block={findBlock(page, block.id).BLOCK}
            sideMenuModal={sideMenuModal}
            closeSideMenu={closeSideMenu}
          />
        ))}
      {sideMenuModal.target === "commentInput" && (
        <CommentInput
          {...props}
          pageId={props.page.id}
          commentBlock={props.block}
          addOrEdit="add"
          mainComment={null}
          subComment={null}
          allComments={props.block.comments}
        />
      )}
    </>
  );
};

export default React.memo(BlockStyler);
