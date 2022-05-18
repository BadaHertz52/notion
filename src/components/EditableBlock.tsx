
import React, {CSSProperties, Dispatch, SetStateAction, useEffect, useRef, useState, } from 'react';
import ReactDOMServer from 'react-dom/server';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Block, BlockType, blockTypes, findBlock, Page } from '../modules/notion';
import CommandBlock from './CommandBlock';
import { Command } from '../containers/EditorContainer';
import BlockComponent from './BlockComponent';

type findTargetBlockReturn ={
  cursor: Selection |null ,
  focusOffset: number,
  targetElement: HTMLElement|undefined|null,
  targetBlock:Block,
  targetBlockIndex:number,
  textContents:string,
  newContents:string
};
const findTargetBlock =(page:Page):findTargetBlockReturn=>{
  const cursor =document.getSelection();
  const focusOffset =cursor?.focusOffset as number;
  const cursorParent = cursor?.anchorNode?.parentElement;
  const cursorParentTag = cursorParent?.tagName ;
  const targetElement =  cursorParentTag ==="LI" ? cursorParent : cursorParent?.parentElement?.parentElement?.parentElement; 
  const textContents = cursorParentTag ==="LI" ?   targetElement?.textContent as string :  targetElement?.getElementsByClassName("mainBlock")[0]?.getElementsByClassName("blockContents")[0]?.textContent as string; 

  const blockId:string = targetElement?.id  as string;
  const targetBlockIndex :number =page.blocksId.indexOf(blockId) as number;
  
  const targetBlock :Block =page.blocks[targetBlockIndex];
  
  const newContents = textContents?.slice(focusOffset) as string ;

  return {
    cursor: cursor ,
    focusOffset: focusOffset,
    targetElement:targetElement,
    targetBlock:targetBlock ,
    targetBlockIndex:targetBlockIndex,
    textContents: textContents,
    newContents:newContents
  }
};
export const makeNewBlock=(page:Page, editTime:string,addBlock:(pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) =>void ,editBlock :(pageId: string, block: Block) => void, targetBlock:Block, targetBlockIndex:number, newContents:string  )=>{
  if(targetBlock.type !=="toggle"){
    const newBlock:Block ={
      id:editTime,
      editTime:editTime,
      type:"text",
      contents: newContents=== undefined ? "" : newContents,
      firstBlock:targetBlock.firstBlock,
      subBlocksId:targetBlock.subBlocksId,
      parentBlocksId:targetBlock.parentBlocksId,
      icon:null,
    };
      //새로운 버튼 
    addBlock(page.id, newBlock, targetBlockIndex+1 ,targetBlock.id)
  }else{
    const newSubBlock:Block ={
      id:editTime,
      editTime:editTime,
      type:"text",
      contents: "" ,
      firstBlock:false,
      subBlocksId:null,
      parentBlocksId:targetBlock.parentBlocksId !==null? targetBlock.parentBlocksId.concat(targetBlock.id) : [targetBlock.id],
      icon:null,
    };
    
    addBlock(page.id, newSubBlock, targetBlockIndex+1, targetBlock.id);
  }
// targetBlock 수정
  //targetBlock 의 subBlock들이 밀려졌을때 
  if(targetBlock.subBlocksId !==null && targetBlock.type !== 'toggle'){
    const editedBlock :Block ={
      ...targetBlock,
      editTime:editTime,
      subBlocksId:null,
    };
    editBlock(page.id, editedBlock);
  };
};

type EditableBlockProps ={
  page:Page,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  setBlockFnBlock :Dispatch<SetStateAction<Block>>
};

const EditableBlock =({ page, block , editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock ,setBlockFnBlock}:EditableBlockProps)=>{  
  const  editTime = JSON.stringify(Date.now());
  const innerRef  =useRef<HTMLDivElement>(null) ;
  const storageItem =sessionStorage.getItem("editedBlock") ;
  const [targetId, setTargetId]=useState<string|null>(null);

  const [command, setCommand] =useState<Command>({
    boolean:false,
    command:null
  }); 

  useEffect(()=>{
    if(storageItem !== null){
      const {editedBlock} = JSON.parse(storageItem) as {pageId: string, editedBlock:Block};
      setTargetId(editedBlock.id);
    };
  },[]);

  useEffect(()=>{
    updateEditedBlock();
  },[targetId]);
  //block
  function callBlockNode(block:Block):string{
    const sub_blocks:Block[]|null = block.subBlocksId? block.subBlocksId.map((id:string)=> {
      const {BLOCK} =findBlock(page, id);
      return BLOCK;
    }): null ;

    const blockNode = ReactDOMServer.renderToString
    (<BlockComponent 
      block={block} 
      subBlocks ={sub_blocks}
      page={page}
      addBlock={addBlock}
      editBlock={editBlock}
      changeToSub={changeToSub}
      raiseBlock={raiseBlock}
      deleteBlock={deleteBlock}
      setBlockFnBlock={setBlockFnBlock}
      />);
    return blockNode
  };
  function onBlockChange(){ 
    const {targetBlock , textContents}= findTargetBlock(page);  
    if(targetBlock !== undefined){
      if(targetBlock.id !== targetId){
        setTargetId(targetBlock.id);
      };

      const newBlock :Block ={
        ...targetBlock,
        contents: textContents,
        editTime: editTime
      } ;
      const editedBlock :{pageId:string, editedBlock:Block} ={
        pageId: page.id,
        editedBlock: newBlock
      };
      if(textContents.startsWith("/")){
        setCommand({boolean:true, command:textContents});
      }else{
        sessionStorage.setItem("editedBlock", JSON.stringify(editedBlock));
      }
    };
  };
  function updateEditedBlock (){
    if(storageItem !== null){
      const {pageId, editedBlock} = JSON.parse(storageItem) as {pageId: string, editedBlock:Block};
      const {BLOCK}= findBlock(page, editedBlock.id);
      
      if((BLOCK !== undefined && editBlock !==undefined) && (BLOCK.contents !== editedBlock.contents)){
        editBlock(pageId, editedBlock);
      }
    };
    sessionStorage.removeItem("editedBlock");
  };

  function onBlockKeyDown (event: React.KeyboardEvent<HTMLDivElement>){
    // find  target block of cursor    
    const {cursor, focusOffset, targetBlock, targetElement ,targetBlockIndex,textContents , newContents}= findTargetBlock(page);

    if(event.code === "Enter"){
        // 새로운 블록 만들기 
        makeNewBlock(page, editTime, addBlock, editBlock,targetBlock, targetBlockIndex, newContents);
        // targetBlock 의 contents 일부가 다음 블록으로 이동되었을 경우
        if(textContents.length > focusOffset+1){
          
          const newContents = targetBlock.contents.slice(0, focusOffset);
          const editedBlock:Block ={
            ...targetBlock,
            subBlocksId : null ,
            contents:newContents,
            editTime:editTime
          };
          editBlock (page.id, editedBlock);
        }
    }else{
      
    } ;

    if(event.code ==="Tab" &&targetBlockIndex>0){
      //  이전 블록의 sub 으로 변경 
      if(cursor?.anchorOffset=== 0 ){
        console.log("tab, 0")
        innerRef.current?.focus();
      const previousBlock:Block = page.blocks[targetBlockIndex-1];
      const newParentBlock:Block = {
        ...previousBlock,
        editTime:editTime,
        subBlocksId: previousBlock.subBlocksId !== null? previousBlock.subBlocksId.concat(targetBlock.id) : [targetBlock.id]
      };

      const editedBlock:Block ={
        ...targetBlock,
        firstBlock: false,
        parentBlocksId: previousBlock.parentBlocksId? previousBlock.parentBlocksId.concat(previousBlock.id) : [previousBlock.id],
        editTime:editTime
      };
      console.log("tab", editedBlock, previousBlock);
      changeToSub(page.id, editedBlock ,targetBlock.firstBlock ,newParentBlock);
      }

    };
    if(event.code ==="Backspace"){
      console.log("focusoff", focusOffset, "length", textContents.length);
      if(textContents.length === 0){
        const deleteTargetBlockDiv = targetElement?.getElementsByTagName("div")[0]  as HTMLDivElement;
        const blockId = deleteTargetBlockDiv.getAttribute("id") as string;
        const {BLOCK} =findBlock(page, blockId);
        deleteBlock(page.id, BLOCK);
        }else{
          if(focusOffset ===0){
            raiseBlock(page.id, targetBlock);
          };
        }
  
    };
  };

  const toggleOn =(btn:HTMLElement)=>{
    btn.classList.toggle("on");
    const blockId =btn.getAttribute("name") as string;
    const toggleBlock = document.getElementById(blockId)?.firstElementChild  as Element;
    toggleBlock.classList.toggle("on");
    console.log("btn", btn,"toggleBlock", toggleBlock)
  };

  function addEvent(event:React.MouseEvent){
    const target =event.target as HTMLElement;
    const targetClassName = target.getAttribute("class");
    const targetParentElement = target.parentElement as HTMLElement; 
    switch (target.tagName) {
      case "svg":
        if(targetClassName ==="blockBtnSvg"){
          toggleOn(targetParentElement);
        };
        break;
      case "path":
        if(targetParentElement.getAttribute("class")==="blockBtnSvg"){
          const btnElement =targetParentElement.parentElement as HTMLElement;
          toggleOn(btnElement);
        };
        break;
      case "button":
        if(targetClassName?.includes("blockBtn")){
          toggleOn(target);
        };
        break;
      default:
        break;
    }
  };
  function showBlockFn (event:React.MouseEvent){
    const target= event.target as HTMLElement;
    const targetPosition = target.getBoundingClientRect();
    const targetHeight = targetPosition.height;
    const targetY = targetPosition.top;
    const targetClassName = target.getAttribute("class");
    const blockFn = document.getElementById("blockFn");

    if(targetClassName==="blockContents" && innerRef.current !==null){
      setBlockFnBlock(block);
      const editableBlockPosition = innerRef.current.getBoundingClientRect();
      const positionX =editableBlockPosition.left;
      const left = positionX - 45 ;
      blockFn?.classList.toggle("on");

      if(block.type ==="h1" ){
        const h1Top = targetY + (targetHeight * 0.4);
        blockFn?.setAttribute("style", `top:${h1Top}px; left:${left}px;`);

      }else if(block.type ==="h2"){
        const h2Top = targetY + (targetHeight *0.25);
        blockFn?.setAttribute("style", `top:${h2Top}px; left:${left}px;`);

      }else{
        blockFn?.setAttribute("style", `top:${targetY}px;left:${left}px;`);
      };
    }
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

  }

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
      console.log("type keyup");
      editBlock(page.id, newBlock);
      setCommand({boolean:false, command:null})
    }
  };
  return(
      <div 
        className="editableBlock"
      >
        <div>
        {!command.boolean?
          <ContentEditable
          id={block.id}
          html={callBlockNode(block)}
          innerRef={innerRef}
          onChange={onBlockChange}
          onKeyDown={onBlockKeyDown}
          onClick={addEvent}
          onMouseOver ={showBlockFn}
          />
        :
          <>
          <ContentEditable
            id={block.id}
            html={command.command !==null? command.command : ""}
            onChange={commandChange}
            onKeyUp={(event)=>commandKeyUp(event,block)}
          />
          <CommandBlock 
            key={`${block.id}_command`}
            page={page}
            block={block}
            editTime={editTime}
            editBlock={editBlock}
          />
          </>
        }
        </div>
      </div>
  )
};

export default EditableBlock ;