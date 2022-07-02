import React, { Dispatch, SetStateAction, useRef} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { IoChatboxOutline } from 'react-icons/io5';
import {  Block,BlockType,blockTypes,findBlock,makeNewBlock,Page, toggle } from '../modules/notion';
import { Command } from './Frame';

type  BlockProps ={
  block:Block,
  page:Page,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  command :Command,
  setCommand:Dispatch<SetStateAction<Command>>,
  onClickCommentBtn: (block: Block) => void,
  setOpenComment :Dispatch<SetStateAction<boolean>>,
};
type BlockCommentProps={
  block:Block,
  onClickCommentBtn: (block: Block) => void
}
export type itemType ={
  block:Block,
  blockIndex:number ,
};
export const BlockComment =({block , onClickCommentBtn}:BlockCommentProps)=>{
  return (
      <div 
        id={`${block.id}_comments`}
        className="commentsBubble"
        >
        <button 
          className='commentBtn btnIcon'
          name={block.id}
          onClick={()=>onClickCommentBtn(block)}
        >
          <IoChatboxOutline/>
          <span className="commentLength">
            {block.comments?.length}
          </span>
        </button>
      </div>

  )
};

const BlockComponent=({block, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock , command, setCommand  ,onClickCommentBtn ,setOpenComment  }:BlockProps)=>{
  const editTime =JSON.stringify(Date.now);
  const contentEditableRef= useRef<HTMLElement>(null);
  const findTargetBlock =(event:ContentEditableEvent|React.KeyboardEvent<HTMLDivElement>|React.MouseEvent):Block=>{
    const target =event.currentTarget.parentElement as HTMLElement;
    const targetId= target.id;
    const end =targetId.indexOf("_contents");
    const blockId = targetId.slice(0, end);
    const targetBlock = findBlock(page, blockId).BLOCK;
    return targetBlock;
  };
  const editor =document.getElementsByClassName("editor")[0] as HTMLElement ;
  
  const showBlockFn=(event: React.MouseEvent)=>{
    const currentTarget =event.currentTarget as Element;
    const mainBlock= currentTarget.parentElement?.parentElement ;
    const domReact =mainBlock?.getClientRects()[0];
    const editableBlockDomRect =document.getElementsByClassName("editableBlock")[0].getClientRects()[0] ; 
    const blockFn =document.getElementById("blockFn");
    blockFn?.classList.toggle("on");
    blockFn?.classList.contains("on")?
    sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block))
    :
    sessionStorage.removeItem("blockFnTargetBlock");
    if(domReact!==undefined){
      const top =domReact.top +editor.scrollTop +5;
      const left = editableBlockDomRect.x - 45;
      const blockFnStyle =`top:${top}px; left:${left}px`;
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
        const cursor = document.getSelection();
        const offset =cursor?.anchorOffset;
        console.log(":value", value ,offset)
        if(!(targetBlock.contents==="" && offset===0&& value ==="")){
          const editedBlock :Block ={
            ...targetBlock,
            contents: value,
            editTime:editTime,
          };
          targetBlock.contents !== value &&
          sessionStorage.setItem("itemsTobeEdited", JSON.stringify(editedBlock));
        };
      };
    }
    if(!value.startsWith("/")){
      changeBlockContent();
    }else{
      setOpenComment(false);
      setCommand({
        boolean:true, 
        command:"/",
        targetBlock:targetBlock
      })
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
        const cursor = document.getSelection();
        const offset =cursor?.anchorOffset;
        console.log("offset", offset, text==="" ,targetBlock.contents);
        if(offset===0 && text===""){
          deleteBlock(page.id, targetBlock, false);
        }
        if(offset===0 && text!==""){
          raiseBlock(page.id, targetBlock )
        }

        break;
      default:
        break;
    };
  };
  function commandChange (event:React.ChangeEvent<HTMLInputElement>){
    const value = event.target.value;
    const trueOrFale = value.startsWith("/");
    if(trueOrFale){
      setCommand({
        boolean: true , 
        command: value.toLowerCase(),
        targetBlock:command.targetBlock
      });
    }else {
      setCommand({
        boolean:false,
        command:null,
        targetBlock:null
      })
    };

  };
  function commandKeyUp(event:React.KeyboardEvent<HTMLInputElement>){
    const code= event.code;
    const firstOn =document.querySelector(".command_btn.on.first");
    if(code ==="Enter" && command.targetBlock!==null  ){
      const name = firstOn?.getAttribute("name") as string ;
      const blockType:BlockType = blockTypes.filter((type)=> name.includes(type))[0];
      const newBlock:Block={
        ...command.targetBlock,
        type: blockType,
        editTime:editTime
      };
      editBlock(page.id, newBlock);
      setCommand({
        boolean:false, 
        command:null 
        ,targetBlock:null})
    }
  };



  const BlockContentEditable=()=>{
    return(
      <>
      {!command.command || (command.targetBlock !==null && command.targetBlock.id !== block.id) ? 
        <ContentEditable
          className='contentEditable'
          placeholder="type '/' for commmands"
          html= {block.contents}
          innerRef={contentEditableRef}
          onChange={(event)=> onChangeContents(event )}
          onKeyDown={(event)=> onKeyDownContents(event)}
        /> 
        :
          <input
            type="text"
            tabIndex={-1}
            value={command.command}
            className='contentEditable'
            onChange={commandChange}
            onKeyUp={commandKeyUp}
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
        onClick={()=>{!command.boolean && onClickCommentBtn(block)}}
      >
        <BlockContentEditable/>
      </button>
      }
    </>
  )
};

export default React.memo (BlockComponent);
