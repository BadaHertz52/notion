import { Dispatch, SetStateAction } from "react";
import EmojiSpritesImg from "../../assets/img/emoji_sprite.png";
export type Emoji =
  | "smile"
  | "heartEyes"
  | "angry"
  | "sob"
  | "heart"
  | "purpleHeart"
  | "noEntrySign"
  | "warning"
  | "memo"
  | "alarm"
  | "phone"
  | "game"
  | "computer"
  | "pray"
  | "tada"
  | "gift"
  | "popcorn"
  | "musicalNote"
  | "dollar"
  | "creditCard"
  | "calendar"
  | "chart"
  | "bulb"
  | "shoppingTrolley"
  | "bath"
  | "fries"
  | "cake"
  | "apple"
  | "carrot"
  | "airplane"
  | "bus"
  | "metro"
  | "house"
  | "tent"
  | "star"
  | "sunny"
  | "rainbow"
  | "rain"
  | "snowman"
  | "blossom";

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
  // 캔버스 요소와 컨텍스트 객체를 생성합니다.
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d", { alpha: true });

  // Image 객체를 생성하고 src 속성에 데이터 URL을 할당합니다.
  let image = new Image();
  image.src = EmojiSpritesImg;
  // onload 이벤트 핸들러를 추가합니다.
  image.onload = function () {
    // 캔버스의 크기를 잘라낼 영역의 크기와 같게 설정합니다.
    const size = 240;
    canvas.width = size; // 잘라낼 영역의 너비
    canvas.height = size; // 잘라낼 영역의 높이
    // 캔버스에 이미지의 일부분을 잘라서 그립니다.
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(
      image,
      EMOJI_ARR.indexOf(icon) * (size + 10), // 잘라낼 영역의 x 좌표
      0, // 잘라낼 영역의 y 좌표
      size, // 잘라낼 영역의 너비
      size, // 잘라낼 영역의 높이
      0, // 캔버스에 그릴 영역의 x 좌표
      0, // 캔버스에 그릴 영역의 y 좌표
      size, // 캔버스에 그릴 영역의 너비
      size // 캔버스에 그릴 영역의 높이
    );
    setUrl(canvas.toDataURL());
    canvas.remove();
  };
};

export const emojiPath =
  "https://raw.githubusercontent.com/BadaHertz52/notion/master/image/emoji/";
