import React, { CSSProperties, Dispatch, SetStateAction, useEffect, useRef} from 'react';
import { Block, findBlock, Page,  } from '../modules/notion';
import { Command } from './Frame';
import BlockComponent, { BlockComment } from './BlockComponent';
import { GoPrimitiveDot } from 'react-icons/go';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { MdPlayArrow } from 'react-icons/md';


type EditableBlockProps ={
  page:Page,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  command:Command,
  setCommand:Dispatch<SetStateAction<Command>>,
  setOpenComment: Dispatch<SetStateAction<boolean>>,
  setCommentBlock: React.Dispatch<React.SetStateAction<Block | null>>
};
export   type CommentOpenType ={
  open:boolean,
  targetId: string | null,
};

const EditableBlock =({ page, block , editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock ,command, setCommand ,setOpenComment ,setCommentBlock
}:EditableBlockProps)=>{  
  const className = block.type !== "toggle" ?
  `${block.type} block ` :
  `${block.type} block ${block.subBlocksId!==null?'on' : ""}`;
  const subBlocks =  block.subBlocksId?.map((id:string)=>findBlock(page, id).BLOCK)
  const blockContentsStyle =(block:Block):CSSProperties =>{
  return ({
  color: block.type !=="todo done" ? block.style.color: "grey",
  backgroundColor :block.style.bgColor,
  fontWeight: block.style.fontWeight ,
  fontStyle: block.type !=="todo done"? block.style.fontStyle : "italic",
  textDecoration: block.type !=="todo done"? block.style.textDeco :"line-through",
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
              onMouseOver={giveFocusToContent}
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
                command={command}
                setCommand={setCommand}
                onClickCommentBtn={onClickCommentBtn}
              />
            </div>
            </div>
          {block.comments !==null &&
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
                onMouseOver={ giveFocusToContent}
              >
              <BlockComponent
                block={block} 
                page={page}
                addBlock={addBlock}
                editBlock={editBlock}
                changeToSub={changeToSub}
                raiseBlock={raiseBlock}
                deleteBlock={deleteBlock}
                command={command}
                setCommand={setCommand}
                onClickCommentBtn={onClickCommentBtn}
              />
              </div>
              </div>
              {block.comments !==null &&
              <BlockComment
                block={block}
                onClickCommentBtn={onClickCommentBtn}
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
                <EditableBlock
                  key ={subBlocks.indexOf(subBlock)} 
                  page={page}
                  block={subBlock}
                  addBlock={addBlock}
                  editBlock={editBlock}
                  changeToSub={changeToSub}
                  raiseBlock={raiseBlock}
                  deleteBlock={deleteBlock}
                  command={command}
                  setCommand={setCommand}
                  setOpenComment={setOpenComment}
                  setCommentBlock={setCommentBlock}
                />
              )
              }
            </div>
          </div>
        </div>
      </div>
  )
};

export default EditableBlock ;