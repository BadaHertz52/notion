import React, {Dispatch, SetStateAction, useEffect} from 'react';
import { FcTodoList } from 'react-icons/fc';
import { IoIosList } from 'react-icons/io';
import { IoDocumentTextOutline, IoTextOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { VscListOrdered } from 'react-icons/vsc';
import { Command } from './Frame';
import {  Block, BlockType,  findParentBlock, makeNewBlock, Page } from "../modules/notion";
import { PopupType } from '../containers/EditorContainer';
import imgIcon from '../assests/img/vincent-van-gogh-ge1323790d_640.jpg'; 
import { setTemplateItem } from './BlockComponent';

type CommandBlockProp ={
  page:Page,
  block:Block,
  addBlock:(pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  editBlock :(pageId:string, block:Block)=>void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,
  changePageToBlock:(currentPageId: string, block: Block) => void,
  editPage: (pageId: string, newPage: Page) => void,
  command:Command | null,
  setCommand: Dispatch<SetStateAction<Command>> |null ,
  setPopup:Dispatch<SetStateAction<PopupType>> |null,
  setCommandTargetBlock :Dispatch<SetStateAction<Block|null>>|null,
};
const CommandBlock =({ page ,block, addBlock , editBlock ,changeBlockToPage,changePageToBlock ,editPage,setCommand ,command ,setPopup, setCommandTargetBlock}:CommandBlockProp)=>{
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
          btn.setAttribute("class", "command_btn on");
        }else{
          btn.setAttribute("class", "command_btn");
        };
      });
      const onBlocks = document.querySelectorAll(".command_btn.on");
        if(onBlocks[0]===undefined){
          commandBlock_inner?.setAttribute("style", "display:none");
          commandBlock_noResult?.setAttribute("style", "display:block");
        }else{
          onBlocks[0].classList.add("first");
          commandBlock_inner?.setAttribute("style", "display:block");
          commandBlock_noResult?.setAttribute("style", "display:none");
        }
    }else{
      btns.forEach((btn)=> btn.setAttribute("class", "command_btn on"));

    }
  };
  /**
   * block의 type 을 numberList 나 bulletList로 바꾸는 함수 
   * @param editedBlock 
   */
  const changeToListType =(editedBlock:Block ,parentBlockType:BlockType)=>{
    const newBlock =makeNewBlock(page, block, "");
    const newParentBlock :Block ={
      ...newBlock,
      type: parentBlockType,
      subBlocksId:[editedBlock.id],
    };
    const editedListBlock :Block ={
      ...editedBlock,
      firstBlock:false ,
      parentBlocksId: newParentBlock.parentBlocksId !== null ? newParentBlock.parentBlocksId.concat(newParentBlock.id): [...newParentBlock.id],
    };
    console.log("newListParent", newParentBlock," editedListBlock", editedListBlock);
    const indexOfEditedBlockInBlocks = page.blocksId?.indexOf(editedBlock.id) as number; 
    if(block.parentBlocksId!==null){
      const {parentBlock} = findParentBlock(page, block);
      const subBlocksId =[...parentBlock.subBlocksId as string[]];
      const index = subBlocksId.indexOf(block.id);
      subBlocksId.splice(index,1);
      const editedParentBlock :Block ={
        ...parentBlock,
        subBlocksId: subBlocksId,
        editTime:JSON.stringify(Date.now())
      };
      editBlock(page.id, editedParentBlock);
      editBlock(page.id, editedListBlock);
      addBlock(page.id, newParentBlock, indexOfEditedBlockInBlocks-1, index===0? null : subBlocksId[index -1]);
    }else{
      if(page.firstBlocksId!==null){
        const firstBlocksId =[...page.firstBlocksId];
        const indexOfBlockAsFirstBlock = firstBlocksId.indexOf(block.id) ;
        const previousFirstBlockId =page.firstBlocksId[indexOfBlockAsFirstBlock-1];
        firstBlocksId.splice(indexOfBlockAsFirstBlock,1);
        const editedPage :Page ={
          ...page,
          firstBlocksId:firstBlocksId
        };
        editPage(page.id, editedPage);

        editBlock(page.id, editedListBlock);
        
        if(indexOfBlockAsFirstBlock===0){
          addBlock(page.id, newParentBlock,0, null);
        }else{
          addBlock(page.id, newParentBlock, indexOfEditedBlockInBlocks, previousFirstBlockId);
        };
        
      }
    };
  };
  const changeType=( blockType:BlockType)=>{
    const templateHtml= document.getElementById("template");
    setTemplateItem(templateHtml, page);
    if(block.type !== blockType){
      const editedBlock:Block ={
        ...block,
        editTime:JSON.stringify(Date.now()),
        type:blockType,
        contents:blockType ==="image media"? "": block.contents,
      };
      switch (blockType) {
        case "page":
          changeBlockToPage(page.id, block);
          break;
        case "numberList":
          changeToListType(editedBlock, "numberListArry");
          break;
        case "bulletList":
          changeToListType(editedBlock , "bulletListArry");
          break;
        default:
          block.type==="page"?
          changePageToBlock(page.id, editedBlock):
          editBlock(page.id, editedBlock)
          break;
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
  },[command]);
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
                onClick={()=>changeType('bulletList')}
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
                onClick={()=>changeType('numberList')}
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