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
