import React, { useCallback, useContext, useEffect, useState } from "react";

import {
  ModalPortal,
  BlockStyler,
  MobileSideMenuModal,
  BlockStylerSideMenu,
  CommentInput,
} from "../index";
import { BlockStylerProps } from "../blockMenu/BlockStyler";
import { ModalType } from "../../types";
import { CSSProperties } from "styled-components";
import {
  changeModalStyleOnTopOfBlock,
  findBlock,
  getBlockDomRect,
  isMobile,
  isTemplates,
  removeSelected,
} from "../../utils";
import { INITIAL_MODAL } from "../../constants";
import { useModal } from "../../hooks";
import { ActionContext } from "../../contexts";

type BlockStylerModalProps = Omit<
  BlockStylerProps,
  "block" | "setSideMenuModal" | "sideMenuModal" | "closeSideMenu"
> & {
  modal: ModalType;
  closeModal: () => void;
};
const BlockStylerModal = ({ ...props }: BlockStylerModalProps) => {
  const { modal, page, closeModal } = props;
  const { editBlock } = useContext(ActionContext).actions;

  const [modalStyle, setModalStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [sideMenuModal, setSideMenuModal] = useState<ModalType>(INITIAL_MODAL);

  const CORRECT_EVENT_TARGETS = [
    "#block-styler",
    `#${modal.block?.id}__contents`,
    "#menu",
    "#menu-command",
    "#menu-color",
    ".comment-input",
    "#loader-link",
    "#mobile-side-menu",
  ];

  const modalOpen = useModal(CORRECT_EVENT_TARGETS, "block-styler");

  const closeSideMenu = () => setSideMenuModal(INITIAL_MODAL);

  const closeBlockStyler = useCallback(() => {
    if (modal.block) {
      const editedBlock = findBlock(page, modal.block.id).BLOCK;
      setTimeout(() => {
        removeSelected(editedBlock, editBlock, page);
      }, 100);
    }
    closeModal();
  }, [modal.block, editBlock, page, closeModal]);

  const handleCloseBlockStyler = useCallback(() => {
    sideMenuModal.open ? closeSideMenu() : closeBlockStyler();
  }, [sideMenuModal.open, closeBlockStyler]);

  useEffect(() => {
    if (!modalStyle) changeModalStyleOnTopOfBlock(modal, setModalStyle);
  }, [modalStyle, modal]);

  useEffect(() => {
    if (modalOpen["block-styler"] === false) {
      handleCloseBlockStyler();
    }
  }, [modalOpen, handleCloseBlockStyler]);

  return (
    <ModalPortal isOpen={modal.open} id="modal-block-styler" style={modalStyle}>
      {modal.block && (
        <BlockStyler
          {...props}
          block={modal.block}
          setModal={props.setModal}
          sideMenuModal={sideMenuModal}
          setSideMenuModal={setSideMenuModal}
          closeSideMenu={closeSideMenu}
        />
      )}
      {sideMenuModal.target &&
        modal.block &&
        (sideMenuModal.target !== "commentInput" ? (
          isMobile() ? (
            <MobileSideMenuModal
              sideMenuModal={sideMenuModal}
              setSideMenuModal={setSideMenuModal}
            >
              <BlockStylerSideMenu
                {...props}
                block={findBlock(page, modal.block.id).BLOCK}
                sideMenuModal={sideMenuModal}
                setSideMenuModal={setSideMenuModal}
                closeSideMenu={() => {
                  setSideMenuModal((prev) => ({ ...prev, open: false }));
                }}
              />
            </MobileSideMenuModal>
          ) : (
            <BlockStylerSideMenu
              {...props}
              block={findBlock(page, modal.block.id).BLOCK}
              sideMenuModal={sideMenuModal}
              setSideMenuModal={setSideMenuModal}
              closeSideMenu={closeSideMenu}
            />
          )
        ) : (
          <CommentInput
            {...props}
            pageId={props.page.id}
            commentBlock={props.modal.block}
            addOrEdit="add"
            mainComment={null}
            subComment={null}
            allComments={modal.block.comments}
          />
        ))}
    </ModalPortal>
  );
};

export default React.memo(BlockStylerModal);
