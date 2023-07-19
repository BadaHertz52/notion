import React, { Dispatch, SetStateAction, useContext } from "react";

import {
  bg_blue,
  bg_default,
  bg_green,
  bg_grey,
  bg_yellow,
  bg_pink,
  Block,
  blue,
  defaultColor,
  green,
  grey,
  orange,
  Page,
  red,
} from "../modules/notion";
import { ActionContext, selectionType } from "../containers/NotionRouter";
import ColorInform from "./ColorInform";

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
        <header>BACKGROUND COLOR</header>
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
