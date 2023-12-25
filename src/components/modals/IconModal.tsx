import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { CSSProperties } from "styled-components";

import { BsEmojiSmile } from "react-icons/bs";

import { ScreenOnly, EmojiIcon, ModalPortal } from "../index";

import { ActionContext } from "../../contexts";
import { Block, IconType, Page, Emoji, ModalType } from "../../types";
import { EMOJI_ARRAY } from "../../constants";
import {
  setOriginTemplateItem,
  randomEmojiIcon,
  changeImgToWebP,
  getEditTime,
  isInTarget,
} from "../../utils";

import "../../assets/iconMenu.scss";

type IconModalProps = {
  isOpen: boolean;
  currentPageId?: string;
  block?: Block;
  page: Page;
  style?: CSSProperties;
  closeIconModal: () => void;
};
const IconModal = ({
  isOpen,
  currentPageId,
  block,
  page,
  style,
  closeIconModal,
}: IconModalProps) => {
  const { editBlock, editPage } = useContext(ActionContext).actions;

  const EMOJI = "emoji";
  const IMAGE = "image";

  type Category = typeof EMOJI | typeof IMAGE;
  const [category, setCategory] = useState<Category>(EMOJI);

  const changePageIcon = useCallback(
    (icon: string | Emoji | null, iconType: IconType) => {
      const editTime = getEditTime();
      setOriginTemplateItem(page);
      const editedPage: Page = {
        ...page,
        header: {
          ...page.header,
          iconType: iconType,
          icon: icon,
        },
        editTime: editTime,
      };
      editPage(page.id, editedPage);
      if (block && currentPageId) {
        const editedBlock: Block = {
          ...block,
          iconType: iconType,
          icon: icon,
          editTime: editTime,
        };
        editBlock(currentPageId, editedBlock);
      }
      closeIconModal();
    },
    [block, currentPageId, editBlock, editPage, page, closeIconModal]
  );

  const removeIcon = () => {
    changePageIcon(null, null);
  };

  const onClickRandom = () => {
    changePageIcon(randomEmojiIcon(), "emoji");
  };

  const changeImg = useCallback(
    (src: string) => {
      changePageIcon(src, "img");
    },
    [changePageIcon]
  );

  const onChangeImgIcon = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          const result = reader.result as string;
          if (file.type.includes("gif") || file.type.includes("webP")) {
            changePageIcon(result, "img");
          } else {
            changeImgToWebP(reader, changeImg);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [changePageIcon, changeImg]
  );

  const handleCloseModal = useCallback(
    (event: globalThis.MouseEvent) => {
      const TARGET = ["#icon-menu", ".page__icon"];

      if (!TARGET.map((v) => isInTarget(event, v)).some((v) => v))
        closeIconModal();
    },
    [closeIconModal]
  );

  useEffect(() => {
    document.addEventListener("click", handleCloseModal);
    return () => document.removeEventListener("click", handleCloseModal);
  }, [handleCloseModal]);

  return (
    <ModalPortal isOpen={isOpen} id="modal-icon" style={style}>
      <div id="icon-menu">
        <div className="inner">
          <div className="header">
            <div className="category">
              <div className="btn-category">
                <button
                  title="button to open EMOJI_ARRAY"
                  onClick={() => setCategory(EMOJI)}
                >
                  Emoji
                </button>
                {category === EMOJI && <span className="bottom-line"></span>}
              </div>
              <div className="btn-category">
                <button
                  title="button to open form to upload image"
                  onClick={() => setCategory(IMAGE)}
                >
                  Upload image
                </button>
                {category === IMAGE && <span className="bottom-line"></span>}
              </div>
            </div>
            <div>
              <button
                title="button to select random emoji as icon"
                onClick={onClickRandom}
              >
                <BsEmojiSmile />
                Random
              </button>
              <button title="button to remove icon" onClick={removeIcon}>
                Remove
              </button>
            </div>
          </div>
          <div className="body">
            {category === EMOJI ? (
              EMOJI_ARRAY.map((i: Emoji) => (
                <button
                  key={`emoji_${i}`}
                  title={`button to select ${i} emoji`}
                  className="btn-emoji"
                  onClick={() => changePageIcon(i, "emoji")}
                >
                  <ScreenOnly text={`button to select ${i} emoji`} />
                  <EmojiIcon icon={i} />
                </button>
              ))
            ) : (
              <div className="iconModal__body__imgIcon">
                <label htmlFor="inputImgIcon" className="label-inputImgIcon">
                  Choose an image
                </label>
                <input
                  id="inputImgIcon"
                  name="inputImgIcon"
                  type="file"
                  accept="image/*"
                  onChange={onChangeImgIcon}
                />
                <div>Recommended size 280 x 280 pixels</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default React.memo(IconModal);
