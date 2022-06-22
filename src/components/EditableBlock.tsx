import React, { Dispatch, SetStateAction, useEffect, useState, } from 'react';
import { Block, Page,  } from '../modules/notion';
import CommandBlock from './CommandBlock';
import { Command } from '../containers/EditorContainer';
import BlockComponent, { itemType } from './BlockComponent';


type EditableBlockProps ={
  userName:string,
  page:Page,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage : ( newPage:Page, )=>void,
  editPage : (pageId:string , newPage:Page, )=>void,
  deletePage : (pageId:string , )=>void,
  
  setCommentBlock : Dispatch<SetStateAction<Block|null>>,
  commentBlock :Block |null,
  setTargetPageId:Dispatch<SetStateAction<string>>,
};
export   type CommentOpenType ={
  open:boolean,
  targetId: string | null,
};
const EditableBlock =({userName, page, block , editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock , addPage, editPage, deletePage ,setCommentBlock ,commentBlock ,setTargetPageId}:EditableBlockProps)=>{  
  const  editTime = JSON.stringify(Date.now());
  const [command, setCommand] =useState<Command>({
    boolean:false,
    command:null
  }); 
  const updateBlock=()=>{
    const item = sessionStorage.getItem("itemsTobeEdited");
    const cursorElement =document.getSelection()?.anchorNode?.parentElement;
    const className =cursorElement?.className ;
    if(item!==null){
      const  targetBlock:Block = JSON.parse(item);
      const condition = className ==="contentEditable" && cursorElement!==undefined && cursorElement!==null && cursorElement.parentElement?.id ===`${targetBlock.id}_contents`;
        if(!condition){
        editBlock(page.id, targetBlock);
        sessionStorage.removeItem("itemsTobeEdited");
        }
    }
  };
  const inner =document.getElementById("inner");
  inner?.addEventListener("click",updateBlock);
  inner?.addEventListener("keyup",updateBlock);
  
  return(
      <div 
        className="editableBlock"
        
      >
        <div className='editableBlockInner'>
        {!command.boolean?
        <>
          <BlockComponent
            userName={userName} 
            block={block} 
            page={page}
            addBlock={addBlock}
            editBlock={editBlock}
            changeToSub={changeToSub}
            raiseBlock={raiseBlock}
            deleteBlock={deleteBlock}
            addPage={addPage}
            editPage={editPage}
            deletePage={deletePage}
            setCommentBlock={setCommentBlock}
            commentBlock={commentBlock}
            setTargetPageId={setTargetPageId}
            command={command}
            setCommand={setCommand}    
          />
        </>
        :
          <>
          <BlockComponent
            userName={userName} 
            block={block} 
            page={page}
            addBlock={addBlock}
            editBlock={editBlock}
            changeToSub={changeToSub}
            raiseBlock={raiseBlock}
            deleteBlock={deleteBlock}
            addPage={addPage}
            editPage={editPage}
            deletePage={deletePage}
            setCommentBlock={setCommentBlock}
            commentBlock={commentBlock}
            setTargetPageId={setTargetPageId}
            command={command}
            setCommand={setCommand}
          />
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
          </>
        }
        </div>
      </div>
  )
};

export default EditableBlock ;