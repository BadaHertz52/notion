import React from "react";

import { TemplateDeleteAlert, TemplateEditAlert } from "../index";
import { TemplateEditAlertProps } from "./TemplateEditAlert";
import { TemplateDeleteAlertProps } from "./TemplateDeleteAlert";

type TemplateAlertProps = TemplateEditAlertProps &
  TemplateDeleteAlertProps & {
    alert: "edit" | "delete" | undefined;
  };

const TemplateAlert = ({ ...props }: TemplateAlertProps) => {
  return (
    <div id="template-alert">
      <div className="template-alert__inner">
        {props.alert === "edit" ? (
          <TemplateEditAlert {...props} />
        ) : (
          <TemplateDeleteAlert {...props} />
        )}
      </div>
    </div>
  );
};

export default React.memo(TemplateAlert);
