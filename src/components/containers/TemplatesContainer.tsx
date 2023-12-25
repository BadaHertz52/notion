import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../modules";
import {
  add_template,
  cancel_edit_template,
  delete_template,
} from "../../modules/notion/reducer";
import { Page } from "../../types";
import { findPage } from "../../utils";
import Templates, { TemplatesProps } from "../templates/Templates";

export type TemplatesContainerProps = Omit<
  TemplatesProps,
  | "templates"
  | "templatesId"
  | "pages"
  | "pagesId"
  | "addTemplate"
  | "cancelEditTemplate"
  | "deleteTemplate"
>;
const TemplatesContainer = ({ ...props }: TemplatesContainerProps) => {
  const { templatesId, pages, pagesId } = useSelector(
    (state: RootState) => state.notion
  );
  const dispatch = useDispatch();
  const addTemplate = useCallback(
    (template: Page) => {
      dispatch(add_template(template));
    },
    [dispatch]
  );
  const cancelEditTemplate = useCallback(
    (templateId: string) => {
      dispatch(cancel_edit_template(templateId));
    },
    [dispatch]
  );
  const deleteTemplate = useCallback(
    (templateId: string) => {
      dispatch(delete_template(templateId));
    },
    [dispatch]
  );
  const templates = useMemo(
    () =>
      templatesId && pagesId && pages
        ? templatesId.map((id: string) => findPage(pagesId, pages, id))
        : null,
    [templatesId, pagesId, pages]
  );

  return (
    <>
      <Templates
        {...props}
        pages={pages}
        pagesId={pagesId}
        templates={templates}
        templatesId={templatesId}
        addTemplate={addTemplate}
        cancelEditTemplate={cancelEditTemplate}
        deleteTemplate={deleteTemplate}
      />
    </>
  );
};

export default TemplatesContainer;
