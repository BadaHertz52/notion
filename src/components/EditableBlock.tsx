import React, { Dispatch, SetStateAction, useEffect, } from 'react';

import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Block, Page } from '../modules/notion';
import CommandBlock from './CommandBlock';
import { Command } from '../containers/EditorContainer';



type EditableBlockProps ={
  page:Page,
  //element: JSX.Element,
  block:Block,
  command : Command,
  innerRef: React.RefObject<HTMLDivElement> ,
  editTime: string,
  targetId: string | null,
  setTargetId: Dispatch<SetStateAction<string|null>>,
  editBlock :(pageId: string, block: Block) => void
  callBlockNode: (block:Block)=> string,
  onBlockChange : ()=> void,
  updateEditedBlock : ()=> void,
  onBlockKeyDown :(event: React.KeyboardEvent<HTMLDivElement>)=> void,
  commandChange :(event: ContentEditableEvent)=> void,
  commandKeyUp :(event: React.KeyboardEvent<HTMLDivElement>, block: Block)=> void,
};

const EditableBlock =({page, block , innerRef,command, editTime,targetId,setTargetId, editBlock,callBlockNode,onBlockChange,updateEditedBlock,onBlockKeyDown,commandChange,commandKeyUp ,}:EditableBlockProps)=>{  
  const storageItem =sessionStorage.getItem("editedBlock") ;

  useEffect(()=>{
    if(storageItem !== null){
      const {editedBlock} = JSON.parse(storageItem) as {pageId: string, editedBlock:Block};
      setTargetId(editedBlock.id);
    };
  },[]);

  useEffect(()=>{
    updateEditedBlock();
  },[targetId]);


  return(
    <div className="editableBlock">
      {!command.boolean?
        <ContentEditable
        id={block.id}
        html={callBlockNode(block)}
        innerRef={innerRef}
        onChange={onBlockChange}
        onKeyDown={onBlockKeyDown}
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
  )
};

export default EditableBlock ;