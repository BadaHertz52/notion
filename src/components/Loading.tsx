import React from 'react';

const Loading=()=>{ 

  return(
    <div className='loading'>
      <div className='loading_container'>
        <div className="loading_loader">
          <span></span>
        </div>
      </div>
    </div>
  )
};

export default React.memo(Loading)