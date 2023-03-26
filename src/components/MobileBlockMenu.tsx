import React, { useState, useEffect, useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";
import { CSSProperties } from "styled-components";
import {
  ActionContext,
  msmWhatType,
  ms_color,
  ms_moreMenu,
  ms_turnInto,
} from "../containers/NotionRouter";
import { Block, findBlock, makeNewBlock } from "../modules/notion";
import BlockStyler, { removeSelected, StylerCommonProps } from "./BlockStyler";

type MobileBlockMenuProps = Omit<StylerCommonProps, "block"> & {
  mobileMenuTargetBlock: Block;
  initialInnerHeight: number;
};

const MobileBlockMenu = ({
  pages,
  pagesId,
  firstList,
  userName,
  page,
  recentPagesId,
  modal,
  setModal,
  setCommentBlock,
  setTargetPageId,
  setModalStyle,
  command,
  setCommand,
  frameHtml,
  mobileMenuTargetBlock,
  setMobileSideMenu,
  setMobileSideMenuOpen,
  setMobileMenuTargetBlock,
  initialInnerHeight,
}: MobileBlockMenuProps) => {
  const { addBlock, editBlock, deleteBlock } =
    useContext(ActionContext).actions;
  const [targetBlock, setTargetBlock] = useState<Block>(mobileMenuTargetBlock);
  const [mbmStyle, setMBMstyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [openMobileBlockStyler, setOpenMobileBlockStyler] =
    useState<boolean>(false);
  const inner = document.getElementById("inner");
  // mobileBlockMenu 창이 열려있을 때, mobileBlockMenu 나 contentEditable 이외의 영역을 클릭 시, mobileBlockMenu 창을 닫는  동작 (+ Selection 이 있는 경우, 이를 해제 )
  inner?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    const mobileBlockMenuElement = target?.closest("#mobileBlockMenu");
    const contentEditableElement = target?.closest(".contentEditable");
    const conditionForClosing_notMobileBlock =
      mobileBlockMenuElement === null || mobileBlockMenuElement === undefined;

    const conditionForClosing_notContentEditable =
      (contentEditableElement === null ||
        contentEditableElement === undefined) &&
      target?.className !== "contentEditable";
    if (
      conditionForClosing_notMobileBlock &&
      conditionForClosing_notContentEditable
    ) {
      closeMM();
    }
  });

  const changeMBMstyle = (block: Block) => {
    const innerHeight = window.innerHeight;
    /**
     *Select event로 인해 가상키보드가 나타날 때 줄어든 window.innerHeight 의 값이자
     */
    const heightGap = initialInnerHeight - innerHeight;
    const blockElement = document.getElementById(`${block.id}-contents`);
    const blockElementDomRect = blockElement?.getClientRects()[0];
    const pageContentInner = frameHtml?.querySelector(".page__contents__inner");
    const pageContentInnerDomRect = pageContentInner?.getClientRects()[0];
    const frameDomRect = frameHtml?.getClientRects()[0];

    if (
      frameHtml !== null &&
      frameDomRect !== undefined &&
      pageContentInnerDomRect !== undefined &&
      blockElement !== null &&
      blockElementDomRect !== undefined
    ) {
      const top = blockElementDomRect.bottom + 16;
      const left = pageContentInnerDomRect.left - frameDomRect.left;
      let newTop = top;
      /**
       * 가상 키보드롤 인해 가려지는 부분의 y축 시작점 (기준: window)
       */
      const pointBlinding = frameDomRect.height - heightGap;
      const gap = blockElementDomRect.bottom + (16 + 32) - pointBlinding;
      if (gap >= 0) {
        frameHtml.scrollTo(0, blockElementDomRect.bottom + 10);
        newTop = blockElement.getClientRects()[0].bottom + 16;
      }
      setMBMstyle({
        top: `${newTop}px`,
        left: `${left}px`,
        width: `${pageContentInnerDomRect.width}px`,
      });
    }
  };

  const openMobileSideMenu = (what: msmWhatType) => {
    setMobileSideMenuOpen(true);
    const item = sessionStorage.getItem("mobileMenuTargetBlock");
    if (targetBlock === undefined && item !== null) {
      setMobileSideMenu({
        block: JSON.parse(item),
        what: what,
      });
      sessionStorage.setItem("msm_block", item);
    } else {
      sessionStorage.setItem("msm_block", JSON.stringify(targetBlock));
      setMobileSideMenu({
        block: targetBlock,
        what: what,
      });
    }
    closeMM();
  };
  /**
   * MobileBlockMenu 창을 닫는 함수
   */
  function closeMM() {
    setMobileMenuTargetBlock(null);
  }
  const addNewBlock = () => {
    if (page.blocksId !== null && targetBlock !== null) {
      const blockIndex = page.blocksId.indexOf(targetBlock.id);
      const newBlock = makeNewBlock(page, targetBlock, "");
      addBlock(page.id, newBlock, blockIndex + 1, targetBlock.id);
      closeMM();
    }
  };
  const removeBlock = () => {
    targetBlock !== null && deleteBlock(page.id, targetBlock, true);
    closeMM();
  };
  const onTouchCommentBtn = () => {
    const item = sessionStorage.getItem("mobileMenuTargetBlock");
    if (targetBlock === undefined && item !== null) {
      setCommentBlock(JSON.parse(item));
    } else {
      setCommentBlock(targetBlock);
    }
    setModal({
      open: true,
      what: "modalComment",
    });
    setModalStyle({
      ...mbmStyle,
    });
    const pageHtml = frameHtml?.querySelector(".page");
    if (pageHtml !== null && frameHtml !== null) {
      pageHtml?.setAttribute(
        "style",
        `translateY(${pageHtml.clientTop - frameHtml.clientTop - 50}px)`
      );
    }

    closeMM();
  };

  const detectSelectionInMobile = (SELECTION: Selection) => {
    const anchorNode = SELECTION.anchorNode;
    let contentEditableElement: HTMLElement | null | undefined = null;
    switch (anchorNode?.nodeType) {
      case 3:
        //text node
        const parentElement = anchorNode.parentElement;
        contentEditableElement = parentElement?.closest(".contentEditable");

        break;
      case 1:
        //element node
        break;
      default:
        break;
    }
    if (
      contentEditableElement !== null &&
      contentEditableElement !== undefined
    ) {
      const blockContentElement = contentEditableElement?.closest(".contents");
      if (blockContentElement !== null) {
        const id = blockContentElement.id;
        const index = id.indexOf("__contents");
        const blockId = id.slice(0, index);
        const newTargetBlock = findBlock(page, blockId).BLOCK;
        setTargetBlock(newTargetBlock);
        changeMBMstyle(newTargetBlock);
      }
    }
  };
  document.onselectionchange = (event) => {
    const SELECTION = document.getSelection();
    const notSelect =
      SELECTION?.anchorNode === SELECTION?.focusNode &&
      SELECTION?.anchorOffset === SELECTION?.focusOffset;
    if (SELECTION === null) {
      closeMM();
    }
    if (notSelect && SELECTION !== null) {
      detectSelectionInMobile(SELECTION);
    }
    if (SELECTION !== null && !notSelect && !openMobileBlockStyler) {
      setOpenMobileBlockStyler(true);
    }
  };
  useEffect(() => {
    if (mobileMenuTargetBlock !== undefined) {
      sessionStorage.setItem(
        "mobileMenuTargetBlock",
        JSON.stringify(mobileMenuTargetBlock)
      );
      changeMBMstyle(mobileMenuTargetBlock);
    } else {
      const item = sessionStorage.getItem("mobileMenuTargetBlock");
      if (item !== null) {
        const block = JSON.parse(item);
        setTargetBlock(block);
        changeMBMstyle(block);
      }
    }
    if (openMobileBlockStyler) {
      setOpenMobileBlockStyler(false);
      removeSelected(frameHtml, mobileMenuTargetBlock, editBlock, page, null);
    }
  }, [mobileMenuTargetBlock]);
  return (
    <>
      <div id="mobileBlockMenu" style={mbmStyle}>
        {!openMobileBlockStyler ? (
          <div className="inner">
            <button
              className="btn-add-block"
              onTouchEnd={addNewBlock}
              title="Click  to add a block below"
            >
              <div className="mobileBlock__btn__inner">
                <AiOutlinePlus />
              </div>
            </button>
            {targetBlock?.type !== "page" && (
              <button
                name="comment"
                className="btn-comment"
                onTouchEnd={onTouchCommentBtn}
              >
                <div className="mobileBlock__btn__inner">
                  <BiCommentDetail />
                </div>
              </button>
            )}
            <button
              className="btn-turn-into"
              onTouchEnd={() => openMobileSideMenu(ms_turnInto)}
              name="turn into"
            >
              <div className="mobileBlock__btn__inner">
                <div className="text">Turn into</div>
                <div className="arrow-down">
                  <TiArrowSortedDown />
                </div>
              </div>
            </button>
            <button
              className="btn-delete"
              onTouchEnd={removeBlock}
              name="delete"
            >
              <div className="mobileBlock__btn__inner">
                <RiDeleteBin6Line />
              </div>
            </button>
            <button
              name="color"
              className="underline menu__editBtn btn-color "
              onTouchEnd={() => openMobileSideMenu(ms_color)}
            >
              <div className="mobileBlock__btn__inner">
                <div className="text">Color</div>
                <div className="arrow-down">
                  <TiArrowSortedDown />
                </div>
              </div>
            </button>
            <button
              className="btn-open-menu"
              aria-details="open menu"
              onTouchEnd={() => openMobileSideMenu(ms_moreMenu)}
            >
              <div className="mobileBlock__btn__inner">
                <div className="text">more</div>
              </div>
            </button>
          </div>
        ) : (
          targetBlock !== null && (
            <BlockStyler
              pages={pages}
              pagesId={pagesId}
              firstList={firstList}
              userName={userName}
              page={page}
              recentPagesId={recentPagesId}
              block={targetBlock}
              modal={modal}
              setModal={setModal}
              setModalStyle={setModalStyle}
              command={command}
              setCommand={setCommand}
              setCommentBlock={setCommentBlock}
              setTargetPageId={setTargetPageId}
              selection={null}
              setSelection={null}
              frameHtml={frameHtml}
              mobileMenuTargetBlock={mobileMenuTargetBlock}
              setMobileSideMenu={setMobileSideMenu}
              setMobileSideMenuOpen={setMobileSideMenuOpen}
              setMobileMenuTargetBlock={setMobileMenuTargetBlock}
              setOpenMobileBlockStyler={setOpenMobileBlockStyler}
            />
          )
        )}
      </div>
    </>
  );
};

export default React.memo(MobileBlockMenu);
