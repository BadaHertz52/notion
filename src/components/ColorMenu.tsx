import React from 'react';
import styled from 'styled-components';
import { BgColorType, bg_blue, bg_default, bg_green, bg_orange, bg_red, Block, blue, ColorType, defaultColor, green, orange, Page, red } from '../modules/notion';

type StyleColorInformProps ={
  color:ColorType | undefined,
  background: BgColorType |undefined,
};
type ColorInformProps ={
  color: ColorType |undefined
  background: BgColorType |undefined,
  colorName:string,
  page:Page,
  block:Block,
  editBlock:(pageId: string, block: Block) => void,
};
const StyleColorInform =styled.span`
  color:${(props:StyleColorInformProps) =>props.color !== undefined? props.color: "initial"};
  background:${(props:StyleColorInformProps)=>props.background !==undefined? props.background:"initial"};
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
const ColorMenu=({page, block, editBlock}:ColorMenuProps)=>{

  return(
    <div  className="menu_color"  >
          <section className="color_colors">
            <header>COLOR</header>
            <div>
              <ColorInform
                colorName='Default'
                color={defaultColor}
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