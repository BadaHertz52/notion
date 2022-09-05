import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { BgColorType, bg_blue, bg_default, bg_green, bg_grey, bg_yellow, bg_pink, Block, blue, ColorType, defaultColor, green, grey, orange, Page, red } from '../modules/notion';
import { setTemplateItem } from './BlockComponent';
import { getContent } from './BlockStyler';
import { selectionType } from './Frame';

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
  templateHtml:HTMLElement|null,
  selection:selectionType|null,
  setSelection: Dispatch<SetStateAction<selectionType | null>>|null
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

const ColorInform=({color ,background, colorName ,page, block ,editBlock, templateHtml,  selection, setSelection}:ColorInformProps)=>{
  const changeContentStyle=(colorName:string)=>{
    if(selection !==null &&setSelection !==null ){
      const className= color===undefined? `bg_${colorName.toLocaleLowerCase()}`:
      `color_${colorName.toLocaleLowerCase()}`
      const targetBlock =selection.block;
      const selectedHtml =document.querySelector(".selected");
      const selectedChildren= selectedHtml?.childNodes  as NodeListOf<Node> | undefined;
      if(selectedChildren !==undefined){
        let array:string[] =[];
        selectedChildren.forEach((node:Node)=> {
          console.log("nodename", node.nodeName);
          if(node.nodeName ==="#text"){
            array.push(node.textContent as string);
          };
          if(node.nodeName=== "SPAN"){
            const element =node as HTMLElement;
            if(element.className.includes("bg_")){
              console.log("e", element, element.innerHTML);
              array.push(element.innerHTML);
            }
            else{
              array.push(element.outerHTML);
            }
          };
        });
        const newSelectedInnerHtml =array.join("");
        console.log("new innerhtml", newSelectedInnerHtml);
        if(selectedHtml!==null){
          selectedHtml.innerHTML =newSelectedInnerHtml;
          selectedHtml?.classList.add(className);
          const newBlock = getContent(targetBlock);
          editBlock(page.id, newBlock);
          const newSelection :selectionType ={
            block:newBlock
          };
          setSelection(newSelection);
        }
      }

    };
  };
  const changeColor =()=>{
    if(color ===undefined && background !== undefined ){
      setTemplateItem(templateHtml,page);
      ///change backgournd color
      if(selection === null){
        const newBlock :Block ={
          ...block,
          style :{
            ...block.style,
            bgColor: background,
          }
        };
        editBlock(page.id, newBlock)
      }else{
          changeContentStyle(colorName);
        }
        
    }
    if(color !== undefined && background === undefined){
      ///change color
      if(selection ===null){
        const newBlock :Block ={
          ...block,
          style: {
            ...block.style,
            color: color
          }
        };
        editBlock(page.id, newBlock)
      }else{
        changeContentStyle(colorName);
      }
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
  selection:selectionType|null,
  setSelection:Dispatch<SetStateAction<selectionType | null>>|null
};
const ColorMenu=({page, block, editBlock, selection, setSelection}:ColorMenuProps)=>{
  const templateHtml=document.getElementById("template");
  return(
    <div className="menu_color"  >
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
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          />
          <ColorInform
            colorName='Grey'
            color={grey}
            background ={undefined}
            page={page}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          />
          <ColorInform
            colorName='Orange'
            color={orange}
            page={page}
            background ={undefined}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          />
          <ColorInform
            colorName='Green'
            color={green}
            page={page}
            background ={undefined}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          />
          <ColorInform
            colorName='Blue'
            color={blue}
            page={page}
            background={undefined}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          /> 
          <ColorInform
            colorName='Red'
            color={red}
            page={page}
            background={undefined}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
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
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          />
          <ColorInform
            colorName='Grey'
            color={undefined}
            page={page}
            background={bg_grey}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          />
          <ColorInform
            colorName='Yellow'
            color={undefined}
            page={page}
            background={bg_yellow}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
            />
          <ColorInform
            colorName='Green'
            color={undefined}
            page={page}
            background={bg_green}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          />
          <ColorInform
            colorName='Blue'
            color={undefined}
            page={page}
            background={bg_blue}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          />
          <ColorInform
            colorName='Pink'
            color={undefined}
            page={page}
            background={bg_pink}
            block={block}
            editBlock={editBlock}
            templateHtml={templateHtml}
            selection={selection}
            setSelection={setSelection}
          />
        </div>
      </section>
        </div>
  )
};
export default React.memo(ColorMenu);