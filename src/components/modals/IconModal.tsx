import React, { useEffect, CSSProperties } from "react";

import { ModalPortal, IconMenu } from "../index";

import { Block, Page } from "../../types";

import "../../assets/iconMenu.scss";
import { useModal } from "../../hooks";

type IconModalProps = {
  isOpen: boolean;
  currentPageId?: string;
  block?: Block;
  page: Page;
  style?: CSSProperties;
  closeIconModal: () => void;
};
const IconModal = ({ ...props }: IconModalProps) => {
  const { closeIconModal, isOpen, style } = props;

  const CORRECT_EVENT_TARGETS = ["#icon-menu", ".page__icon"];
  const modalOpen = useModal(CORRECT_EVENT_TARGETS, "icon");

  useEffect(() => {
    if (modalOpen.icon === false) closeIconModal();
  }, [modalOpen.icon, closeIconModal]);

  return (
    <ModalPortal isOpen={isOpen} id="modal-icon" style={style}>
      <IconMenu {...props} />
    </ModalPortal>
  );
};

export default React.memo(IconModal);
