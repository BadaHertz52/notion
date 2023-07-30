import React, { Dispatch, SetStateAction, useRef } from "react";

type DiscardEditFormProps = {
  setDiscardEdit: Dispatch<SetStateAction<boolean>>;
};
const DiscardEditForm = ({ setDiscardEdit }: DiscardEditFormProps) => {
  const discardEditFormRef = useRef<HTMLDivElement>(null);
  const onClickDiscardEdit = () => {
    discardEditFormRef.current?.classList.remove("on");
    setDiscardEdit(true);
  };

  const onClickCloseEdit = () => {
    discardEditFormRef.current?.classList.remove("on");
    setDiscardEdit(false);
  };
  return (
    <div
      id="discardEditForm"
      className="discardEditForm"
      ref={discardEditFormRef}
    >
      <div className="inner">
        <div className="question">
          <div>Do you want to discard this edit?</div>
        </div>
        <div className="btn-group">
          <button title="button to discard" onClick={onClickDiscardEdit}>
            Discard
          </button>
          <button title="close button" onClick={onClickCloseEdit}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DiscardEditForm);
