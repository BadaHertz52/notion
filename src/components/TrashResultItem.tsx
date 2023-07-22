import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  MouseEvent,
} from "react";
import Result, { resultType } from "./Result";
import { ActionContext } from "../containers/NotionRouter";
import ScreenOnly from "./ScreenOnly";
import { RiArrowGoBackLine } from "react-icons/ri";
import { IoTrashOutline } from "react-icons/io5";
type TrashResultItemProps = {
  item: resultType;
  setTargetPageId: Dispatch<SetStateAction<string>>;
  setOpenTrash: Dispatch<SetStateAction<boolean>>;
};

const TrashResultItem = ({
  item,
  setTargetPageId,
  setOpenTrash,
}: TrashResultItemProps) => {
  const { cleanTrash, restorePage } = useContext(ActionContext).actions;
  const goPage = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      setOpenTrash(false);
      if (!["button", "svg", "path"].includes(tagName)) {
        setTargetPageId(item.id);
      }
    },
    [item.id, setOpenTrash, setTargetPageId]
  );

  return (
    <div className="page" onClick={goPage}>
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
