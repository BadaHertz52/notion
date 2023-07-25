import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  TouchEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import ScreenOnly from "./ScreenOnly";
import PageIcon from "./PageIcon";
import { ListItem } from "../modules/notion/type";
import { ActionContext } from "../containers/NotionRouter";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineStar } from "react-icons/ai";
import { HiOutlineDuplicate } from "react-icons/hi";
import { BsPencilSquare } from "react-icons/bs";
import { IoArrowRedoOutline } from "react-icons/io5";
import Time from "./Time";
import { UserState } from "../modules/user/reducer";
type SideBarMoreFnProps = {
  user: UserState;
  moreFnStyle: CSSProperties | undefined;
  setMoreFnStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  targetItem: ListItem | null;
  setOpenSideMoreMenu: Dispatch<SetStateAction<boolean>>;
  setOpenRename: Dispatch<SetStateAction<boolean>>;
  target: HTMLElement | null;
  setRenameStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  setOpenPageMenu: Dispatch<SetStateAction<boolean>>;
  setPageMenuStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
};
function SideBarMoreFn({
  user,
  moreFnStyle,
  setMoreFnStyle,
  targetItem,
  setOpenSideMoreMenu,
  setOpenRename,
  target,
  setRenameStyle,
  setOpenPageMenu,
  setPageMenuStyle,
}: SideBarMoreFnProps) {
  const moreFnRef = useRef<HTMLDivElement>(null);
  const { deletePage, removeFavorites, addFavorites, duplicatePage } =
    useContext(ActionContext).actions;
  const touchResizeBar = useRef<boolean>(false);
  const onTouchMoveSideBar = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (touchResizeBar.current) {
        const clientY = event.changedTouches[0].clientY;
        const innerHeight = window.innerHeight;
        if (innerHeight - 50 <= clientY) {
          setMoreFnStyle(undefined);
          touchResizeBar.current = false;
        } else {
          setMoreFnStyle({
            display: "block",
            transform: `translateY(${clientY}px)`,
          });
        }
      }
    },
    []
  );
  const onTouchStartResizeBar = useCallback(() => {
    touchResizeBar.current = true;
  }, []);
  const onClickToDelete = useCallback(() => {
    setOpenSideMoreMenu(false);
    if (targetItem) {
      deletePage(targetItem.id);
    }
  }, [deletePage, targetItem, setOpenSideMoreMenu]);

  const onClickToRemoveFavorite = useCallback(() => {
    setOpenSideMoreMenu(false);
    targetItem && removeFavorites(targetItem.id);
  }, [targetItem, removeFavorites, setOpenSideMoreMenu]);

  const onClickToAddFavorite = useCallback(() => {
    setOpenSideMoreMenu(false);
    targetItem && addFavorites(targetItem.id);
  }, [addFavorites, targetItem, setOpenSideMoreMenu]);

  const onClickToDuplicate = useCallback(() => {
    setOpenSideMoreMenu(false);
    targetItem && duplicatePage(targetItem.id);
  }, [targetItem, duplicatePage, setOpenSideMoreMenu]);

  const onClickToRename = useCallback(() => {
    setOpenSideMoreMenu(false);
    setOpenRename(true);
    if (targetItem && target && target?.parentElement) {
      const domRect = target.parentElement.getClientRects()[0];
      setRenameStyle({
        position: "absolute",
        top: domRect.bottom,
        left: domRect.left + 10,
      });
    }
  }, [target, targetItem, setRenameStyle, setOpenRename, setOpenSideMoreMenu]);

  const onClickMoveToBtn = useCallback(() => {
    setOpenPageMenu(true);
    setOpenSideMoreMenu(false);
    if (window.innerWidth > 768) {
      setPageMenuStyle({
        position: "absolute",
        top: "50%",
        left: "50%",
      });
    }
  }, []);

  useEffect(() => {
    if (!moreFnStyle && moreFnRef.current) {
      moreFnRef.current.classList.toggle("on");
    }
  }, [moreFnStyle]);
  return (
    <div
      id="sideBar__moreFn"
      className="sideBar__moreFn"
      ref={moreFnRef}
      style={moreFnStyle}
      onTouchMove={onTouchMoveSideBar}
    >
      <button
        title="button to resize sideBar__moreFn "
        className="resizeBar"
        onTouchStart={onTouchStartResizeBar}
      >
        <ScreenOnly text="button to resize sideBar__moreFn" />
        <div></div>
      </button>
      {targetItem && (
        <div className="page__inform">
          <PageIcon
            icon={targetItem.icon}
            iconType={targetItem.iconType}
            style={undefined}
          />
          <div className="page__title">{targetItem.title}</div>
        </div>
      )}
      <button
        title="button to delete"
        className="moreFn__btn btn-delete"
        onClick={onClickToDelete}
      >
        <div>
          <RiDeleteBin6Line />
          <span>Delete</span>
        </div>
      </button>
      {targetItem && user.favorites?.includes(targetItem.id) ? (
        <button
          title="button to remove to favorite"
          className="moreFn__btn"
          onClick={onClickToRemoveFavorite}
        >
          <div>
            <AiOutlineStar />
            <span>Remove to Favorites</span>
          </div>
        </button>
      ) : (
        <button
          title="button to add to favorite"
          className="moreFn__btn"
          onClick={onClickToAddFavorite}
        >
          <div>
            <AiOutlineStar />
            <span>Add to Favorites</span>
          </div>
        </button>
      )}
      <button
        title="button to duplicate"
        className="moreFn__btn"
        onClick={onClickToDuplicate}
      >
        <div>
          <HiOutlineDuplicate />
          <span>Duplicate</span>
          <span></span>
        </div>
      </button>
      <button
        title="button to rename"
        className="moreFn__btn"
        onClick={onClickToRename}
      >
        <div>
          <BsPencilSquare />
          <span>Rename</span>
        </div>
      </button>
      <button
        title="button to move  it to other page"
        className="moreFn__btn"
        onClick={onClickMoveToBtn}
      >
        <div>
          <IoArrowRedoOutline />
          <span>Move to</span>
        </div>
      </button>
      <div className="edit__inform">
        <p>Last edited by {user.userName}</p>
        {targetItem && <Time editTime={targetItem.editTime} />}
      </div>
    </div>
  );
}

export default React.memo(SideBarMoreFn);
