import React, { Dispatch, SetStateAction } from "react";
import ModalPortal from "./ModalPortal";
import DiscardEditForm from "../DiscardEditForm";

type DiscardEditModalProps = {
  openDiscardEdit: boolean;
  setOpenDiscardEdit: Dispatch<SetStateAction<boolean>>;
  discardEdit: () => void;
};

function DiscardEditModal({ ...props }: DiscardEditModalProps) {
  return (
    <ModalPortal
      target="discardEdit"
      id="modal-discardEdit"
      isOpen={props.openDiscardEdit}
      style={{}}
    >
      <DiscardEditForm
        discardEdit={props.discardEdit}
        setOpenDiscardEdit={props.setOpenDiscardEdit}
      />
    </ModalPortal>
  );
}

export default React.memo(DiscardEditModal);
