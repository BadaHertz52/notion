import { Dispatch, SetStateAction } from "react";
import EmojiSpritesImg from "../../assets/img/emoji_sprite.png";
export const EMOJI_DATA = {
  smile: "😄",
  heartEyes: "😍",
  angry: "😠",
  sob: "😭",
  heart: "❤️",
  purpleHeart: "💜",
  noEntrySign: "🚫",
  warning: "⚠️",
  memo: "📝",
  alarm: "⏰",
  phone: "📱",
  game: "🎮",
  computer: "💻",
  pray: "🙏",
  tada: "🎉",
  gift: "🎁",
  popcorn: "🍿",
  musicalNote: "🎵",
  dollar: "💵",
  creditCard: "💳",
  calendar: "📆",
  chart: "📊",
  bulb: "💡",
  shoppingTrolley: "🛒",
  bath: "🛁",
  fries: "🍟",
  cake: "🍰",
  apple: "🍎",
  carrot: "🥕",
  airplane: "✈️",
  bus: "🚍",
  metro: "🚇",
  house: "🏠",
  tent: "🏕️",
  star: "⭐",
  sunny: "☀️",
  rainbow: "🌈",
  rain: "☂️",
  snowman: "☃️",
  blossom: "🌸",
};
export type Emoji = keyof typeof EMOJI_DATA;
export const EMOJI_ARR: Emoji[] = [
  "airplane",
  "alarm",
  "angry",
  "apple",
  "bath",
  "bulb",
  "bus",
  "cake",
  "calendar",
  "carrot",
  "chart",
  "blossom",
  "creditCard",
  "computer",
  "dollar",
  "fries",
  "gift",
  "heart",
  "heartEyes",
  "house",
  "memo",
  "metro",
  "musicalNote",
  "noEntrySign",
  "phone",
  "popcorn",
  "pray",
  "purpleHeart",
  "rain",
  "rainbow",
  "shoppingTrolley",
  "smile",
  "snowman",
  "sob",
  "star",
  "sunny",
  "tada",
  "tent",
  "game",
  "warning",
].sort() as Emoji[];

export const randomEmojiIcon = (): Emoji => {
  const index = Math.floor(Math.random() * (EMOJI_ARR.length, 0) + 0);
  return EMOJI_ARR[index];
};

export const getEmojiUrl = (
  icon: Emoji,
  setUrl: Dispatch<SetStateAction<string | undefined>>
) => {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d", { alpha: true });
  let image = new Image();
  image.src = EmojiSpritesImg;
  image.onload = function () {
    const size = 240;
    canvas.width = size;
    canvas.height = size;
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(
      image,
      EMOJI_ARR.indexOf(icon) * (size + 10),
      0,
      size,
      size,
      0,
      0,
      size,
      size
    );
    setUrl(canvas.toDataURL());
    canvas.remove();
  };
};
