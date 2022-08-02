import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useState} from 'react';
import { FcTodoList } from 'react-icons/fc';
import { IoIosList } from 'react-icons/io';
import { IoDocumentTextOutline, IoTextOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { VscListOrdered } from 'react-icons/vsc';
import { Command } from './Frame';
import { Block, BlockType, Page } from "../modules/notion";
import { PopupType } from '../containers/EditorContainer';
import imgIcon from '../assests/img/vincent-van-gogh-ge1323790d_640.jpg'; 
import bookmarkIcon from '../assests/img/folder-g047ba9133_640.jpg';

type CommandBlockProp ={
  page:Page,
  block:Block,
  editBlock :(pageId:string, block:Block)=>void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,
  changePageToBlock:(currentPageId: string, block: Block) => void,
  command:Command | null,
  setCommand: Dispatch<SetStateAction<Command>> |null ,
  setPopup:Dispatch<SetStateAction<PopupType>> |null,
  setCommandTargetBlock :Dispatch<SetStateAction<Block|null>>|null,
};
const CommandBlock =({ page ,block , editBlock ,changeBlockToPage,changePageToBlock ,setCommand ,command ,setPopup, setCommandTargetBlock}:CommandBlockProp)=>{
  const commandBlock_inner =document.getElementById("commandBlock_inner");
  const commandBlock_noResult =document.getElementById("commandBlock_noResult");

  const showResult =()=>{
    const btns = [...document.getElementsByClassName("command_btn")];
    if(command !==null){
      const typeCommand = command.command?.slice(1);
      typeCommand !==undefined &&
      btns.forEach((btn:Element)=>{
        const name =btn.getAttribute("name");
        if(name?.includes(typeCommand)){
          btns.indexOf(btn)===0 ?
          btn.setAttribute("class", "command_btn on first"):
          btn.setAttribute("class", "command_btn on");
        }else{
          btn.setAttribute("class", "command_btn");
        };
        const onBlocks = document.querySelectorAll(".command_btn.on");
        if(onBlocks[0]===undefined){
          commandBlock_inner?.setAttribute("style", "display:none");
          commandBlock_noResult?.setAttribute("style", "display:block");
        }else{
          commandBlock_inner?.setAttribute("style", "display:block");
          commandBlock_noResult?.setAttribute("style", "display:none");
        }
      });
    }else{
      btns.forEach((btn)=> btn.setAttribute("class", "command_btn on"));

    }
  };
  const changeType=( blockType:BlockType)=>{
    if(block.type !== blockType){
      if(blockType==="page"){

        changeBlockToPage(page.id, block);
      }else{
        const newBlock:Block ={
          ...block,
          editTime:JSON.stringify(Date.now()),
          type:blockType,
        };
        block.type==="page"?
        changePageToBlock(page.id, newBlock):
        editBlock(page.id, newBlock);
      };
    };
    closeCommentBlock();
  };
  function closeCommentBlock(){
    setCommand !==null && setCommand({
      boolean:false, 
      command:null,
      targetBlock:null
    })
    setPopup !==null && setPopup({popup:false, what:null}) ;
    setCommandTargetBlock !==null && setCommandTargetBlock(null);
  };

  useEffect(()=>{
      showResult();
  },[command])
  return(
      <div 
        id='commandBlock'
      >
          <div id='commandBlock_inner'>
          <div className='command basic_blocks'>
            <header className='command_header'>
              BASIC BLOCKS
            </header>
            <div className='command_btns type'>
              <button
                onClick={()=>changeType("text")} 
                className="command_btn"
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
                className="command_btn"  
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
                className="command_btn"
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
              className="command_btn"
                onClick={()=>changeType("h1")}
                name='h1 heading 1'
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
              className="command_btn"
                onClick={()=>changeType("h2")}
                name='h2 heading 2'
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
                className="command_btn"
                onClick={()=>changeType("h3")}
                name="h3 heading 3"
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
                className="command_btn"
                onClick={()=>changeType("bulletList")}
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
                className="command_btn"
                onClick={()=>changeType("numberList")}
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
                className="command_btn"
                onClick={()=>changeType("toggle")}
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
          <div className='command media_blocks'>
            <header className='command_header'>
              MEDIA
            </header>
            <div className='command_btns type'>
              <button
                  className="command_btn"
                  onClick={()=>changeType("image media")}
                  name="image"
                >
                <div className='command_btn_inner'>
                    <div className='command_btn_left'>
                      <img
                        src={imgIcon}
                        alt="imgIcon"
                      />
                  </div>
                  <div className='command_btn_right'>
                    <header>Image</header>
                    <div className='command_explanation'>
                      Upload or embed width a link
                    </div>
                  </div>
                </div>
              </button>
              <button
                  className="command_btn"
                  onClick={()=>changeType("bookmark media")}
                  name="bookmark"
                >
                <div className='command_btn_inner'>
                    <div className='command_btn_left'>
                      <img
                        src={bookmarkIcon}
                        alt="bookmarkIcon"
                      />
                  </div>
                  <div className='command_btn_right'>
                    <header>Web bookmark</header>
                    <div className='command_explanation'>
                      Save a linke as a visual bookmark
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          </div>
          <div 
            className='noResult'
            id="commandBlock_noResult" 
          >
            No results
          </div>
      </div>
  )
};

export default CommandBlock;