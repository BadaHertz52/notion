import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
} from "react";
import { CSSProperties } from "styled-components";
import { ActionContext } from "../containers/NotionRouter";
import { Block, Page } from "../modules/notion";
import { setTemplateItem } from "./BlockComponent";
import IconModal from "./IconModal";
import PageIcon from "./PageIcon";
import { closeModal } from "./SideBar";
import ScreenOnly from "./ScreenOnly";
type RenameProps = {
  currentPageId: string | null;
  block: Block | null;
  page: Page;
  renameStyle: CSSProperties | undefined;
  setOpenRename: Dispatch<SetStateAction<boolean>>;
};
const Rename = ({
  currentPageId,
  block,
  page,
  renameStyle,
  setOpenRename,
}: RenameProps) => {
  const { editPage, editBlock } = useContext(ActionContext).actions;
  const inner = document.getElementById("inner");
  const [openIconModal, setOpenIconModal] = useState<boolean>(false);
  inner?.addEventListener("click", (event) => {
    if (document.getElementById("rename")) {
      openIconModal && closeModal("iconModal", setOpenIconModal, event);
      closeModal("rename", setOpenRename, event);
    }
  });
  const onClickRenameIcon = () => {
    setOpenIconModal(true);
  };
  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const editTime = JSON.stringify(Date.now());
    if (value !== page.header.title) {
      const templateHtml = document.getElementById("template");
      setTemplateItem(templateHtml, page);
      const renamedPage: Page = {
        ...page,
        header: {
          ...page.header,
          title: value,
        },
        editTime: editTime,
      };
      editPage(renamedPage.id, renamedPage);
      if (block && currentPageId) {
        const editedBlock: Block = {
          ...block,
          contents: value,
          editTime: editTime,
        };
        editBlock(currentPageId, editedBlock);
      }
    }
  };
  return (
    <div id="rename" style={renameStyle}>
      <div className="inner">
        <button
          title="button to move page"
          className="rename__btn"
          onClick={onClickRenameIcon}
        >
          <PageIcon
            icon={page.header.icon}
            iconType={page.header.iconType}
            style={undefined}
          />
        </button>
        <label>
          <ScreenOnly text="input to rename " />
          <input
            className="rename__title"
            title="input to rename "
            onChange={changeTitle}
            type="text"
            value={page.header.title}
          />
        </label>
      </div>
      {openIconModal && (
        <IconModal
          page={page}
          currentPageId={currentPageId}
          block={block}
          style={undefined}
          setOpenIconModal={setOpenIconModal}
        />
      )}
    </div>
  );
};

export default React.memo(Rename);
