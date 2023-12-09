import React, {
  ChangeEvent,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useContext,
  Dispatch,
} from "react";
import ScreenOnly from "../ScreenOnly";
import { Block, BlockType, CommandType, Page } from "../../types";
import { BLOCK_TYPES } from "../../constants";
import { getEditTime } from "../../utils";
import { ActionContext } from "../../contexts";

type CommandInputProps = {
  templateHtml: HTMLElement | null;
  page: Page;
  command: CommandType;
  setTemplateItem(templateHtml: HTMLElement | null, page: Page): void;
  setCommand: Dispatch<SetStateAction<CommandType>>;
};

const CommandInput = ({ ...props }: CommandInputProps) => {
  const { editBlock } = useContext(ActionContext).actions;

  const { command, templateHtml, page, setCommand, setTemplateItem } = props;
  /**
   * input 창을 통해 command의 값을 변경 시키는 함수
   * @param event ChangeEvent<HTMLInputElement>
   */
  const commandChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setTemplateItem(templateHtml, page);
      const value = event.target.value;
      const trueOrFalse = value.startsWith("/");
      if (trueOrFalse) {
        setCommand({
          open: true,
          command: value.toLowerCase(),
          targetBlock: command.targetBlock,
        });
      } else {
        setCommand({
          open: false,
          command: null,
          targetBlock: null,
        });
      }
    },
    [command.targetBlock, page, setCommand, setTemplateItem, templateHtml]
  );

  /**
   * enter 키를 누르면 block 의 type을 commandBlock 에서 현재 제일 위에 있는 type으로 변경하는 함수
   * @param event KeyboardEvent<HTMLInputElement>
   */
  const commandKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const code = event.code;
      const firstOn = document.querySelector(".btn-command.on.first");
      if (code === "Enter" && command.targetBlock) {
        const name = firstOn?.getAttribute("name") as string;
        const blockType: BlockType = BLOCK_TYPES.filter((type) =>
          name.includes(type)
        )[0];
        const newBlock: Block = {
          ...command.targetBlock,
          type: blockType,
          editTime: getEditTime(),
        };
        editBlock(page.id, newBlock);
        setCommand({
          open: false,
          command: null,
          targetBlock: null,
        });
        setTemplateItem(templateHtml, page);
      }
    },
    [
      command.targetBlock,
      editBlock,
      page,
      setCommand,
      setTemplateItem,
      templateHtml,
    ]
  );

  return (
    <div className="commandInput">
      <label htmlFor="commandInput">
        <ScreenOnly text="content input" />
      </label>
      <input
        type="text"
        title="content input"
        tabIndex={-1}
        value={command.command as string}
        id="commandInput"
        className="contentEditable"
        onChange={commandChange}
        onKeyUp={commandKeyUp}
      />
    </div>
  );
};

export default React.memo(CommandInput);
