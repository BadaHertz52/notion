import React, { memo } from "react";
import { FixedSizeList } from "react-window";
import { Block, ListItem, Page } from "../modules/notion/type";
import PageButton from "./PageButton";
import { CSSProperties } from "styled-components";
import { isMobile } from "../fn";

type PageBtnListProps = {
  list: ListItem[];
  listWidth: number;
  pages: Page[];
  currentPage: Page;
  closeMenu: (() => void) | undefined;
  what: "page" | "block";
  block: Block | null;
};
const PageBtnList = (props: PageBtnListProps) => {
  const btnPadding = 5;
  const itemSize = 18;
  const totalItemSize = itemSize + btnPadding * 2;
  const searchHeight = 12 + 10 * 2;
  const newBtnHeight = 40;
  const closeBtnHeight = 30;
  const maxHeightInMobile =
    window.innerHeight - searchHeight - newBtnHeight - closeBtnHeight;
  const totalListHeight = props.list.length * totalItemSize;
  const listHeight = isMobile()
    ? maxHeightInMobile > totalListHeight
      ? totalListHeight
      : maxHeightInMobile
    : totalItemSize * (props.list.length > 2 ? 2.5 : props.list.length);
  const btnStyle: CSSProperties = {
    padding: btnPadding,
    height: itemSize,
    boxSizing: "border-box",
  };
  return (
    <div className="page-list__btn-group">
      <FixedSizeList
        height={listHeight}
        width={props.listWidth}
        layout="vertical"
        itemCount={props.list.length}
        itemData={props.list}
        itemKey={(index) => `page-btn-list_${props.list[index].id}`}
        itemSize={itemSize}
      >
        {({ index }) => (
          <PageButton
            key={`list_${props.list[index].id}`}
            pages={props.pages}
            currentPage={props.currentPage}
            closeMenu={props.closeMenu}
            what={props.what}
            block={props.block}
            item={props.list[index]}
            itemSize={itemSize}
            style={btnStyle}
          />
        )}
      </FixedSizeList>
    </div>
  );
};

export default memo(PageBtnList);
