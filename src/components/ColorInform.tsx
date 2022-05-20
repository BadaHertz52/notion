import React from 'react';
import styled from 'styled-components';

type StyleColorInformProps ={
  color: string | undefined,
  background: string |undefined,
};
type ColorInformProps ={
  color: string | undefined,
  background: string |undefined,
  colorName:string,
};
const StyleColorInform =styled.span`
  color:${(props:StyleColorInformProps) =>props.color !== undefined? props.color: "initial"};

  background:${(props:StyleColorInformProps)=>props.background !==undefined? props.background: "initial" };
  font-weight: 500;
  font-size: 16px;
  width: 22px;
  text-align: center;
  border-radius: 20%;
`; 

const ColorInform=({color ,background, colorName}:ColorInformProps)=>{
  return(
    <div className='colorInform'>
      <StyleColorInform
        className={"colorIcon"}
        color={color} 
        background={background}
        >
        A
      </StyleColorInform>
      <span className='colorName'>
        {color !== undefined ?
          colorName
        :
        `${colorName} background`
          }
      </span>
    </div>

  )
};

export default React.memo(ColorInform);