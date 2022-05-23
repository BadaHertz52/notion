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
const ColorInform=({color ,background, colorName ,page, block ,editBlock}:ColorInformProps)=>{
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
                page={page}
                block={block}
                editBlock={editBlock}
              />
              <ColorInform
                colorName='Orange'
                color={orange}
                page={page}
                background ={undefined}
                block={block}
                editBlock={editBlock}
              />
              <ColorInform
                colorName='Green'
                color={green}
                page={page}
                background ={undefined}
                block={block}
                editBlock={editBlock}
              />
              <ColorInform
                colorName='Blue'
                color={blue}
                page={page}
                background={undefined}
                block={block}
                editBlock={editBlock}
              /> 
              <ColorInform
                colorName='Red'
                color={red}
                page={page}
                background={undefined}
                block={block}
                editBlock={editBlock}
              />
            </div>
          </section>
          <section className="color_background">
            <header>BACKGROUNDCOLOR</header>
            <div>
              <ColorInform
                colorName='Default'
                color={undefined}
                page={page}
                background={bg_default}
                block={block}
                editBlock={editBlock}
              />
              <ColorInform
                colorName='Orange'
                color={undefined}
                page={page}
                background={bg_orange}
                block={block}
                editBlock={editBlock}
                />
              <ColorInform
                colorName='Green'
                color={undefined}
                page={page}
                background={bg_green}
                block={block}
                editBlock={editBlock}
              />
              <ColorInform
                colorName='Blue'
                color={undefined}
                page={page}
                background={bg_blue}
                block={block}
                editBlock={editBlock}
              />
              <ColorInform
                colorName='Red'
                color={undefined}
                page={page}
                background={bg_red}
                block={block}
                editBlock={editBlock}
              />
            </div>
          </section>
        </div>
  )
};
export default React.memo(ColorMenu);