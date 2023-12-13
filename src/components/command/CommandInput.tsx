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
import ScreenOnly from "../ScreenOnly";
import { Block, BlockType, Page } from "../../types";
import { BLOCK_TYPES } from "../../constants";
import { getEditTime } from "../../utils";
import { ActionContext } from "../../contexts";

type CommandInputProps = {
  templateHtml: HTMLElement | null;
  page: Page;
  block: Block;
  setTemplateItem(templateHtml: HTMLElement | null, page: Page): void;
  closeCommand: () => void;
  setCommand: Dispatch<SetStateAction<string | undefined>>;
};

const CommandInput = ({ ...props }: CommandInputProps) => {
  const { editBlock } = useContext(ActionContext).actions;

  const {
    templateHtml,
    page,
    block,
    setCommand,
    closeCommand,
    setTemplateItem,
  } = props;

  const commentInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("/");

  /**
   * input 창을 통해 command의 값을 변경 시키는 함수
   * @param event ChangeEvent<HTMLInputElement>
   */
  const commandChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTemplateItem(templateHtml, page);
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
    [closeCommand, page, setCommand, setValue, setTemplateItem, templateHtml]
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
        setTemplateItem(templateHtml, page);
        closeCommand();
      }
    },
    [block, closeCommand, editBlock, page, setTemplateItem, templateHtml]
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
    <div className="commandInput">
      <label htmlFor="commandInput">
        <ScreenOnly text="content input" />
      </label>
      <input
        type="text"
        title="content input"
        tabIndex={-1}
        value={value}
        id="commandInput"
        className="contentEditable"
        ref={commentInputRef}
        onChange={commandChange}
        onKeyUp={commandKeyUp}
      />
    </div>
  );
};

export default React.memo(CommandInput);
