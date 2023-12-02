import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  TouchEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  MouseEvent,
} from "react";

import { ActionContext } from "../../contexts";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineStar } from "react-icons/ai";
import { HiOutlineDuplicate } from "react-icons/hi";
import { BsPencilSquare } from "react-icons/bs";
import { IoArrowRedoOutline } from "react-icons/io5";

import { ScreenOnly, PageIcon, Time } from "../index";

import { UserState } from "../../modules/user/reducer";
import { ListItem } from "../../types";

type SideBarMoreFnProps = {
  user: UserState;
  moreFnStyle: CSSProperties | undefined;
  setMoreFnStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  targetItem: ListItem | null;
  setOpenRename: Dispatch<SetStateAction<boolean>>;
  target: HTMLElement | null;
  setRenameStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  setOpenPageMenu: Dispatch<SetStateAction<boolean>>;
  setPageMenuStyle: Dispatch<SetStateAction<CSSProperties | undefined>>;
  closeSideMoreFn: () => void;
};

function SideBarMoreFn({
  user,
  moreFnStyle,
  setMoreFnStyle,
  targetItem,
  setOpenRename,
  target,
  setRenameStyle,
  setOpenPageMenu,
  setPageMenuStyle,
  closeSideMoreFn,
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
        if (innerHeight * 0.9 <= clientY) {
          setMoreFnStyle(undefined);
          touchResizeBar.current = false;
        } else {
          clientY >= 120 &&
            setMoreFnStyle({
              transform: `translateY(${clientY}px)`,
            });
        }
      }
    },
    [setMoreFnStyle]
  );
  const onTouchStartResizeBar = useCallback(() => {
    touchResizeBar.current = true;
  }, []);
  const onClickToDelete = useCallback(() => {
    closeSideMoreFn();
    if (targetItem) {
      deletePage(targetItem.id);
    }
  }, [deletePage, targetItem, closeSideMoreFn]);

  const onClickToRemoveFavorite = useCallback(() => {
    closeSideMoreFn();
    targetItem && removeFavorites(targetItem.id);
  }, [targetItem, removeFavorites, closeSideMoreFn]);

  const onClickToAddFavorite = useCallback(() => {
    closeSideMoreFn();
    targetItem && addFavorites(targetItem.id);
  }, [addFavorites, targetItem, closeSideMoreFn]);

  const onClickToDuplicate = useCallback(() => {
    closeSideMoreFn();
    targetItem && duplicatePage(targetItem.id);
  }, [targetItem, duplicatePage, closeSideMoreFn]);

  const onClickToRename = useCallback(() => {
    closeSideMoreFn();
    setOpenRename(true);
    if (targetItem && target && target?.parentElement) {
      const domRect = target.parentElement.getClientRects()[0];
      setRenameStyle({
        position: "absolute",
        top: domRect.bottom,
        left: domRect.left + 10,
      });
    }
  }, [target, targetItem, setRenameStyle, setOpenRename, closeSideMoreFn]);

  const onClickMoveToBtn = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const targetDomRect = target?.getClientRects()[0];
      console.log("ta", targetDomRect, target);
      if (window.innerWidth > 768) {
        setPageMenuStyle({
          top: moreFnStyle ? moreFnStyle.top : "50%",
          left: moreFnStyle ? moreFnStyle.left : "50%",
        });
      } else {
        //mobile
        setTimeout(() => {
          setPageMenuStyle({
            top: 0,
            left: 0,
          });
        }, 500);
      }
      setOpenPageMenu(true);
      closeSideMoreFn();
    },
    [setOpenPageMenu, setPageMenuStyle, moreFnStyle, closeSideMoreFn]
  );
  useEffect(() => {
    if (moreFnRef.current) {
      if (moreFnStyle) {
        moreFnRef.current.classList.remove("hide");
        if (window.innerWidth <= 768) {
          setTimeout(() => moreFnRef.current?.classList.add("on"), 500);
        } else {
          moreFnRef.current.classList.add("on");
        }
      } else {
        //close
        const classList = moreFnRef.current.classList;
        classList.contains("on") && moreFnRef.current.classList.remove("on");
        if (!classList.contains("hide")) {
          moreFnRef.current.classList.add("hide");
        }
      }
    }
  }, [moreFnStyle]);

  return (
    <div
      id="sideBar__moreFn"
      className="sideBar__moreFn hide"
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
