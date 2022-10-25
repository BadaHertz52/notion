import React, {Dispatch, SetStateAction, useEffect} from 'react';
import { FcTodoList } from 'react-icons/fc';
import { IoIosList } from 'react-icons/io';
import { IoDocumentTextOutline, IoTextOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { VscListOrdered } from 'react-icons/vsc';
import { Command, selectionType } from './Frame';
import {  Block, BlockType,  findBlock,  findParentBlock, makeNewBlock, numberList, Page } from "../modules/notion";
import imgIcon from '../assests/img/vincent-van-gogh-ge1323790d_640.jpg'; 
import { setTemplateItem } from './BlockComponent';
import { CSSProperties } from 'styled-components';

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
  setSelection:Dispatch<SetStateAction<selectionType | null>>|null,
  style:CSSProperties|undefined
};
const CommandBlock =({ page ,block , editBlock ,addBlock ,changeBlockToPage,changePageToBlock ,editPage ,setCommand ,command ,setSelection ,style}:CommandBlockProp)=>{
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
    if(page.firstBlocksId!==null && page.blocks!==null && page.blocksId!==null){
      const firstBlocksId =[...page.firstBlocksId];
      const blocks=[...page.blocks];
      const blocksId =[...page.blocksId];
      const indexOfBlocks = blocksId.indexOf(editedBlock.id);

      const newBlock =makeNewBlock(page, editedBlock, "");
      const newParentBlock :Block ={
        ...newBlock,
        type: parentBlockType,
        subBlocksId:[editedBlock.id],
      };
      const listBlock :Block ={
        ...editedBlock,
        firstBlock:false ,
        parentBlocksId: newParentBlock.parentBlocksId !== null ? newParentBlock.parentBlocksId.concat(newParentBlock.id): [newParentBlock.id],
      };
      //listBlock data 수정
      blocks.splice(indexOfBlocks,1,listBlock);
      
      
      setSelection!==null && setSelection({
        change:true,
        block:listBlock
      });
      // newParent 를 blocks에 추가 
      if(editedBlock.parentBlocksId!==null){
        //editedBlock is not firstBlock
        const {parentBlock, parentBlockIndex} = findParentBlock(page, editedBlock);
        const subBlocksId =[...parentBlock.subBlocksId as string[]];
        const index = subBlocksId.indexOf(editedBlock.id);
        const editTime =JSON.stringify(Date.now());

        if(parentBlock.type.includes("Arry")){
          const updatedNewParentBlock :Block ={
            ...newParentBlock,
            parentBlocksId: parentBlock.parentBlocksId,
            firstBlock:parentBlock.firstBlock
          };
          const updatedListBlock :Block ={
            ...listBlock,
            parentBlocksId: updatedNewParentBlock.parentBlocksId==null? [updatedNewParentBlock.id]: updatedNewParentBlock.parentBlocksId.concat(updatedNewParentBlock.id)
          };
          blocks.splice(indexOfBlocks,1,updatedListBlock);
          

          if(parentBlock.firstBlock){
            const indexAsFirst = firstBlocksId.indexOf(parentBlock.id);
            firstBlocksId.splice(indexAsFirst+1,0, updatedNewParentBlock.id);
          }
          //block의 subBlock으로의 위치에 따라 newParentBlock의 data나 위치가 달라짐
          if(index ===0){
            blocks.splice(parentBlockIndex,1,updatedNewParentBlock);
            blocksId.splice(parentBlockIndex,1,updatedNewParentBlock.id);
          }else{
            blocks.splice(indexOfBlocks,0,updatedNewParentBlock);
            blocksId.splice(indexOfBlocks,0,updatedNewParentBlock.id);
            
            if(index===subBlocksId.length-1){
              subBlocksId.splice(index,1);
              const editedParentBlock :Block ={
                ...parentBlock,
                subBlocksId: subBlocksId,
                editTime:editTime
              };
              blocks.splice(parentBlockIndex,1,editedParentBlock);
            }else{
              const preSubBlocksId =subBlocksId.slice(0,index);
              const afterSubBlocksId =subBlocksId.slice(index+1);

              const editedParentBlock :Block ={
                ...parentBlock,
                subBlocksId: preSubBlocksId,
                editTime :editTime
              };
              blocks.splice(parentBlockIndex,1,editedParentBlock);
              const newBlock = makeNewBlock(page, parentBlock, "");
              const newAfterArryBlock:Block ={
                ...newBlock,
                id:`${page.id}_${editTime}(1)`,
                subBlocksId:afterSubBlocksId
              };
              blocks.splice(indexOfBlocks+2,0,newAfterArryBlock);
              blocksId.splice(indexOfBlocks+2,0, newAfterArryBlock.id);
              if(parentBlock.firstBlock){
                const indexAsFirst = firstBlocksId.indexOf(parentBlock.id);
                firstBlocksId.splice(indexAsFirst+2,0,newAfterArryBlock.id);
              }
            }
          };

        }else{
          // parentBlock의 subBlocks 중 block을 newParentBlock으로 바꿈
          subBlocksId.splice(index,1,newParentBlock.id);
          const editedParentBlock :Block ={
            ...parentBlock,
            subBlocksId: subBlocksId,
            editTime:JSON.stringify(Date.now())
          };
          blocks.splice(parentBlockIndex,1,editedParentBlock);
  
          const editedNewParentBlock:Block ={
            ...newParentBlock,
            parentBlocksId: editedParentBlock.parentBlocksId!==null ? editedParentBlock.parentBlocksId.concat(editedParentBlock.id):[editedParentBlock.id],
          };
          blocks.splice(indexOfBlocks,0,editedNewParentBlock);
          blocksId.splice(indexOfBlocks,0,editedNewParentBlock.id);
          const editedListBlock:Block ={
            ...listBlock,
            parentBlocksId: editedNewParentBlock.parentBlocksId!==null ? editedNewParentBlock.parentBlocksId.concat(editedNewParentBlock.id):[editedNewParentBlock.id]
          };
          blocks.splice(indexOfBlocks,1,editedListBlock);
        }

      }else{
          const indexOfBlockAsFirstBlock = firstBlocksId.indexOf(editedBlock.id) ;
          firstBlocksId.splice(indexOfBlockAsFirstBlock,1, newParentBlock.id);
          blocks.splice(indexOfBlocks,0,newParentBlock);
          blocksId.splice(indexOfBlocks,0,newParentBlock.id);
      };
      const editedPage :Page ={
        ...page,
        firstBlocksId:firstBlocksId,
        blocks:blocks,
        blocksId:blocksId,
        editTime:JSON.stringify(Date.now())
      };
      editPage(page.id, editedPage);
    };
  };
  const changeType=( blockType:BlockType)=>{
    const templateHtml= document.getElementById("template");
    setTemplateItem(templateHtml, page);
    if(block.type !== blockType){

      const editedBlock:Block ={
        ...block,
        editTime:JSON.stringify(Date.now()),
        type: 
        blockType==="bulletListArry"? 
        "bulletList"
        :
        (
          blockType==="numberListArry"?
          numberList
          :
          blockType
        ),
        contents:blockType ==="image media"? "": block.contents,
      };
      switch (blockType) {
        case "page":
          changeBlockToPage(page.id, block);
          const changedBlock =findBlock(page,block.id).BLOCK;
          setSelection!==null && setSelection({
            change:true,
            block:changedBlock
          });
          break;
        case "numberListArry":
          changeToListType(editedBlock, "numberListArry");
          break;
        case "bulletListArry":
          changeToListType(editedBlock , "bulletListArry");
          break;
        default:
          block.type==="page"?
          changePageToBlock(page.id, editedBlock):
          editBlock(page.id, editedBlock);
          setSelection!==null && setSelection({
            change:true,
            block:editedBlock
          })
          break;
      };
    };
    closeCommendBlock();
  };
  function closeCommendBlock(){
    setCommand !==null && setCommand({
      boolean:false, 
      command:null,
      targetBlock:null
    })
  };

  useEffect(()=>{
      showResult();
  },[command]);
  return(
      <div 
        id='commandBlock'
        style={style}
      >
          <div id='commandBlock_inner'>
          <div className='command basic_blocks'>
            <header className='command_header'>
              BASIC BLOCKS
            </header>
            <div className='command_btns type'>
              <button
                onClick={()=>changeType("text")} 
                className="command_btn on"
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
                className="command_btn on "  
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
                className="command_btn on"
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
              className="command_btn on"
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
              className="command_btn on"
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
                className="command_btn on"
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
                className="command_btn on"
                onClick={()=>changeType("bulletListArry")}
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
                className="command_btn on"
                onClick={()=>changeType("numberListArry")}
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
                className="command_btn on"
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
                  className="command_btn on"
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