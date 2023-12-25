import React, {
  ChangeEvent,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useContext,
  Dispatch,
  useState,
  useRef,
  useEffect,
} from "react";

import { ScreenOnly } from "../index";

import { BLOCK_TYPES } from "../../constants";
import { ActionContext } from "../../contexts";
import { Block, BlockType, Page } from "../../types";
import { getEditTime, setOriginTemplateItem } from "../../utils";

type CommandInputProps = {
  page: Page;
  block: Block;
  closeCommand: () => void;
  setCommand: Dispatch<SetStateAction<string | undefined>>;
};

const CommandInput = ({ ...props }: CommandInputProps) => {
  const { editBlock } = useContext(ActionContext).actions;

  const { page, block, setCommand, closeCommand } = props;

  const commentInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("/");

  /**
   * input 창을 통해 command의 값을 변경 시키는 함수
   * @param event ChangeEvent<HTMLInputElement>
   */
  const commandChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setOriginTemplateItem(page);
      const targetValue = event.target.value;
      setValue(targetValue);
      const SLASH = "/";
      const isStartWidthSlash = targetValue.startsWith(SLASH);
      if (isStartWidthSlash) {
        setCommand(targetValue.replace(SLASH, ""));
      } else {
        closeCommand();
      }
    },
    [closeCommand, page, setCommand, setValue]
  );

  /**
   * enter 키를 누르면 block 의 type을 commandBlock 에서 현재 제일 위에 있는 type으로 변경하는 함수
   * @param event KeyboardEvent<HTMLInputElement>
   */
  const commandKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const code = event.code;
      const firstOn = document.querySelector(".btn-command.on");
      if (code === "Enter") {
        const name = firstOn?.getAttribute("name") as string;
        const blockType: BlockType = BLOCK_TYPES.filter((type) =>
          name.includes(type)
        )[0];
        const newBlock: Block = {
          ...block,
          type: blockType,
          editTime: getEditTime(),
        };
        editBlock(page.id, newBlock);
        setOriginTemplateItem(page);
        closeCommand();
      }
    },
    [block, closeCommand, editBlock, page]
  );

  useEffect(() => {
    commentInputRef.current?.focus();
    const frameEl = commentInputRef.current?.closest(".frame");
    frameEl?.classList.add("stop");

    return () => {
      frameEl?.classList.remove("stop");
    };
  }, []);
  return (
    <div className="command-input">
      <label htmlFor="input-command">
        <ScreenOnly text="content input" />
      </label>
      <input
        type="text"
        title="content input"
        tabIndex={-1}
        value={value}
        id="input-command"
        className="editable"
        ref={commentInputRef}
        onChange={commandChange}
        onKeyUp={commandKeyUp}
      />
    </div>
  );
};

export default React.memo(CommandInput);
