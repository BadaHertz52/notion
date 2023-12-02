import React from "react";

import { Link } from "react-router-dom";
import { CSSProperties } from "styled-components";

import { PageIcon } from "../index";
import { ResultType } from "../../types";
import { makeRoutePath } from "../../utils";

import "../../assets/result.scss";

export type ResultProps = {
  item: ResultType;
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
