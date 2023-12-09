import React, {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

import { FiCode, FiChevronsLeft } from "react-icons/fi";
import { AiOutlineClockCircle, AiOutlinePlus } from "react-icons/ai";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFillTrash2Fill, BsTrash } from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { HiTemplate } from "react-icons/hi";

import {
  ScreenOnly,
  RecentPages,
  Favorites,
  Private,
  SideBarMoreFn,
  Trash,
  Rename,
} from "../index";

import { ActionContext } from "../../contexts";
import {
  Block,
  ListItem,
  ModalType,
  Notion,
  Page,
  SideAppear,
} from "../../types";
import {
  closeModal,
  findPage,
  getBlockSample,
  getPageSample,
} from "../../utils";
import { UserState } from "../../modules/user/reducer";

import "../../assets/sideBar.scss";
import SideBarModal from "../modal/SideBarModal";
import { INITIAL_MODAL } from "../../constants";

export type SideBarProps = {
  notion: Notion;
  user: UserState;
  sideAppear: SideAppear;
  firstPages: Page[] | null;
  firstList: ListItem[] | null;
  setOpenQF?: Dispatch<SetStateAction<boolean>>;
  setOpenTemplates?: Dispatch<SetStateAction<boolean>>;
  showAllComments?: boolean;
};

const SideBar = ({
  notion,
  user,
  sideAppear,
  firstPages,
  firstList,
  showAllComments,
}: SideBarProps) => {
  const { addBlock, addPage, changeSide } = useContext(ActionContext).actions;
  const { pages, pagesId, trash } = notion;
  const trashPages = trash.pages;
  const trashPagesId = trash.pagesId;

  const trashBtnRef = useRef<HTMLButtonElement>(null);

  const [sideModal, setSideModal] = useState<ModalType>(INITIAL_MODAL);
  const [targetItem, setTargetItem] = useState<ListItem | null>(null);
  const [openTrash, setOpenTrash] = useState<boolean>(false);
  const [trashStyle, setTrashStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const recordIcon = user.userName.substring(0, 1);
  const size = window.innerWidth * 0.25;
  const itemSize = size >= 130 ? size : 130;
  const listHeight = itemSize;

  const addNewPage = () => {
    addPage(getPageSample());
  };

  const addNewSubPage = useCallback(
    (item: ListItem) => {
      if (pagesId && pages) {
        const targetPage = findPage(pagesId, pages, item.id);
        const newPageBlock: Block = {
          ...getBlockSample(),
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
    setTargetItem(item);

    const newModal: ModalType = {
      open: true,
      target: "sideBarMoreFn",
      pageId: item.id,
    };

    if (window.innerWidth > 768) {
      const domRect = target.getClientRects()[0];
      setSideModal({
        ...newModal,
        targetDomRect: domRect,
      });
    } else {
      setSideModal({
        ...newModal,
        isMobile: true,
      });
    }
  }, []);

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

  const onClickTrashBtn = useCallback(() => {
    setOpenTrash(true);
    changeTrashStyle();
  }, [changeTrashStyle]);

  const onMouseOutSideBar = useCallback(() => {
    sideAppear === "float" && changeSide("floatHide");
  }, [changeSide, sideAppear]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.addEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (sideAppear === "close") {
      setOpenTrash(false);
      setSideModal(INITIAL_MODAL);
    }
  }, [sideAppear]);

  return (
    <div
      id="sideBar-outBox"
      className="sideBar-lock"
      onMouseLeave={onMouseOutSideBar}
    >
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
                // onClick={
                //   //() => setOpenQF(true)
                // }
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
                // onClick={
                //   //() => setOpenTemplates(true)
                // }
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
      {pages && pagesId && firstList && (
        <SideBarModal
          user={user}
          targetItem={targetItem}
          pages={pages}
          pagesId={pagesId}
          firstList={firstList}
          sideModal={sideModal}
          setSideModal={setSideModal}
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
