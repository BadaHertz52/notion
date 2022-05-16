import React from 'react';
import { CSSProperties } from "react";
import { FcTodoList } from 'react-icons/fc';
import { IoIosList } from 'react-icons/io';
import { IoDocumentTextOutline, IoTextOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { VscListOrdered } from 'react-icons/vsc';
import { Block, BlockType, blockTypes, Page } from "../modules/notion";

type CommandBlockProp ={
  page:Page,
  block:Block,
  editTime:string,
  editBlock :(pageId:string, block:Block)=>void,
};

const CommandBlock =({ page ,block , editTime , editBlock}:CommandBlockProp)=>{
  const blockElement = document.getElementById(block.id) as HTMLElement;
  const commandStyle :CSSProperties={
    position: 'absolute',
    top: blockElement.clientHeight,
  };
  const textContent =blockElement.textContent?.toLowerCase() as string ;
  const commandBtns = document.querySelectorAll(".command_btn");
  const no_result =document.getElementById("no_result");
  const commandBlock_inner = document.querySelector("#commandBlock_inner");
  if(textContent !==null){
    const command = textContent.slice(1);
    commandBtns.forEach((btn:Element)=>{
      btn.classList.contains("first") && btn.classList.remove("first");

      if(command !== null &&btn.getAttribute("name")?.includes(command)){
        !btn.classList.contains("on")&&
        btn.classList.add("on");
      }else{
        btn.classList.contains("on")&&
        btn.classList.remove("on");
      };
    });
    const onBtns = document.querySelectorAll('.command_btn.on');

    if(onBtns[0]!== undefined){
      onBtns[0].classList.add("first");
      no_result?.setAttribute("style", "display:none")
    }else{
      no_result?.setAttribute("style", "display:block");
      commandBlock_inner?.setAttribute("style", "display:none");
    }
    
  };
  const changeType=(type:string)=>{
    
    const blockType:BlockType = blockTypes.filter((block_type)=> block_type === type)[0];
    const newBlock:Block ={
      ...block,
      editTime:editTime,
      type:blockType
    };
    console.log("changeType", type, newBlock);
    editBlock(page.id, newBlock);

  };
  return(
      <div 
        id='commandBlock'
        style={commandStyle}
      >
        <div id='commandBlock_inner'>
          <div className='command basic_blocks'>
            <header className='command_header'>
              BASIC BLOCKS
            </header>
            <div className='command_btns type'>
              <button
                onClick={()=>changeType("text")} 
                className='command_btn on' 
                name='text'
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                    <IoTextOutline/>
                  </div>
                  <div className='command_btn_right'>
                    <header>Text</header>
                    <div className='command_explanation'>
                      Just start writing with plain text.
                    </div>
                  </div>
                </div>
              </button>
              <button  
                onClick={()=>changeType("page")}
                className='command_btn on' 
                name='page'
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                    <IoDocumentTextOutline/>
                  </div>
                  <div className='command_btn_right'>
                    <header>Page</header>
                    <div className='command_explanation'>
                      Embed a sub-page inside this page.
                    </div>
                  </div>
                </div>
              </button>
              <button   
                onClick={()=>changeType("todo")}
                className='command_btn on' 
                name='todo list'
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                    <FcTodoList/>
                  </div>
                  <div className='command_btn_right'>
                    <header>To-do list</header>
                    <div className='command_explanation'>
                      Track tasks width a to-do list.
                    </div>
                  </div>
                </div>
              </button>
              <button 
                onClick={()=>changeType("h1")}
                className='command_btn on'
                name='h1'
              >
              <div className='command_btn_inner'>
                <div className='command_btn_left headerType' >
                  <span>H</span>
                  <span>1</span>
                </div>
                <div className='command_btn_right'>
                  <header>Heading 1</header>
                  <div className='command_explanation'>
                    Big section heading.
                  </div>
                </div>
              </div>
              </button>
              <button 
                onClick={()=>changeType("h2")}
                className='command_btn on'
                name='h2'
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left headerType'>
                    <span>H</span>
                    <span>2</span>
                  </div>
                  <div className='command_btn_right '>
                    <header>Heading 2</header>
                    <div className='command_explanation'>
                      Medium section heading 
                    </div>
                  </div>
                </div>
              </button>
              <button 
                onClick={()=>changeType("h3")}
                className='command_btn on'
                name="h3"
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left headerType'>
                    <span>H</span>
                    <span>3</span>
                  </div>
                  <div className='command_btn_right'>
                    <header>Heading 3</header>
                    <div className='command_explanation'>
                      Small section heading.
                    </div>
                  </div>
                </div>
              </button>
              <button 
                onClick={()=>changeType("bullet")}
                className='command_btn on'
                name='bullet list'
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                  <IoIosList/>
                  </div>
                  <div className='command_btn_right'>
                    <header>Bullet list</header>
                    <div className='command_explanation'>
                      Create a simple buttled list.
                    </div>
                  </div>
                </div>
              </button>
              <button 
                onClick={()=>changeType("number")}
                className='command_btn on'
                name="number list"
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                    <VscListOrdered/>
                  </div>
                  <div className='command_btn_right'>
                    <header>Numbered list</header>
                    <div className='command_explanation'>
                      Create a lisdt with numbering.
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={()=>changeType("toggle")}
                className='command_btn on'
                name="toggle list"
              >
              <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                  <RiPlayList2Fill/>
                </div>
                <div className='command_btn_right'>
                  <header>Toggle list</header>
                  <div className='command_explanation'>
                    Toggles can hide and show content inside
                  </div>
                </div>
              </div>
              </button>
            </div>
          </div>
        </div>
        <div id='no_result'>
          No results
        </div>
      </div>
  )
};

export default CommandBlock;