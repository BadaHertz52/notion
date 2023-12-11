import React, { useState, useRef, useCallback } from "react";

import { CSSProperties } from "styled-components";
import { Link } from "react-router-dom";

import { MdPlayArrow } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";

import { ScreenOnly, PageIcon } from "../index";

import { SideAppear, ListItem } from "../../types";
import { makeRoutePath } from "../../utils";

type PageListItemProp = {
  item: ListItem;
  onClickMoreBtn: (item: ListItem, target: HTMLElement) => void;
  addNewSubPage: (item: ListItem) => void;
  changeSide: (appear: SideAppear) => void;
  handleImgLoad?: () => void;
};

const PageListItem = ({
  item,
  onClickMoreBtn,
  addNewSubPage,
  changeSide,
  handleImgLoad,
}: PageListItemProp) => {
  const [toggleStyle, setToggleStyle] = useState<CSSProperties>({
    transform: "rotate(0deg)",
  });
  const sideBarPageFnRef = useRef<HTMLDivElement>(null);
  const onToggleSubPage = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const toggleSubPage = (subPageElement: null | undefined | Element) => {
      if (subPageElement) {
        subPageElement.classList.toggle("on");
        subPageElement.classList.contains("on")
          ? setToggleStyle({
              transform: "rotate(90deg)",
            })
          : setToggleStyle({
              transform: "rotate(0deg)",
            });
      }
    };
    let subPageElement = null;
    switch (target.tagName.toLocaleLowerCase()) {
      case "path":
        subPageElement =
          target.parentElement?.parentElement?.parentElement?.parentElement
            ?.parentElement?.nextElementSibling;

        break;
      case "svg":
        subPageElement =
          target.parentElement?.parentElement?.parentElement?.parentElement
            ?.nextElementSibling;

        break;
      case "button":
        subPageElement =
          target.parentElement?.parentElement?.parentElement
            ?.nextElementSibling;
        break;

      default:
        break;
    }
    toggleSubPage(subPageElement);
  }, []);
  const showPageFn = useCallback(() => {
    if (sideBarPageFnRef.current) {
      sideBarPageFnRef.current.classList.toggle("on");
    }
  }, []);
  const removeOn = useCallback(() => {
    if (sideBarPageFnRef.current) {
      sideBarPageFnRef.current.classList.contains("on") &&
        sideBarPageFnRef.current.classList.remove("on");
    }
  }, []);
  const onClickPageName = useCallback(() => {
    if (window.innerWidth <= 768) {
      changeSide("close");
    }
  }, [changeSide]);
  return (
    <div
      className="pageList__item link-page"
      onMouseOver={showPageFn}
      onMouseOut={removeOn}
    >
      <div className="pageList__item__page">
        <button
          title="button to toggle page"
          className="btn-toggle"
          onClick={onToggleSubPage}
          style={toggleStyle}
        >
          <ScreenOnly text="button to toggle page" />
          <MdPlayArrow />
        </button>
        <Link
          className="pageName"
          to={makeRoutePath(item.id)}
          onClick={onClickPageName}
        >
          <PageIcon
            icon={item.icon}
            iconType={item.iconType}
            style={undefined}
            handleImgLoad={handleImgLoad}
          />
          <div>{item.title}</div>
        </Link>
      </div>
      <div className="pageList__item__btn-group" ref={sideBarPageFnRef}>
        <button
          className="btn-menu"
          title="button to open menu to delete, duplicate or for more"
          onClick={() => {
            sideBarPageFnRef.current &&
              onClickMoreBtn(item, sideBarPageFnRef.current);
          }}
        >
          <ScreenOnly text="button to open menu to delete, duplicate or for more" />
          <BsThreeDots />
        </button>
        <button
          className="btn-addPage"
          title="button to quickly add a page inside"
          onClick={() => {
            addNewSubPage(item);
          }}
        >
          <ScreenOnly text="button to quickly add a page inside" />
          <AiOutlinePlus />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PageListItem);
