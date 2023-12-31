import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useRef,
  MouseEvent,
} from "react";

import { ActionContext } from "../../contexts";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineStar } from "react-icons/ai";
import { HiOutlineDuplicate } from "react-icons/hi";
import { BsPencilSquare } from "react-icons/bs";
import { IoArrowRedoOutline } from "react-icons/io5";

import { PageIcon, Time } from "../index";

import { ListItem, ModalType, ModalTargetType, UserState } from "../../types";

type SideBarMoreFnProps = {
  user: UserState;
  targetItem: ListItem | null;
  setSideModal: Dispatch<SetStateAction<ModalType>>;
  closeModal: () => void;
};

const SideBarMoreFn = ({
  user,
  targetItem,
  setSideModal,
  closeModal,
}: SideBarMoreFnProps) => {
  const moreFnRef = useRef<HTMLDivElement>(null);

  const { deletePage, removeFavorites, addFavorites, duplicatePage } =
    useContext(ActionContext).actions;

  const handleClickMenu = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { name } = event.currentTarget;
      if (targetItem?.id) {
        const { id } = targetItem;
        switch (name) {
          case "delete":
            deletePage(id);
            break;
          case "removeFavorite":
            removeFavorites(id);
            break;
          case "addFavorite":
            addFavorites(id);
            break;
          case "duplicate":
            duplicatePage(id);
            break;
          default:
            break;
        }
      }
      closeModal();
    },
    [
      targetItem,
      closeModal,
      addFavorites,
      deletePage,
      duplicatePage,
      removeFavorites,
    ]
  );
  const openOtherSideModal = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (targetItem?.id && moreFnRef.current) {
        const { name } = event.currentTarget;

        const domRect = moreFnRef.current.getClientRects()[0];

        const newModal: ModalType = {
          open: true,
          target: name as ModalTargetType,
          pageId: targetItem.id,
          targetDomRect: domRect,
        };
        if (window.innerWidth > 768) {
          setSideModal(newModal);
        } else {
          setSideModal({ ...newModal, isMobile: true });
        }
      }
    },
    [targetItem?.id, setSideModal]
  );

  return (
    <div id="sideBar__moreFn" className="sideBar__moreFn" ref={moreFnRef}>
      <div className="inner">
        {/*mobile ---*/}
        {targetItem && (
          <div className="page__inform">
            <PageIcon icon={targetItem.icon} iconType={targetItem.iconType} />
            <div className="page__title">{targetItem.title}</div>
          </div>
        )}
        {/*---mobile*/}
        <button
          title="button to delete"
          name="delete"
          className="moreFn__btn btn-delete"
          onClick={handleClickMenu}
        >
          <div>
            <RiDeleteBin6Line />
            <span>Delete</span>
          </div>
        </button>
        {targetItem && user.favorites?.includes(targetItem.id) ? (
          <button
            title="button to remove to favorite"
            name="removeFavorite"
            className="moreFn__btn"
            onClick={handleClickMenu}
          >
            <div>
              <AiOutlineStar />
              <span>Remove to Favorites</span>
            </div>
          </button>
        ) : (
          <button
            title="button to add to favorite"
            name="addToFavorite"
            className="moreFn__btn"
            onClick={handleClickMenu}
          >
            <div>
              <AiOutlineStar />
              <span>Add to Favorites</span>
            </div>
          </button>
        )}
        <button
          title="button to duplicate"
          name="duplicate"
          className="moreFn__btn"
          onClick={handleClickMenu}
        >
          <div>
            <HiOutlineDuplicate />
            <span>Duplicate</span>
            <span></span>
          </div>
        </button>
        <button
          title="button to rename"
          name="rename"
          className="moreFn__btn"
          onClick={openOtherSideModal}
        >
          <div>
            <BsPencilSquare />
            <span>Rename</span>
          </div>
        </button>
        <button
          title="button to move  it to other page"
          name="pageMenu"
          className="moreFn__btn"
          onClick={openOtherSideModal}
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
    </div>
  );
};

export default React.memo(SideBarMoreFn);
