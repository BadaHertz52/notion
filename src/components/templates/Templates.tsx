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
  templateId: string | null;
  setTemplateId: Dispatch<SetStateAction<string | null>>;
  addTemplate: (template: Page) => void;
  cancelEditTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  closeTemplates: () => void;
  onClickUseBtn: () => void;
  onClickMakeTemplateBtn: () => void;
};

const Templates = ({ ...props }: TemplatesProps) => {
  const { templateId } = props;
  // template side에서 클릭된 template
  const openTarget = useRef<Page | null>(null);

  const [expand, setExpand] = useState<boolean>(false);

  return (
    <div id="templates">
      <div className="inner templates__inner">
        {((isMobile() && templateId) || !isMobile()) && (
          <Template
            {...props}
            expand={expand}
            setExpand={setExpand}
            templateId={templateId}
            isOpenTemplate={true}
          />
        )}
        {(!isMobile() || (isMobile() && !templateId)) && (
          <TemplateSide {...props} expand={expand} openTarget={openTarget} />
        )}
      </div>
      {props.alert && (
        <TemplateAlert
          {...props}
          templateId={templateId}
          openTarget={openTarget}
        />
      )}
    </div>
  );
};

export default React.memo(Templates);
