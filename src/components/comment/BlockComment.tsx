import React from "react";

import { IoChatboxOutline } from "react-icons/io5";

import { ScreenOnly } from "../index";
import { Block, MainCommentType } from "../../types";

type BlockCommentProps = {
  block: Block;
  onClickCommentBtn: (block: Block) => void;
};

const BlockComment = ({ block, onClickCommentBtn }: BlockCommentProps) => {
  const lengthOfOpenComments = (block.comments as MainCommentType[]).filter(
    (c) => c.type === "open"
  ).length;
  return (
    <div id={`${block.id}-comments`} className="comments-bubble">
      <button
        className="btn-comment btnIcon"
        title="open comment about contents"
        name={block.id}
        onClick={() => onClickCommentBtn(block)}
      >
        <ScreenOnly text="open comment about contents" />
        <IoChatboxOutline />
        <span className="comment-length">{lengthOfOpenComments}</span>
      </button>
    </div>
  );
};

export default React.memo(BlockComment);
