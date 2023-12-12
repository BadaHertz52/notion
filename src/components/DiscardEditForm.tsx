import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
} from "react";

import "../assets/discardEditForm.scss";

type DiscardEditFormProps = {
  setOpenDiscardEdit: Dispatch<SetStateAction<boolean>>;
  discardEdit: () => void;
};

const DiscardEditForm = ({
  setOpenDiscardEdit,
  discardEdit,
}: DiscardEditFormProps) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { name } = event.currentTarget;
      if (name === "discard") {
        discardEdit();
      }
      setOpenDiscardEdit(false);
    },
    [setOpenDiscardEdit, discardEdit]
  );

  return (
    <div id="discardEditForm" className="discardEditForm">
      <div className="inner">
        <div className="question">
          <div>Do you want to discard this edit?</div>
        </div>
        <div className="btn-group">
          <button
            title="button to discard"
            name="discard"
            onClick={handleClick}
          >
            Discard
          </button>
          <button title="close button" name="close" onClick={handleClick}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DiscardEditForm);
