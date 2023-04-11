import React, { Dispatch, SetStateAction, useContext } from "react";
import styled from "styled-components";
import {
  BgColorType,
  bg_blue,
  bg_default,
  bg_green,
  bg_grey,
  bg_yellow,
  bg_pink,
  Block,
  blue,
  ColorType,
  defaultColor,
  green,
  grey,
  orange,
  Page,
  red,
} from "../modules/notion";
import { setTemplateItem } from "./BlockComponent";
import { ActionContext, selectionType } from "../containers/NotionRouter";

type StyleColorInformProps = {
  color: ColorType | undefined;
  background: BgColorType | undefined;
};
type ColorInformProps = {
  color: ColorType | undefined;
  background: BgColorType | undefined;
  colorName: string;
  page: Page;
  block: Block;
  editBlock: (pageId: string, block: Block) => void;
  templateHtml: HTMLElement | null;
  selection: selectionType | null;
  setSelection: Dispatch<SetStateAction<selectionType | null>> | null;
  closeMenu?: () => void;
};
const StyleColorInform = styled.span`
  color: ${(props: StyleColorInformProps) =>
    props.color ? props.color : "initial"};
  background: ${(props: StyleColorInformProps) =>
    props.background ? props.background : "initial"};
  font-weight: 500;
  font-size: 16px;
  width: 22px;
  text-align: center;
  border-radius: 20%;
`;

const ColorInform = ({
  color,
  background,
  colorName,
  page,
  block,
  editBlock,
  templateHtml,
  selection,
  setSelection,
  closeMenu,
}: ColorInformProps) => {
  const changeContentStyle = (color: string | undefined) => {
    if (selection) {
      const target = color === undefined ? "bg" : "color";
      const bgColorArr = [
        "bg_default",
        "bg_grey",
        " bg_orange",
        "bg_green",
        " bg_blue",
        "bg_pink",
      ];
      const colorArr = [
        " color_default",
        "color_grey",
        " color_orange",
        "color_green",
        " color_blue",
        "color_red",
      ];
      const TARGET_COLOR_ARR = target === "bg" ? bgColorArr : colorArr;
      const className = `${target}_${colorName.toLocaleLowerCase()}`;
      const targetBlock = selection.block;
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
            ...targetBlock,
            contents: innerHtml,
            editTime: JSON.stringify(Date.now()),
          };
          editBlock(page.id, editedBlock);
          setSelection &&
            setSelection({
              block: editedBlock,
              change: true,
            });
        }
      }
    }
  };
  const changeColor = () => {
    if (color === undefined && background) {
      setTemplateItem(templateHtml, page);
      ///change background color
      if (selection === null) {
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
    if (color && background === undefined) {
      ///change color
      if (selection === null) {
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
  };
  return (
    <button className="btn-color-inform" onClick={changeColor}>
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
type ColorMenuProps = {
  page: Page;
  block: Block;
  selection: selectionType | null;
  setSelection: Dispatch<SetStateAction<selectionType | null>> | null;
  closeMenu?: () => void;
};
const ColorMenu = ({
  page,
  block,
  selection,
  setSelection,
  closeMenu,
}: ColorMenuProps) => {
  const { editBlock } = useContext(ActionContext).actions;
  const templateHtml = document.getElementById("template");
  return (
    <div className="menu__color">
      <section className="color-group">
        <header>COLOR</header>
        <div>
          <ColorInform
            colorName="Default"
            color={defaultColor}
            background={undefined}
            page={page}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Grey"
            color={grey}
            background={undefined}
            page={page}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Orange"
            color={orange}
            page={page}
            background={undefined}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Green"
            color={green}
            page={page}
            background={undefined}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Blue"
            color={blue}
            page={page}
            background={undefined}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Red"
            color={red}
            page={page}
            background={undefined}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
        </div>
      </section>
      <section className="background-group">
        <header>BACKGROUNDCOLOR</header>
        <div>
          <ColorInform
            colorName="Default"
            color={undefined}
            page={page}
            background={bg_default}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Grey"
            color={undefined}
            page={page}
            background={bg_grey}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Yellow"
            color={undefined}
            page={page}
            background={bg_yellow}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Green"
            color={undefined}
            page={page}
            background={bg_green}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Blue"
            color={undefined}
            page={page}
            background={bg_blue}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Pink"
            color={undefined}
            page={page}
            background={bg_pink}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            closeMenu={closeMenu}
          />
        </div>
      </section>
    </div>
  );
};
export default React.memo(ColorMenu);
