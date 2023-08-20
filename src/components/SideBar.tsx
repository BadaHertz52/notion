import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { blockSample, pageSample } from "../modules/notion/reducer";
import { Block, ListItem, Notion, Page } from "../modules/notion/type";
import { closeModal, findPage } from "../fn";
import { UserState } from "../modules/user/reducer";
import Trash from "./Trash";
import Rename from "./Rename";

import PageMenu from "./PageMenu";

import { SideBarContainerProp } from "../containers/SideBarContainer";

//react-icon
import { FiCode, FiChevronsLeft } from "react-icons/fi";
import { AiOutlineClockCircle, AiOutlinePlus } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFillTrash2Fill, BsTrash } from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { HiTemplate } from "react-icons/hi";

import { ActionContext } from "../route/NotionRouter";
import ScreenOnly from "./ScreenOnly";
import RecentPages from "./RecentPages";
import Favorites from "./Favorites";
import Private from "./Private";
import SideBarMoreFn from "./SideBarMoreFn";

type SideBarProps = SideBarContainerProp & {
  notion: Notion;
  user: UserState;
};

const SideBar = ({
  notion,
  user,
  sideAppear,
  setOpenQF,
  setOpenTemplates,
  showAllComments,
}: SideBarProps) => {
  const { addBlock, addPage, changeSide } = useContext(ActionContext).actions;
  const inner = document.getElementById("inner");
  const { pages, pagesId, trash, firstPagesId } = notion;

  const trashPages = trash.pages;
  const trashPagesId = trash.pagesId;
  const firstPages: Page[] | null = useMemo(
    () =>
      pagesId && pages && firstPagesId
        ? firstPagesId.map((id: string) => findPage(pagesId, pages, id) as Page)
        : null,
    [firstPagesId, pagesId, pages]
  );

  const firstList: ListItem[] | null = useMemo(
    () =>
      firstPages
        ? firstPages.map((page: Page) => {
            return {
              id: page.id,
              title: page.header.title,
              iconType: page.header.iconType,
              icon: page.header.icon,
              subPagesId: page.subPagesId,
              parentsId: page.parentsId,
              editTime: page.editTime,
              createTime: page.createTime,
            };
          })
        : null,
    [firstPages]
  );
  const trashBtnRef = useRef<HTMLButtonElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [targetItem, setTargetItem] = useState<ListItem | null>(null);
  const [targetPage, setTargetPage] = useState<Page | null>(null);
  const [openTrash, setOpenTrash] = useState<boolean>(false);
  const [openSideMoreMenu, setOpenSideMoreMenu] = useState<boolean>(false);
  const [openPageMenu, setOpenPageMenu] = useState<boolean>(false);
  const [openRename, setOpenRename] = useState<boolean>(false);
  const [trashStyle, setTrashStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [moreFnStyle, setMoreFnStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const [renameStyle, setRenameStyle] = useState<CSSProperties>();
  const [pageMenuStyle, setPageMenuStyle] = useState<CSSProperties>();

  const recordIcon = user.userName.substring(0, 1);
  const size = window.innerWidth * 0.25;
  const itemSize = size >= 130 ? size : 130;
  const listHeight = itemSize;

  const addNewPage = () => {
    addPage(pageSample);
  };

  const addNewSubPage = useCallback(
    (item: ListItem) => {
      if (pagesId && pages) {
        const targetPage = findPage(pagesId, pages, item.id);
        const newPageBlock: Block = {
          ...blockSample,
          contents: "untitle",
          type: "page",
          parentBlocksId: null,
        };
        if (targetPage.blocksId === null) {
          addBlock(targetPage.id, newPageBlock, 0, null);
        } else {
          addBlock(
            targetPage.id,
            newPageBlock,
            targetPage.blocksId.length,
            targetPage.firstBlocksId === null
              ? null
              : targetPage.firstBlocksId[targetPage.firstBlocksId.length - 1]
          );
        }
      }
    },
    [addBlock, pages, pagesId]
  );

  const onClickMoreBtn = useCallback((item: ListItem, target: HTMLElement) => {
    setOpenSideMoreMenu(true);
    setTargetItem(item);
    setTarget(target);
    if (window.innerWidth > 768) {
      const position = target.getClientRects()[0];
      setMoreFnStyle({
        top: position.top,
        left: position.right,
      });
    } else {
      const moreFnEl = document.querySelector("#sideBar__moreFn");
      if (moreFnEl) {
        moreFnEl.classList.add("on");
        setTimeout(() => {
          setMoreFnStyle({
            transform: "translateY(50vh)",
          });
        }, 500);
      }
    }
  }, []);
  const handleClickToCloseModal = useCallback(
    (event: globalThis.MouseEvent) => {
      if (openSideMoreMenu) {
        const target = event.target as HTMLElement | null;
        if (target?.parentElement?.className !== "resizeBar") {
          closeModal("sideBar__moreFn", setOpenSideMoreMenu, event);
          if (window.innerWidth > 768) {
            setMoreFnStyle(undefined);
          } else {
            setMoreFnStyle({
              display: "block",
              transform: "translateY(100vh)",
            });
            setTimeout(() => {
              setMoreFnStyle(undefined);
            }, 500);
          }
        }
      }
      openPageMenu && closeModal("pageMenu", setOpenPageMenu, event);
      openRename && closeModal("rename", setOpenRename, event);
      openTrash && closeModal("trash", setOpenTrash, event);
    },
    [openPageMenu, openRename, openSideMoreMenu, openTrash]
  );
  const changeTrashStyle = useCallback(() => {
    const innerWidth = window.innerWidth;
    if (innerWidth > 768 && trashBtnRef.current) {
      const domRect = trashBtnRef.current.getClientRects()[0];
      if (domRect) {
        setTrashStyle({
          top: domRect.top - 100,
          left:
            window.innerWidth > 768
              ? domRect.right + 50
              : window.innerWidth * 0.2,
        });
      }
    }
  }, [trashBtnRef]);
  const handleResize = useCallback(() => {
    if (window.innerWidth < 800 && sideAppear === "lock" && showAllComments) {
      changeSide("close");
    }
    openTrash && changeTrashStyle();
  }, [changeSide, changeTrashStyle, openTrash, showAllComments, sideAppear]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.addEventListener("resize", handleResize);
  }, [handleResize]);

  const onClickTrashBtn = useCallback(() => {
    setOpenTrash(true);
    changeTrashStyle();
  }, [changeTrashStyle]);
  const onMouseOutSideBar = useCallback(() => {
    sideAppear === "float" && changeSide("floatHide");
  }, [changeSide, sideAppear]);

  useEffect(() => {
    inner?.addEventListener("click", handleClickToCloseModal);

    return () => {
      inner?.removeEventListener("click", handleClickToCloseModal);
    };
  }, [inner, handleClickToCloseModal]);

  useEffect(() => {
    if (targetItem && pagesId && pages) {
      const page = findPage(pagesId, pages, targetItem.id);
      setTargetPage(page);
    }
  }, [targetItem, pages, pagesId]);

  useEffect(() => {
    if (sideAppear === "close") {
      setOpenTrash(false);
      setMoreFnStyle(undefined);
    }
  }, [sideAppear]);
  return (
    <div className="sideBar-outbox" onMouseLeave={onMouseOutSideBar}>
      <div className="sideBar">
        <div className="sideBar__inner">
          <div className="sideBar__inner_top">
            <div className="switcher">
              <div className="item__inner">
                <div>
                  <div className="record-icon">
                    <div>{recordIcon}</div>
                  </div>
                  <div className="user">
                    <div className="userId">
                      <div>{user.userName}'s Notion</div>
                      <div>
                        <FiCode />
                      </div>
                    </div>
                    <div className="userEmail">
                      <div>{user.userEmail}</div>
                    </div>
                  </div>
                </div>
                <button
                  title="button to close side menu"
                  className="closeSideBarBtn topBar__btn-sideBar"
                  onClick={() => changeSide("close")}
                >
                  <ScreenOnly text="button to close side menu" />
                  <FiChevronsLeft />
                </button>
              </div>
            </div>
            {/* recentPages - 모바일 */}
            <RecentPages
              pages={pages}
              pagesId={pagesId}
              recentPagesId={user.recentPagesId}
              listHeight={listHeight}
              itemSize={itemSize}
            />
            <div className="fn-group-1">
              <button
                title="button to open quick find board"
                onClick={() => setOpenQF(true)}
              >
                <div className="item__inner">
                  <BiSearchAlt2 />
                  <span>Quick Find</span>
                </div>
              </button>
              <div>
                <div className="item__inner">
                  <AiOutlineClockCircle />
                  <span>All Updates</span>
                </div>
              </div>
              <div>
                <div className="item__inner">
                  <IoIosSettings />
                  <span>Setting &amp; Members</span>
                </div>
              </div>
            </div>
            <div className="sideBar__inner__list">
              <Favorites
                favorites={user.favorites}
                notion={notion}
                pages={pages}
                pagesId={pagesId}
                onClickMoreBtn={onClickMoreBtn}
                addNewSubPage={addNewSubPage}
              />

              <Private
                notion={notion}
                firstPages={firstPages}
                addNewPage={addNewPage}
                addNewSubPage={addNewSubPage}
                onClickMoreBtn={onClickMoreBtn}
              />
            </div>
            <div className="fn-group-2">
              <button
                title="button to open templates"
                onClick={() => setOpenTemplates(true)}
              >
                <div className="item__inner">
                  <HiTemplate />
                  <span>Templates</span>
                </div>
              </button>
              <button
                title="button to open form that has deleted pages"
                onClick={onClickTrashBtn}
                ref={trashBtnRef}
              >
                <div className="item__inner">
                  <BsFillTrash2Fill />
                  <span>Trash</span>
                </div>
              </button>
            </div>
          </div>
          <div className="mobile-trash-btn-container">
            <button
              title="open form that has deleted page"
              className="trashBtn"
              onClick={onClickTrashBtn}
            >
              <div className="header">TRASH</div>
              <BsTrash />
            </button>
          </div>
          {/* <a href="https://icons8.com/icon/11732/페이지-개요">페이지 개요 icon by Icons8</a> */}
          <div className="addNewPageBtn">
            <button title="make new page" onClick={addNewPage}>
              <AiOutlinePlus />
              <span>New page</span>
            </button>
          </div>
        </div>
      </div>
      <SideBarMoreFn
        user={user}
        moreFnStyle={moreFnStyle}
        setMoreFnStyle={setMoreFnStyle}
        targetItem={targetItem}
        setOpenSideMoreMenu={setOpenSideMoreMenu}
        setOpenRename={setOpenRename}
        target={target}
        setRenameStyle={setRenameStyle}
        setOpenPageMenu={setOpenPageMenu}
        setPageMenuStyle={setPageMenuStyle}
      />

      {openPageMenu && targetItem && firstList && pages && pagesId && (
        <div id="sideBar__pageMenu" style={pageMenuStyle}>
          <PageMenu
            what="page"
            currentPage={findPage(pagesId, pages, targetItem.id)}
            pages={pages}
            firstList={firstList}
            closeMenu={() => setOpenSideMoreMenu(false)}
          />
        </div>
      )}
      {openRename && targetPage && (
        <Rename
          currentPageId={null}
          block={null}
          page={targetPage}
          renameStyle={renameStyle}
          setOpenRename={setOpenRename}
        />
      )}
      <Trash
        style={trashStyle}
        trashPagesId={trashPagesId}
        trashPages={trashPages}
        pagesId={pagesId}
        pages={pages}
        openTrash={openTrash}
        setOpenTrash={setOpenTrash}
      />
    </div>
  );
};

export default React.memo(SideBar);
