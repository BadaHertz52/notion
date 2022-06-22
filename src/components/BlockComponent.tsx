import React, { Dispatch, SetStateAction, useRef} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { GoPrimitiveDot } from 'react-icons/go';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { IoChatboxOutline } from 'react-icons/io5';
import { MdPlayArrow } from 'react-icons/md';
import {  CSSProperties} from 'styled-components';
import { Command } from '../containers/EditorContainer';
import {  Block,BlockType,blockTypes,findBlock,makeNewBlock,Page } from '../modules/notion';

type BlockProp ={
  userName:string,
  block:Block,
  page:Page,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage : (newPage:Page, )=>void,
  editPage : (pageId:string , newPage:Page, )=>void,
  deletePage : (pageId:string , )=>void,
  setCommentBlock : Dispatch<SetStateAction<Block|null>>,
  commentBlock:Block|null,
  setTargetPageId:Dispatch<SetStateAction<string>>,
  setCommand: Dispatch<SetStateAction<Command>>,
  command:Command,
};
type BlockCommentProps ={
  block:Block,
};
type BlockContentProps={
  block:Block,
  onChangeContents: (event: ContentEditableEvent) => void,
  onKeyDownContents: (event: React.KeyboardEvent<HTMLDivElement>) => void,
};
export type itemType ={
  block:Block,
  blockIndex:number ,
}
export const BlockComment =({block}:BlockCommentProps)=>{
  return (
      <div 
        id={`${block.id}_comments`}
        className="blockId_comments"
        >
        <button 
          className='commentBtn btnIcon'
          name={block.id}
        >
          <IoChatboxOutline/>
          <span className="commentLength">
            {block.comments?.length}
          </span>
        </button>
      </div>

  )
};
const BlockContent =({block, onChangeContents, onKeyDownContents}:BlockContentProps)=>{
  const contentEditableRef= useRef<HTMLElement>(null);
  const editTime= JSON.stringify(Date.now());
  const showBlockFn=(event: React.MouseEvent)=>{
    const mainBlock= event.currentTarget.parentElement?.parentElement ;
    const domReact =mainBlock?.getBoundingClientRect();
    const editableBlockDomRect =document.getElementsByClassName("editableBlock")[0].getBoundingClientRect(); 
    
    const blockFn =document.getElementById("blockFn");
    blockFn?.classList.toggle("on");
    blockFn?.classList.contains("on")?
    sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block))
    :
    sessionStorage.removeItem("blockFnTargetBlock");

    if(domReact!==undefined){
      const top = domReact.top +5;
      const left = editableBlockDomRect.x - 45;
      const blockFnStyle =`top:${top}px; left: ${left}px`
      blockFn?.setAttribute("style",blockFnStyle);
    }
  };

  const BlockContentEditable=()=>{
    return(
        <ContentEditable
          className='contentEditable'
          html= {block.contents}
          innerRef={contentEditableRef}
          onChange={(event)=> onChangeContents(event )}
          onKeyDown={(event)=> onKeyDownContents(event)}
        /> 
    )
  }
  return(
    <>
    {block.comments ==null ?
    ( block.type==="page"?
      <button 
        className="contents pageTitle"
        id={`${block.id}_contents`}
        placeholder="type '/' for commmands"
        onMouseOver={showBlockFn}
      >
        <BlockContentEditable/>
      </button>
      :
      <div 
        id={`${block.id}_contents`}
        className="contents"
        placeholder="type '/' for commmands"
        onMouseOver={showBlockFn}
      >
        <BlockContentEditable/>
      </div>
    )
    :
    <button 
      id={`${block.id}_contents`}
      className="contents commentBtn"
      placeholder="type '/' for commmands"
      onMouseOver={showBlockFn}
    >
      <BlockContentEditable/>
    </button>
    }
  </>
  )
};
const BlockComponent=({ userName,block, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock ,addPage, editPage, deletePage,setCommentBlock ,commentBlock ,setTargetPageId ,setCommand , command }:BlockProp)=>{
  const className = block.type !== "toggle" ?
                    `${block.type} block ` :
                    `${block.type} block ${block.subBlocksId!==null?'on' : ""}`;
  const editTime = JSON.stringify(Date.now());
  const subBlocks =  block.subBlocksId?.map((id:string)=>findBlock(page, id).BLOCK)
  //const [text, setText] =useState<string>(block.contents);
  const blockContentsStyle =(block:Block):CSSProperties =>{
    return ({
      color: block.type !=="todo done" ? block.style.color: "grey",
      backgroundColor :block.style.bgColor,
      fontWeight: block.style.fontWeight ,
      fontStyle: block.type !=="todo done"? block.style.fontStyle : "italic",
      textDecoration: block.type !=="todo done"? block.style.textDeco :"line-through",
    })
  };
  const findTargetBlock =(event:ContentEditableEvent|React.KeyboardEvent<HTMLDivElement>|React.MouseEvent):Block=>{
    const target =event.currentTarget.parentElement as HTMLElement;
    const targetId= target.id;
    const end =targetId.indexOf("_contents");
    const blockId = targetId.slice(0, end);
    const targetBlock = findBlock(page, blockId).BLOCK;
    return targetBlock;
  };
  const onChangeContents=(event:ContentEditableEvent)=>{
    const value =event.target.value;
    const targetBlock= findTargetBlock(event);
    const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);

    if(value.includes("<div>")){
      //enter 시에 새로운 블록 생성 
      const start = value.indexOf("<div>");
      const end =value.indexOf("</div>");
      const editedContents =value.slice(0, start);
      const newBlockContents= value.slice(start+5,end );
      if(block.contents!== editedContents){
        const editedBlock:Block ={
          ...targetBlock,
          contents:editedContents,
          editTime:editTime,
        };
        editBlock(page.id, editedBlock);
      } 
      const newBlock = makeNewBlock(page, targetBlock, newBlockContents);
      addBlock(page.id, newBlock,targetBlockIndex+1, targetBlock.id);
    }else{
      const editedBlock :Block ={
                ...targetBlock,
                contents: value,
                editTime:editTime,
              };
      sessionStorage.setItem("itemsTobeEdited", JSON.stringify(editedBlock));
    };
    if(value.startsWith("/")){
      setCommand({boolean:true, command:value})
    }else{
      command.boolean &&
      setCommand({boolean:false, command:null})
    }
  };
  const onKeyDownContents=(event:React.KeyboardEvent<HTMLDivElement>)=>{
    const code =event.code.toLowerCase();
    const targetBlock= findTargetBlock(event);
    const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
    switch (code) {
      case "tab":
        event.preventDefault();
          const targetEditableDoc = document.getElementById(`block_${targetBlock.id}`)?.parentElement?.parentElement as HTMLElement ;
          const previousEditableDoc = targetEditableDoc.previousElementSibling as HTMLElement ;  
          const previousBlockDoc= previousEditableDoc.firstChild?.firstChild as HTMLElement;
          const previousBlockId = previousBlockDoc.id.slice(6);
          changeToSub(page.id, targetBlock,previousBlockId );
          
        break;
    
      default:
        break;
    }
    // const childeNodes =[...event.currentTarget.childNodes];
    //console.log(childeNodes , currentTarget);
    // if(!command.boolean){
    //   const code =event.code.toLowerCase();
    //   if(code.startsWith("key")){
    //     if(text.startsWith("/")){

    //     }else{
    //       const newBlock :Block ={
    //         ...targetBlock,
    //         contents: text,
    //         editTime:editTime
    //       };
    //       editBlock(page.id, newBlock);
    //     }
    //   }else{
    //     switch (code) {
    //       case "enter":
    //         const end = text?.indexOf("<div>");
    //         console.log("enter", text,end, text.slice(0, end),text.slice(end));
    //         const editedTargetBlock:Block ={
    //           ...targetBlock,
    //           contents: text.slice(0, end),
    //           editTime:editTime
    //         };
    //        //editBlock(page.id, editedTargetBlock);
    //         
    //         break;
    //       case"tab" :
    //       break;
    //       case "backspace":
    //         break;
          
    //       default:
    //         break;
    //     }
    //   }

    // }else{
    //   ///command.boolean ===true
    //   commandKeyUp(event, block);
    // }

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

  };

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
  // function showBlockFn( blockId:string){
  //   const blockDoc = document.getElementById(`block_${block.id}`) as HTMLElement;
  //   const blockContentsCollection =blockDoc.getElementsByClassName("blockContents");
  //   const blockContents =blockContentsCollection[0];
  //   console.log(blockDoc,blockContents);
  //   //blockFn positon
  //   if(blockContents!==undefined){
  //     const targetBlock =findBlock(page, blockId).BLOCK;
  //     const blockFn = document.getElementById("blockFn");
  //     blockFn?.classList.toggle("on");
  //     if(blockFn?.classList.contains("on")){
  //       sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(targetBlock));
  //     }else{
  //       sessionStorage.removeItem("blockFnTargetBlock");
  //     };
  //     const domRect =blockContents?.getClientRects()[0];
  //     if(domRect!==undefined){
  //       const targetY = domRect.top;
  //       const top = domRect.y -(domRect.height * 0.8) ;
  //       console.log("y", targetY);
  //       blockFn?.setAttribute("style", `top:${top}px;left: -45px;`);
  //       }else{
  //         console.log("Cant' find blockContents")
  //       };
  //     };

  // };

  const ListSub = ()=>{
    const blockContentsRef= useRef<HTMLDivElement>(null);
    const listStyle =(block:Block):CSSProperties=>{
      return({
        textDecoration:"none",
        fontStyle:"normal",
        fontWeight: "normal",
        backgroundColor:block.style.bgColor,
        color:block.style.color
      })
    }
    return(
      <>
        {subBlocks !== undefined  && 
          subBlocks.map((block:Block)=>(
          <div 
            className='list mainBlock'
            key={`listItem_${subBlocks.indexOf(block)}`}
          >
            <div className='mainBlock_block'>
            <div 
              id ={block.id}
              className= "blockContents"
              ref={blockContentsRef}
              style={listStyle(block)}
              >
              <div 
                className='list_marker'
              >
                {className.includes("number")? 
                `${subBlocks.indexOf(block)+1}.`
                :
                <GoPrimitiveDot/> 
                }
              </div>
              <BlockContent 
                block={block}
                onChangeContents={onChangeContents}
                onKeyDownContents={onKeyDownContents}
              />
            </div>
            </div>
          {block.comments !==null &&
            <BlockComment
            block={block}
            />
          }
          </div>
        ))
        }
      </>
    )
  };

  return(
    <div 
      id={`block_${block.id}`}
      className={className} 
    > 

      {(block.type ==="numberList" || block.type=== "bulletList" ) ?
        <ListSub/>
      :
      <>
      <div 
        className="mainBlock"
      >
        <div className='mainBlock_block'>
        {block.type ==="todo" &&
          <button 
            className='checkbox left blockBtn'
            name={block.id}
            >
            <GrCheckbox 
              className='blockBtnSvg' 
            />
          </button>
        }
        {block.type ==="todo done" &&
          <button 
            className='checkbox done left blockBtn'
            name={block.id}
          >
            <GrCheckboxSelected   className='blockBtnSvg '
            />
          </button>
        }
        {block.type ==="toggle" &&
          <button 
            name={block.id}
            className={block.subBlocksId!==null ? 
              'blockToggleBtn on left blockBtn' :
              'blockToggleBtn left blockBtn' 
            }
          >
            <MdPlayArrow 
              className='blockBtnSvg'
            />
          </button>
        }
        {block.type ==="page" &&
          <div 
            className='pageIcon left'
          >
          {block.icon == null?
            < GrDocumentText/>
          :
            block.icon
          }
          </div>
        }
        <div 
          className='blockContents' 
          style={blockContentsStyle(block)}
        >
        <BlockContent
          block={block}
          onChangeContents={onChangeContents}
          onKeyDownContents={onKeyDownContents}
        />
        </div>
        </div>
        {block.comments !==null &&
        <BlockComment
          block={block}
        />
        }
      </div>
      </>
      }
      <div 
        className='subBlocks'
      >
        {subBlocks!==undefined&&
        subBlocks.map((subBlock :Block)=> 
          <BlockComponent
            key ={subBlocks.indexOf(subBlock)} 
            userName={userName} 
            page={page}
            block={subBlock}
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
        )
        }
      </div>

    </div>
  )
};

export default React.memo (BlockComponent);
