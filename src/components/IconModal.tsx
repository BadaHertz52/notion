import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { CSSProperties } from "styled-components";
import { ActionContext } from "../route/NotionRouter";
import { Block, IconType, Page, Emoji } from "../modules/notion/type";
import { EMOJI_ARR, randomEmojiIcon } from "../modules/notion/emojiData";
import { setTemplateItem } from "../fn";
import ScreenOnly from "./ScreenOnly";
import EmojiIcon from "./EmojiIcon";

type IconModalProps = {
  currentPageId: string | null;
  block: Block | null;
  page: Page;
  style: CSSProperties | undefined;
  setOpenIconModal: Dispatch<SetStateAction<boolean>>;
};
const IconModal = ({
  currentPageId,
  block,
  page,
  style,
  setOpenIconModal,
}: IconModalProps) => {
  const { editBlock, editPage } = useContext(ActionContext).actions;
  const EMOJI = "emoji";
  const IMAGE = "image";
  type Category = typeof EMOJI | typeof IMAGE;
  const [category, setCategory] = useState<Category>(EMOJI);

  const changePageIcon = useCallback(
    (icon: string | Emoji | null, iconType: IconType) => {
      const editTime = JSON.stringify(Date.now());
      const templateHtml = document.getElementById("template");
      setTemplateItem(templateHtml, page);
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
      setOpenIconModal(false);
    },
    [block, currentPageId, editBlock, editPage, page, setOpenIconModal]
  );
  const removeIcon = () => {
    changePageIcon(null, null);
  };

  const onClickRandom = () => {
    changePageIcon(randomEmojiIcon(), "emoji");
  };

  const onChangeImgIcon = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          const result = reader.result as string;
          changePageIcon(result, "img");
        };
        reader.readAsDataURL(file);
      }
    },
    [changePageIcon]
  );

  const inner = document.getElementById("inner");
  const closeIconModal = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const isInIconModal = target?.closest("#iconModal");
      if (target?.id !== "inputImgIcon") {
        !isInIconModal && setOpenIconModal(false);
      }
    },
    [setOpenIconModal]
  );
  useEffect(() => {
    inner?.addEventListener("click", closeIconModal);
    return () => inner?.removeEventListener("click", closeIconModal);
  }, [inner, closeIconModal]);
  return (
    <div id="iconModal" style={style}>
      <div className="inner">
        <div className="header">
          <div className="category">
            <div className="btn-category">
              <button
                title="button to open EMOJI_ARR"
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
            EMOJI_ARR.map((i: Emoji) => (
              <button
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
  );
};

export default React.memo(IconModal);
