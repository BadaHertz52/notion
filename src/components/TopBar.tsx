import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
  useCallback,
  MouseEvent,
} from "react";

import { ActionContext, PathType } from "../route/NotionRouter";
import { ListItem, Page } from "../modules/notion/type";
import { SideAppear } from "../modules/side/reducer";
import PageMenu from "./PageMenu";
import { CSSProperties } from "styled-components";
import PageIcon from "./PageIcon";
import {
  defaultFontFamily,
  FontStyleType,
  monoFontFamily,
  serifFontFamily,
} from "../route/NotionRouter";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import { FiChevronsLeft } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoArrowRedoOutline } from "react-icons/io5";
import { GrDocumentUpload } from "react-icons/gr";
import { isMobile, makeRoutePath } from "../fn";
import ScreenOnly from "./ScreenOnly";
import { Link } from "react-router-dom";
import FontBtn from "./FontBtn";
//frame font
const defaultStyle = "default";
const serif = "serif";
const mono = "mono";
export type FrameFontStyleType =
  | typeof defaultStyle
  | typeof serif
  | typeof mono;

type TopBarProps = {
  firstList: ListItem[];
  favorites: string[] | null;
  sideAppear: SideAppear;
  page: Page;
  pages: Page[];
  pagePath: PathType[] | null;
  showAllComments: boolean;
  setShowAllComments: Dispatch<SetStateAction<boolean>>;
  smallText: boolean;
  setSmallText: Dispatch<SetStateAction<boolean>>;
  fullWidth: boolean;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
  setOpenExport: Dispatch<SetStateAction<boolean>>;
  setFontStyle: Dispatch<SetStateAction<FontStyleType>>;
};

const TopBar = ({
  firstList,
  favorites,
  sideAppear,
  page,
  pages,
  pagePath,
  showAllComments,
  setShowAllComments,
  smallText,
  setSmallText,
  fullWidth,
  setFullWidth,
  setOpenExport,
  setFontStyle,
}: TopBarProps) => {
  const { deletePage, changeSide, addFavorites, removeFavorites } =
    useContext(ActionContext).actions;
  const inner = document.getElementById("inner");
  const [title, setTitle] = useState<string>("");
  const [openPageMoreFun, setOpenPageMoreFun] = useState<boolean>(false);
  const [openPageMenu, setOpenPageMenu] = useState<boolean>(false);
  const pageInFavorites = favorites?.includes(page.id);
  const FONT_BTN_ARRAY: FrameFontStyleType[] = ["default", "mono", "serif"];
  const [selectedFontStyle, setSelectedFontStyle] =
    useState<FrameFontStyleType>("default");
  const onClickSideBarBtn = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      const targetTag = target.tagName.toLowerCase();
      const width = window.outerWidth;
      if (showAllComments && width < 1024) {
        setShowAllComments(false);
      }
      switch (targetTag) {
        case "button":
          target.id === "topBar__btn-sideBar" && changeSide("lock");
          break;
        case "svg":
          target.parentElement?.id === "topBar__btn-sideBar" &&
            changeSide("lock");
          break;
        case "path":
          target.parentElement?.parentElement?.id === "topBar__btn-sideBar" &&
            changeSide("lock");
          break;
        default:
          break;
      }
    },
    [changeSide, setShowAllComments, showAllComments]
  );
  const onMouseEnterSidBarBtn = useCallback(() => {
    const innerWidth = window.innerWidth;
    if (innerWidth >= 1024) {
      sideAppear === "close" || sideAppear === "floatHide"
        ? changeSide("float")
        : changeSide("floatHide");
    }
  }, [changeSide, sideAppear]);

  const addOrRemoveFavorite = useCallback(() => {
    pageInFavorites ? removeFavorites(page.id) : addFavorites(page.id);
  }, [addFavorites, page.id, pageInFavorites, removeFavorites]);

  const changeAllCommentAndTopBarStyle = useCallback(() => {
    const innerWidth = window.innerWidth;
    const topBarLeftEl = document.querySelector(".topBar__left");
    const topBarPageToolEl = document.querySelector(".topBar__page-tool");
    const pagePathEl = document.querySelectorAll(".pagePath");
    const changePathWidth = (topBarLeftWidth: number) => {
      const width: number = (topBarLeftWidth - 32) / pagePathEl.length;
      pagePathEl.forEach((e: Element) =>
        e.setAttribute("style", `max-width:${width}px`)
      );
    };
    if (showAllComments) {
      if (innerWidth >= 385) {
        const newWidth = innerWidth - (12 + 385 + 5);
        topBarLeftEl?.setAttribute("style", `width: ${newWidth}px`);
        topBarPageToolEl?.setAttribute("style", "width:385px");
        changePathWidth(newWidth);
      } else {
        changePathWidth(innerWidth * 0.5);
        topBarLeftEl?.setAttribute("style", "width:50%");
        topBarPageToolEl?.setAttribute("style", "width:50%");
      }
    } else {
      topBarLeftEl?.setAttribute("style", "width:50%");
      changePathWidth(innerWidth * 0.5 - 26);
    }
  }, [showAllComments]);

  const onClickViewAllComments = useCallback(() => {
    if (!showAllComments) {
      setOpenPageMoreFun(false);
      changeAllCommentAndTopBarStyle();
    }
    setShowAllComments(!showAllComments);
  }, [changeAllCommentAndTopBarStyle, setShowAllComments, showAllComments]);

  const onClickMoreBtn = useCallback(() => {
    setOpenPageMoreFun((prev) => !prev);
    setShowAllComments(false);
  }, [setShowAllComments, setOpenPageMoreFun]);

  const returnFontFamily = (font: FrameFontStyleType) => {
    const style: CSSProperties = {
      fontFamily: font,
    };
    return style;
  };
  const changeFontStyle = useCallback(
    (event: MouseEvent, font: FrameFontStyleType) => {
      const currentTarget = event.currentTarget;
      const targetFontSample = currentTarget.firstElementChild;
      const fontSample = [...document.getElementsByClassName("font-sample")];
      fontSample.forEach((element: Element) => {
        element.classList.contains("on") && element.classList.remove("on");
      });
      targetFontSample && targetFontSample.classList.add("on");
      setSelectedFontStyle(font);
      switch (font) {
        case "default":
          setFontStyle(defaultFontFamily);
          break;
        case "serif":
          setFontStyle(serifFontFamily);
          break;
        case "mono":
          setFontStyle(monoFontFamily);
          break;
        default:
          break;
      }
    },
    [setFontStyle]
  );
  const changeFontSize = () => {
    setSmallText(!smallText);
  };

  const changeWidth = useCallback(() => {
    const width = window.innerWidth;
    !(width < 1024 && sideAppear === "lock") && setFullWidth(!fullWidth);
  }, [sideAppear, setFullWidth, fullWidth]);

  const onClickMoveTo = () => {
    setOpenPageMoreFun(false);
    setOpenPageMenu(!openPageMenu);
  };
  useEffect(() => {
    window.addEventListener("resize", changeAllCommentAndTopBarStyle);
    return () =>
      window.removeEventListener("resize", changeAllCommentAndTopBarStyle);
  }, [changeAllCommentAndTopBarStyle]);

  /**
   * pageMenu 창이 열려있을 경우, pageMenu 외의 구역을 클릭 시에 pageMenu 창을 닫는 기능
   */
  const closePageMenu = useCallback(
    (event: globalThis.MouseEvent) => {
      if (openPageMenu) {
        const target = event.target as HTMLElement | null;
        const isInnerMenu = target?.closest("#pageMenu");
        !isInnerMenu && setOpenPageMenu(false);
      }
    },
    [openPageMenu]
  );
  useEffect(() => {
    if (sideAppear === "float") {
      setTitle("Lock sideBar ");
    }
    if (sideAppear === "close") {
      setTitle("Open sideBar ");
    }
  }, [sideAppear]);

  useEffect(() => {
    inner?.addEventListener("click", closePageMenu);
    return () => {
      inner?.addEventListener("click", closePageMenu);
    };
  }, [inner, closePageMenu]);
  return (
    <div className="topBar">
      <div className="topBar__left">
        {sideAppear !== "lock" && (
          <button
            id="topBar__btn-sideBar"
            title={title}
            aria-label={title}
            onMouseEnter={onMouseEnterSidBarBtn}
            onClick={onClickSideBarBtn}
          >
            <ScreenOnly text={title} />
            {sideAppear === "float" ? (
              <FiChevronsLeft />
            ) : window.innerWidth >= 1024 ? (
              <AiOutlineMenu />
            ) : (
              <IoIosArrowBack />
            )}
          </button>
        )}
        <div className="page__path-group">
          {pagePath === null ? (
            <Link
              title="Link to move page"
              className="pagePath"
              to={makeRoutePath(page.id)}
            >
              <PageIcon
                icon={page.header.icon}
                iconType={page.header.iconType}
                style={undefined}
              />
              <div>{page.header.title}</div>
            </Link>
          ) : (
            pagePath.map((path: PathType) => (
              <div className="pagePath" key={pagePath.indexOf(path)}>
                {pagePath.indexOf(path) !== 0 && (
                  <div className="pathSlash">/</div>
                )}

                <Link className="page-link" to={makeRoutePath(path.id)}>
                  <div className="icon-path">
                    <PageIcon
                      icon={path.icon}
                      iconType={path.iconType}
                      style={undefined}
                    />
                  </div>
                  <div className="path-title">
                    <div>{path.title}</div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="topBar__page-tool">
        <button title="Share or publish to the web">Share</button>
        <button
          id="allCommentsBtn"
          title="View all comments"
          onClick={onClickViewAllComments}
        >
          <ScreenOnly text="View all comments" />
          <BiMessageDetail />
        </button>
        <button
          title="Pin this page in your sidebar"
          className={pageInFavorites ? "btn-favorite on" : "btn-favorite"}
          onClick={addOrRemoveFavorite}
        >
          <ScreenOnly text="Pin this page in your sidebar" />
          {pageInFavorites ? <AiFillStar /> : <AiOutlineStar />}
        </button>
        <button title=" Style, export, and more" onClick={onClickMoreBtn}>
          <ScreenOnly text="Style, export, and more" />
          <BsThreeDots />
        </button>
        {openPageMoreFun && (
          <div className="page-tool__more">
            <div className="inner">
              <div className="fontStyle">
                <div className="fontStyle__header">STYLE</div>
                <div className="fontStyle__btn-group">
                  {FONT_BTN_ARRAY.map((i) => (
                    <FontBtn
                      selectedFonStyle={selectedFontStyle}
                      fontStyle={i}
                      changeFontStyle={changeFontStyle}
                      returnFontFamily={returnFontFamily}
                    />
                  ))}
                </div>
              </div>
              <div className="size">
                <button
                  title={` button  ${
                    smallText ? "to change large text " : "to change small text"
                  }`}
                  onClick={changeFontSize}
                >
                  <div>Small text</div>
                  <label className="btn-switch">
                    <span className={smallText ? "slider on" : "slider"}></span>
                  </label>
                </button>
                <button
                  title={`button ${
                    fullWidth ? "to change small width" : "to change full width"
                  }`}
                  style={{ display: isMobile() ? "none" : "flex" }}
                  onClick={changeWidth}
                >
                  <div>Full width</div>
                  <label className="btn-switch">
                    <span className={fullWidth ? "slider on" : "slider"}></span>
                  </label>
                </button>
                <div></div>
              </div>
              <div className="function">
                <button
                  title={`button ${
                    pageInFavorites
                      ? "to remove from Favorites"
                      : "to add to Favorites"
                  }`}
                  className={
                    pageInFavorites ? "btn-favorite on" : "btn-favorite"
                  }
                  onClick={addOrRemoveFavorite}
                >
                  {pageInFavorites ? <AiFillStar /> : <AiOutlineStar />}
                  <span className="label">
                    {pageInFavorites
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </span>
                </button>
                <button
                  title="delete button"
                  onClick={() => deletePage(page.id)}
                >
                  <RiDeleteBin6Line />
                  <span className="label">Delete</span>
                </button>
                <button
                  title="button to move page to other page"
                  onClick={onClickMoveTo}
                >
                  <IoArrowRedoOutline />
                  <span className="label">Move to</span>
                </button>
                <button
                  title="button to export page"
                  style={{ display: isMobile() ? "none" : "flex" }}
                  onClick={() => {
                    setOpenExport(true);
                    setOpenPageMoreFun(false);
                  }}
                >
                  <GrDocumentUpload />
                  <div>
                    <span className="label">Export</span>
                    <span>PDF,HTML,Markdown</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {openPageMenu && (
          <PageMenu
            what="page"
            currentPage={page}
            firstList={firstList}
            pages={pages}
            closeMenu={() => setOpenPageMenu(false)}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(TopBar);
