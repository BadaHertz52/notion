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
    if (file !== undefined) {
      const reader = new FileReader();
      reader.onload = function () {
        const result = reader.result as string;
        if (block !== null) {
          const editedBlock: Block = {
            ...block,
            type: "image",
            contents: result,
            editTime: JSON.stringify(Date.now()),
          };
          const templateHtml = document.getElementById("template");
          setTemplateItem(templateHtml, page);
          editBlock !== null && editBlock(page.id, editedBlock);
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
          editPage !== null && editPage(page.id, editedPage);
          closeLoader();
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.log("can't find image file");
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
    editPage !== null && editPage(page.id, editedPage);
    setOpenLoader(false);
  };
  function closeLoader() {
    setOpenLoader(false);
    setLoaderTargetBlock !== null && setLoaderTargetBlock(null);
  }
  inner?.addEventListener("click", (event) => {
    if (loaderHtml !== null) {
      !detectRange(event, loaderHtml.getClientRects()[0]) && closeLoader();
    }
  });
  function changeLoaderStyle() {
    if (block !== null) {
      const blockHtml = document.getElementById(`block_${block.id}`);
      const blockDomRect = blockHtml?.getClientRects()[0];
      const editorHtml = document.querySelector(".editor");
      const editorDomRect = editorHtml?.getClientRects()[0];

      if (
        blockDomRect !== undefined &&
        frameHtml !== null &&
        editorDomRect !== undefined
      ) {
        const frameDomRect = frameHtml.getClientRects()[0];
        const frameInner = frameHtml.getElementsByClassName(
          "frame_inner"
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
      const pageCover = frameHtml?.querySelector(".pageCover");
      if (pageCover !== undefined && pageCover !== null) {
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
        <div className="imgLoader">
          <div className="menu">
            <div className=" innerPadding">
              <button name="uploadBtn">Upload</button>
              {block === null && (
                <button className="removeBtn" onClick={removePageCover}>
                  Remove
                </button>
              )}
            </div>
          </div>
          <div className="loaderForm innerPadding">
            <label htmlFor="imgLoader">Or upload file</label>
            <input
              type="file"
              accept="image/jpg , image/jpeg, imgae/png"
              name="imgLoader"
              id="imgLoader"
              onChange={onChangeImgFile}
            />
          </div>
          <div className="explain innerPadding">
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
