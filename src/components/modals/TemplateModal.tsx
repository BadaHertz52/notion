import React, { useCallback, useEffect, useState } from "react";
import ModalPortal from "./ModalPortal";
import TemplatesContainer, {
  TemplatesContainerProps,
} from "../containers/TemplatesContainer";
import { ModalType } from "../../types";
import { isInTarget } from "../../utils";
import { SESSION_KEY } from "../../constants";

type TemplateModalProps = Omit<
  TemplatesContainerProps,
  "alert" | "setAlert"
> & {
  templateModal: ModalType;
  closeTemplates: () => void;
};

const TemplateModal = ({ ...props }: TemplateModalProps) => {
  const { closeTemplates, templateModal } = props;

  const [alert, setAlert] = useState<"edit" | "delete" | undefined>(undefined);

  const handleCloseTemplates = useCallback(
    (event: globalThis.MouseEvent) => {
      const TARGET = [
        "#templates",
        "#template-alert",
        ".btn-open-templates",
        ".templates__side__list",
        ".templates__btn",
      ];
      const item = sessionStorage.getItem(SESSION_KEY.originTemplate);
      if (
        templateModal.open &&
        !TARGET.map((v) => isInTarget(event, v)).some((v) => v)
      ) {
        item ? setAlert("edit") : closeTemplates();
      }
    },
    [closeTemplates, templateModal.open]
  );

  useEffect(() => {
    if (templateModal.open) {
      document.addEventListener("click", handleCloseTemplates);
    } else {
      setAlert(undefined);
      document.removeEventListener("click", handleCloseTemplates);
    }
  }, [templateModal.open, handleCloseTemplates]);

  return (
    <ModalPortal isOpen={templateModal.open} id="modal-template">
      {templateModal.open && (
        <TemplatesContainer
          {...props}
          closeTemplates={closeTemplates}
          alert={alert}
          setAlert={setAlert}
        />
      )}
    </ModalPortal>
  );
};

export default React.memo(TemplateModal);
