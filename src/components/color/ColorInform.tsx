import React, { Dispatch, SetStateAction, useCallback } from "react";
import styled from "styled-components";

import { BgColorType, Block, ColorType, ModalType, Page } from "../../types";
import { getEditTime, setOriginTemplateItem } from "../../utils";
import { BACKGROUND_COLOR, COLOR } from "../../constants";

type ColorInformProps = {
  color?: ColorType;
  background?: BgColorType;
  colorName: string;
  page: Page;
  block: Block;
  editBlock: (pageId: string, block: Block) => void;
  setModal?: Dispatch<SetStateAction<ModalType>>;
  closeMenu?: () => void;
};

const ColorInform = ({
  color,
  background,
  colorName,
  page,
  block,
  editBlock,
  setModal,
  closeMenu,
}: ColorInformProps) => {
  type StyleColorInformProps = {
    color: ColorType | undefined;
    background: BgColorType | undefined;
  };

  const StyleColorInform = styled.span`
    color: ${(props: StyleColorInformProps) =>
      props.color ? COLOR[props.color] : "initial"};
    background: ${(props: StyleColorInformProps) =>
      props.background ? BACKGROUND_COLOR[props.background] : "initial"};
    font-weight: 500;
    font-size: 16px;
    width: 22px;
    text-align: center;
    border-radius: 20%;
  `;

  const changeContentStyle = useCallback(
    (color: string | undefined) => {
      const target = !color ? "bg" : "color";
      const BG_COLOR_ARRAY = Object.keys(BACKGROUND_COLOR);
      const COLOR_ARRAY = Object.keys(COLOR);
      const TARGET_COLOR_ARR = target === "bg" ? BG_COLOR_ARRAY : COLOR_ARRAY;
      const className = `${target}_${colorName.toLocaleLowerCase()}`;

      const selectedHtml = document.querySelector(".selected");
      if (selectedHtml) {
        //배경색이나 폰트 색상을 바꾸려하는데, 선택된 node의 자식 node 중에 이미 배경색이나 폰트색상이 지정되어 있는 경우, 지정된 스타일을 제거함
        const selectedChildren = selectedHtml.childNodes as
          | NodeListOf<Node>
          | undefined;
        if (selectedChildren) {
          selectedChildren.forEach((node: Node) => {
            if (node.nodeName === "SPAN") {
              const spanHtml = node as HTMLElement;
              if (spanHtml.classList.contains(target)) {
                const targetColor = TARGET_COLOR_ARR.filter((c: string) =>
                  spanHtml.classList.contains(c)
                )[0];
                spanHtml.classList.remove(target);
                spanHtml.classList.remove(targetColor);
                if (spanHtml.classList[0] === undefined) {
                  const newTextNode = document.createTextNode(
                    spanHtml.innerHTML
                  );
                  spanHtml.parentNode?.replaceChild(newTextNode, spanHtml);
                }
              }
            }
          });
        }
        // 배경색 or 폰트 색상 지정을 위한 className 변경
        if (selectedHtml.classList.contains(target)) {
          const removeTargetClass = TARGET_COLOR_ARR.filter((c: string) =>
            selectedHtml.classList.contains(c)
          )[0];
          selectedHtml.classList.replace(removeTargetClass, className);
        } else {
          selectedHtml.classList.add(target);
          selectedHtml.classList.add(className);
        }
        const contentEditableHtml = document.getElementById(
          `${block.id}__contents`
        )?.firstElementChild;
        if (contentEditableHtml) {
          const innerHtml = contentEditableHtml.innerHTML;
          const editedBlock: Block = {
            ...block,
            contents: innerHtml,
            editTime: getEditTime(),
          };
          editBlock(page.id, editedBlock);
          if (setModal)
            setModal((prev) => ({
              ...prev,
              block: editedBlock,
            }));
        }
      }
    },
    [block, colorName, editBlock, page.id, setModal]
  );
  const changeColor = useCallback(() => {
    if (!color && background) {
      setOriginTemplateItem(page);
      ///change background color
      if (!setModal) {
        const newBlock: Block = {
          ...block,
          style: {
            ...block.style,
            bgColor: background,
          },
        };
        editBlock(page.id, newBlock);
      } else {
        changeContentStyle(color);
      }
    }
    if (color && !background) {
      ///change color
      if (!setModal) {
        const newBlock: Block = {
          ...block,
          style: {
            ...block.style,
            color: color,
          },
        };
        editBlock(page.id, newBlock);
      } else {
        changeContentStyle(color);
      }
    }
    closeMenu && closeMenu();
  }, [
    background,
    block,
    changeContentStyle,
    closeMenu,
    color,
    editBlock,
    page,
    setModal,
  ]);
  return (
    <button
      className="btn-color-inform"
      title={`button to change ${color ? "color" : "background color"}`}
      onClick={changeColor}
    >
      <StyleColorInform
        className={"icon-color"}
        color={color}
        background={background}
      >
        A
      </StyleColorInform>
      <span className="color-name">
        {color ? colorName : `${colorName} background`}
      </span>
    </button>
  );
};

export default React.memo(ColorInform);
