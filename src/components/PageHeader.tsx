import React, {
  Dispatch,
  MouseEvent,
  RefObject,
  SetStateAction,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";
import { MainCommentType, Page } from "../modules/notion/type";
import { CSSProperties } from "styled-components";
import Loader from "./Loader";
import { ActionContext } from "../route/NotionRouter";
import IconModal from "./IconModal";
import PageIcon from "./PageIcon";
import { randomEmojiIcon } from "../modules/notion/emojiData";
import { setTemplateItem } from "../fn";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import basicPageCover from "../assets/img/artificial-turf-g6e884a1d4_1920.jpeg";
import { MdInsertPhoto } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import Comments from "./Comments";
import CommentInput from "./CommentInput";

export type PageHeaderProps = {
  userName: string;
  page: Page;
  frameRef: RefObject<HTMLDivElement>;
  fontSize: number;
  openTemplates: boolean;
  templateHtml: HTMLElement | null;
  discardEdit: boolean;
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
  showAllComments: boolean;
  newPageFrame: boolean;
  handleImgLoad?: () => void;
  frameInnerStyle: CSSProperties;
};
function PageHeader({
  userName,
  page,
  frameRef,
  fontSize,
  openTemplates,
  templateHtml,
  discardEdit,
  setDiscardEdit,
  showAllComments,
  newPageFrame,
  handleImgLoad,
  frameInnerStyle,
}: PageHeaderProps) {
  const { editPage, editBlock } = useContext(ActionContext).actions;

  const [decoOpen, setDecoOpen] = useState<boolean>(false);
  const [openLoaderForCover, setOpenLoaderForCover] = useState<boolean>(false);
  const [openIconModal, setOpenIconModal] = useState<boolean>(false);

  const [openPageCommentInput, setOpenPageCommentInput] =
    useState<boolean>(false);

  const [iconStyle, setIconStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const headerStyle: CSSProperties = {
    ...frameInnerStyle,
    marginTop: page.header.cover ? "10px" : "30px",
  };
  const pageCommentStyle: CSSProperties = {
    fontSize: `${fontSize}rem`,
  };

  const pageTitleStyle: CSSProperties = {
    fontSize: `${fontSize * 2}rem`,
    position: "relative",
  };
  const size =
    page.header.iconType === null ? (window.innerWidth >= 768 ? 72 : 48) : 72;
  const pageIconStyle: CSSProperties = {
    width: size,
    height: size,
    marginTop:
      page.header.cover === null
        ? 0
        : page.header.iconType === null
        ? window.innerWidth >= 768
          ? -39
          : -16
        : window.innerWidth >= 768
        ? -62
        : -16,
  };

  const onMouseMoveOnPH = useCallback(() => {
    if (
      (page.header.icon === null ||
        page.header.cover === null ||
        page.header.comments === null) &&
      !decoOpen
    ) {
      setDecoOpen(true);
    }
  }, [decoOpen, page.header.comments, page.header.cover, page.header.icon]);

  const onMouseLeaveFromPH = useCallback(() => {
    decoOpen && setDecoOpen(false);
  }, [decoOpen]);

  const onMouseEnterPC = useCallback((event: MouseEvent) => {
    const currentTarget = event?.currentTarget;
    currentTarget.classList.add("on");
  }, []);

  const onMouseLeavePC = useCallback((event: MouseEvent) => {
    const currentTarget = event?.currentTarget;
    currentTarget.classList.remove("on");
  }, []);

  const onClickChangeCoverBtn = useCallback(() => {
    setOpenLoaderForCover(true);
    const pageCover = frameRef.current?.querySelector(".page__header__cover");
    pageCover?.classList.remove("on");
  }, [frameRef]);

  const onClickPageIcon = useCallback(
    (event: React.MouseEvent) => {
      if (openIconModal !== true) {
        const currentTarget = event.currentTarget;
        if (currentTarget.firstElementChild) {
          setIconStyle({
            position: "absolute",
            top: (pageIconStyle.width as number) + 4,
            left: 0,
          });
          setOpenIconModal(true);
        } else {
          console.error("Can't find currentTarget");
        }
      } else {
        setOpenIconModal(false);
      }
    },
    [openIconModal, pageIconStyle.width]
  );

  const addRandomIcon = useCallback(() => {
    const icon = randomEmojiIcon();
    const newPageWithIcon: Page = {
      ...page,
      header: {
        ...page.header,
        icon: icon,
        iconType: "emoji",
      },
      editTime: JSON.stringify(Date.now()),
    };
    openTemplates && setTemplateItem(templateHtml, page);
    editPage(page.id, newPageWithIcon);
  }, [editPage, openTemplates, page, templateHtml]);

  const onClickAddCover = useCallback(() => {
    const editedPage: Page = {
      ...page,
      header: {
        ...page.header,
        cover: basicPageCover,
      },
      editTime: JSON.stringify(Date.now()),
    };
    editPage(page.id, editedPage);
  }, [editPage, page]);

  const onChangePageTitle = useCallback(
    (event: ContentEditableEvent) => {
      const value = event.target.value;
      openTemplates && setTemplateItem(templateHtml, page);
      editPage(page.id, {
        ...page,
        header: {
          ...page.header,
          title: value,
        },
        editTime: JSON.stringify(Date.now()),
      });
    },
    [editPage, openTemplates, page, templateHtml]
  );

  return (
    <div
      className="page__header"
      style={headerStyle}
      onMouseMove={onMouseMoveOnPH}
      onMouseLeave={onMouseLeaveFromPH}
    >
      {page.header.cover && (
        <div
          className="page__header__cover"
          onMouseEnter={(event) => onMouseEnterPC(event)}
          onMouseLeave={(event) => onMouseLeavePC(event)}
        >
          <img
            src={page.header.cover}
            alt="page cover "
            onLoad={handleImgLoad}
          />
          <button
            title="button to change page cover"
            className="btn-change-cover"
            onClick={onClickChangeCoverBtn}
          >
            change cover
          </button>
        </div>
      )}
      {openLoaderForCover && (
        <Loader
          block={null}
          page={page}
          editBlock={null}
          editPage={editPage}
          frameHtml={frameRef.current}
          setOpenLoader={setOpenLoaderForCover}
          setLoaderTargetBlock={null}
        />
      )}
      <div className="page__header_notCover">
        <div
          className="page__icon-outBox"
          style={pageTitleStyle}
          onClick={onClickPageIcon}
        >
          <PageIcon
            icon={page.header.icon}
            iconType={page.header.iconType}
            style={pageIconStyle}
            handleImgLoad={handleImgLoad}
          />
          {openIconModal && (
            <IconModal
              currentPageId={page.id}
              block={null}
              page={page}
              style={iconStyle}
              setOpenIconModal={setOpenIconModal}
            />
          )}
        </div>
        <div className="deco">
          {decoOpen && (
            <div>
              {page.header.icon === null && (
                <button
                  title="button to  open menu to add page icon"
                  className="deco__btn-icon"
                  onClick={addRandomIcon}
                >
                  <BsFillEmojiSmileFill />
                  <span>Add Icon</span>
                </button>
              )}
              {page.header.cover === null && (
                <button
                  title="button to  open menu to add page cover"
                  className="deco__btn-cover"
                  onClick={onClickAddCover}
                >
                  <MdInsertPhoto />
                  <span>Add Cover</span>
                </button>
              )}
              {page.header.comments === null && (
                <button
                  title="button to  open menu to add comment about page"
                  className="deco__btn-comment"
                  onClick={() => setOpenPageCommentInput(true)}
                >
                  <BiMessageDetail />
                  <span>Add Comment</span>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="page__title" style={pageTitleStyle}>
          <ContentEditable
            html={page.header.title}
            onChange={onChangePageTitle}
          />
        </div>
        <div className="page__comments" style={pageCommentStyle}>
          {page.header.comments ? (
            page.header.comments.map((comment: MainCommentType) => (
              <Comments
                key={`pageComment_${comment.id}`}
                block={null}
                page={page}
                pageId={page.id}
                userName={userName}
                frameHtml={frameRef.current}
                discardEdit={discardEdit}
                setDiscardEdit={setDiscardEdit}
                select={null}
                openComment={false}
                showAllComments={showAllComments}
              />
            ))
          ) : openPageCommentInput ? (
            <CommentInput
              page={page}
              pageId={page.id}
              userName={userName}
              mainComment={null}
              subComment={null}
              editBlock={editBlock}
              editPage={editPage}
              commentBlock={null}
              allComments={page.header.comments}
              setAllComments={null}
              setModal={null}
              addOrEdit={"add"}
              setEdit={setOpenPageCommentInput}
              templateHtml={templateHtml}
              frameHtml={frameRef.current}
            />
          ) : (
            newPageFrame && (
              <div>
                Press Enter to continue with an empty page or pick a template
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(PageHeader);