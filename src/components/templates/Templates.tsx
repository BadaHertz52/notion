import React, { useRef, useState, Dispatch, SetStateAction } from "react";

import { Template, TemplateSide, TemplateAlert } from "../index";

import {
  ListItem,
  Page,
  TemplateFrameCommonProps,
  TrashPage,
  UserState,
} from "../../types";
import { isMobile } from "../../utils";

import "../../assets/templates.scss";

export type TemplatesProps = TemplateFrameCommonProps & {
  pages: Page[] | null;
  pagesId: string[] | null;
  firstList: ListItem[] | null;
  templates: (Page | TrashPage)[] | null;
  templatesId: string[] | null;
  user: UserState;
  routePageId: string; // 현재 page
  alert: "edit" | "delete" | undefined;
  setAlert: Dispatch<SetStateAction<"edit" | "delete" | undefined>>;
  template: Page | null;
  setTemplate: Dispatch<SetStateAction<Page | null>>;
  addTemplate: (template: Page) => void;
  cancelEditTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  closeTemplates: () => void;
  onClickUseBtn: () => void;
  onClickMakeTemplateBtn: () => void;
};

const Templates = ({ ...props }: TemplatesProps) => {
  const { template, setTemplate } = props;

  const openTarget = useRef<Page | null>(null);

  const [expand, setExpand] = useState<boolean>(false);

  return (
    <div id="templates">
      <div className="inner templates__inner">
        {((isMobile() && template) || !isMobile()) && (
          <Template
            {...props}
            expand={expand}
            setExpand={setExpand}
            template={template}
            isOpenTemplate={true}
          />
        )}
        {(!isMobile() || (isMobile() && !template)) && (
          <TemplateSide
            {...props}
            expand={expand}
            setTemplate={setTemplate}
            openTarget={openTarget}
          />
        )}
      </div>
      {props.alert && (
        <TemplateAlert
          {...props}
          template={template}
          setTemplate={setTemplate}
          openTarget={openTarget}
        />
      )}
    </div>
  );
};

export default React.memo(Templates);
