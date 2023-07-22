import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useRef,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {
  AiOutlineExpandAlt,
  AiOutlinePlus,
  AiOutlineShrink,
} from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ActionContext } from "../containers/NotionRouter";

import {
  add_template,
  cancel_edit_template,
  delete_template,
  pageSample,
} from "../modules/notion/reducer";
import { Page } from "../modules/notion/type";
import { findPage } from "../fn";
import { UserState } from "../modules/user/reducer";
import Frame, { Template_Frame_SAME_Props } from "./Frame";
import PageIcon from "./PageIcon";
import { RootState } from "../modules";

type TemplatesProps = Template_Frame_SAME_Props & {
  user: UserState;
  routePageId: string; // 현재 page
  setRoutePage: Dispatch<SetStateAction<Page | null>>;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
};
const Templates = ({
  routePageId,
  user,
  pagesId,
  pages,
  firstList,
  recentPagesId,
  setRoutePage,
  setTargetPageId,
  commentBlock,
  openComment,
  openTemplates,
  setOpenTemplates,
  setOpenComment,
  modal,
  setModal,
  setCommentBlock,
  showAllComments,
  smallText,
  fullWidth,
  discardEdit,
  setDiscardEdit,
  fontStyle,
  mobileSideMenu,
  setMobileSideMenu,
}: TemplatesProps) => {
  const { addPage, editPage } = useContext(ActionContext).actions;
  const templatesId = useSelector(
    (state: RootState) => state.notion
  ).templatesId;
  const dispatch = useDispatch();
  const addTemplate = (template: Page) => {
    dispatch(add_template(template));
  };
  const cancelEditTemplate = (templateId: string) => {
    dispatch(cancel_edit_template(templateId));
  };
  const deleteTemplate = (templateId: string) => {
    dispatch(delete_template(templateId));
  };
  const templates = useMemo(
    () =>
      templatesId
        ? templatesId.map((id: string) => findPage(pagesId, pages, id))
        : null,
    [templatesId, pagesId, pages]
  );
  const [template, setTemplate] = useState<Page | null>(
    templates === null ? null : templates[0]
  );
  const openTarget = useRef<Page | null>(null);
  const [openEditAlert, setOpenEditAlert] = useState<boolean>(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);

  const onClickTemplate = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const templateInner = event.currentTarget.firstElementChild;
      if (templateInner) {
        const templateInnerDomRect = templateInner.getClientRects()[0];
        const clientX = event.clientX;
        const clientY = event.clientY;
        const isInX =
          clientX >= templateInnerDomRect.left &&
          clientX <= templateInnerDomRect.right;
        const isInY =
          clientY >= templateInnerDomRect.top &&
          clientY <= templateInnerDomRect.bottom;
        const isInInner = isInX && isInY;
        if (!isInInner) {
          if (template) {
            // 수정이전의 버전인 originTemplate이 있으면, 수정된 버전으로 바꿀 것인지 아닌지를 묻는 창이 뜨고, originTemplate이 없다면 templates 창을 닫음
            const item = sessionStorage.getItem("originTemplate");
            item === null ? setOpenTemplates(false) : setOpenEditAlert(true);
          } else {
            setOpenTemplates(false);
          }
        }
      }
    },
    [setOpenTemplates, template]
  );

  const onClickUseBtn = useCallback(() => {
    const targetPageId = sessionStorage.getItem("targetPageId");
    if (template) {
      const newPage: Page = {
        ...template,
        id: JSON.stringify(Date.now()),
      };
      if (targetPageId === null) {
        addPage(newPage);
      } else {
        const editedPage: Page = {
          ...template,
          id: targetPageId,
          editTime: JSON.stringify(Date.now()),
        };
        sessionStorage.removeItem("targetPageId");
        editPage(targetPageId, editedPage);
        setRoutePage(editedPage);
      }
      setOpenTemplates(false);
    }
  }, [addPage, editPage, setOpenTemplates, setRoutePage, template]);
  const showOtherTemplate = useCallback(
    (otherTemplate: Page) => {
      if (template) {
        const item = sessionStorage.getItem("originTemplate");
        openTarget.current = otherTemplate;
        if (item === null) {
          setTemplate(otherTemplate);
        } else {
          setOpenEditAlert(true);
        }
      }
    },
    [template]
  );
  const closeTemplate = useCallback(() => {
    setOpenEditAlert(false);
    setOpenTemplates(false);
  }, [setOpenTemplates]);
  /**
   * editAlert 창을 닫고, templates에서  다른  template (=openTarget.current)을 연다
   */
  const closeAlertOpenOther = useCallback(() => {
    setOpenEditAlert(false);
    setTemplate(openTarget.current);
  }, []);
  /**
   * editAlert에서 수정 사항을 취소하거나 저장한 후에, openTarget.current의 값에 따라 templates창을 닫거나, 다른 template을 연다.
   */
  const afterEditAlert = useCallback(() => {
    template && sessionStorage.removeItem("originTemplate");
    openTarget.current === null ? closeTemplate() : closeAlertOpenOther();
  }, [closeTemplate, closeAlertOpenOther, template]);
  const onClickDiscardBtn = useCallback(() => {
    if (template) {
      const item = sessionStorage.getItem("originTemplate");
      if (item) {
        cancelEditTemplate(template.id);
        afterEditAlert();
      }
    }
  }, [template, cancelEditTemplate, afterEditAlert]);

  const onClickMakeTemplateBtn = useCallback(() => {
    const date = JSON.stringify(Date.now());
    const id =
      templatesId === null
        ? `template1_${date}`
        : `template${templatesId.length + 1}_${date}`;
    const newTemplate: Page = {
      ...pageSample,
      id: id,
      header: {
        ...pageSample.header,
        title: "new template",
      },
      type: "template",
      createTime: date,
      editTime: date,
    };

    addTemplate(newTemplate);
    setOpenTemplates(false);
    setRoutePage(newTemplate);
  }, [addTemplate, setOpenTemplates, setRoutePage, templatesId]);

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
        setOpenTemplates(false);
        if (routePageId === template.id) {
          const recentPagesId = user.recentPagesId;
          if (recentPagesId) {
            const lastPageId = recentPagesId[recentPagesId.length - 2];
            const recentPageIndex = pagesId.indexOf(lastPageId);
            const recentPage = pages[recentPageIndex];
            setRoutePage(recentPage);
          } else {
            const favorites = user.favorites;
            if (favorites) {
              const favoritePageIndex = pagesId.indexOf(favorites[0]);
              const favoritePage = pages[favoritePageIndex];
              setRoutePage(favoritePage);
            } else {
              setRoutePage(pages[0]);
            }
          }
        }
      }
      deleteTemplate(template.id);
    }
    setOpenDeleteAlert(false);
  }, [
    deleteTemplate,
    pages,
    pagesId,
    routePageId,
    setOpenTemplates,
    setRoutePage,
    template,
    templates,
    templatesId,
    user.favorites,
    user.recentPagesId,
  ]);

  return (
    <>
      <div id="templates" onClick={onClickTemplate}>
        <div className="inner">
          <div id="template" className={expand ? "expand" : ""}>
            {template ? (
              <>
                <div className="template__topBar">
                  <div className="template__inform">
                    <PageIcon
                      icon={template.header.icon}
                      iconType={template.header.iconType}
                      style={undefined}
                    />
                    <div className="page__title">
                      <span>{template.header.title}</span>
                    </div>
                  </div>
                  <div className="template__tool">
                    <button
                      title={`button to ${
                        expand
                          ? "revert  the template to original size"
                          : "expand the template size"
                      } `}
                      className="btn-expand"
                      aria-label={
                        expand
                          ? "revert  the template to original size"
                          : "expand the template size"
                      }
                      onClick={() => setExpand(!expand)}
                    >
                      {expand ? <AiOutlineShrink /> : <AiOutlineExpandAlt />}
                      <div className="bubble">
                        {expand ? "Revert to original size" : "Expand  size"}
                      </div>
                    </button>
                    <button
                      title="button to delete template"
                      className="template__btn-delete"
                      aria-label="delete template"
                      onClick={() => setOpenDeleteAlert(true)}
                    >
                      <BsTrash />
                      <div className="bubble">Delete template</div>
                    </button>
                  </div>
                </div>
                <Frame
                  page={template}
                  userName={user.userName}
                  pagesId={pagesId}
                  pages={pages}
                  firstList={firstList}
                  recentPagesId={recentPagesId}
                  commentBlock={commentBlock}
                  openComment={openComment}
                  setTargetPageId={setTargetPageId}
                  setRoutePage={setRoutePage}
                  setOpenComment={setOpenComment}
                  setCommentBlock={setCommentBlock}
                  modal={modal}
                  setModal={setModal}
                  showAllComments={showAllComments}
                  smallText={smallText}
                  fullWidth={fullWidth}
                  discardEdit={discardEdit}
                  setDiscardEdit={setDiscardEdit}
                  openTemplates={openTemplates}
                  setOpenTemplates={setOpenTemplates}
                  fontStyle={fontStyle}
                  mobileSideMenu={mobileSideMenu}
                  setMobileSideMenu={setMobileSideMenu}
                />
              </>
            ) : (
              <div className="noTemplate">
                <p>NO TEMPLATE</p>
              </div>
            )}
          </div>
          <div id="template__side" className={expand ? "off" : ""}>
            <button
              title="button to use this template"
              className="template__side__btn-use"
              onClick={onClickUseBtn}
            >
              Use this template
            </button>

            <div className="template__side__list">
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
                      style={undefined}
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
            <button
              title="button to make new template"
              className="template__side__btn-make"
              onClick={onClickMakeTemplateBtn}
            >
              <AiOutlinePlus />
              <span>Make New Template</span>
            </button>
          </div>
        </div>
      </div>
      {openEditAlert && (
        <div className="template__alert">
          <div className="inner">
            <div>
              The template has been modified. <br />
              Do you want to save the edits?
            </div>
            <button
              title="button to save changed"
              className="btn-save"
              onClick={afterEditAlert}
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
          </div>
        </div>
      )}
      {openDeleteAlert && (
        <div className="template__alert">
          <div className="inner">
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
              onClick={() => setOpenDeleteAlert(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Templates);
