import React from "react";
import { IconType } from "../modules/notion/type";
import PageIcon from "./PageIcon";
import { Link } from "react-router-dom";
import { makeRoutePath } from "../fn";
import { CSSProperties } from "styled-components";
import "../assets/result.scss";

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
  width: number;
};

const Result = ({ item, width }: ResultProps) => {
  const padding = 15;
  const iconWidth = 16 * 1.1 + 10;
  const style: CSSProperties = {
    width: (width - padding - iconWidth) * 0.8,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  return (
    <Link className="result" to={makeRoutePath(item.id)}>
      <PageIcon icon={item.icon} iconType={item.iconType} style={undefined} />
      <div>
        <div className="page__title" style={style}>
          {item.title}
        </div>
        {item.path && (
          <div className="path" style={style}>
            {item.path}
          </div>
        )}
      </div>
    </Link>
  );
};

export default React.memo(Result);
