import React, { useState, useEffect, useContext, useCallback } from "react";

import { CSSProperties } from "styled-components";

import { AiOutlinePlus } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";

import { ScreenOnly, BlockStyler, CommentInput } from "../index";

import { ActionContext } from "../../contexts";
import {
  Block,
  ModalType,
  ModalTypeTarget,
  Page,
  StylerCommonProps,
} from "../../types";
import { makeNewBlock, findBlock, getEditTime } from "../../utils";

import "../../assets/mobileMenu.scss";
import { INITIAL_MODAL, SESSION_KEY } from "../../constants";
import MobileSideMenu, { MobileSideMenuProps } from "./MobileSideMenu";
import { HiOutlineDuplicate } from "react-icons/hi";
import { CommentInputProps } from "../comment/CommentInput";

export type MobileMenuProps = Omit<
  MobileSideMenuProps,
  "sideMenuModal" | "setSideMenuModal"
> &
  Omit<
    CommentInputProps,
    "pageId" | "addOrEdit" | "subComment" | "allComments" | "mainComment"
  > & {
    page: Page;
    frameHtml: HTMLElement | null;
    block: Block;
    closeModal: () => void;
  };

const MobileMenu = ({ ...props }: MobileMenuProps) => {
  const { page, block, closeModal, frameHtml } = props;
  const { addBlock, deleteBlock, duplicatePage } =
    useContext(ActionContext).actions;

  const [sideMeuModal, setSideMenuModal] = useState<ModalType>(INITIAL_MODAL);

  const openSideMenu = (target: ModalTypeTarget) => {
    setSideMenuModal({
      open: true,
      target: target,
      block: block,
    });
  };

  // const openMobileSideMenu = (what: MobileSideMenuWhat) => {
  //   const item = sessionStorage.getItem(SESSION_KEY.mobileMenuTargetBlock);
  //   if (block === undefined && item) {
  //     setMobileSideMenu({
  //       block: JSON.parse(item),
  //       what: what,
  //     });
  //     sessionStorage.setItem(SESSION_KEY.mobileSideMenuBlock, item);
  //   } else {
  //     sessionStorage.setItem(
  //       SESSION_KEY.mobileSideMenuBlock,
  //       JSON.stringify(block)
  //     );
  //     setMobileSideMenu({
  //       block: block,
  //       what: what,
  //     });
  //   }
  //   closeMM();
  // };

  const addNewBlock = useCallback(() => {
    if (page.blocksId && block) {
      const blockIndex = page.blocksId.indexOf(block.id);
      const newBlock = makeNewBlock(page, block);
      addBlock(page.id, newBlock, blockIndex + 1, block.id);
      closeModal();
    }
  }, [addBlock, page, block, closeModal]);

  const removeBlock = () => {
    block && deleteBlock(page.id, block, true);
    closeModal();
  };

  const duplicateBlock = useCallback(() => {
    if (page.blocks && page.blocksId) {
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

      if (block.type === "page") {
        duplicatePage(block.id);
      }
    }
    closeModal();
  }, [addBlock, block, duplicatePage, page, closeModal]);

  useEffect(() => {
    frameHtml?.classList.add("stop");
    return () => {
      frameHtml?.classList.remove("stop");
    };
  }, [frameHtml]);

  return (
    <>
      {!sideMeuModal.open ? (
        <div id="mobile-menu">
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
            <button
              title="button to duplicate"
              className="btn-duplicate"
              onTouchEnd={duplicateBlock}
            >
              <ScreenOnly text="button  to duplicate a block below" />
              <div className="mobileBlock__btn__inner">
                <HiOutlineDuplicate />
              </div>
            </button>
            {block?.type !== "page" && (
              <button
                name="comment"
                className="btn-comment"
                title="button to comment"
                onTouchEnd={() => openSideMenu("commentInput")}
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
              onTouchEnd={() => openSideMenu("command")}
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
              className="underline menu__btn-edit btn-color "
              onTouchEnd={() => openSideMenu("color")}
            >
              <div className="mobileBlock__btn__inner">
                <div className="text">Color</div>
                <div className="arrow-down">
                  <TiArrowSortedDown />
                </div>
              </div>
            </button>
          </div>
        </div>
      ) : (
        sideMeuModal.target === "commentInput" && (
          <CommentInput
            {...props}
            pageId={props.page.id}
            mainComment={null}
            subComment={null}
            commentBlock={block}
            allComments={block.comments}
            addOrEdit="add"
          />
        )
      )}
      {sideMeuModal.target && sideMeuModal.target !== "commentInput" && (
        <MobileSideMenu
          {...props}
          sideMenuModal={sideMeuModal}
          setSideMenuModal={setSideMenuModal}
        />
      )}
    </>
  );
};

export default React.memo(MobileMenu);
