import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ModalPortal from "./ModalPortal";
import TemplatesContainer, {
  TemplatesContainerProps,
} from "../containers/TemplatesContainer";
import { ModalType, Page } from "../../types";
import { SESSION_KEY } from "../../constants";
import { useModal } from "../../hooks";
import {
  getEditTime,
  getNewPageId,
  isMobile,
  getPageSample,
} from "../../utils";
import MobileSideMenuModal from "./MobileSideMenuModal";
import Templates, { TemplatesProps } from "../templates/Templates";
import UseTemplateBtn from "../templates/UseTemplateBtn";
import { IoMdCheckmark } from "react-icons/io";
import NewTemplateBtn from "../templates/NewTemplateBtn";
import ScreenOnly from "../ScreenOnly";
import { FaPlus } from "react-icons/fa";
import { ActionContext } from "../../contexts";

export type TemplateModalProps = Omit<
  TemplatesProps,
  | "alert"
  | "setAlert"
  | "template"
  | "setTemplate"
  | "onClickUseBtn"
  | "onClickMakeTemplateBtn"
> & {
  templateModal: ModalType;
  setTemplateModal: Dispatch<SetStateAction<ModalType>>;
  closeTemplates: () => void;
};

const TemplateModal = ({ ...props }: TemplateModalProps) => {
  const { closeTemplates, templateModal, templatesId, addTemplate } = props;
  const { addPage, editPage } = useContext(ActionContext).actions;

  const CORRECT_EVENT_TARGETS = [
    "#templates",
    "#template-alert",
    ".btn-open-templates",
    ".templates__side__list",
    ".templates__btn",
  ];
  const modalOpen = useModal(CORRECT_EVENT_TARGETS);
  const [alert, setAlert] = useState<"edit" | "delete" | undefined>(undefined);
  const [template, setTemplate] = useState<Page | null>(
    !props.templates || isMobile() ? null : props.templates[0]
  );

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
  }, [addPage, editPage, template, closeTemplates]);

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

  const handleAlert = useCallback(() => {
    const item = sessionStorage.getItem(SESSION_KEY.originTemplate);
    item ? setAlert("edit") : setAlert(undefined);

    return !!item;
  }, [setAlert]);

  const handleCloseTemplates = useCallback(() => {
    const isEdit = handleAlert();
    if (!isEdit && !isMobile()) closeTemplates();
  }, [closeTemplates, handleAlert]);

  useEffect(() => {
    if (!modalOpen) {
      handleCloseTemplates();
    }
  }, [modalOpen, setAlert, handleCloseTemplates]);

  return (
    <>
      {isMobile() ? (
        <MobileSideMenuModal
          setSideMenuModal={props.setTemplateModal}
          sideMenuModal={props.templateModal}
          handleAlert={handleAlert}
          rightBtn={
            template ? (
              <UseTemplateBtn onClickUseBtn={onClickUseBtn}>
                <IoMdCheckmark />
              </UseTemplateBtn>
            ) : (
              <NewTemplateBtn onClickMakeTemplateBtn={onClickMakeTemplateBtn}>
                <ScreenOnly text="make new template" />
                <FaPlus />
              </NewTemplateBtn>
            )
          }
        >
          {templateModal.open && (
            <Templates
              {...props}
              closeTemplates={closeTemplates}
              alert={alert}
              setAlert={setAlert}
              template={template}
              setTemplate={setTemplate}
              onClickUseBtn={onClickUseBtn}
              onClickMakeTemplateBtn={onClickMakeTemplateBtn}
            />
          )}
        </MobileSideMenuModal>
      ) : (
        <ModalPortal isOpen={templateModal.open} id="modal-template">
          {templateModal.open && (
            <Templates
              {...props}
              closeTemplates={closeTemplates}
              alert={alert}
              setAlert={setAlert}
              template={template}
              setTemplate={setTemplate}
              onClickUseBtn={onClickUseBtn}
              onClickMakeTemplateBtn={onClickMakeTemplateBtn}
            />
          )}
        </ModalPortal>
      )}
    </>
  );
};

export default React.memo(TemplateModal);
