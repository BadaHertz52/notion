import React, {
  useCallback,
  useState,
  MouseEvent,
  SetStateAction,
  Dispatch,
  useContext,
  CSSProperties,
} from "react";
import { GrDocumentUpload } from "react-icons/gr";
import { IoArrowRedoOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

import { FontBtn } from "../index";

import { ActionContext, ModalContext } from "../../contexts";
import { isMobile } from "../../utils";
import { FontStyle, ModalType, Page, SideAppear } from "../../types";

export type TopBarToolMoreProps = {
  sideAppear: SideAppear;
  page: Page;
  smallText: boolean;
  setSmallText: Dispatch<SetStateAction<boolean>>;
  fullWidth: boolean;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
  setFontStyle: Dispatch<SetStateAction<FontStyle>>;
  setModal: Dispatch<SetStateAction<ModalType>>;
  closeModal: () => void;
};
const TopBarToolMore = ({ ...props }: TopBarToolMoreProps) => {
  const {
    setFontStyle,
    smallText,
    setSmallText,
    fullWidth,
    setFullWidth,
    sideAppear,
    page,
    setModal,
    closeModal,
  } = props;

  const { deletePage } = useContext(ActionContext).actions;
  const { changeModalState } = useContext(ModalContext);

  const FONT_BTN_ARRAY: FontStyle[] = ["default", "mono", "serif"];

  const [selectedFontStyle, setSelectedFontStyle] =
    useState<FontStyle>("default");

  const changeFontStyle = useCallback(
    (event: MouseEvent, font: FontStyle) => {
      const currentTarget = event.currentTarget;
      const targetFontSample = currentTarget.firstElementChild;

      const fontSample = [...document.getElementsByClassName("font-sample")];
      fontSample.forEach((element: Element) => {
        element.classList.contains("on") && element.classList.remove("on");
      });
      targetFontSample && targetFontSample.classList.add("on");
      setSelectedFontStyle(font);
      setFontStyle(font);
    },
    [setFontStyle]
  );

  const returnFontFamily = (font: FontStyle) => {
    const style: CSSProperties = {
      fontFamily: font,
    };
    return style;
  };

  const changeFontSize = () => {
    setSmallText(!smallText);
  };

  const changeWidth = useCallback(() => {
    const width = window.innerWidth;
    !(width < 1024 && sideAppear === "lock") && setFullWidth(!fullWidth);
  }, [sideAppear, setFullWidth, fullWidth]);

  const onClickMoveTo = () => {
    setModal({
      open: true,
      target: "pageMenu",
    });
  };

  const onClickExportBtn = useCallback(() => {
    changeModalState({ open: true, target: "export" });
    closeModal();
  }, []);
  return (
    <div id="top-bar__tool-more">
      <div className="inner">
        <div className="fontStyle">
          <div className="fontStyle__header">STYLE</div>
          <div className="fontStyle__btn-group">
            {FONT_BTN_ARRAY.map((i) => (
              <FontBtn
                selectedFonStyle={selectedFontStyle}
                fontStyle={i}
                changeFontStyle={changeFontStyle}
                returnFontFamily={returnFontFamily}
              />
            ))}
          </div>
        </div>
        <div className="size">
          <button
            title={` button  ${
              smallText ? "to change large text " : "to change small text"
            }`}
            onClick={changeFontSize}
          >
            <div>Small text</div>
            <label className="btn-switch">
              <span className={smallText ? "slider on" : "slider"}></span>
            </label>
          </button>
          <button
            title={`button ${
              fullWidth ? "to change small width" : "to change full width"
            }`}
            style={{ display: isMobile() ? "none" : "flex" }}
            onClick={changeWidth}
          >
            <div>Full width</div>
            <label className="btn-switch">
              <span className={fullWidth ? "slider on" : "slider"}></span>
            </label>
          </button>
          <div></div>
        </div>
        <div className="function">
          <button title="delete button" onClick={() => deletePage(page.id)}>
            <RiDeleteBin6Line />
            <span className="label">Delete</span>
          </button>
          <button
            title="button to move page to other page"
            onClick={onClickMoveTo}
          >
            <IoArrowRedoOutline />
            <span className="label">Move to</span>
          </button>
          <button
            title="button to export page"
            style={{ display: isMobile() ? "none" : "flex" }}
            onClick={onClickExportBtn}
          >
            <GrDocumentUpload />
            <div>
              <span className="label">Export</span>
              <span>PDF,HTML,Markdown</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TopBarToolMore);
