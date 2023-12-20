import React, { useState, useEffect, useContext, useCallback } from "react";

import { CSSProperties } from "styled-components";

import { AiOutlinePlus } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";

import { ScreenOnly, BlockStyler } from "../index";

import { ActionContext } from "../../contexts";
import { Block, MobileSideMenuWhat, StylerCommonProps } from "../../types";
import { makeNewBlock, findBlock } from "../../utils";

import "../../assets/mobileMenu.scss";
import { SESSION_KEY } from "../../constants";

type MobileMenuProps = Omit<StylerCommonProps, "block"> & {
  mobileMenuTargetBlock: Block;
  initialInnerHeight: number;
};

const MobileMenu = ({
  pages,
  pagesId,
  firstList,
  userName,
  page,
  recentPagesId,

  setCommentBlock,
  setModalStyle,
  command,
  setCommand,
  frameHtml,
  mobileMenuTargetBlock,
  setMobileSideMenu,
  setMobileMenuTargetBlock,
  initialInnerHeight,
}: MobileMenuProps) => {
  const { addBlock, editBlock, deleteBlock } =
    useContext(ActionContext).actions;
  const [targetBlock, setTargetBlock] = useState<Block>(mobileMenuTargetBlock);
  const [mbmStyle, setMBMstyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [openMobileBlockStyler, setOpenMobileBlockStyler] =
    useState<boolean>(false);
  const inner = document.getElementById("notion__inner");

  /**
   * MobileMenu 창을 닫는 함수
   */
  const closeMM = useCallback(() => {
    setMobileMenuTargetBlock(null);
  }, [setMobileMenuTargetBlock]);
  // mobileMenu 창이 열려있을 때, mobileMenu 나 contentEditable 이외의 영역을 클릭 시, mobileMenu 창을 닫는  동작 (+ Selection 이 있는 경우, 이를 해제 )
  const closeMobileMenu = useCallback(
    (event: TouchEvent) => {
      const target = event.target as HTMLElement | null;
      const mobileMenuElement = target?.closest("#mobileMenu");
      const blockEl = target?.closest(`#block-${targetBlock.id}`);
      const conditionForClosing_notMobileBlock = !mobileMenuElement;
      const conditionForClosing_notContentEditable =
        !blockEl && target?.className !== "contentEditable";
      if (
        conditionForClosing_notMobileBlock &&
        conditionForClosing_notContentEditable
      ) {
        closeMM();
      }
    },
    [closeMM, targetBlock.id]
  );

  const changeMBMstyle = useCallback(
    (block: Block) => {
      const innerHeight = window.innerHeight;
      /**
       *Select event로 인해 가상키보드가 나타날 때 줄어든 window.innerHeight 의 값
       */
      const heightGap = initialInnerHeight - innerHeight;
      const blockElement = document.getElementById(`${block.id}__contents`);
      const blockElementDomRect = blockElement?.getClientRects()[0];
      const pageHeaderEl = frameHtml?.querySelector(".page__header_notCover");
      const pageHeaderElDomRect = pageHeaderEl?.getBoundingClientRect();
      const frameDomRect = frameHtml?.getClientRects()[0];
      if (
        frameHtml &&
        frameDomRect &&
        pageHeaderElDomRect &&
        blockElement &&
        blockElementDomRect
      ) {
        const mobileMenuHeight = 36;
        const top =
          blockElementDomRect.top +
          frameHtml.scrollTop -
          frameDomRect.top -
          blockElementDomRect.height -
          mobileMenuHeight;
        const left = pageHeaderElDomRect.left;
        /**
         * 가상 키보드롤 인해 가려지는 부분의 y축 시작점 (기준: window)
         */
        const pointBlinding = frameDomRect.height - heightGap;
        const gap = blockElementDomRect.bottom + (16 + 32) - pointBlinding;
        if (gap >= 0) {
          frameHtml.scrollTo(0, blockElementDomRect.bottom + 10);
        }
        setMBMstyle({
          top: top,
          left: left,
          width: pageHeaderElDomRect.width,
          height: mobileMenuHeight,
        });
      }
    },
    [frameHtml, initialInnerHeight]
  );

  const openMobileSideMenu = (what: MobileSideMenuWhat) => {
    const item = sessionStorage.getItem(SESSION_KEY.mobileMenuTargetBlock);
    if (targetBlock === undefined && item) {
      setMobileSideMenu({
        block: JSON.parse(item),
        what: what,
      });
      sessionStorage.setItem(SESSION_KEY.mobileSideMenuBlock, item);
    } else {
      sessionStorage.setItem(
        SESSION_KEY.mobileSideMenuBlock,
        JSON.stringify(targetBlock)
      );
      setMobileSideMenu({
        block: targetBlock,
        what: what,
      });
    }
    closeMM();
  };

  const addNewBlock = useCallback(() => {
    if (page.blocksId && targetBlock) {
      const blockIndex = page.blocksId.indexOf(targetBlock.id);
      const newBlock = makeNewBlock(page, targetBlock);
      addBlock(page.id, newBlock, blockIndex + 1, targetBlock.id);
      closeMM();
    }
  }, [addBlock, closeMM, page, targetBlock]);
  const removeBlock = () => {
    targetBlock && deleteBlock(page.id, targetBlock, true);
    closeMM();
  };
  const onTouchCommentBtn = useCallback(() => {
    const item = sessionStorage.getItem(SESSION_KEY.mobileMenuTargetBlock);
    if (targetBlock === undefined && item) {
      setCommentBlock(JSON.parse(item));
    } else {
      setCommentBlock(targetBlock);
    }
    //TODO -  수정
    // setModal({
    //   open: true,
    //   what: "modalComment",
    // });
    setModalStyle({
      ...mbmStyle,
    });
    const pageHtml = frameHtml?.querySelector(".page");
    if (pageHtml && frameHtml) {
      pageHtml?.setAttribute(
        "style",
        `translateY(${pageHtml.clientTop - frameHtml.clientTop - 50}px)`
      );
    }
    closeMM();
  }, [
    closeMM,
    frameHtml,
    mbmStyle,
    setCommentBlock,
    setModalStyle,
    targetBlock,
  ]);

  const detectSelectionInMobile = useCallback(
    (SELECTION: Selection) => {
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
          contentEditableElement = anchorNode as HTMLElement;
          break;
        default:
          break;
      }
      if (contentEditableElement) {
        const blockContentElement =
          contentEditableElement?.closest(".contents");
        if (blockContentElement) {
          const id = blockContentElement.id;
          const index = id.indexOf("__contents");
          const blockId = id.slice(0, index);
          const newTargetBlock = findBlock(page, blockId).BLOCK;
          setTargetBlock(newTargetBlock);
          changeMBMstyle(newTargetBlock);
        }
      }
    },
    [changeMBMstyle, page]
  );
  const handleSelectionChange = useCallback(
    (event) => {
      const SELECTION = document.getSelection();
      const notSelect =
        SELECTION?.anchorNode === SELECTION?.focusNode &&
        SELECTION?.anchorOffset === SELECTION?.focusOffset;
      if (SELECTION === null) {
        closeMM();
      }
      if (SELECTION) {
        if (notSelect) {
          detectSelectionInMobile(SELECTION);
        } else if (!openMobileBlockStyler) {
          setOpenMobileBlockStyler(true);
        }
      }
    },
    [
      closeMM,
      detectSelectionInMobile,
      setOpenMobileBlockStyler,
      openMobileBlockStyler,
    ]
  );

  useEffect(() => {
    frameHtml?.classList.add("stop");
    document.addEventListener("selectionchange", handleSelectionChange);
    inner?.addEventListener("touchstart", (event) => closeMobileMenu(event));
    return () => {
      inner?.removeEventListener("touchstart", (event) =>
        closeMobileMenu(event)
      );
      document.removeEventListener("selectionchange", handleSelectionChange);
      frameHtml?.classList.remove("stop");
    };
  }, [inner, closeMobileMenu, handleSelectionChange, frameHtml]);
  useEffect(() => {
    if (mobileMenuTargetBlock) {
      sessionStorage.setItem(
        SESSION_KEY.mobileMenuTargetBlock,
        JSON.stringify(mobileMenuTargetBlock)
      );
      changeMBMstyle(mobileMenuTargetBlock);
    } else {
      const item = sessionStorage.getItem(SESSION_KEY.mobileMenuTargetBlock);
      if (item) {
        const block = JSON.parse(item);
        setTargetBlock(block);
        changeMBMstyle(block);
      }
    }
  }, [
    mobileMenuTargetBlock,
    changeMBMstyle,
    editBlock,
    frameHtml,
    openMobileBlockStyler,
    page,
  ]);
  useEffect(() => {
    window.addEventListener("resize", () =>
      changeMBMstyle(mobileMenuTargetBlock)
    );
    return () => {
      window.removeEventListener("resize", () =>
        changeMBMstyle(mobileMenuTargetBlock)
      );
    };
  }, [changeMBMstyle, mobileMenuTargetBlock]);
  return (
    <>
      <div id="mobileMenu" style={mbmStyle}>
        {!openMobileBlockStyler ? (
          <div className="inner">
            <button
              className="btn-add-block"
              onTouchEnd={addNewBlock}
              title="button  to add a block below"
            >
              <ScreenOnly text="button  to add a block below" />
              <div className="mobileBlock__btn__inner">
                <AiOutlinePlus />
              </div>
            </button>
            {targetBlock?.type !== "page" && (
              <button
                name="comment"
                className="btn-comment"
                title="button to comment"
                onTouchEnd={onTouchCommentBtn}
              >
                <ScreenOnly text="button  to comment" />
                <div className="mobileBlock__btn__inner">
                  <BiCommentDetail />
                </div>
              </button>
            )}
            <button
              title="button to turn into"
              className="btn-turn-into"
              onTouchEnd={() => openMobileSideMenu("ms_turnInto")}
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
              title="button to delete"
              className="btn-delete"
              onTouchEnd={removeBlock}
              name="delete"
            >
              <ScreenOnly text="button  to delete" />
              <div className="mobileBlock__btn__inner">
                <RiDeleteBin6Line />
              </div>
            </button>
            <button
              title="button to change color"
              name="color"
              className="underline menu__editBtn btn-color "
              onTouchEnd={() => openMobileSideMenu("ms_color")}
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
              onTouchEnd={() => openMobileSideMenu("ms_moreMenu")}
            >
              <div className="mobileBlock__btn__inner">
                <div className="text">more</div>
              </div>
            </button>
          </div>
        ) : (
          //TODO -   수정
          sessionStorage.getItem(SESSION_KEY.mobileMenuTargetBlock) && (
            <div></div>
            // <BlockStyler
            //   pages={pages}
            //   pagesId={pagesId}
            //   firstList={firstList}
            //   userName={userName}
            //   page={page}
            //   recentPagesId={recentPagesId}
            //   block={
            //     targetBlock
            //       ? targetBlock
            //       : JSON.parse(
            //           sessionStorage.getItem(
            //             SESSION_KEY.mobileMenuTargetBlock
            //           ) as string
            //         )
            //   }
            //   setModalStyle={setModalStyle}
            //   command={command}
            //   setCommand={setCommand}
            //   setCommentBlock={setCommentBlock}
            //   selection={null}
            //   frameHtml={frameHtml}
            //   setMobileSideMenu={setMobileSideMenu}
            //   setMobileMenuTargetBlock={setMobileMenuTargetBlock}
            //   setOpenMobileBlockStyler={setOpenMobileBlockStyler}
            // />
          )
        )}
      </div>
    </>
  );
};

export default React.memo(MobileMenu);
