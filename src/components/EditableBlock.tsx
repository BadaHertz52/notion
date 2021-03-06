import React, { Dispatch, SetStateAction, useEffect, useRef, useState, } from 'react';
import ReactDOMServer from 'react-dom/server';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { bg_default, Block, BlockType, blockTypes, defaultColor, findBlock, Page, pageSample } from '../modules/notion';
import CommandBlock from './CommandBlock';
import { Command } from '../containers/EditorContainer';
import BlockComponent from './BlockComponent';
import { detectRange } from './BlockFn';

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
  const cursorAnchorNode = cursor?.anchorNode as Node;
  const nodeType = cursorAnchorNode.nodeType as number ;
  const contentsDiv= nodeType=== 3? cursorAnchorNode.parentElement as Element: cursorAnchorNode as Element;
  const blockContentsElement = contentsDiv.parentElement ; 
  const title =blockContentsElement?.getAttribute("title") as string ; 
  const end = title?.indexOf("_contents");
  const blockId :string = title?.slice(0,end ); 
  const textContents = contentsDiv?.textContent as string; 
  const targetBlockIndex :number =page.blocksId.indexOf(blockId) as number;
  
  const targetBlock :Block =page.blocks[targetBlockIndex];
  const newContents = textContents?.slice(focusOffset) as string ;

  return {
    cursor: cursor ,
    focusOffset: focusOffset,
    targetElement:blockContentsElement as HTMLElement,
    targetBlock:targetBlock ,
    targetBlockIndex:targetBlockIndex,
    textContents: textContents,
    newContents:newContents
  }
};
export const makeNewBlock=(page:Page, editTime:string,addBlock:(pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) =>void ,editBlock :(pageId: string, block: Block) => void, addPage:( newPage: Page) => void ,targetBlock:Block, targetBlockIndex:number, newContents:string  )=>{
  
  if(targetBlock.type !=="toggle"){
    let number =page.blocksId.length.toString();
    const newBlock:Block ={
      id: `${page.id}_${number}_${editTime}`,
      editTime:editTime,
      createTime:editTime,
      type:"text",
      contents: newContents=== undefined ? "" : newContents,
      firstBlock:targetBlock.firstBlock,
      subBlocksId:targetBlock.subBlocksId,
      parentBlocksId:targetBlock.parentBlocksId,
      icon:null,
      style :{
        color:defaultColor,
        bgColor:bg_default,
                fontWeight:"initial",
        fontStyle:"initial",
        textDeco:"none"
      },
      comments:null
    };
      //????????? ?????? 
    addBlock(page.id, newBlock, targetBlockIndex+1 ,targetBlock.id)
    if(newBlock.type ==="page"){
      const newPage:Page ={
        ...pageSample,
        id:newBlock.id,
        header:{
                ...pageSample.header,
                title:newContents,
                },
      };
      addPage(newPage);
    }
  }else{
    const number = targetBlock.subBlocksId? targetBlock.subBlocksId.length.toString() : "1";
    const newSubBlock:Block ={
      id:`${page.id}_${targetBlock.id}_${number}_${editTime}`,
      editTime:editTime,
      createTime:editTime,
      type:"text",
      contents: "" ,
      firstBlock:false,
      subBlocksId:null,
      parentBlocksId:targetBlock.parentBlocksId !==null? targetBlock.parentBlocksId.concat(targetBlock.id) : [targetBlock.id],
      icon:null,
      style :{
        color:defaultColor,
        bgColor:bg_default,
        fontWeight:"initial",
        fontStyle:"initial",
        textDeco:"none"
      },
      comments:null
    };
    
    addBlock(page.id, newSubBlock, targetBlockIndex+1, targetBlock.id);
  }
// targetBlock ??????
  //targetBlock ??? subBlock?????? ??????????????? 
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
  userName:string,
  page:Page,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage : ( newPage:Page, )=>void,
  editPage : (pageId:string , newPage:Page, )=>void,
  deletePage : (pageId:string , )=>void,
  setCommentBlock : Dispatch<SetStateAction<Block|null>>,
  commentBlock :Block |null,
  setTargetPageId:Dispatch<SetStateAction<string>>
};
export   type CommentOpenType ={
  open:boolean,
  targetId: string | null,
};
const EditableBlock =({userName, page, block , editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock , addPage, editPage, deletePage ,setCommentBlock ,commentBlock ,setTargetPageId}:EditableBlockProps)=>{  
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
      userName={userName} 
      block={block} 
      subBlocks ={sub_blocks}
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
      if(textContents !==""){
        if(textContents.startsWith("/")){
          setCommand({boolean:true, command:textContents});
        }else{
          targetBlock.contents !== textContents &&
          sessionStorage.setItem("editedBlock", JSON.stringify(editedBlock));
        }
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
        // ????????? ?????? ????????? 
        makeNewBlock(page, editTime, addBlock, editBlock,addPage,targetBlock, targetBlockIndex, newContents);
        // targetBlock ??? contents ????????? ?????? ???????????? ??????????????? ??????
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
      //  ?????? ????????? sub ?????? ?????? 
      if(cursor?.anchorOffset=== 0 ){
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
      changeToSub(page.id, editedBlock ,targetBlock.firstBlock ,newParentBlock);
      }

    };
    if(event.code ==="Backspace"){
      if(textContents.length === 0){
        const deleteTargetBlockDiv = targetElement?.getElementsByTagName("div")[0]  as HTMLDivElement;
        const blockId = deleteTargetBlockDiv.getAttribute("id") as string;
        const {BLOCK} =findBlock(page, blockId);
        deleteBlock(page.id, BLOCK);
        if(BLOCK.type ==="page"){
          deletePage(BLOCK.id);
        }
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
  };

  function addEvent(event:React.MouseEvent){
    const target =event.target as HTMLElement;
    //toggle btn 
    const targetClassName = target.getAttribute("class");
    const targetParentElement = target.parentElement as HTMLElement; 
    const editor =document.getElementsByClassName("editor"
    )[0];
    const comments =document.getElementById("comments");

    const openComment =(element:HTMLElement)=>{
      const targetElement = element as HTMLButtonElement;
      const id = targetElement.name;
      const blockId_comments = document.getElementById(`${id}_comments`) ;
      const mainBlockElement = blockId_comments?.parentElement ;
      if(!blockId_comments?.classList.contains("open") ){
        const width =mainBlockElement?.offsetWidth ; 
        const position_mainBlock = mainBlockElement?.getClientRects()[0]; 
        const positionX = position_mainBlock?.x;
        const positionBottom = position_mainBlock?.bottom;
        comments?.setAttribute("style", `left:${positionX}px; top:${positionBottom}px ; width:${width}px`);
        editor?.setAttribute("style", "overflow:hidden");
        const {BLOCK} =findBlock(page, id)
        setCommentBlock(BLOCK);
      }
    };
    const closeComments =(event:React.MouseEvent)=>{
      const commentsDocArea =comments?.getClientRects()[0];
      const isInCommentsDoc =detectRange(event, commentsDocArea);
      if(!isInCommentsDoc){
        setCommentBlock(null);
        editor?.setAttribute("style", "overflow-y:scroll");
      }
    };

    commentBlock !==null &&
    closeComments(event)

    const changeTodoDone =(element:HTMLElement, done:boolean)=>{
      const id = element.getAttribute("name");
      if(id !==null){
        const {BLOCK}= findBlock(page, id);
        const newBlock:Block= {
          ...BLOCK,
          type: done ? "todo": "todo done"
        };
        editBlock(page.id, newBlock);
      };
    };

    const moveToPage =(element:HTMLElement, attribute:string)=>{
      const name =element.getAttribute(attribute);
      name !==null && setTargetPageId(name);
    };
    switch (target.tagName.toLowerCase()) {
      case "div":
        if(targetClassName?.includes("pageIcon")){
          const pageTitle = target.nextElementSibling?.firstElementChild as HTMLElement;
          moveToPage(pageTitle, "name");
        };
        if(target.previousElementSibling?.classList.contains("pageIcon")){
          const pageTitle =target.firstElementChild as HTMLElement ;
          moveToPage(pageTitle, "name");
        };
      break;
      case "svg":
        if(targetClassName ==="blockBtnSvg"){
          toggleOn(targetParentElement);
        };
        if(targetParentElement.className?.includes("commentBtn")){
          openComment(targetParentElement);
        };
        if(targetParentElement.className?.includes("checkbox") ){
          changeTodoDone(targetParentElement, targetParentElement.className?.includes("done"))
        };
        break;
      case "path":
        if(targetParentElement.getAttribute("class")==="blockBtnSvg"){
          const btnElement =targetParentElement.parentElement as HTMLElement;
          toggleOn(btnElement);
        };
        if(targetParentElement.parentElement?.className.includes("commentBtn")){
          openComment(targetParentElement.parentElement)
        };
        if(targetParentElement.parentElement?.className.includes("checkbox")){
          changeTodoDone(targetParentElement.parentElement,targetParentElement.parentElement.className?.includes("done"));
        };
        break;
      case "span":
        if(targetParentElement.className?.includes("commentBtn")){
          openComment(targetParentElement)
        };
        break;
      case "button":
        if(targetClassName?.includes("blockBtn")){
          if(targetClassName?.includes("checkbox")){
            changeTodoDone(target,targetClassName?.includes("done"));
          }else{
            toggleOn(target);
          }
        };
        if(targetClassName?.includes("commentBtn")){
          openComment(target);
        };
        if(targetClassName?.includes("pageTitle")){
          moveToPage(target, "name");
        };
        break;
      default:
        break;
    };
  };
  function showBlockFn (event:React.MouseEvent){
    const target= event.target as HTMLElement;
    const targetClassName = target.getAttribute("class");
    const blockFn = document.getElementById("blockFn");
    if( innerRef.current !==null){
      const left =45;
      blockFn?.classList.toggle("on");
      const getTitle =(element:Element)=>{
        const title = element.getAttribute("title");
        if(title !==null){
          const start = title.indexOf("_contents");
          const id= title.substring(0, start);
          const {BLOCK} =findBlock(page, id);
          const position = element.parentElement?.getClientRects()[0] as DOMRect;
          const targetHeight = position.height;
          const targetY = position.top;
          if(blockFn?.classList.contains("on")){
            sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(BLOCK));
          }else{
            sessionStorage.removeItem("blockFnTargetBlock");
          };

        if(block.type ==="h1" ){
          const h1Top = targetY + (targetHeight * 0.4);
          blockFn?.setAttribute("style", `top:${h1Top}px; left:${left}px;`);
        }else if(block.type ==="h2"){
          const h2Top = targetY + (targetHeight *0.25);
          blockFn?.setAttribute("style", `top:${h2Top}px; left:${left}px;`);
        }else{
          blockFn?.setAttribute("style", `top:${targetY}px;left:${left}px;`);
        };
        }else{
          console.log("Cant' find title")
        };
      };
      switch (target.tagName) {
        case "DIV":
          if(targetClassName ==="blockContents"){
            getTitle(target);
          };
          if(targetClassName?.includes("left")){
            const element = target.nextElementSibling as Element;
            getTitle(element); 
          };
          if(targetClassName ==="contents"){
            const parentElement =target.parentElement as Element ;
            getTitle(parentElement);
          }
          break;
        case "SVG":
          const blockComment = target.parentElement?.nextElementSibling as Element ;
          getTitle(blockComment);
          break;
        case "PATH":
          const block_comment = target.parentElement?.parentElement?.nextElementSibling as Element ;
          getTitle(block_comment);
          break;
        
        default:
          break;
      }
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
      editBlock(page.id, newBlock);
      setCommand({boolean:false, command:null})
    }
  };

  return(
      <div 
        className="editableBlock"
        onClick={addEvent}
      >
        <div>
        {!command.boolean?
        <>
          <ContentEditable
          id={block.id}
          html={callBlockNode(block)}
          innerRef={innerRef}
          onChange={onBlockChange}
          onKeyDown={onBlockKeyDown}
          onMouseOver ={showBlockFn}
          />
        </>
        :
          <>
          <ContentEditable
            id={block.id}
            html={command.command !==null? command.command : ""}
            innerRef={innerRef}
            onChange={commandChange}
            onKeyUp={(event)=>commandKeyUp(event,block)}
            onMouseOver ={showBlockFn}
          />
          <CommandBlock 
            key={`${block.id}_command`}
            page={page}
            block={block}
            editTime={editTime}
            editBlock={editBlock}
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