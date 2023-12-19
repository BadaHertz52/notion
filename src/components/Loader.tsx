import React, {
  ChangeEvent,
  useEffect,
  useState,
  useCallback,
  RefObject,
  useContext,
} from "react";
import { CSSProperties } from "styled-components";

import { SESSION_KEY } from "../constants";
import { Block, Page } from "../types";
import {
  setTemplateItem,
  changeImgToWebP,
  getEditTime,
  isInTarget,
} from "../utils";

import "../assets/loader.scss";
import ActionContext from "./../contexts/ActionContext";

export type LoaderProps = {
  //page cover -> block=undefined , image block loader -> block:Block
  block?: Block;
  page: Page;
  style?: CSSProperties;
  editBlock?: (pageId: string, block: Block) => void;
  editPage?: (pageId: string, newPage: Page) => void;
  closeModal: () => void;
};

const Loader = ({ block, page, style, closeModal }: LoaderProps) => {
  const { editBlock, editPage } = useContext(ActionContext).actions;

  const changeImg = useCallback(
    (src: string) => {
      const editTime = getEditTime();
      //파일 창을 열 경우, props로 받은 block을 인식하지 못해서 세션에 저장해 사용하기로 함
      const targetBlockItem = sessionStorage.getItem(
        SESSION_KEY.loaderTargetBlock
      );
      if (targetBlockItem) {
        const targetBlock = JSON.parse(targetBlockItem) as Block;

        const editedBlock: Block = {
          ...targetBlock,
          type: "image",
          contents: src,
          editTime: editTime,
        };
        const templateHtml = document.getElementById("template");
        setTemplateItem(templateHtml, page);
        editBlock(page.id, editedBlock);
      } else {
        //change page cover
        const editedPage: Page = {
          ...page,
          header: {
            ...page.header,
            cover: src,
          },
          editTime: editTime,
        };
        editPage(page.id, editedPage);
        closeModal();
      }
      closeModal();
    },
    [closeModal, editBlock, editPage, page]
  );
  const onChangeImgFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const result = reader.result as string;
        if (file.type.includes("gif") || file.type.includes("webP")) {
          changeImgToWebP(reader, changeImg);
        } else {
          changeImg(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error("can't find image file");
    }
  };
  const removePageCover = useCallback(() => {
    const editedPage: Page = {
      ...page,
      header: {
        ...page.header,
        cover: null,
      },
      editTime: getEditTime(),
    };
    editPage && editPage(page.id, editedPage);
    closeModal();
  }, [editPage, page, closeModal]);

  const handleClose = useCallback(
    (event: globalThis.MouseEvent) => {
      const correctTarget = [
        ".btn-change-cover",
        "#loader",
        ".btn-addBlockFile",
      ];
      const isNotClose = correctTarget
        .map((v) => isInTarget(event, v))
        .some((v) => v);

      if (!isNotClose) closeModal();
    },
    [closeModal]
  );

  useEffect(() => {
    window.addEventListener("click", handleClose);
    if (block) {
      sessionStorage.setItem(
        SESSION_KEY.loaderTargetBlock,
        JSON.stringify(block)
      );
    }
    return () => {
      window.removeEventListener("click", handleClose);
      if (block) sessionStorage.removeItem(SESSION_KEY.loaderTargetBlock);
    };
  }, [handleClose, block]);

  return (
    <div id="loader" style={style}>
      <div className="inner">
        <div className="loader-img">
          <div className="menu">
            <div className=" loader__inner-padding">
              <button title="button to upload file" name="btn-upload">
                Upload
              </button>
              {!block && (
                <button
                  title="button to remove file"
                  className="btn-remove"
                  onClick={removePageCover}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <div className="loaderForm loader__inner-padding">
            <label htmlFor="loader-img">Or upload file</label>
            <input
              type="file"
              accept="image/*"
              name="loader-img"
              id="loader-img"
              onChange={onChangeImgFile}
            />
          </div>
          <div className="explain loader__inner-padding">
            {!block
              ? "Images wider that 1500 pixels work best"
              : "The maximum size per file is 5MB"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Loader);
