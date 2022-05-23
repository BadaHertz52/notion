import React from 'react';
import styled from 'styled-components';
import { Block } from '../modules/notion';

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
type ColorMenuProps = {
  block:Block,
  editBlock : (pageId: string, block: Block) => void,
};
const ColorMenu=({block, editBlock}:ColorMenuProps)=>{
  const orange:string ="#ffa726";
  const green:string ="#00701a";
  const blue :string ="#1565c0";
  const red : string ="#d32f2f";
  const bg_default:string = "#d0d0d0";
  const bg_orange:string ="#ffecd0";
  const bg_green:string ="#dcedc8";
  const bg_blue :string ="#e3f2fd";
  const bg_red : string ="#ffcdd2";

  return(
    <div  className="menu_color"  >
          <section className="color_colors">
            <header>COLOR</header>
            <div>
              <ColorInform
                colorName='Default'
                color={"black"}
                background ={undefined}
              />
              <ColorInform
                colorName='Orange'
                color={orange}
                background ={undefined}
              />
              <ColorInform
                colorName='Green'
                color={green}
                background ={undefined}
              />
              <ColorInform
                colorName='Blue'
                color={blue}
                background={undefined}
              /> 
              <ColorInform
                colorName='Red'
                color={red}
                background={undefined}
              />
            </div>
          </section>
          <section className="color_background">
            <header>BACKGROUNDCOLOR</header>
            <div>
              <ColorInform
                colorName='Default'
                color={undefined}
                background={bg_default}
              />
              <ColorInform
                colorName='Orange'
                color={undefined}
                background={bg_orange}
                />
              <ColorInform
                colorName='Green'
                color={undefined}
                background={bg_green}
              />
              <ColorInform
                colorName='Blue'
                color={undefined}
                background={bg_blue}
              />
              <ColorInform
                colorName='Red'
                color={undefined}
                background={bg_red}
              />
            </div>
          </section>
        </div>
  )
};
export default React.memo(ColorMenu);