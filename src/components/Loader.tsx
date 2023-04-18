import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CSSProperties } from "styled-components";
import { Block, Page } from "../modules/notion";
import { setTemplateItem } from "./BlockComponent";
import { detectRange } from "./BlockFn";
type LoaderProps = {
  block: Block | null;
  page: Page;
  editBlock: ((pageId: string, block: Block) => void) | null;
  editPage: ((pageId: string, newPage: Page) => void) | null;
  frameHtml: HTMLDivElement | null;
  setOpenLoader: Dispatch<SetStateAction<boolean>>;
  setLoaderTargetBlock: Dispatch<SetStateAction<Block | null>> | null;
};
const Loader = ({
  block,
  page,
  editBlock,
  editPage,
  frameHtml,
  setOpenLoader,
  setLoaderTargetBlock,
}: LoaderProps) => {
  const inner = document.getElementById("inner");
  const loaderHtml = document.getElementById("loader");
  const [loaderStyle, setLoaderStyle] = useState<CSSProperties | undefined>(
    undefined
  );
  const onChangeImgFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const result = reader.result as string;
        if (block) {
          const editedBlock: Block = {
            ...block,
            type: "image",
            contents: result,
            editTime: JSON.stringify(Date.now()),
          };
          const templateHtml = document.getElementById("template");
          setTemplateItem(templateHtml, page);
          editBlock && editBlock(page.id, editedBlock);
          closeLoader();
        } else {
          //change page cover
          const editedPage: Page = {
            ...page,
            header: {
              ...page.header,
              cover: result,
            },
            editTime: JSON.stringify(Date.now()),
          };
          editPage && editPage(page.id, editedPage);
          closeLoader();
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error("can't find image file");
    }
  };
  const removePageCover = () => {
    const editedPage: Page = {
      ...page,
      header: {
        ...page.header,
        cover: null,
      },
      editTime: JSON.stringify(Date.now()),
    };
    editPage && editPage(page.id, editedPage);
    setOpenLoader(false);
  };
  function closeLoader() {
    setOpenLoader(false);
    setLoaderTargetBlock && setLoaderTargetBlock(null);
  }
  inner?.addEventListener("click", (event) => {
    if (loaderHtml) {
      !detectRange(event, loaderHtml.getClientRects()[0]) && closeLoader();
    }
  });
  function changeLoaderStyle() {
    if (block) {
      const blockHtml = document.getElementById(`block-${block.id}`);
      const blockDomRect = blockHtml?.getClientRects()[0];
      const editorHtml = document.querySelector(".editor");
      const editorDomRect = editorHtml?.getClientRects()[0];

      if (blockDomRect && frameHtml && editorDomRect) {
        const frameDomRect = frameHtml.getClientRects()[0];
        const frameInner = frameHtml.getElementsByClassName(
          "frame__inner"
        )[0] as HTMLElement;
        const frameInnerDomRect = frameInner.getClientRects()[0];

        const top =
          blockDomRect.bottom - frameDomRect.top + blockDomRect.height + 10;
        const remainHeight = frameDomRect.height - top;
        const left =
          (frameDomRect.width - frameInner.offsetWidth) * 0.5 +
          (blockDomRect.left - frameInnerDomRect.left) -
          editorDomRect.left;
        const basicStyle: CSSProperties = {
          position: "absolute",
          left: left,
          width: blockDomRect.width,
        };
        const style: CSSProperties =
          remainHeight > 135
            ? {
                ...basicStyle,
                top: top,
              }
            : {
                ...basicStyle,
                bottom:
                  frameDomRect.height -
                  blockDomRect.top +
                  blockDomRect.height +
                  10,
              };
        setLoaderStyle(style);
      }
    } else {
      const pageCover = frameHtml?.querySelector(".page__header__cover");
      if (pageCover) {
        const style: CSSProperties = {
          position: "absolute",
          top: pageCover.clientHeight,
          left: pageCover.clientWidth * 0.3,
          width: pageCover.clientWidth * 0.5,
        };
        setLoaderStyle(style);
      }
    }
  }
  useEffect(() => {
    loaderStyle === undefined && changeLoaderStyle();
  }, [loaderStyle]);

  window.onresize = () => {
    changeLoaderStyle();
  };
  return (
    <div id="loader" style={loaderStyle}>
      <div className="inner">
        <div className="loader-img">
          <div className="menu">
            <div className=" loader__inner-padding">
              <button name="btn-upload">Upload</button>
              {block === null && (
                <button className="btn-remove" onClick={removePageCover}>
                  Remove
                </button>
              )}
            </div>
          </div>
          <div className="loaderForm loader__inner-padding">
            <label htmlFor="loader-img">Or upload file</label>
            <input
              type="file"
              accept="image/jpg , image/jpeg, image/png"
              name="loader-img"
              id="loader-img"
              onChange={onChangeImgFile}
            />
          </div>
          <div className="explain loader__inner-padding">
            {block === null
              ? "Images wider that 1500 pixels work best"
              : "The maximum size per file is 5MB"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Loader);
