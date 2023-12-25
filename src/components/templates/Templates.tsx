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
  addTemplate: (template: Page) => void;
  cancelEditTemplate: (templateId: string) => void;
  deleteTemplate: (templateId: string) => void;
  closeTemplates: () => void;
};

const Templates = ({ ...props }: TemplatesProps) => {
  const { templates, templatesId, closeTemplates, addTemplate } = props;

  const { addPage, editPage } = useContext(ActionContext).actions;

  const [template, setTemplate] = useState<Page | null>(
    !templates || isMobile() ? null : templates[0]
  );
  const openTarget = useRef<Page | null>(null);

  const [expand, setExpand] = useState<boolean>(false);

  const onClickUseBtn = useCallback(() => {
    const editTime = getEditTime();
    const targetPageId = sessionStorage.getItem(SESSION_KEY.targetPageId);
    if (template) {
      const newPage: Page = {
        ...template,
        id: getNewPageId(),
      };
      if (targetPageId === null) {
        addPage(newPage);
      } else {
        const editedPage: Page = {
          ...template,
          id: targetPageId,
          editTime: editTime,
        };
        sessionStorage.removeItem(SESSION_KEY.targetPageId);
        editPage(targetPageId, editedPage);
      }
      closeTemplates();
    }
  }, [addPage, editPage, template]);

  const onClickMakeTemplateBtn = useCallback(() => {
    const editTime = getEditTime();
    const id =
      templatesId === null
        ? `template1_${editTime}`
        : `template${templatesId.length + 1}_${editTime}`;
    const newTemplate: Page = {
      ...getPageSample(),
      id: id,
      header: {
        ...getPageSample().header,
        title: "new template",
      },
      type: "template",
      createTime: editTime,
      editTime: editTime,
    };

    addTemplate(newTemplate);
  }, [addTemplate, templatesId]);

  const onClickCloseBtn = () => {
    const item = sessionStorage.getItem(SESSION_KEY.originTemplate);
    item ? props.setAlert("edit") : closeTemplates();
  };

  return (
    <>
      <div id="templates">
        {isMobile() && (
          <div className={`templates__top-bar ${template ? "on" : ""}`}>
            <button
              className="templates__btn templates__btn-close"
              onClick={onClickCloseBtn}
            >
              {template ? <IoClose /> : <FaArrowAltCircleDown />}
            </button>
            <header>Templates</header>
            {template ? (
              <UseTemplateBtn onClickUseBtn={onClickUseBtn}>
                <IoMdCheckmark />
              </UseTemplateBtn>
            ) : (
              <NewTemplateBtn onClickMakeTemplateBtn={onClickMakeTemplateBtn}>
                <ScreenOnly text="make new template" />
                <FaPlus />
              </NewTemplateBtn>
            )}
          </div>
        )}
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
              onClickUseBtn={onClickUseBtn}
              onClickMakeTemplateBtn={onClickMakeTemplateBtn}
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
    </>
  );
};

export default React.memo(Templates);
