import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Block, Page } from '../modules/notion';
import BlockComponent from './BlockComponent';

import { IoDocumentTextOutline, IoTextOutline } from 'react-icons/io5';
import {FcTodoList} from 'react-icons/fc';
import {RiPlayList2Fill} from 'react-icons/ri';
import { IoIosList } from 'react-icons/io';
import {VscListOrdered} from 'react-icons/vsc';

type EditableBlockProps ={
  page:Page,
  //element: JSX.Element,
  block:Block,
  editBlock :(pageId:string, block:Block)=>void,
  deleteBlock :(pageId:string, block:Block)=>void,
  addBlock :(pageId:string, block:Block , nextBlockIndex:number ,previousBlockId:string |null)=>void,
  changeToSub :(pageId:string, block:Block ,first:boolean ,previousBlockId:string | null)=>void,
  raiseBlock: (pageId:string, block:Block)=>void,
};

const EditableBlock =({page, block   ,editBlock ,deleteBlock,addBlock, changeToSub  ,raiseBlock}:EditableBlockProps)=>{  

  const  editTime = JSON.stringify(Date.now());
  const innerRef  =useRef<HTMLDivElement>(null) ;
  const [subBlocks, setSubBlocks]= useState<Block[]|null>(null);
  const [command, setCommand] =useState<boolean>(false);

  useEffect(()=>{
    const contents= innerRef.current?.getElementsByClassName("blockContents")[0]?.firstChild;

    if(contents ==null){
      innerRef.current?.focus();
    };

    if(block.subBlocksId!==null){
      const array =block.subBlocksId.map((id:string)=>{
        const subBlockIndex: number=page.blocksId.indexOf(id);
        const subBlock = page.blocks[subBlockIndex]
        return subBlock
      });
      setSubBlocks(array);

    };
  },[]);

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
      raiseBlock ={raiseBlock}
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
    const focusOffset =cursor?.focusOffset as number;
    const cursorParent = cursor?.anchorNode?.parentElement;
    const cursorParentTag = cursorParent?.tagName ;
    const targetElement = cursorParentTag ==="LI" ? cursorParent : cursorParent?.parentElement?.parentElement?.parentElement; 
    const textContent = targetElement?.textContent;
    const blockId:string = targetElement?.id  as string;
    const targetBlockIndex :number =page.blocksId.indexOf(blockId) as number;
    const targetBlock :Block =page.blocks[targetBlockIndex];
    const newContents = textContent?.slice(focusOffset) ;
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
        // targetBlock 수정 
        if( focusOffset>0){
          const newContents = targetBlock.contents.slice(0, focusOffset);
          const editedBlock:Block ={
            ...targetBlock,
            subBlocksId : null ,
            contents:newContents,
            editTime:editTime
          };
          console.log(focusOffset, editedBlock)
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
      if(focusOffset ===0){
        raiseBlock(page.id, targetBlock);
      };
      if(textContent?.length===1){
        deleteBlock(page.id, targetBlock);
        };
  
    };
  };


  return(
  <>
    <ContentEditable
      id={block.id}
      className="editableBlock"
      html={callBlockNode(block)}
      innerRef={innerRef}
      onChange={onChange}
      onKeyDown={onKeydown}
    />
    {command &&
      <div className='blockCommand'>
        <div className='blockCommand_inner'>
          <div className='basic_blocks'>
            <header className='command_header'>
              BASIC BLOCKS
            </header>
            <div className='blockType'>
              <button>
                <div className='types_left'>
                  <IoTextOutline/>
                </div>
                <div className='types_right'>
                  <header>Text</header>
                  <div className='typeExplannation'>
                    Just start writing with plain text.
                  </div>
                </div>
              </button>
              <button>
                <div className='types_left'>
                  <IoDocumentTextOutline/>
                </div>
                <div className='types_right'>
                  <header>Page</header>
                  <div className='typeExplannation'>
                    Embed a sub-page inside this page.
                  </div>
                </div>
              </button>
              <button>
                <div className='types_left'>
                  <FcTodoList/>
                </div>
                <div className='types_right'>
                  <header>To-do list</header>
                  <div className='typeExplannation'>
                    Track tasks width a to-do list.
                  </div>
                </div>
              </button>
              <button>
                <div className='types_left'>
                  H1
                </div>
                <div className='types_right'>
                  <header>Heading 1</header>
                  <div className='typeExplannation'>
                    Big section heading.
                  </div>
                </div>
              </button>
              <button>
                <div className='types_left'>
                  H2
                </div>
                <div className='types_right'>
                  <header>Heading 2</header>
                  <div className='typeExplannation'>
                    Medium section heading 
                  </div>
                </div>
              </button>
              <button>
                <div className='types_left'>
                  H3
                </div>
                <div className='types_right'>
                  <header>Heading 3</header>
                  <div className='typeExplannation'>
                    Small section heading.
                  </div>
                </div>
              </button>
              <button>
                <div className='types_left'>
                  <IoIosList/>
                </div>
                <div className='types_right'>
                  <header>Bullet list</header>
                  <div className='typeExplannation'>
                    Create a simple buttled list.
                  </div>
                </div>
              </button>
              <button>
                <div className='types_left'>
                  <VscListOrdered/>
                </div>
                <div className='types_right'>
                  <header>Numbered list</header>
                  <div className='typeExplannation'>
                    Create a lisdt with numbering.
                  </div>
                </div>
              </button>
              <button>
                <div className='types_left'>
                  <RiPlayList2Fill/>
                </div>
                <div className='types_right'>
                  <header>Toggle list</header>
                  <div className='typeExplannation'>
                    Toggles can hide and show content inside
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>
      </div>
      }
  </>
  )
};

export default EditableBlock ;