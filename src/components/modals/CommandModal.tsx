import React, { CSSProperties, useEffect } from "react";

import { ModalPortal, CommandMenu } from "../index";

import { CommandMenuProp } from "../command/CommandMenu";
import { useModal } from "../../hooks";

type CommandModalProps = Omit<CommandMenuProp, "setSelection"> & {
  openCommandMenu: boolean;
  style: CSSProperties | undefined;
  closeCommand: () => void;
};
function CommandModal({ ...props }: CommandModalProps) {
  const { closeCommand } = props;
  const CORRECT_EVENT_TARGETS = ["#menu-command", "#commendInput"];
  const openModal = useModal(CORRECT_EVENT_TARGETS, "command");

  useEffect(() => {
    if (openModal.command === false) closeCommand();
  }, [openModal, closeCommand]);

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
