import React from "react";
import { IoChatboxOutline } from "react-icons/io5";
import { Block } from "../modules/notion";

type BlockCommentProps = {
  block: Block;
  onClickCommentBtn: (block: Block) => void;
};

const BlockComment = ({ block, onClickCommentBtn }: BlockCommentProps) => {
  return (
    <div id={`${block.id}-comments`} className="comments-bubble">
      <button
        className="btn-comment btnIcon"
        title="open comment about contents"
        name={block.id}
        onClick={() => onClickCommentBtn(block)}
      >
        <IoChatboxOutline />
        <span className="comment-length">{block.comments?.length}</span>
      </button>
    </div>
  );
};

export default React.memo(BlockComment);
