import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
} from "react";
import { AiOutlinePlus } from "react-icons/ai";

import { PageIcon, UseTemplateBtn, NewTemplateBtn } from "../index";

import { SESSION_KEY } from "../../constants";
import { Page, TrashPage } from "../../types";

type TemplateSideProps = {
  expand: boolean;
  setTemplate: Dispatch<SetStateAction<Page | null>>;
  templates: (Page | TrashPage)[] | null;
  templatesId: string[] | null;
  openTarget: MutableRefObject<Page | null>;
  setAlert: Dispatch<SetStateAction<"edit" | "delete" | undefined>>;
  addTemplate: (template: Page) => void;
  onClickUseBtn: () => void;
  onClickMakeTemplateBtn: () => void;
};

const TemplateSide = ({
  expand,
  setTemplate,
  templates,
  openTarget,
  setAlert,
  onClickUseBtn,
  onClickMakeTemplateBtn,
}: TemplateSideProps) => {
  const showOtherTemplate = useCallback(
    (otherTemplate: Page) => {
      const item = sessionStorage.getItem(SESSION_KEY.originTemplate);
      openTarget.current = otherTemplate;
      if (!item) {
        setTemplate(otherTemplate);
      } else {
        setAlert("edit");
      }
    },
    [openTarget, setAlert, setTemplate]
  );

  return (
    <div id="templates__side" className={expand ? "off" : ""}>
      <UseTemplateBtn onClickUseBtn={onClickUseBtn}>
        Use this template
      </UseTemplateBtn>

      <div className="templates__side__list">
        {templates ? (
          templates.map((template: Page) => (
            <button
              title="button to move page"
              className="item"
              onClick={() => showOtherTemplate(template)}
            >
              <PageIcon
                icon={template.header.icon}
                iconType={template.header.iconType}
              />
              <div className="page__title">
                <span>{template.header.title}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="noTemplate">
            <p>No template</p>
          </div>
        )}
      </div>
      <NewTemplateBtn onClickMakeTemplateBtn={onClickMakeTemplateBtn}>
        <AiOutlinePlus />
        <span>Make New Template</span>
      </NewTemplateBtn>
    </div>
  );
};

export default React.memo(TemplateSide);
