import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { BgColorType, bg_blue, bg_default, bg_green, bg_grey, bg_yellow, bg_pink, Block, blue, ColorType, defaultColor, green, grey, orange, Page, red } from '../modules/notion';
import { setTemplateItem } from './BlockComponent';
import {selectionType} from '../containers/NotionRouter';

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
  setSelection: Dispatch<SetStateAction<selectionType | null>>|null ,
  setOpenMenu :Dispatch<SetStateAction<boolean>>|null
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

const ColorInform=({color ,background, colorName ,page, block ,editBlock, templateHtml,  selection, setSelection , setOpenMenu}:ColorInformProps)=>{

  const changeContentStyle=(colorName:string)=>{
    if(selection !==null &&setSelection !==null ){
      const target = color ===undefined? "bg" :"color";
      const bg_colors=["bg_default","bg_grey"," bg_orange", "bg_green", " bg_blue",  "bg_pink"];
      const color_colors=[" color_default","color_grey"," color_orange", "color_green", " color_blue", "color_red" ];
      const className=  `${target}_${colorName.toLocaleLowerCase()}`;
      const targetBlock =selection.block;
      const selecteds =document.querySelectorAll(".selected") as NodeListOf<HTMLElement>;
      if(selecteds[0]!==undefined){
        selecteds.forEach((selectedHtml:HTMLElement)=>{
          //배경색이나 폰트 색상을 바꾸려하는데, 선택된 node의 자식 node 중에 이미 배경색이나 폰트색상이 지정되어 있는 경우, 지정된 스타일을 제거함 
          const selectedChildren= selectedHtml.childNodes  as NodeListOf<Node> | undefined;
          if(selectedChildren !==undefined){
            selectedChildren.forEach((node:Node)=> {
              if(node.nodeName==="SPAN"){
                const spantHtml =node as HTMLElement; 
                if(spantHtml.classList.contains(target)){
                  const arry =target==="bg"? bg_colors : color_colors;
                  const targetColor = arry.filter((c:string)=> spantHtml.classList.contains(c))[0];
                  spantHtml.classList.remove(target);
                  spantHtml.classList.remove(targetColor);
                  if(spantHtml.classList[0]===undefined){
                    const newTextNode = document.createTextNode(spantHtml.innerHTML);
                    spantHtml.parentNode?.replaceChild(newTextNode, spantHtml);
                  }
                }
              }
            });
          };
          // 배경색 or 폰트 색상 지정을 위한 className 변경 
          if(selectedHtml.classList.contains(target)){
            const arry = target==="bg"? bg_colors: color_colors;
            const removeTargetClass = arry.filter((c:string)=> selectedHtml.classList.contains(c))[0];
            selectedHtml.classList.remove(removeTargetClass);
            selectedHtml.classList.add(className)
          }else{
            selectedHtml.classList.add(target);
            selectedHtml.classList.add(className);
          };
          const contentEditableHtml =document.getElementById(`${block.id}_contents`)?.firstElementChild
          if(contentEditableHtml!==null&& contentEditableHtml!==undefined){
            const innerHtml =contentEditableHtml.innerHTML;
            const editedBlock:Block ={
              ...targetBlock,
              contents:innerHtml,
              editTime:JSON.stringify(Date.now())
            };
            editBlock(page.id, editedBlock);
            setSelection!==null && setSelection({
              block:editedBlock,
              change:true
            })
          }
        })
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
    };
    setOpenMenu !==null && setOpenMenu(false);
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
  setSelection:Dispatch<SetStateAction<selectionType | null>>|null,
  setOpenMenu : Dispatch<SetStateAction<boolean>>|null
};
const ColorMenu=({page, block, editBlock, selection, setSelection , setOpenMenu}:ColorMenuProps)=>{
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
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
            setOpenMenu={setOpenMenu}
          />
        </div>
      </section>
        </div>
  )
};
export default React.memo(ColorMenu);