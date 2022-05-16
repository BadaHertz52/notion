import React, { useRef, useState } from 'react';
import { ContentEditableEvent } from 'react-contenteditable';
import ReactDOMServer from 'react-dom/server';
import { useDispatch, useSelector } from 'react-redux';
import BlockComponent from '../components/BlockComponent';
import Frame from '../components/Frame';
import TopBar from '../components/TopBar';
import { RootState } from '../modules';
import {  Block, Page, findBlock, BlockType, blockTypes, edit_block, add_block, delete_block, change_to_sub, raise_block } from '../modules/notion';
import { Side } from '../modules/side';

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

type EditorContainerProps ={
  page: Page,
  pagePath : string [] | null,
  side : Side,
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void 
};
export type Command ={
  boolean:boolean,
  command:string | null
};
const EditorContainer =({page , pagePath ,side, lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage }:EditorContainerProps)=>{
  const  editTime = JSON.stringify(Date.now());
  const innerRef  =useRef<HTMLDivElement>(null) ;
  const storageItem =sessionStorage.getItem("editedBlock") ;
  const [targetId, setTargetId]=useState<string|null>(null);

  const [command, setCommand] =useState<Command>({
    boolean:false,
    command:null
  }); 

  const userName =useSelector((state:RootState)=> state.user.userName) ;

  const dispatch =useDispatch();

  const editBlock = (pageId:string, block:Block)=> {dispatch(edit_block(pageId, block ))};

  const addBlock =(pageId:string , block:Block , nextBlockIndex:number ,previousBlockId:string|null)=>{dispatch(add_block(pageId,block ,nextBlockIndex ,previousBlockId))};

  const deleteBlock=(pageId:string,block:Block)=>{dispatch(delete_block(pageId,block))};

  const changeToSub =(pageId:string, block:Block , first:boolean ,newParentBlock:Block)=>{dispatch(change_to_sub(pageId,block,first,newParentBlock));
  };

  const raiseBlock=(pageId:string, block:Block)=>{dispatch(raise_block(pageId,block))};

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
      innerRef={innerRef}
      callBlockNode={callBlockNode}
      onBlockChange={onBlockChange}
      updateEditedBlock={updateEditedBlock}
      onBlockKeyDown={onBlockKeyDown}
      commandChange ={commandChange}
      commandKeyUp ={commandKeyUp}
      editBlock={editBlock}
      command ={command}
      editTime={editTime}
      targetId={targetId}
      setTargetId={setTargetId}
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
    const {cursor, focusOffset, targetBlock, targetElement ,targetBlockIndex,textContents, newContents}= findTargetBlock(page);
    if(event.code === "Enter"){
        // 새로운 블록 만들기 
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

      // targetBlock 수정 
      if(textContents.length > focusOffset){
        const newContents = targetBlock.contents.slice(0, focusOffset);
        const editedBlock:Block ={
          ...targetBlock,
          subBlocksId : null ,
          contents:newContents,
          editTime:editTime
        };
        editBlock (page.id, editedBlock);
      }else {
        //밀려졌을때 기존의 block 수정 
      if(targetBlock.subBlocksId !==null){
        const editedBlock :Block ={
          ...targetBlock,
          editTime:editTime,
          subBlocksId:null,
        };
        editBlock(page.id, editedBlock);
      };
        
        }
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
    <div className='editor'>
      <TopBar
      page={page}
      pagePath ={pagePath}
      side ={side}
      lockSideBar ={lockSideBar}
      leftSideBar ={leftSideBar}
      closeSideBar ={closeSideBar}
      openNewPage ={openNewPage}
      closeNewPage={closeNewPage}
      />
      <Frame
        userName ={userName}
        page={page}
        side={side}
        innerRef={innerRef}
        callBlockNode={callBlockNode}
        onBlockChange={onBlockChange}
        updateEditedBlock={updateEditedBlock}
        onBlockKeyDown={onBlockKeyDown}
        commandChange ={commandChange}
        commandKeyUp ={commandKeyUp}
        editBlock={editBlock}
        command ={command}
        editTime={editTime}
        targetId={targetId}
        setTargetId={setTargetId}
      />
    </div>
  )
};

export default React.memo(EditorContainer)