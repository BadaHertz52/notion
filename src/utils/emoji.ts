import { Dispatch, SetStateAction } from "react";

import { EMOJI_ARRAY } from "../constants";
import { Emoji } from "../types";

import EmojiSpritesImg from "../assets/img/emoji_sprite.png";

export const randomEmojiIcon = (): Emoji => {
  const index = Math.floor(Math.random() * (EMOJI_ARRAY.length, 0) + 0);
  return EMOJI_ARRAY[index];
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
      EMOJI_ARRAY.indexOf(icon) * size,
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
