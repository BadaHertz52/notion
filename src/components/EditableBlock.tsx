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
  addBlock :(pageId:string, block:Block , nextBlockIndex:number)=>void,
  changeToSub :(pageId:string, block:Block ,first:boolean)=>void,
  // raiseBlock: (pageId:string, block:Block)=>void,
}
const EditableBlock =({page, block   ,editBlock ,deleteBlock,addBlock, changeToSub}:EditableBlockProps)=>{  
  const blockIndex:number = page.blocksId.indexOf(block.id) ;
  const nextBlockIndex :number= blockIndex +1; 
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

  function addNewBlock( newBlock:Block, newBlockIndex:number){
    addBlock(page.id,newBlock,newBlockIndex);
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
  
  function make_subBlock(parentBlock:Block, subBlock:Block){
      const newMainBlock:Block ={
        ...parentBlock, 
        editTime :editTime ,
        subBlocksId: parentBlock.subBlocksId? [ subBlock.id ,...parentBlock.subBlocksId]: [subBlock.id],
      };
      const newSubBlock:Block ={
        ...subBlock,
        parentBlocksId:parentBlock.parentBlocksId?  [...parentBlock.parentBlocksId, parentBlock.id] : [
          parentBlock.id
        ]
      };
      addNewBlock(newSubBlock,nextBlockIndex);
      editBlock(page.id, newMainBlock);
      };
  
  function onKeydown (event: React.KeyboardEvent<HTMLDivElement>){
    if(event.code === "Enter"){
      // 새로운 블록 만들기 
        const newBlock:Block ={
          id:editTime,
          editTime:editTime,
          type:"text",
          contents:"",
          firstBlock:true,
          subBlocksId:null,
          parentBlocksId:null,
          icon:null,
        };
    
      if(block.type.includes("toggle")){
        //subBtn 
        const newSubBlock:Block ={
          ...newBlock,
          firstBlock:false,
          parentBlocksId:[block.id]
        }
        make_subBlock(block, newSubBlock);
        
      }else{
        //새로운 버튼 
        addNewBlock(newBlock, nextBlockIndex);
      }
    } ;
    if(event.code ==="Tab" && blockIndex>0){
      //  이전 블록의 sub 으로 변경 
      const cursorPosition = window.getSelection();
      const targetBlock:Block =page.blocks[blockIndex];
      if(cursorPosition?.anchorOffset=== 0){
        innerRef.current?.focus();
      const newParentBlock:Block = page.blocks[blockIndex-1];
      const editedBlock:Block ={
        ...targetBlock,
        firstBlock: false,
        parentBlocksId: newParentBlock.parentBlocksId? newParentBlock.parentBlocksId.concat(newParentBlock.id) : [newParentBlock.id],
        editTime:editTime
      };
      changeToSub(page.id, editedBlock ,targetBlock.firstBlock);
      }
      
    };
    if(event.code ==="Backspace"){
      const target =event.target as Node ;
      const textNode = target.firstChild?.firstChild?.firstChild?.firstChild;
      const textContent :string = textNode?.textContent as string
      if(textContent ===""){
        deleteBlock(page.id, block);

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