import React from 'react';
import styled from 'styled-components';
import { BgColorType, bg_blue, bg_default, bg_green, bg_grey, bg_yellow, bg_pink, Block, blue, ColorType, defaultColor, green, grey, orange, Page, red } from '../modules/notion';

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

const ColorInform=({color ,background, colorName ,page, block ,editBlock}:ColorInformProps)=>{
  const changeColor =()=>{
    if(color ===undefined && background !== undefined ){
      ///change backgournd color
      const newBlock :Block ={
        ...block,
        style :{
          ...block.style,
          bgColor: background,
        }
      };
      editBlock(page.id, newBlock)
    }
    if(color !== undefined && background === undefined){
      ///change color
      const newBlock :Block ={
        ...block,
        style: {
          ...block.style,
          color: color
        }
      };
      editBlock(page.id, newBlock)
    }
  };

  return(
    <button 
      className='colorInform'
      onClick ={changeColor}
    >
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
    </button>

  )
};
type ColorMenuProps = {
  page :Page,
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
                colorName='Grey'
                color={grey}
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
                colorName='Grey'
                color={undefined}
                page={page}
                background={bg_grey}
                block={block}
                editBlock={editBlock}
              />
              <ColorInform
                colorName='Yellow'
                color={undefined}
                page={page}
                background={bg_yellow}
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
                colorName='Pink'
                color={undefined}
                page={page}
                background={bg_pink}
                block={block}
                editBlock={editBlock}
              />
            </div>
          </section>
        </div>
  )
};
export default React.memo(ColorMenu);