import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Block, Page } from '../modules/notion';
import BlockComponent from './BlockComponent';

type EditableBlockProps ={
  page:Page,
  //element: JSX.Element,
  block:Block,
  editBlock :(pageId:string, block:Block)=>void,
  addBlock :(pageId:string, block:Block , nextBlockIndex:number)=>void,
  changeToSub :(pageId:string, block:Block)=>void,
  // raiseBlock: (pageId:string, block:Block)=>void,
}
const EditableBlock =({page, block   ,editBlock ,addBlock, changeToSub}:EditableBlockProps)=>{  
  const blockIndex:number = page.blocksId.indexOf(block.id) ;
  const nextBlockIndex :number= blockIndex +1; 
  const  editTime = JSON.stringify(Date.now());
  const innerRef  =useRef<HTMLDivElement>(null) ;
  const [targetBlock, setTargetBlock]=useState<Block>(block); 
  const [newBlock, setNewBlock]=useState<boolean>(false);
  const [newBlockDoc, setNewBlockDoc]=useState<HTMLElement| null>(null);
 
  useEffect(()=>{
    newBlockDoc?.focus();
  },[newBlockDoc , newBlock]);

  function callBlockNode(block:Block):string{
    const blockNode = ReactDOMServer.renderToString(<BlockComponent block={block}/>);
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
    setNewBlockDoc(document.getElementById(newBlock.id));
  };

  function onChange(event:ContentEditableEvent){   
    const value = event.target.value;
      
      if(!value.includes("<div>")){
        editContents(value ,targetBlock);      
      }else{
        //when user press eneter 
      const start = value.indexOf("<div>");
      const last =value.indexOf("</div>");
      const text =value.substring(start+5, last);
      const newContents = text=== "<br>" ? "": text;
      editContents(newContents, targetBlock );
      };
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
          parentBlocksId:[targetBlock.id]
        }
        make_subBlock(targetBlock, newSubBlock);
        
      }else{
        //새로운 버튼 
        addNewBlock(newBlock, nextBlockIndex);
      }
    } ;
    if(event.code ==="Tab" && blockIndex>0){
      //  이전 블록의 sub 으로 변경 
      innerRef.current?.focus();
      const newParentBlock:Block = page.blocks[blockIndex-1];
      const editedBlock:Block ={
        ...targetBlock,
        firstBlock: false,
        parentBlocksId: newParentBlock.parentBlocksId? newParentBlock.parentBlocksId.concat(newParentBlock.id) : [newParentBlock.id],
        editTime:editTime
      };
      changeToSub(page.id, editedBlock);
    };
  };

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