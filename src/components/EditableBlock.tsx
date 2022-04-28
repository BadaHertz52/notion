import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Block, Page } from '../modules/notion';
import BlockComponent from './BlockComponent';

type EditableBlockProps ={
  page:Page,
  //element: JSX.Element,
  block:Block,
  setBlocks:Dispatch<SetStateAction<Block[]>>,
  editBlock :(pageId:string, block:Block)=>void,
  addBlock :(pageId:string, block:Block , nextBlockIndex:number)=>void,
  changeToSub :(pageId:string, block:Block)=>void,
  // raiseBlock: (pageId:string, block:Block)=>void,
}
const EditableBlock =({page, block  ,setBlocks ,editBlock ,addBlock, changeToSub}:EditableBlockProps)=>{
  const blockIndex:number = page.blocksId.indexOf(block.id) ;
  const nextBlockIndex :number= blockIndex +1; 
  const  editTime = JSON.stringify(Date.now());
  const innerRef  =useRef<HTMLDivElement>(null) ;
  const [targetBlock, setTargetBlock]=useState<Block>(block); 
  const [sub, setSub]=useState<boolean>(false);

  const callBlockNode=(block:Block):string=>{
    const blockNode = ReactDOMServer.renderToString(<BlockComponent page={page} block={block}/>);
    return blockNode
  };
    const editContents =(contents :string , block:Block )=> {
    const newBlock :Block ={
      ...block,
      contents: contents,
      editTime: editTime
    } ;
    editBlock(page.id,newBlock);
    setBlocks(page.blocks);
  };
  const onChange =(event:ContentEditableEvent)=>{   
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

  const make_subBlock =(parentBlock:Block, subBlock:Block)=>{
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
      addBlock(page.id,newSubBlock,nextBlockIndex);
      editBlock(page.id, newMainBlock);
      document.getElementById(newSubBlock.id)?.focus();
    };
  
    const onKeydown =(event: React.KeyboardEvent<HTMLDivElement>)=>{
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
          addBlock(page.id, newBlock, nextBlockIndex);
          document.getElementById(newBlock.id)?.focus();
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
      console.log("pagebLOCKS", page.blocks)
      setBlocks(page.blocks);
    };
  return(
    <ContentEditable
      id={targetBlock.id}
      className="editableBlock"
      html={callBlockNode(targetBlock)}
      innerRef={innerRef}
      onChange={onChange}
      onKeyDown={onKeydown}
    />
  )
};

export default EditableBlock ;