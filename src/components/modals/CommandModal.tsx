import React, { CSSProperties, useCallback, useEffect } from "react";
import { ModalPortal, CommandMenu } from "../index";
import { CommandMenuProp } from "../command/CommandMenu";
import { isInTarget } from "../../utils";

type CommandModalProps = Omit<CommandMenuProp, "setSelection"> & {
  openCommandMenu: boolean;
  style: CSSProperties | undefined;
  closeCommand: () => void;
};
function CommandModal({ ...props }: CommandModalProps) {
  const { closeCommand } = props;

  const handleClose = useCallback(
    (event: globalThis.MouseEvent) => {
      const array = ["#menu-command", "#commendInput"];
      const isNotTarget = array
        .map((v) => !isInTarget(event, v))
        .every((v) => v);
      if (isNotTarget) closeCommand();
    },
    [closeCommand]
  );

  useEffect(() => {
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [handleClose]);

  return (
    <ModalPortal
      id="modal-command"
      isOpen={props.openCommandMenu}
      style={props.style}
    >
      <CommandMenu
        page={props.page}
        block={props.block}
        command={props.command}
        closeCommand={props.closeCommand}
      />
    </ModalPortal>
  );
}

export default React.memo(CommandModal);
