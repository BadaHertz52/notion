import React from "react";
import { IconType } from "../modules/notion/type";
import PageIcon from "./PageIcon";
export type resultType = {
  id: string;
  title: string;
  icon: string | null;
  iconType: IconType;
  createTime: string;
  editTime: string;
  path: string | null;
};
export type ResultProps = {
  item: resultType;
};

const Result = ({ item }: ResultProps) => {
  return (
    <div className="result">
      <PageIcon icon={item.icon} iconType={item.iconType} style={undefined} />
      <div>
        <div className="page__title">{item.title}</div>
        {item.path && (
          <div className="path">
            <span>—</span>
            {item.path}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Result);
