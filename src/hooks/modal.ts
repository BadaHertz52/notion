import { useCallback, useEffect, useState } from "react";
import { isInTarget } from "../utils";

/**
 *  correctEventTargets :모달 창이 닫히지 않는 클릭 이벤트 타켓
 */
const useModal = (correctEventTargets: string[], modalName: string) => {
  const [modalOpen, setModalOpen] = useState<boolean>(true);

  const handleCloseModal = useCallback(
    (event: globalThis.MouseEvent) => {
      const targetModalEl = document.querySelector(`#modal-${modalName}__menu`);
      if (targetModalEl) {
        const isTarget = correctEventTargets
          .map((v) => isInTarget(event, v))
          .some((v) => !!v);

        setModalOpen(isTarget);
      }
    },
    [setModalOpen, correctEventTargets, modalName]
  );

  useEffect(() => {
    window.addEventListener("click", handleCloseModal);
    return () => window.removeEventListener("click", handleCloseModal);
  }, [handleCloseModal]);

  return { [modalName]: modalOpen };
};

export default useModal;
