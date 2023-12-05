import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Modal from "../Modal";
import { FrameModalType, Page } from "../../types";
import Menu, { MenuProps } from "../menu/Menu";
import Rename, { RenameProps } from "../Rename";
import CommentInput, { CommentInputProps } from "../comment/CommentInput";
import { CSSProperties } from "styled-components";
import { findPage, getBlockDomRect, isInTarget } from "../../utils";

type ChildrenProps = MenuProps & RenameProps & CommentInputProps;
type FrameModalMenuProps = Omit<
  ChildrenProps,
  | "block"
  | "pageId"
  | "currentPageId"
  | "closeRename"
  | "addOrEdit"
  | "mainComment"
  | "subComment"
  | "allComments"
  | "setModal"
> & {
  setModal: Dispatch<SetStateAction<FrameModalType>>;
  pagesId: string[];
  modal: FrameModalType;
  closeModal: () => void;
};
function FrameModalMenu({ ...props }: FrameModalMenuProps) {
  const { modal } = props;
  const ID = "frameModalMenu";

  const [modalStyle, setModalStyle] = useState<CSSProperties | undefined>(
    undefined
  );

  //TODO - modal style
  const changeStyleOfModalOnBottomBlock = useCallback(() => {
    if (modal.block) {
      const blockDomRect = getBlockDomRect(modal.block);
      const EXTRA_SPACE = 10;

      if (blockDomRect) {
        const top1 = blockDomRect.top + blockDomRect.height + EXTRA_SPACE;
        const top2 = `calc(${blockDomRect.top - EXTRA_SPACE}px - 100%) `;
        const remains = window.innerHeight - top1;

        setModalStyle({
          position: "absolute",
          top: remains > EXTRA_SPACE ? top1 : top2,
          left: blockDomRect.left,
        });
      }
    }
  }, [modal.block]);

  const changeMenuModalStyle = useCallback(() => {
    const blockFnEl = document.getElementById("blockFn");
    const blockFnElDomRect = blockFnEl?.getClientRects()[0];
    if (blockFnElDomRect) {
      const { top, right } = blockFnElDomRect;
      setModalStyle({
        position: "absolute",
        top: top,
        left: right,
      });
    }
  }, []);

  const changeModalStyle = useCallback(() => {
    switch (modal.target) {
      case "rename":
        changeStyleOfModalOnBottomBlock();
        break;
      case "commentInput":
        changeStyleOfModalOnBottomBlock();
        break;
      case "menu":
        changeMenuModalStyle();
        break;
      default:
        break;
    }
  }, [modal, changeStyleOfModalOnBottomBlock, changeMenuModalStyle]);

  const handleScrollOfFrame = useCallback(() => {
    const frameEl = document.querySelector(".frame");
    frameEl?.classList.toggle("stop", modal.open);
  }, [modal.open]);

  const handleCloseModal = useCallback(
    (event: globalThis.MouseEvent) => {
      const target = ["modal", "menu"];
      const isInModal = target
        .map((v) => !!isInTarget(event, undefined, v))
        .some((v) => v);
      if (modal.open) {
        if (!isInModal) {
          console.log("close");
          props.closeModal();
        }
      }
    },
    [props, modal]
  );

  useEffect(() => {
    changeModalStyle();
  }, [modal, changeModalStyle]);

  useEffect(() => {
    handleScrollOfFrame();
    window.addEventListener("click", handleCloseModal);
  }, [handleCloseModal, handleScrollOfFrame]);

  return (
    <Modal id={ID} isOpen={modal.open} style={modalStyle}>
      {modal.target === "menu" && modal.block && (
        <Menu
          pages={props.pages}
          block={modal.block}
          firstList={props.firstList}
          page={props.page}
          userName={props.userName}
          frameHtml={props.frameHtml}
          setModal={props.setModal}
          closeModal={props.closeModal}
        />
      )}
      {modal.target === "rename" && modal.block && (
        <Rename
          currentPageId={props.page.id}
          block={modal.block}
          page={findPage(props.pagesId, props.pages, modal.block.id) as Page}
          closeRename={props.closeModal}
        />
      )}
      {modal.target === "commentInput" && modal.block && (
        <CommentInput
          pageId={props.page.id}
          page={props.page}
          userName={props.userName}
          editBlock={props.editBlock}
          editPage={props.editPage}
          mainComment={null}
          subComment={null}
          commentBlock={modal.block}
          allComments={modal.block.comments}
          addOrEdit="add"
          templateHtml={props.templateHtml}
          frameHtml={props.frameHtml}
        />
      )}
    </Modal>
  );
}

export default React.memo(FrameModalMenu);
