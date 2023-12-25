import React, { Dispatch, SetStateAction, useCallback, useEffect } from "react";

import PageIcon from "../icon/PageIcon";
import { AiOutlineExpandAlt, AiOutlineShrink } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";

import { Frame } from "../index";
import { FrameProps } from "../frame/Frame";

import { ListItem, Page } from "../../types";
import { SESSION_KEY } from "../../constants";

export type TemplateProps = Omit<
  FrameProps,
  "page" | "pages" | "pagesId" | "firstList" | "openTemplates"
> & {
  pages: Page[] | null;
  pagesId: string[] | null;
  firstList: ListItem[] | null;
  expand: boolean;
  setExpand: Dispatch<SetStateAction<boolean>>;
  template: Page | null;
  setAlert: Dispatch<SetStateAction<"edit" | "delete" | undefined>>;
};

const Template = ({ ...props }: TemplateProps) => {
  const { expand, template, setExpand, pages, pagesId, firstList, setAlert } =
    props;

  return (
    <div id="template" className={expand ? "expand" : ""}>
      {template && pages && pagesId && firstList ? (
        <>
          <div className="template__topBar">
            <div className="template__inform">
              <PageIcon
                icon={template.header.icon}
                iconType={template.header.iconType}
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
                onClick={() => setAlert("delete")}
              >
                <BsTrash />
                <div className="bubble">Delete template</div>
              </button>
            </div>
          </div>
          <Frame
            {...props}
            page={template}
            pages={pages}
            pagesId={pagesId}
            firstList={firstList}
          />
        </>
      ) : (
        <div className="noTemplate">
          <p>NO TEMPLATE</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(Template);
