import React, { ReactNode } from "react";

type UseTemplateBtnProps = {
  onClickUseBtn: () => void;
  children: ReactNode;
};
const UseTemplateBtn = ({ onClickUseBtn, children }: UseTemplateBtnProps) => {
  return (
    <button
      title="button to use this template"
      className="templates__btn templates__btn-use-template"
      onClick={onClickUseBtn}
    >
      {children}
    </button>
  );
};

export default React.memo(UseTemplateBtn);
