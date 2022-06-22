import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FcTodoList } from 'react-icons/fc';
import { IoIosList } from 'react-icons/io';
import { IoDocumentTextOutline, IoTextOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { VscListOrdered } from 'react-icons/vsc';
import { Command } from '../containers/EditorContainer';
import { Block, BlockType, blockTypes, Page } from "../modules/notion";
import { changeSubPage } from './PageMenu';

type CommandBlockProp ={
  page:Page,
  block:Block,
  editTime:string,
  editBlock :(pageId:string, block:Block)=>void,
  command:Command,
  setCommand: Dispatch<SetStateAction<Command>> ,
  addPage:( newPage: Page) => void,
};

const CommandBlock =({ page ,block , editTime , editBlock ,addPage,setCommand ,command}:CommandBlockProp)=>{
  const [result, setResult]=useState<boolean>(true);
  const showResult =()=>{
    const onBtns = document.getElementsByClassName('command_btn on');
    console.log(onBtns[0]);
    if(onBtns[0]!== undefined){
      onBtns[0].classList.add("first");
      setResult(true);
    }else{
      setResult(false)
    }   
  };

  const changeType=( type:string)=>{
    const blockType:BlockType = blockTypes.filter((block_type)=> block_type === type)[0];

    if(blockType==="page"){
      changeSubPage(page, block, editBlock, addPage);
    }else{
      const newBlock:Block ={
        ...block,
        editTime:editTime,
        type:blockType
      };
      console.log("changeType", type, newBlock);
      editBlock(page.id, newBlock);
    };
    setCommand({boolean:false, command:null})
  };
  const makeClassName=(type:string):string=>{
    const typeCommand = command.command?.slice(1);
    let className ="";
    typeCommand !==undefined?
    (
      type.includes(typeCommand)?
      className='command_btn on' :
      className='command_btn'
    )
    :
    className="command_btn on";

    return className
  };
  useEffect(()=>{
    showResult();
  },[command.command])
  return(
      <div 
        id='commandBlock'
      >
        {result? 
          <div id='commandBlock_inner'>
          <div className='command basic_blocks'>
            <header className='command_header'>
              BASIC BLOCKS
            </header>
            <div className='command_btns type'>
              <button
                onClick={()=>changeType("text")} 
                className={makeClassName("text")} 
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
                className={makeClassName("page")}  
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
                className={makeClassName("todo list")}  
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
                className={makeClassName("h1")} 
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
                className={makeClassName("h2")} 
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
                className={makeClassName("h3")} 
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
                className={makeClassName("bullet list")} 
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
                className={makeClassName('number list')} 
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
                className={makeClassName("toggle list")} 
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
        :
          <div className='noResult'>
            No results
          </div>
        }


      </div>
  )
};

export default CommandBlock;