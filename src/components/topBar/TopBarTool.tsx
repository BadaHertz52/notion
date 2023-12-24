import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import ScreenOnly from "../ScreenOnly";
import { BsThreeDots } from "react-icons/bs";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { ModalType, Page } from "../../types";
import { BiMessageDetail } from "react-icons/bi";
import { ActionContext } from "../../contexts";

type TopBarToolProps = {
  favorites: string[] | null;
  page: Page;
  setModal: Dispatch<SetStateAction<ModalType>>;
  closeModal: () => void;
};
const TopBarTool = ({ ...props }: TopBarToolProps) => {
  const { favorites, page, setModal } = props;

  const { addFavorites, removeFavorites } = useContext(ActionContext).actions;

  const pageInFavorites = favorites?.includes(page.id);

  const addOrRemoveFavorite = useCallback(() => {
    pageInFavorites ? removeFavorites(page.id) : addFavorites(page.id);
  }, [addFavorites, page.id, pageInFavorites, removeFavorites]);

  const onClickViewAllComments = () => {
    setModal((prev) =>
      prev.open && prev.target === "allComments"
        ? { target: "allComments", open: false }
        : {
            target: "allComments",
            open: true,
          }
    );
  };

  const onClickMoreBtn = () => {
    setModal({
      open: true,
      target: "topBarToolMore",
    });
  };

  return (
    <div id="top-bar__tool">
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
      <button
        className="btn-page-tool-more"
        title=" Style, export, and more"
        onClick={onClickMoreBtn}
      >
        <ScreenOnly text="Style, export, and more" />
        <BsThreeDots />
      </button>
      {/* //TODO -  modal , pageToolMore */}
      {/* {openPageMenu && (
      <PageMenu
        what="page"
        currentPage={page}
        firstList={firstList}
        pages={pages}
        closeMenu={() => setOpenPageMenu(false)}
      />
    )} */}
    </div>
  );
};

export default TopBarTool;
