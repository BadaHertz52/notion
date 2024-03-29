import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
} from "react";
import { SESSION_KEY } from "../../constants";
import { Page } from "../../types";
import { isMobile } from "../../utils";

export type TemplateEditAlertProps = {
  templateId: string | null;
  setTemplateId: Dispatch<SetStateAction<string | null>>;
  openTarget: MutableRefObject<Page | null>;
  setAlert: Dispatch<SetStateAction<"edit" | "delete" | undefined>>;
  closeTemplates: () => void;
  cancelEditTemplate: (templateId: string) => void;
};
const TemplateEditAlert = ({
  templateId,
  setTemplateId,
  setAlert,
  closeTemplates,
  openTarget,
  cancelEditTemplate,
}: TemplateEditAlertProps) => {
  /**
   * editAlert 창을 닫고, templates에서  다른  template (=openTarget.current)을 연다
   */
  const closeAlertOpenOther = useCallback(() => {
    setAlert(undefined);
    if (openTarget.current) {
      setTemplateId(openTarget.current.id);
    }
  }, [setTemplateId, setAlert, openTarget]);

  /**
   * editAlert에서 수정 사항을 취소하거나 저장한 후에, openTarget.current의 값에 따라 templates창을 닫거나, 다른 template을 연다.
   */
  const afterTemplateEditAlert = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY.originTemplate);
    !openTarget.current || isMobile()
      ? closeTemplates()
      : closeAlertOpenOther();
  }, [closeTemplates, closeAlertOpenOther, openTarget]);

  const onClickDiscardBtn = useCallback(() => {
    const item = sessionStorage.getItem(SESSION_KEY.originTemplate);
    if (item) {
      if (templateId) cancelEditTemplate(templateId);
      afterTemplateEditAlert();
    }
  }, [templateId, cancelEditTemplate, afterTemplateEditAlert]);

  return (
    <>
      <div>
        The template has been modified. <br />
        Do you want to save the edits?
      </div>
      <button
        title="button to save changed"
        className="btn-save"
        onClick={afterTemplateEditAlert}
      >
        Save
      </button>
      <button
        title="button to discard edited"
        className="btn-discard"
        onClick={onClickDiscardBtn}
      >
        Discard edit
      </button>
    </>
  );
};

export default React.memo(TemplateEditAlert);
