import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Block, Page } from '../modules/notion';
import BlockComponent from './BlockComponent';

type EditableBlockProps ={
  page:Page,
  //element: JSX.Element,
  block:Block,
  editBlock :(pageId:string, block:Block)=>void,
  deleteBlock :(pageId:string, block:Block)=>void,
  addBlock :(pageId:string, block:Block , nextBlockIndex:number ,previousBlockId:string |null)=>void,
  changeToSub :(pageId:string, block:Block ,first:boolean ,previousBlockId:string | null)=>void,
  // raiseBlock: (pageId:string, block:Block)=>void,
};

const EditableBlock =({page, block   ,editBlock ,deleteBlock,addBlock, changeToSub}:EditableBlockProps)=>{  

  const  editTime = JSON.stringify(Date.now());
  const innerRef  =useRef<HTMLDivElement>(null) ;
  const [subBlocks, setSubBlocks]= useState<Block[]|null>(null);

  useEffect(()=>{
    if(block.subBlocksId!==null){
      const array =block.subBlocksId.map((id:string)=>{
        const subBlockIndex: number=page.blocksId.indexOf(id);
        const subBlock = page.blocks[subBlockIndex]
        return subBlock
      });
      setSubBlocks(array);
    };
  },[block.subBlocksId]);

  function callBlockNode(block:Block):string{
    const blockNode = ReactDOMServer.renderToString
    (<BlockComponent 
      block={block} 
      subBlocks ={subBlocks}
      page={page}
      editBlock ={editBlock}
      deleteBlock={deleteBlock}
      addBlock ={addBlock}
      changeToSub ={changeToSub}
      />);
    return blockNode
  };

  function editContents(contents :string , block:Block ){
  const newBlock :Block ={
    ...block,
    contents: contents,
    editTime: editTime
  } ;
  editBlock(page.id,newBlock);
  };

  function onChange(event:ContentEditableEvent){   
    const value = event.target.value;
    const doc = new DOMParser().parseFromString(value,"text/html" );
    if(doc.getElementsByClassName("blockContents")[0]!== undefined){
      const textNode = doc.getElementsByClassName("blockContents")[0].firstChild as Node; 
      const textContenet =textNode?.textContent as string; 
        editContents(textContenet ,block);  
    }
  };
  
  function make_subBlock(parentBlock:Block, subBlock:Block, newBlockIndex:number  ){
      const previousBlockId =null  ;
      const newSubBlock:Block ={
        ...subBlock,
        parentBlocksId:parentBlock.parentBlocksId?  [...parentBlock.parentBlocksId, parentBlock.id] : [
          parentBlock.id
        ]
      };

      addBlock(page.id,newSubBlock, newBlockIndex ,previousBlockId);
      };
  
  function onKeydown (event: React.KeyboardEvent<HTMLDivElement>){
    // find  target block of cursor
    const cursor =document.getSelection();
    const blockId:string = cursor?.anchorNode?.parentElement?.parentElement?.parentElement?.parentElement?.id  as string;
    const targetBlockIndex :number =page.blocksId.indexOf(blockId) as number;
    const targetBlock :Block =page.blocks[targetBlockIndex];
    console.log(targetBlock);
    if(event.code === "Enter"){
      // 새로운 블록 만들기 
        const newBlock:Block ={
          id:editTime,
          editTime:editTime,
          type:"text",
          contents:"",
          firstBlock:targetBlock.firstBlock,
          subBlocksId:targetBlock.subBlocksId,
          parentBlocksId:targetBlock.parentBlocksId,
          icon:null,
        };
        //밀려졌을때 기존의 block 수정 
        if(targetBlock.subBlocksId !==null){
          const editedBlock :Block ={
            ...targetBlock,
            editTime:editTime,
            subBlocksId:null,
          };
          editBlock(page.id, editedBlock);
        };
        
    
      if(targetBlock.type.includes("toggle")){
        //subBtn 
        const newSubBlock:Block ={
          ...newBlock,
          firstBlock:false,
          parentBlocksId:[block.id]
        }
        make_subBlock(targetBlock, newSubBlock ,targetBlockIndex+1, );
        
      }else{
        //새로운 버튼 
        addBlock(page.id, newBlock, targetBlockIndex+1 ,targetBlock.id)

      }
    } ;
    if(event.code ==="Tab" && targetBlockIndex>0){
      //  이전 블록의 sub 으로 변경 
      if(cursor?.anchorOffset=== 0){
        innerRef.current?.focus();
      const newParentBlock:Block = page.blocks[targetBlockIndex-1];
      const editedBlock:Block ={
        ...targetBlock,
        firstBlock: false,
        parentBlocksId: newParentBlock.parentBlocksId? newParentBlock.parentBlocksId.concat(newParentBlock.id) : [newParentBlock.id],
        editTime:editTime
      };
      changeToSub(page.id, editedBlock ,targetBlock.firstBlock , block.id);
      }
      
    };
    if(event.code ==="Backspace"){
      const target =event.target as HTMLDivElement ;
      const textNode = target.firstChild?.firstChild?.firstChild?.firstChild;
      const textContent :string = textNode?.textContent as string;
      const deltedBlockId :string = target.getAttribute("id") as string;
      const deletedBlockIndex :number= page.blocksId.indexOf(deltedBlockId) as number;
      const deletedBlock :Block =page.blocks[deletedBlockIndex] ;
      if(textContent ===""){
        deleteBlock(page.id, deletedBlock);
        };
  
    };
  };
  useEffect(()=>{
    const contents= innerRef.current?.getElementsByClassName("blockContents")[0].firstChild;

    if(contents ==null){
      innerRef.current?.focus();
    }
  },[]);

  return(
    <ContentEditable
      id={block.id}
      className="editableBlock"
      html={callBlockNode(block)}
      innerRef={innerRef}
      onChange={onChange}
      onKeyDown={onKeydown}

    />
  )
};

export default EditableBlock ;