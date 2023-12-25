import React, { Dispatch, SetStateAction, useCallback } from "react";
import { Page, TrashPage } from "../../types";

export type TemplateDeleteAlertProps = {
  templatesId: string[] | null;
  templates: (Page | TrashPage)[] | null;
  template: Page | null;
  setTemplate: Dispatch<SetStateAction<Page | null>>;
  setAlert: Dispatch<SetStateAction<"edit" | "delete" | undefined>>;
  closeTemplates: () => void;
  deleteTemplate: (templateId: string) => void;
};

const TemplateDeleteAlert = ({
  templates,
  templatesId,
  template,
  setTemplate,
  setAlert,
  closeTemplates,
  deleteTemplate,
}: TemplateDeleteAlertProps) => {
  const onClickDeleteTemplateBtn = useCallback(() => {
    if (template && templatesId && templates) {
      const index = templatesId?.indexOf(template.id);
      if (templatesId.length > 1) {
        if (index === 0) {
          const nextTemplate = templates[1];
          setTemplate(nextTemplate);
        } else {
          setTemplate(templates[0]);
        }
      } else {
        closeTemplates();
      }
      deleteTemplate(template.id);
    }
    setAlert(undefined);
  }, [
    deleteTemplate,
    closeTemplates,
    setAlert,
    setTemplate,
    template,
    templates,
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
