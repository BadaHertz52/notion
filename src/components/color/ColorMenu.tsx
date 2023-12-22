import React, { Dispatch, SetStateAction, useContext } from "react";

import { Block, ModalType, Page } from "../../types";
import { ActionContext } from "../../contexts";
import { ColorInform } from "../index";

type ColorMenuProps = {
  page: Page;
  block: Block;
  setModal?: Dispatch<SetStateAction<ModalType>>;
  closeMenu?: () => void;
};
const ColorMenu = ({ page, block, setModal, closeMenu }: ColorMenuProps) => {
  const { editBlock } = useContext(ActionContext).actions;
  const templateHtml = document.getElementById("template");
  return (
    <div id="menu-color">
      <section className="color-group">
        <header>COLOR</header>
        <div>
          <ColorInform
            colorName="Default"
            color="default"
            page={page}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Grey"
            color="grey"
            page={page}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Orange"
            color="orange"
            page={page}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Green"
            color="green"
            page={page}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Blue"
            color="blue"
            page={page}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Red"
            color="red"
            page={page}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
        </div>
      </section>
      <section className="background-group">
        <header>BACKGROUND COLOR</header>
        <div>
          <ColorInform
            colorName="Default"
            page={page}
            background={"default"}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Grey"
            page={page}
            background={"grey"}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Yellow"
            page={page}
            background={"yellow"}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Green"
            page={page}
            background={"green"}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Blue"
            page={page}
            background={"blue"}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
          <ColorInform
            colorName="Pink"
            page={page}
            background={"pink"}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            setModal={setModal}
            closeMenu={closeMenu}
          />
        </div>
      </section>
    </div>
  );
};
export default React.memo(ColorMenu);
