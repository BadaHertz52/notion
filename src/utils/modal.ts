import { CSSProperties, Dispatch, SetStateAction, MouseEvent } from "react";
import { isTemplates } from "./template";
import { getBlockDomRect } from "./block";
import { ModalType } from "../types";
import { isMobile } from "./mobile";

/**
 * 클릭한 부분이 특정 타켓 요소 안에 존재하는 지 여부 반환
 * @param event
 * @param target : 타켓 요소의 아이디나 클래스(아이디:"#id",클래스:".클래스")
 */
export const isInTarget = (event: globalThis.MouseEvent, target: string) => {
  const eventTarget = event.target as HTMLElement;
  return eventTarget.closest(target);
};

export const changeIconModalStyle = (
  event: MouseEvent,
  setIconModalStyle: Dispatch<SetStateAction<CSSProperties | undefined>>
) => {
  const renameEl = document.querySelector("#rename");
  const { bottom, left, top } = renameEl
    ? renameEl.getClientRects()[0]
    : event.currentTarget.getClientRects()[0];

  const GAP = 4;
  const MODAL_HEIGHT = 173;
  const EXTRA_SPACE = 20;
  const isOver =
    window.innerHeight - (bottom + GAP) - MODAL_HEIGHT <= EXTRA_SPACE;
  const iconTop = isOver ? top - MODAL_HEIGHT - GAP : bottom + GAP;
  setIconModalStyle({
    position: "absolute",
    top: iconTop,
    left: left,
  });
};

export const changeModalStyleOnTopOfBlock = (
  modal: ModalType,
  setStyle: Dispatch<SetStateAction<CSSProperties | undefined>>
) => {
  const pageContentsEl = isTemplates()
    ? document.querySelector("#template .page__firstBlock")
    : document.querySelector(".page__firstBlock");
  const pageContentsElDomRect = pageContentsEl?.getClientRects()[0];

  if (modal.block && pageContentsElDomRect) {
    const domeRect = getBlockDomRect(modal.block);
    const topBarBottom = document.querySelector("#top-bar")?.clientHeight;
    const GAP = 10;
    const STYLER_HEIGHT = 45;

    if (domeRect && topBarBottom) {
      const top = domeRect.top - GAP - STYLER_HEIGHT;
      const isOverlap = top <= topBarBottom;
      const bottomStyle: CSSProperties = {
        position: "absolute",
        bottom: -domeRect.bottom - GAP - STYLER_HEIGHT,
        left: pageContentsElDomRect.left,
      };
      const topStyle: CSSProperties = {
        position: "absolute",
        top: top,
        left: pageContentsElDomRect.left,
      };

      if (isMobile() || isOverlap) {
        //모바일에서 포커스 시, 브라우저의 검색 또는 번역 기능이 있는 경우를 대비해 블럭 아래에 위치하도록 함
        setStyle(bottomStyle);
        return;
      }
      setStyle(topStyle);
    }
  }
};
