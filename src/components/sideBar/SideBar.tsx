import React, {
  CSSProperties,
  useEffect,
  useState,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

import { FiCode, FiChevronsLeft } from "react-icons/fi";

import {
  ScreenOnly,
  RecentPages,
  Favorites,
  Private,
  SideBarModal,
  FnGroup,
  NewPageBtn,
} from "../index";

import { INITIAL_MODAL } from "../../constants";
import { ActionContext } from "../../contexts";
import {
  Block,
  ListItem,
  ModalType,
  Notion,
  Page,
  SideAppear,
  UserState,
} from "../../types";
import { findPage, getBlockSample, getPageSample } from "../../utils";

import "../../assets/sideBar.scss";

export type SideBarProps = {
  notion: Notion;
  user: UserState;
  sideAppear: SideAppear;
  firstPages: Page[] | null;
  firstList: ListItem[] | null;
  setOpenQF?: Dispatch<SetStateAction<boolean>>;
  setOpenTemplates?: Dispatch<SetStateAction<boolean>>;
};

const SideBar = ({
  notion,
  user,
  sideAppear,
  firstPages,
  firstList,
}: SideBarProps) => {
  const { addBlock, addPage, changeSide } = useContext(ActionContext).actions;
  const { pages, pagesId, trash } = notion;

  const [sideModal, setSideModal] = useState<ModalType>(INITIAL_MODAL);
  const [targetItem, setTargetItem] = useState<ListItem | null>(null);
  const [innerListStyle, setInnerListStyle] = useState<
    CSSProperties | undefined
  >(undefined);

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
      setTargetItem(item);
    } else {
      if (sideModal.pageId !== item.id) {
        setSideModal({
          ...newModal,
          isMobile: true,
        });
        setTargetItem(item);
      }
    }
  }, []);

  const openQuickFindBoard = useCallback(() => {
    setSideModal({
      open: true,
      target: "quickFind",
    });
  }, [setSideModal]);

  const isAllComments = useCallback(
    () => !!document.querySelector("#all-comments"),
    []
  );

  const handleResize = useCallback(() => {
    if (window.innerWidth < 800 && sideAppear === "lock" && isAllComments()) {
      changeSide("close");
    }
  }, [changeSide, isAllComments, sideAppear]);

  const onClickTrashBtn = useCallback(() => {
    setSideModal({
      open: true,
      target: "trash",
    });
  }, []);

  const onMouseOutSideBar = useCallback(() => {
    sideAppear === "float" && changeSide("floatHide");
  }, [changeSide, sideAppear]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.addEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (sideAppear === "close") {
      setSideModal(INITIAL_MODAL);
    }
  }, [sideAppear]);

  const changeInnerStyle = () => {
    if (window.innerWidth <= 768) {
      const switcherEl = document.querySelector(".switcher");
      const recentPagesEl = document.querySelector(".recentPages");
      const mobileBtnGroupEl = document.querySelector(".mobile-btn-group");
      if (switcherEl && recentPagesEl && mobileBtnGroupEl) {
        const height =
          window.innerHeight -
          switcherEl.clientHeight -
          recentPagesEl.clientHeight -
          mobileBtnGroupEl.clientHeight;
        setInnerListStyle({
          maxHeight: height - 35,
        });
      }
    } else {
      setInnerListStyle({
        maxHeight: window.innerHeight * 0.5,
      });
    }
  };
  useEffect(() => {
    changeInnerStyle();
  }, [user.recentPagesId]);

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
                    <div className="userId">{user.userName}'s Notion</div>
                  </div>
                </div>
                <button
                  title="button to close side menu"
                  className="btn-close-sideBar top-bar__btn-change-side-bar"
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
            <div className="sideBar__inner__list" style={innerListStyle}>
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
            <FnGroup
              openQuickFindBoard={openQuickFindBoard}
              onClickTrashBtn={onClickTrashBtn}
            />
          </div>
          <NewPageBtn addNewPage={addNewPage} />
          <div className="mobile-btn-group">
            <FnGroup
              openQuickFindBoard={openQuickFindBoard}
              onClickTrashBtn={onClickTrashBtn}
            />
            <NewPageBtn addNewPage={addNewPage} />
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
          trash={trash}
          sideModal={sideModal}
          setSideModal={setSideModal}
        />
      )}
    </div>
  );
};

export default React.memo(SideBar);
