import React, { Dispatch, SetStateAction, useCallback } from "react";

export type TemplateDeleteAlertProps = {
  templatesId: string[] | null;
  templateId: string | null;
  setTemplateId: Dispatch<SetStateAction<string | null>>;
  setAlert: Dispatch<SetStateAction<"edit" | "delete" | undefined>>;
  closeTemplates: () => void;
  deleteTemplate: (templateId: string) => void;
};

const TemplateDeleteAlert = ({
  templatesId,
  templateId,
  setTemplateId,
  setAlert,
  closeTemplates,
  deleteTemplate,
}: TemplateDeleteAlertProps) => {
  const onClickDeleteTemplateBtn = useCallback(() => {
    if (templateId) {
      const index = templatesId?.indexOf(templateId);
      if (templatesId && templateId.length > 1) {
        index === 0
          ? setTemplateId(templatesId[1])
          : setTemplateId(templatesId[0]);
      } else {
        closeTemplates();
      }
      deleteTemplate(templateId);
    }
    setAlert(undefined);
  }, [
    deleteTemplate,
    closeTemplates,
    setAlert,
    setTemplateId,
    templateId,
    templatesId,
  ]);

  return (
    <>
      <div>Do you want to delete this template?</div>
      <button
        title="button to delete"
        className="alert__btn-delete"
        onClick={onClickDeleteTemplateBtn}
      >
        Delete
      </button>
      <button
        title="button to cancel"
        className="alert__btn-cancel"
        onClick={() => setAlert(undefined)}
      >
        Cancel
      </button>
    </>
  );
};

export default React.memo(TemplateDeleteAlert);
