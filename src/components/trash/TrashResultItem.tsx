import React, { MouseEvent, useContext } from "react";

import { RiArrowGoBackLine } from "react-icons/ri";
import { IoTrashOutline } from "react-icons/io5";

import { ResultType } from "../../types";
import { ActionContext } from "../../contexts";
import { ScreenOnly, Result } from "../index";

type TrashResultItemProps = {
  item: ResultType;
  closeTrash: () => void;
  width: number;
};

const TrashResultItem = ({ item, closeTrash, width }: TrashResultItemProps) => {
  const { cleanTrash, restorePage } = useContext(ActionContext).actions;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { className } = event.currentTarget;
    className.includes("restore") ? restorePage(item.id) : cleanTrash(item.id);
    closeTrash();
  };

  return (
    <div className="page">
      <Result item={item} width={width} />
      <div className="btn-group">
        <button
          title="button to restore page"
          className="btn-restore"
          onClick={handleClick}
        >
          <ScreenOnly text="button to restore page" />
          <RiArrowGoBackLine />
        </button>
        <button
          title="button to  permanently delete page"
          className="btn-clean"
          onClick={handleClick}
        >
          <ScreenOnly text="button to permanently delete page" />
          <IoTrashOutline />
        </button>
      </div>
    </div>
  );
};

export default React.memo(TrashResultItem);
