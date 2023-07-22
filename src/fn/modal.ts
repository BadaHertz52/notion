import { Dispatch, SetStateAction } from "react";
import { detectRange } from ".";

export const closeModal = (
  elementId: string,
  setState: Dispatch<SetStateAction<boolean>>,
  event: globalThis.MouseEvent
) => {
  const eventTarget = event.target as Element | null;
  if (eventTarget?.id !== "inputImgIcon") {
    const element = document.getElementById(elementId);
    const elementDomRect = element?.getClientRects()[0];
    const isInElement = detectRange(event, elementDomRect);
    !isInElement && setState(false);
  }
};
