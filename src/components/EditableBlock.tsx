import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Block, findBlock, Page } from '../modules/notion';
import BlockComponent from './BlockComponent';

import { RiPlayList2Fill } from 'react-icons/ri';
import { VscListOrdered } from 'react-icons/vsc';
import { IoIosList } from 'react-icons/io';
import { FcTodoList } from 'react-icons/fc';
import { IoDocumentTextOutline, IoTextOutline } from 'react-icons/io5';

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

type CommandBlockProp ={
  block:Block,
};

const CommandBlock =({block}:CommandBlockProp)=>{
  const blockElement = document.getElementById(block.id) as HTMLElement;
  const commandStyle :CSSProperties={
    position: 'absolute',
    top: blockElement.clientHeight,
  };
  const textContent =blockElement.textContent?.toLowerCase() as string ;
  const commandBtns = document.querySelectorAll(".command_btn");
  const no_result =document.getElementById("no_result");
  const commandBlock_inner = document.querySelector("#commandBlock_inner");
  if(textContent !==null){
    const command = textContent.slice(1);
    commandBtns.forEach((btn:Element)=>{
      if(command !== null &&btn.getAttribute("name")?.includes(command)){
        !btn.classList.contains("on")&&
        btn.classList.add("on");
      }else{
        btn.classList.contains("on")&&
        btn.classList.remove("on");
      };
    });
    const onBtns = document.querySelectorAll('.command_btn.on');
    if(onBtns[0]!== undefined){
      onBtns[0].setAttribute("style", "background-color:rgba(55, 53, 47, 0.08)");
      no_result?.setAttribute("style", "display:none")
    }else{
      no_result?.setAttribute("style", "display:block");
      commandBlock_inner?.setAttribute("style", "display:none");
    }
    
  };
  
  return(
      <div 
        id='commandBlock'
        style={commandStyle}
      >
        <div id='commandBlock_inner'>
          <div className='command basic_blocks'>
            <header className='command_header'>
              BASIC BLOCKS
            </header>
            <div className='command_btns type'>
              <button 
              className='command_btn on' name='text'>
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                    <IoTextOutline/>
                  </div>
                  <div className='command_btn_right'>
                    <header>Text</header>
                    <div className='command_explanation'>
                      Just start writing with plain text.
                    </div>
                  </div>
                </div>
              </button>
              <button  
              className='command_btn on' 
              name='page'
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                    <IoDocumentTextOutline/>
                  </div>
                  <div className='command_btn_right'>
                    <header>Page</header>
                    <div className='command_explanation'>
                      Embed a sub-page inside this page.
                    </div>
                  </div>
                </div>
              </button>
              <button   
              className='command_btn on' 
              name='to-do list'
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                    <FcTodoList/>
                  </div>
                  <div className='command_btn_right'>
                    <header>To-do list</header>
                    <div className='command_explanation'>
                      Track tasks width a to-do list.
                    </div>
                  </div>
                </div>
              </button>
              <button 
              className='command_btn on'
              name='h1'

              >
              <div className='command_btn_inner'>
                <div className='command_btn_left headerType' >
                  <span>H</span>
                  <span>1</span>
                </div>
                <div className='command_btn_right'>
                  <header>Heading 1</header>
                  <div className='command_explanation'>
                    Big section heading.
                  </div>
                </div>
              </div>
              </button>
              <button 
                className='command_btn on'
                name='h2'
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left headerType'>
                    <span>H</span>
                    <span>2</span>
                  </div>
                  <div className='command_btn_right '>
                    <header>Heading 2</header>
                    <div className='command_explanation'>
                      Medium section heading 
                    </div>
                  </div>
                </div>
              </button>
              <button 
                className='command_btn on'
                name="h3"
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left headerType'>
                    <span>H</span>
                    <span>3</span>
                  </div>
                  <div className='command_btn_right'>
                    <header>Heading 3</header>
                    <div className='command_explanation'>
                      Small section heading.
                    </div>
                  </div>
                </div>
              </button>
              <button 
                className='command_btn on'
                name='bullet list'
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                  <IoIosList/>
                  </div>
                  <div className='command_btn_right'>
                    <header>Bullet list</header>
                    <div className='command_explanation'>
                      Create a simple buttled list.
                    </div>
                  </div>
                </div>
              </button>
              <button 
                className='command_btn on'
                name="number list"
              >
                <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                    <VscListOrdered/>
                  </div>
                  <div className='command_btn_right'>
                    <header>Numbered list</header>
                    <div className='command_explanation'>
                      Create a lisdt with numbering.
                    </div>
                  </div>
                </div>
              </button>
              <button
                className='command_btn on'
                name="toggle list"
              >
              <div className='command_btn_inner'>
                  <div className='command_btn_left'>
                  <RiPlayList2Fill/>
                </div>
                <div className='command_btn_right'>
                  <header>Toggle list</header>
                  <div className='command_explanation'>
                    Toggles can hide and show content inside
                  </div>
                </div>
              </div>
              </button>
            </div>
          </div>
        </div>
        <div id='no_result'>
          No results
        </div>
      </div>
  )
};

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
  const storageItem =sessionStorage.getItem("editedBlock");
  type Command ={
    boolean:boolean,
    command:string | null
  }
  const [command, setCommand] =useState<Command>({
    boolean:false,
    command:null
  }); 
  useEffect(()=>{
    const contents= innerRef.current?.getElementsByClassName("blockContents")[0]?.firstChild;

    if(contents ==null){
      innerRef.current?.focus();
    };
    updateEditedBlock();
    sessionStorage.removeItem("editedBlock");
  },[]);
  
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
      editBlock ={editBlock}
      deleteBlock={deleteBlock}
      addBlock ={addBlock}
      changeToSub ={changeToSub}
      raiseBlock ={raiseBlock}
      />);
    return blockNode
  };

  function onChange(event:ContentEditableEvent){ 
    const {targetBlock , textContents}= findTargetBlock(page);  
    if(targetBlock !== undefined){
      const newBlock :Block ={
        ...targetBlock,
        contents: textContents,
        editTime: editTime
      } ;
      const editedBlock :{pageId:string, editedBlock:Block} ={
        pageId: page.id,
        editedBlock: newBlock
      };
      sessionStorage.setItem("editedBlock", JSON.stringify(editedBlock));
      if(textContents.startsWith("/")){
        setCommand({boolean:true, command:textContents});
      };
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
  };

  function onKeydown (event: React.KeyboardEvent<HTMLDivElement>){
    // find  target block of cursor    
    const {cursor, focusOffset, targetBlock, targetBlockIndex,textContents, newContents}= findTargetBlock(page);

    if(event.code === "Enter"){
      if( !textContents.startsWith("/")){
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
      };

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
    
      if(textContents?.length<1){
        deleteBlock(page.id, targetBlock);
        };
  
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
    }

  }

  return(
    <div className="editableBlock">
      {!command.boolean?
        <ContentEditable
        id={block.id}
        html={callBlockNode(block)}
        innerRef={innerRef}
        onChange={onChange}
        onKeyDown={onKeydown}
        />
      :
        <>
        <ContentEditable
          id={block.id}
          html={command.command !==null? command.command : ""}
          onChange={commandChange}
        />
        <CommandBlock 
        key={`${block.id}_command`}
        block={block}
        
        />
        </>
      }
    </div>
  )
};

export default EditableBlock ;