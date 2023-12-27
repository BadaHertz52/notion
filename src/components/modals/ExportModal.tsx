import React from "react";
import ModalPortal from "./ModalPortal";
import Export, { ExportProps } from "../Export";

type ExportModalProps = ExportProps;

const ExportModal = ({ ...props }: ExportModalProps) => {
  return (
    <ModalPortal id="modal-export" target="export" isOpen={true}>
      <Export {...props} />
    </ModalPortal>
  );
};

export default React.memo(ExportModal);
