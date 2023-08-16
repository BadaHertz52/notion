import React, { Dispatch, SetStateAction, useContext } from "react";
import Result, { resultType } from "./Result";
import { ActionContext } from "../route/NotionRouter";
import ScreenOnly from "./ScreenOnly";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { makeRoutePath } from "../fn";
type TrashResultItemProps = {
  item: resultType;
  setOpenTrash: Dispatch<SetStateAction<boolean>>;
};

const TrashResultItem = ({ item, setOpenTrash }: TrashResultItemProps) => {
  const { cleanTrash, restorePage } = useContext(ActionContext).actions;

  return (
    <div className="page" onClick={() => setOpenTrash(false)}>
      <Result item={item} />
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
