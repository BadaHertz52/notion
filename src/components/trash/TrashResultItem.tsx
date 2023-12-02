import React, { Dispatch, SetStateAction, useContext } from "react";

import { RiArrowGoBackLine } from "react-icons/ri";
import { IoTrashOutline } from "react-icons/io5";

import { ResultType } from "../../types";
import { ActionContext } from "../../contexts";
import { ScreenOnly, Result } from "../index";

type TrashResultItemProps = {
  item: ResultType;
  setOpenTrash: Dispatch<SetStateAction<boolean>>;
  width: number;
};

const TrashResultItem = ({
  item,
  setOpenTrash,
  width,
}: TrashResultItemProps) => {
  const { cleanTrash, restorePage } = useContext(ActionContext).actions;
  return (
    <div className="page" onClick={() => setOpenTrash(false)}>
      <Result item={item} width={width} />
      <div className="btn-group">
        <button
          title="button to restore page"
          className="btn-restore"
          onClick={() => restorePage(item.id)}
        >
          <ScreenOnly text="button to restore page" />
          <RiArrowGoBackLine />
        </button>
        <button
          title="button to  permanently delete page"
          className="btn-clean"
          onClick={() => cleanTrash(item.id)}
        >
          <ScreenOnly text="button to permanently delete page" />
          <IoTrashOutline />
        </button>
      </div>
    </div>
  );
};

export default React.memo(TrashResultItem);
