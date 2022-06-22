import React, { Dispatch, SetStateAction, useRef, useState} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { IoChatboxOutline } from 'react-icons/io5';

import { Command } from '../containers/EditorContainer';
import {  Block,BlockType,blockTypes,findBlock,makeNewBlock,Page, toggle } from '../modules/notion';
import CommandBlock from './CommandBlock';

type  BlockProps ={
  userName:string,
  block:Block,
  page:Page,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage : (newPage:Page, )=>void,
  editPage : (pageId:string , newPage:Page, )=>void,
  deletePage : (pageId:string , )=>void,
  setCommentBlock : Dispatch<SetStateAction<Block|null>>,
  commentBlock:Block|null,
  setTargetPageId:Dispatch<SetStateAction<string>>,
};
type BlockCommentProps={
  block:Block
}
export type itemType ={
  block:Block,
  blockIndex:number ,
};
export const BlockComment =({block}:BlockCommentProps)=>{
  return (
      <div 
        id={`${block.id}_comments`}
        className="blockId_comments"
        >
        <button 
          className='commentBtn btnIcon'
          name={block.id}
        >
          <IoChatboxOutline/>
          <span className="commentLength">
            {block.comments?.length}
          </span>
        </button>
      </div>

  )
};

const BlockComponent=({ userName,block, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock ,addPage, editPage, deletePage,setCommentBlock ,commentBlock ,setTargetPageId  }:BlockProps)=>{
  const editTime =JSON.stringify(Date.now);
  const contentEditableRef= useRef<HTMLElement>(null);
  const [command, setCommand]=useState<Command>({boolean:false, command:null})
  const findTargetBlock =(event:ContentEditableEvent|React.KeyboardEvent<HTMLDivElement>|React.MouseEvent):Block=>{
    const target =event.currentTarget.parentElement as HTMLElement;
    const targetId= target.id;
    const end =targetId.indexOf("_contents");
    const blockId = targetId.slice(0, end);
    const targetBlock = findBlock(page, blockId).BLOCK;
    return targetBlock;
  };
  const showBlockFn=(event: React.MouseEvent)=>{
    const currentTarget =event.currentTarget as Element;
    const mainBlock= currentTarget.parentElement?.parentElement ;
    const domReact =mainBlock?.getBoundingClientRect();
    const editableBlockDomRect =document.getElementsByClassName("editableBlock")[0].getBoundingClientRect(); 
    const blockFn =document.getElementById("blockFn");
    blockFn?.classList.toggle("on");
    blockFn?.classList.contains("on")?
    sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block))
    :
    sessionStorage.removeItem("blockFnTargetBlock");

    if(domReact!==undefined){
      const top = domReact.top +5;
      const left = editableBlockDomRect.x - 45;
      const blockFnStyle =`top:${top}px; left: ${left}px`
      blockFn?.setAttribute("style",blockFnStyle);
    }
  };
  const onChangeContents=(event:ContentEditableEvent)=>{
    const value =event.target.value;
    const targetBlock= findTargetBlock(event);
    const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
    const changeBlockContent =()=>{
      if(value.includes("<div>")){
        //enter 시에 새로운 블록 생성 
        const start = value.indexOf("<div>");
        const end =value.indexOf("</div>");
        const editedContents =value.slice(0, start);
        const newBlockContents= value.slice(start+5,end );
        const newBlock:Block ={
          ...makeNewBlock(page, targetBlock, newBlockContents),
          firstBlock: targetBlock.firstBlock,
          subBlocksId: targetBlock.subBlocksId
        } ;
        const previouseBlockId : string|null = targetBlock.firstBlock ? null : targetBlock.id ;
  
        if((targetBlock.contents!== editedContents) || (targetBlock.subBlocksId!==null)){
          const editedBlock:Block ={
            ...targetBlock,
            contents:block.contents!== editedContents ?editedContents : targetBlock.contents,
            subBlocksId: targetBlock.subBlocksId !==null ? null : targetBlock.subBlocksId,
            editTime:editTime,
          };
          editBlock(page.id, editedBlock);
        }
        if(block.type ===toggle){
          const newSubToggleBlock :Block ={
            ...newBlock,
            parentBlocksId:[targetBlock.id],
            firstBlock:false,
          };
          addBlock(page.id, newSubToggleBlock, targetBlockIndex+1, previouseBlockId);
  
        }else{
          addBlock(page.id, newBlock,targetBlockIndex+1, previouseBlockId);
        };
      }else{
        // edite targetBlock 
        
        const editedBlock :Block ={
                  ...targetBlock,
                  contents: value,
                  editTime:editTime,
                };
        targetBlock.contents !== value &&
        sessionStorage.setItem("itemsTobeEdited", JSON.stringify(editedBlock));
      };
    }
    if(!value.startsWith("/")){
      changeBlockContent();
    }else{
      
      commandChange(event);
    }
  };
  const onKeyDownContents=(event:React.KeyboardEvent<HTMLDivElement>)=>{
    const code =event.code.toLowerCase();
    const targetBlock= findTargetBlock(event);
    switch (code) {
      case "tab":
        event.preventDefault();
          const targetEditableDoc = document.getElementById(`block_${targetBlock.id}`)?.parentElement?.parentElement as HTMLElement ;
          const previousEditableDoc = targetEditableDoc.previousElementSibling as HTMLElement ;  
          const previousBlockDoc= previousEditableDoc.firstChild?.firstChild as HTMLElement;
          const previousBlockId = previousBlockDoc.id.slice(6);
          changeToSub(page.id, targetBlock,previousBlockId );
        break;
      case "backspace":
        const text =event.currentTarget.innerText;
        console.log(text, text==="");
        if(text===""){
          deleteBlock(page.id, targetBlock);
        }
        break;
      default:
        break;
    };
  };
  function commandChange (event:ContentEditableEvent){
    const value = event.target.value;
    const trueOrFale = value.startsWith("/");
    if(trueOrFale){
      setCommand({
        boolean: true , 
        command: value
      });
    }else {
      setCommand({
        boolean:false,
        command:null
      })
    };

  };
  function commandKeyUp(event:React.KeyboardEvent<HTMLDivElement>, block:Block){
    const code= event.code;
    const firstOn =document.querySelector(".command_btn.on.first");
    if(code ==="Enter"  ){
      const name = firstOn?.getAttribute("name") as string ;
      
      const blockType:BlockType = blockTypes.filter((type)=> name.includes(type))[0];

      const newBlock:Block={
        ...block,
        type: blockType,
        editTime:editTime
      };
      editBlock(page.id, newBlock);
      setCommand({boolean:false, command:null})
    }
  };
  const BlockContentEditable=()=>{
    return(
      <>
        <ContentEditable
          className='contentEditable'
          placeholder="type '/' for commmands"
          html= {block.contents}
          innerRef={contentEditableRef}
          onChange={(event)=> onChangeContents(event )}
          onKeyDown={(event)=> onKeyDownContents(event)}
        /> 
        {command.boolean &&
          <CommandBlock 
            key={`${block.id}_command`}
            page={page}
            block={block}
            editTime={editTime}
            editBlock={editBlock}
            command={command}
            setCommand={setCommand}
            addPage={addPage}
          />
        }
      </>
    )
  };
  return(
    <>
      {block.comments ==null ?
      ( block.type==="page"?
        <button 
          className="contents pageTitle"
          id={`${block.id}_contents`}
          onMouseOver={showBlockFn}
        >
          <BlockContentEditable/>
        </button>
        :
        <div 
          id={`${block.id}_contents`}
          className="contents"
          onMouseOver={showBlockFn}
        >
          <BlockContentEditable/>
        </div>
      )
      :
      <button 
        id={`${block.id}_contents`}
        className="contents commentBtn"
        onMouseOver={showBlockFn}
      >
        <BlockContentEditable/>
      </button>
      }
    </>
  )
};

export default React.memo (BlockComponent);
