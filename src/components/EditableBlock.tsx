import React, { CSSProperties, Dispatch, SetStateAction, useEffect, useRef} from 'react';
import { Block, BlockCommentType, findBlock, Page,  } from '../modules/notion';
import { Command } from './Frame';
import BlockComponent, { BlockComment } from './BlockComponent';
import { GoPrimitiveDot } from 'react-icons/go';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import {  MdPlayArrow } from 'react-icons/md';
import PageIcon from './PageIcon';


type EditableBlockProps ={
  page:Page,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  smallText:boolean,
  command:Command,
  setCommand:Dispatch<SetStateAction<Command>>,
  setTargetPageId: React.Dispatch<React.SetStateAction<string>> ,
  setOpenComment: Dispatch<SetStateAction<boolean>>,
  setCommentBlock: Dispatch<SetStateAction<Block | null>>,
  setOpenLoader:Dispatch<SetStateAction<boolean>>,
  setLoaderTargetBlock : Dispatch<SetStateAction<Block | null>>,
};
export   type CommentOpenType ={
  open:boolean,
  targetId: string | null,
};

const EditableBlock =({ page, block , editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock ,smallText ,command, setCommand ,setTargetPageId ,setOpenComment ,setCommentBlock ,setOpenLoader, setLoaderTargetBlock,
}:EditableBlockProps)=>{  
  const className = block.type !== "toggle" ?
  `${block.type} block ` :
  `${block.type} block ${block.subBlocksId!==null?'on' : ""}`;
  const changeFontSizeBySmallText=(block:Block):CSSProperties=>{
    const baseSize = smallText? 14 :16; 
    let ratio =1;
    switch (block.type) {
      case "h1":
        ratio =3;
        break;
      case "h2":
        ratio=2.5;
        break;
      case "h3" :
        ratio =2; 
        break; 
      default:
        break;
    }
    const style :CSSProperties={
      fontSize :`${baseSize * ratio}px`
    };
    return style 
  };
  const blockComments = 
  block.comments==null? 
  false : 
  (block.comments.filter((comment:BlockCommentType)=>  comment.type ==="open" )[0] ===undefined? 
  false:  
  true );
  const subBlocks =  block.subBlocksId?.map((id:string)=>findBlock(page, id).BLOCK)
  const blockContentsStyle =(block:Block):CSSProperties =>{
  return ({
  color: block.type !=="todo done" ? block.style.color: "grey",
  backgroundColor :block.style.bgColor,
  fontWeight: block.style.fontWeight ,
  fontStyle: block.type !=="todo done"? block.style.fontStyle : "italic",
  textDecoration: block.type !=="todo done"? block.style.textDeco :"line-through",
  width: block.style.width===undefined? "inherit" : block.style.width,
  height: block.style.height===undefined? "inherit" : block.style.height,
  })
  };
  const giveFocusToContent =(event:React.MouseEvent)=>{
  const currentTarget =event.currentTarget as HTMLElement;
  const contentEditable =currentTarget.getElementsByClassName("contentEditable")[0] as HTMLElement ;
 
  contentEditable.focus();
  };
  const onClickCommentBtn=(block:Block)=>{
    setOpenComment(true); 
    setCommentBlock(block);
  };
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
  const onClickTodoBtn =()=>{
    const editedTobo :Block ={
      ...block,
      type : block.type ==="todo" ? "todo done" : "todo",
      editTime:JSON.stringify(Date.now())
    };
    editBlock(page.id, editedTobo);
  };
  const onClickToggle=(event:React.MouseEvent)=>{
    const target =event.currentTarget ;
    const blockId =target.getAttribute("name");
    const toggleMainDoc = document.getElementById(`block_${blockId}`) ;
    target.classList.toggle("on");
    toggleMainDoc?.classList.toggle("on");
    
  };

  const inner =document.getElementById("inner");
  inner?.addEventListener("click",updateBlock);
  inner?.addEventListener("keyup",updateBlock);
  useEffect(()=>{
    const newBlockItem= sessionStorage.getItem("newBlock");
    if(newBlockItem!==null){
        const newBlockContentsDoc = document.getElementById(`${newBlockItem}_contents`);
        if(newBlockContentsDoc !==null){
          const newBlockContentEditableDoc= newBlockContentsDoc.firstElementChild as HTMLElement; 
          newBlockContentEditableDoc.focus();
        };
        sessionStorage.removeItem("newBlock");
    };
    if(block.type.includes("media") && block.contents===""){
      setOpenLoader(true);
      setLoaderTargetBlock(block);
    }
  },[]);
  
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
    };
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
              //onMouseOver={giveFocusToContent}
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
              <BlockComponent 
                block={block} 
                page={page}
                addBlock={addBlock}
                editBlock={editBlock}
                changeToSub={changeToSub}
                raiseBlock={raiseBlock}
                deleteBlock={deleteBlock}
                blockComments={blockComments}
                command={command}
                setCommand={setCommand}
                onClickCommentBtn={onClickCommentBtn}
                setOpenComment={setOpenComment}
                setTargetPageId={setTargetPageId}
                setOpenLoader={setOpenLoader}
                setLoaderTargetBlock={setLoaderTargetBlock}
              />
            </div>
            </div>
          {blockComments &&
            <BlockComment
              block={block} 
              onClickCommentBtn={onClickCommentBtn}
            />
          }
          </div>
        ))
        }
      </>
    )
  };
  return(
      <div className="editableBlock">
        <div className='editableBlockInner'>
          <div 
            id={`block_${block.id}`}
            className={className} 
            style={changeFontSizeBySmallText(block)}
          > 

            {block.type.includes("List") ?
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
                  onClick={onClickTodoBtn}
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
                  onClick={onClickTodoBtn}
                >
                  <GrCheckboxSelected   
                    className='blockBtnSvg '
                  />
                </button>
              }
              {block.type ==="toggle" &&
                <button 
                  name={block.id}
                  onClick={onClickToggle}
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
                  <PageIcon
                    icon={block.icon}
                    iconType={block.iconType} 
                    style={undefined}
                  />
                </div>
              }
              <div 
                className='blockContents' 
                style={blockContentsStyle(block)}
                //onMouseOver={ giveFocusToContent}
              >
                <BlockComponent
                block={block} 
                page={page}
                addBlock={addBlock}
                editBlock={editBlock}
                changeToSub={changeToSub}
                raiseBlock={raiseBlock}
                deleteBlock={deleteBlock}
                blockComments={blockComments}
                command={command}
                setCommand={setCommand}
                onClickCommentBtn={onClickCommentBtn}
                setTargetPageId={setTargetPageId}
                setOpenComment={setOpenComment}
                setOpenLoader={setOpenLoader}
                setLoaderTargetBlock={setLoaderTargetBlock}
                />
              </div>
              </div>
              {blockComments &&
              <BlockComment
                block={block}
                onClickCommentBtn={onClickCommentBtn}
              />
              }
            </div>
            </>
            }
            {!block.type.includes("List")&&
            <div 
              className='subBlocks'
            >
              {subBlocks!==undefined&&
              subBlocks.map((subBlock :Block)=> 
                <EditableBlock
                  key ={subBlocks.indexOf(subBlock)} 
                  page={page}
                  block={subBlock}
                  addBlock={addBlock}
                  editBlock={editBlock}
                  changeToSub={changeToSub}
                  raiseBlock={raiseBlock}
                  deleteBlock={deleteBlock}
                  smallText={smallText}
                  command={command}
                  setCommand={setCommand}
                  setOpenComment={setOpenComment}
                  setCommentBlock={setCommentBlock}
                  setTargetPageId={setTargetPageId}
                  setOpenLoader={setOpenLoader}
                  setLoaderTargetBlock={setLoaderTargetBlock}
                />
              )
              }
            </div>
            }
          </div>
        </div>
      </div>
  )
};

export default EditableBlock ;