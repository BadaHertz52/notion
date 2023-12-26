import React from "react";

import { AiOutlinePlus } from "react-icons/ai";

import { ScreenOnly, PageList } from "../index";
import { ListItem, Page } from "../../types";
import { PageListProp } from "./PageList";

type PrivateProps = Omit<PageListProp, "targetList"> & {
  firstPages: Page[] | null;
  addNewPage: () => void;
};

function Private({ ...props }: PrivateProps) {
  const { firstPages, pages } = props;

  const targetList: ListItem[] | null = firstPages
    ? firstPages
        .filter((page: Page) => page.parentsId === null)
        .map((page: Page) => ({
          id: page.id,
          iconType: page.header.iconType,
          icon: page.header.icon,
          title: page.header.title,
          subPagesId: page.subPagesId,
          parentsId: page.parentsId,
          editTime: page.editTime,
          createTime: page.createTime,
        }))
    : null;
  return (
    <div className="private">
      <div className="header">
        <span>PRIVATE</span>
        <button
          className="btn-addPage"
          title="Quickly add a page inside"
          onClick={props.addNewPage}
        >
          <ScreenOnly text="Quickly add a page inside" />
          <AiOutlinePlus />
        </button>
      </div>
      {pages && (
        <div className="list">
          {pages[0] && targetList && (
            <PageList {...props} targetList={targetList} />
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(Private);
