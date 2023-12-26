import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";

import { Link } from "react-router-dom";

import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import { FiChevronsLeft } from "react-icons/fi";
import { PageIcon, ScreenOnly, TopBarModal, TopBarTool } from "../index";

import { ActionContext } from "../../contexts";
import {
  ListItem,
  Page,
  FontStyle,
  SideAppear,
  Path,
  ModalType,
} from "../../types";
import { makeRoutePath } from "../../utils";
import { INITIAL_MODAL } from "../../constants";

import "../../assets/topBar.scss";

type TopBarProps = {
  userName: string;
  firstList: ListItem[];
  favorites: string[] | null;
  sideAppear: SideAppear;
  page: Page;
  pages: Page[];
  pagePath: Path[] | null;
  smallText: boolean;
  setSmallText: Dispatch<SetStateAction<boolean>>;
  fullWidth: boolean;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
  setFontStyle: Dispatch<SetStateAction<FontStyle>>;
  openExportModal: () => void;
};

const TopBar = ({ ...props }: TopBarProps) => {
  const { sideAppear, page, pagePath } = props;

  const { changeSide } = useContext(ActionContext).actions;

  const [modal, setModal] = useState<ModalType>(INITIAL_MODAL);
  const [title, setTitle] = useState<string>("");

  const closeModal = useCallback(() => {
    setModal(INITIAL_MODAL);
  }, []);
  //sideBar --
  const onClickSideBarBtn = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      const targetTag = target.tagName.toLowerCase();
      const width = window.outerWidth;
      if (modal.open && width < 1024) {
        closeModal();
      }
      switch (targetTag) {
        case "button":
          target.id === "top-bar__btn-change-side-bar" && changeSide("lock");
          break;
        case "svg":
          target.parentElement?.id === "top-bar__btn-change-side-bar" &&
            changeSide("lock");
          break;
        case "path":
          target.parentElement?.parentElement?.id ===
            "top-bar__btn-change-side-bar" && changeSide("lock");
          break;
        default:
          break;
      }
    },
    [changeSide, modal.open, closeModal]
  );

  const onMouseEnterSidBarBtn = useCallback(() => {
    const innerWidth = window.innerWidth;
    if (innerWidth >= 1024) {
      sideAppear === "close" || sideAppear === "floatHide"
        ? changeSide("float")
        : changeSide("floatHide");
    }
  }, [changeSide, sideAppear]);

  useEffect(() => {
    if (sideAppear === "float") {
      setTitle("Lock sideBar ");
    }
    if (sideAppear === "close") {
      setTitle("Open sideBar ");
    }
  }, [sideAppear]);

  return (
    <div id="top-bar">
      <div id="top-bar__left">
        {sideAppear !== "lock" && (
          <button
            id="top-bar__btn-change-side-bar"
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
              className="page-path"
              to={makeRoutePath(page.id)}
            >
              <PageIcon
                icon={page.header.icon}
                iconType={page.header.iconType}
              />
              <div>{page.header.title}</div>
            </Link>
          ) : (
            pagePath.map((path: Path) => (
              <div className="page-path" key={pagePath.indexOf(path)}>
                {pagePath.indexOf(path) !== 0 && (
                  <div className="path-slash">/</div>
                )}

                <Link className="link-page" to={makeRoutePath(path.id)}>
                  <div className="icon-path">
                    <PageIcon icon={path.icon} iconType={path.iconType} />
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
      <TopBarTool {...props} setModal={setModal} closeModal={closeModal} />
      {modal.target && (
        <TopBarModal
          {...props}
          modal={modal}
          closeModal={closeModal}
          setModal={setModal}
        />
      )}
    </div>
  );
};

export default React.memo(TopBar);
