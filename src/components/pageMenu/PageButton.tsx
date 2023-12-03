import React, { useContext, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { CSSProperties } from "styled-components";

import { PageIcon } from "../index";

import { ActionContext } from "../../contexts";
import { delete_block } from "../../modules/notion/reducer";
import { Block, Page, ListItem } from "../../types";
import { setTemplateItem } from "../../utils";
import { SESSION_KEY } from "../../constants";

type PageButtonProps = {
  itemSize: number;
  pages: Page[];
  item: ListItem;
  currentPage: Page;
  closeMenu: (() => void) | undefined;
  what: "page" | "block";
  block: Block | null;
  style: CSSProperties;
};

const PageButton = ({
  pages,
  item,
  currentPage,
  closeMenu,
  what,
  block,
  style,
}: PageButtonProps) => {
  const { addBlock, movePageToPage } = useContext(ActionContext).actions;
  const navigate = useNavigate();
  const templateHtml = document.getElementById("template");
  const moveBlockToPage = useCallback(
    (destinationPageId: string, block: Block) => {
      setTemplateItem(templateHtml, currentPage);
      // 기존 페이지에서 블록 삭제
      delete_block(currentPage.id, block, true);
      // 블록을 다른 페이지로 이동
      const newBlock: Block = {
        ...block,
        firstBlock: true,
        parentBlocksId: null,
        editTime: JSON.stringify(Date.now()),
      };
      const destinationPage = pages.filter(
        (page: Page) => page.id === destinationPageId
      )[0];
      //set origin destinationPage
      if (templateHtml) {
        const item = JSON.stringify(destinationPage);
        sessionStorage.setItem(SESSION_KEY.originMoveTargetPage, item);
      }
      if (!destinationPage.blocksId) {
        addBlock(destinationPageId, newBlock, 0, null);
      } else {
        const blocksIdLength = destinationPage.blocksId.length;
        addBlock(destinationPageId, newBlock, blocksIdLength, null);
      }
      // close Menu and recovery Menu state
      closeMenu && closeMenu();
    },
    [addBlock, closeMenu, currentPage, pages, templateHtml]
  );

  const onClickToMove = useCallback(() => {
    const id = item.id;
    switch (what) {
      case "block":
        if (block) {
          if (block.type === "page") {
            movePageToPage(block.id, id);
          } else {
            moveBlockToPage(id, block);
          }
        }
        break;
      case "page":
        movePageToPage(currentPage.id, id);
        navigate(id);
        break;
      default:
        break;
    }
  }, [
    block,
    currentPage.id,
    item.id,
    moveBlockToPage,
    movePageToPage,
    what,
    navigate,
  ]);

  return (
    <button
      title="button to move page"
      className="btn-page"
      onClick={onClickToMove}
      style={{ paddingTop: style.padding, paddingBottom: style.padding }}
    >
      <div className="btn-page__inner" style={{ height: style.height }}>
        <PageIcon
          icon={item.icon}
          iconType={item.iconType}
          style={{ width: style.height, height: style.height }}
        />
        <div className="btn-page__title">
          <span>{item.title}</span>
        </div>
      </div>
    </button>
  );
};

export default React.memo(PageButton);
