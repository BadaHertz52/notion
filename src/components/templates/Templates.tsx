import React, {
  useRef,
  useState,
  useCallback,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

import { FaArrowAltCircleDown, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";

import {
  Template,
  TemplateSide,
  TemplateAlert,
  ScreenOnly,
  UseTemplateBtn,
  NewTemplateBtn,
} from "../index";

import { SESSION_KEY } from "../../constants";
import { ActionContext } from "../../contexts";
import {
  ListItem,
  Page,
  TemplateFrameCommonProps,
  TrashPage,
  UserState,
} from "../../types";
import {
  getEditTime,
  getNewPageId,
  isMobile,
  getPageSample,
} from "../../utils";

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
