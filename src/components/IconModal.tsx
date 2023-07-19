import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
} from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { CSSProperties } from "styled-components";
import { ActionContext } from "../containers/NotionRouter";
import { Block, emojiPath, IconType, Page } from "../modules/notion";
import { setTemplateItem } from "../fn";
import { detectRange } from "./BlockFn";
import ScreenOnly from "./ScreenOnly";
const smileEmoji = "smile";
const heartEyesEmoji = "heart_eyes";
const angryEmoji = "angry";
const sobEmoji = "sob";
const heartEmoji = "heart";
const purpleHeartEmoji = "purple_heart";
const no_entry_signEmoji = "no_entry_sign";
const warningEmoji = "warning";
const memoEmoji = "memo";
const alarmEmoji = "alarm_clock";
const phoneEmoji = "phone";
const gameEmoji = "video_game";
const computerEmoji = "desktop_computer";
const prayEmoji = "pray";
const tadaEmoji = "tada";
const giftEmoji = "gift";
const popcornEmoji = "popcorn";
const musicalNoteEmoji = "musical_note";
const dollarEmoji = "dollar";
const creditCardEmoji = "credit_card";
const calendarEmoji = "calendar";
const chartEmoji = "chart_with_upwards_trend";
const bulbEmoji = "bulb";
const shoppingTrolleyEmoji = "shopping_trolley";
const bathEmoji = "bath";
const friesEmoji = "fries";
const cakeEmoji = "cake";
const appleEmoji = "apple";
const carrotEmoji = "carrot";
const airplaneEmoji = "airplane";
const busEmoji = "bus";
const metroEmoji = "metro";
const houseEmoji = "house_with_garden";
const tentEmoji = "tent";
const starEmoji = "star";
const sunnyEmoji = "sunny";
const rainbowEmoji = "rainbow";
const rainEmoji = "rain_cloud";
const snowmanEmoji = "snowman";
const blossomEmoji = "cherry_blossom";
export type Emoji =
  | typeof smileEmoji
  | typeof heartEyesEmoji
  | typeof angryEmoji
  | typeof sobEmoji
  | typeof heartEmoji
  | typeof purpleHeartEmoji
  | typeof no_entry_signEmoji
  | typeof warningEmoji
  | typeof memoEmoji
  | typeof alarmEmoji
  | typeof phoneEmoji
  | typeof gameEmoji
  | typeof computerEmoji
  | typeof prayEmoji
  | typeof tadaEmoji
  | typeof giftEmoji
  | typeof popcornEmoji
  | typeof musicalNoteEmoji
  | typeof dollarEmoji
  | typeof creditCardEmoji
  | typeof calendarEmoji
  | typeof chartEmoji
  | typeof bulbEmoji
  | typeof shoppingTrolleyEmoji
  | typeof bathEmoji
  | typeof friesEmoji
  | typeof cakeEmoji
  | typeof appleEmoji
  | typeof carrotEmoji
  | typeof airplaneEmoji
  | typeof busEmoji
  | typeof metroEmoji
  | typeof houseEmoji
  | typeof tentEmoji
  | typeof starEmoji
  | typeof sunnyEmoji
  | typeof rainbowEmoji
  | typeof rainEmoji
  | typeof snowmanEmoji
  | typeof blossomEmoji;
export const EMOJI_ARR: Emoji[] = [
  smileEmoji,
  heartEyesEmoji,
  angryEmoji,
  sobEmoji,
  heartEmoji,
  purpleHeartEmoji,
  no_entry_signEmoji,
  warningEmoji,
  memoEmoji,
  alarmEmoji,
  phoneEmoji,
  gameEmoji,
  computerEmoji,
  prayEmoji,
  tadaEmoji,
  giftEmoji,
  popcornEmoji,
  musicalNoteEmoji,
  dollarEmoji,
  creditCardEmoji,
  calendarEmoji,
  chartEmoji,
  bulbEmoji,
  shoppingTrolleyEmoji,
  bathEmoji,
  friesEmoji,
  cakeEmoji,
  appleEmoji,
  carrotEmoji,
  airplaneEmoji,
  busEmoji,
  metroEmoji,
  houseEmoji,
  tentEmoji,
  starEmoji,
  sunnyEmoji,
  rainbowEmoji,
  rainEmoji,
  snowmanEmoji,
  blossomEmoji,
];

export const randomIcon = (): Emoji => {
  const index = Math.floor(Math.random() * (emojis.length, 0) + 0);
  return emojis[index];
};

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
  const emoji = "emoji";
  const image = "image";
  type Category = typeof emoji | typeof image;
  const [category, setCategory] = useState<Category>(emoji);
  const changePageIcon = (icon: string | Emoji | null, iconType: IconType) => {
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
  };
  const removeIcon = () => {
    changePageIcon(null, null);
  };

  const onClickRandom = () => {
    changePageIcon(randomIcon(), "emoji");
  };

  const onChangeImgIcon = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const result = reader.result as string;
        changePageIcon(result, "img");
      };
      reader.readAsDataURL(file);
    }
  };

  const inner = document.getElementById("inner");
  inner?.addEventListener("click", (event: MouseEvent) => {
    const iconModal = document.getElementById("iconModal");
    if (iconModal) {
      const iconModalDomRect = iconModal?.getClientRects()[0];
      const isInIconModal = detectRange(event, iconModalDomRect);
      const target = event.target as null | Element;
      if (target?.id !== "inputImgIcon") {
        !isInIconModal && setOpenIconModal(false);
      }
    }
  });
  return (
    <div id="iconModal" style={style}>
      <div className="inner">
        <div className="header">
          <div className="category">
            <div className="btn-category">
              <button
                title="button to open emojis"
                onClick={() => setCategory(emoji)}
              >
                Emoji
              </button>
              {category === emoji && <span className="bottom-line"></span>}
            </div>
            <div className="btn-category">
              <button
                title="button to open form to upload image"
                onClick={() => setCategory(image)}
              >
                Upload image
              </button>
              {category === image && <span className="bottom-line"></span>}
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
          {category === emoji ? (
            emojis.map((emoji: Emoji) => (
              <button
                title={`button to select ${emoji} emoji`}
                className="btn-emoji"
                onClick={() => changePageIcon(emoji, "emoji")}
              >
                <ScreenOnly text={`button to select ${emoji} emoji`} />
                <img alt={emoji} src={`${emojiPath}${emoji}.png`} />
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
