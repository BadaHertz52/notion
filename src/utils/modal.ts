import { Dispatch, SetStateAction } from "react";

export const closeModal = (
  elementId: string,
  setState: Dispatch<SetStateAction<boolean>>,
  event: globalThis.MouseEvent
) => {
  const eventTarget = event.target as HTMLElement | null;
  if (eventTarget?.id !== "inputImgIcon") {
    const isInElement = eventTarget?.closest(`#${elementId}`);
    !isInElement && setState(false);
  }
};

export const closeModalPortal = () => {
  const modalEl = document.querySelectorAll("#modal-root .modal");
  modalEl?.forEach((el) => {
    if (!el.id.includes("blockFn")) el.classList.remove("on");
  });
};
/**
 * 클릭한 부분이 특정 타켓 요소 안에 존재하는 지 여부 반환
 * @param event
 * @param targetId :타켓 요소의 아이디
 * @param targetClassName : 타켓 요소의 클래스
 * @returns
 */
export const isInTarget = (event: globalThis.MouseEvent, target: string) => {
  const eventTarget = event.target as Element;
  return eventTarget.closest(target);
};
