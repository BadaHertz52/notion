import React, { ReactNode } from "react";

type NewTemplateBtnProps = {
  onClickMakeTemplateBtn: () => void;
  children: ReactNode;
};
const NewTemplateBtn = ({
  onClickMakeTemplateBtn,
  children,
}: NewTemplateBtnProps) => {
  return (
    <button
      title="button to make new template"
      className="templates__btn templates__btn-make"
      onClick={onClickMakeTemplateBtn}
    >
      {children}
    </button>
  );
};

export default React.memo(NewTemplateBtn);
