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
  border :1px solid black;
`; 

const ColorInform=({color ,background, colorName}:ColorInformProps)=>{
  return(
    <div className='color_color'>
      <StyleColorInform
        className={"color_left"}
        color={color} 
        background={background}
        >
        A
      </StyleColorInform>
      <span className='color_inform'>
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