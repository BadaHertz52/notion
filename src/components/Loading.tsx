import React from "react";

import "../assets/loading.scss";

const Loading = () => {
  return (
    <div className="loading">
      <div className="loading__container">
        <div className="loading__loader">
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Loading);
