import React, { CSSProperties, Dispatch, MouseEvent, MutableRefObject, SetStateAction, useEffect, useRef} from 'react';
import { Block, MainCommentType, findBlock, Page,  } from '../modules/notion';
import { Command, selectionType } from './Frame';
import BlockComponent, { setTemplateItem } from './BlockComponent';
import { GoPrimitiveDot } from 'react-icons/go';
import { GrCheckbox, GrCheckboxSelected } from 'react-icons/gr';
import {  MdPlayArrow } from 'react-icons/md';
import PageIcon from './PageIcon';
import BlockComment  from './BlockComment';
export type EditableBlockProps ={
  pages:Page[],
  pagesId:string[],
  page:Page,
  block:Block,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  fontSize:number,
  moveBlock:MutableRefObject<boolean>,
  setMoveTargetBlock :Dispatch<SetStateAction<Block | null>>,
  pointBlockToMoveBlock:MutableRefObject<Block | null>,
  command:Command,
  setCommand:Dispatch<SetStateAction<Command>>,
  setTargetPageId:Dispatch<SetStateAction<string>> ,
  openComment: boolean,
  setOpenComment: Dispatch<SetStateAction<boolean>>,
  setCommentBlock: Dispatch<SetStateAction<Block | null>>,
  setOpenLoader:Dispatch<SetStateAction<boolean>>,
  setLoaderTargetBlock : Dispatch<SetStateAction<Block | null>>,
  closeMenu:(event: globalThis.MouseEvent |MouseEvent) => void,
  templateHtml: HTMLElement | null,
  setSelection:Dispatch<SetStateAction<selectionType|null>>,
  openMobileMenu:boolean,
  setOpenMM:Dispatch<SetStateAction<boolean>>,
  setMobileMenuBlock:Dispatch<SetStateAction<Block | null>>
};
export   type CommentOpenType ={
  open:boolean,
  targetId: string | null,
};
export const changeFontSizeBySmallText=(block:Block, fontSize:number):CSSProperties=>{
  const baseSize = fontSize; 
  let ratio =1;
  switch (block.type) {
    case "h1":
      window.innerWidth>= 768?
        ratio =2.5:
        ratio =2 ;
      break;
    case "h2":
      window.innerWidth >= 768?
      ratio=2.2:
      ratio =1.6
      break;
    case "h3" :
      window.innerWidth >= 768?
      ratio =2:
      ratio= 1.3
      break; 
    default:
      break;
  }
  const style :CSSProperties={
    fontSize :`${baseSize * ratio}px`
  };
  return style 
};

const EditableBlock =({ pages,pagesId,page, block , editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock ,fontSize, moveBlock ,setMoveTargetBlock, pointBlockToMoveBlock ,command, setCommand , openComment, setTargetPageId ,setOpenComment ,setCommentBlock ,setOpenLoader, setLoaderTargetBlock,closeMenu ,templateHtml ,setSelection ,setOpenMM ,openMobileMenu ,setMobileMenuBlock

}:EditableBlockProps)=>{  
  const className = block.type !== "toggle" ?
  `${block.type} block ` :
  `${block.type} block ${block.subBlocksId!==null?'on' : ""}`;
  const subBlocks =  block.subBlocksId?.map((id:string)=>findBlock(page, id).BLOCK);

  const blockComments = 
  block.comments==null? 
  false : 
  (block.comments.filter((comment:MainCommentType)=>  comment.type ==="open" )[0] ===undefined? 
  false:  
  true );
  const blockContentsStyle =(block:Block):CSSProperties =>{
  return ({
  color: block.type !=="todo done" ? block.style.color: "grey",
  backgroundColor :block.style.bgColor,
  width: block.style.width===undefined? "inherit" : block.style.width,
  height: block.style.height===undefined? "inherit" : block.style.height,
  })
  };
  const onMouseOverToMoveBlock=(event:MouseEvent<HTMLDivElement>, targetBlock:Block)=>{
    if(moveBlock.current){
      pointBlockToMoveBlock.current = targetBlock;
      event.currentTarget.classList.add("on");
    }
  };
  const onMouseLeaveToMoveBlock=(event:MouseEvent<HTMLDivElement>)=>{
    if(moveBlock.current && pointBlockToMoveBlock.current?.id=== block.id){
      event.currentTarget.classList.remove("on");
    }
  };
  const onClickCommentBtn=(block:Block)=>{
    if(!openComment){
      setCommentBlock(block);
      setOpenComment(true);
    }
  };

  const onClickTodoBtn =()=>{
    const editedTobo :Block ={
      ...block,
      type : block.type ==="todo" ? "todo done" : "todo",
      editTime:JSON.stringify(Date.now())
    };
    setTemplateItem(templateHtml,page);
    editBlock(page.id, editedTobo);
  };
  const onClickToggle=(event:React.MouseEvent)=>{
    const target =event.currentTarget ;
    const blockId =target.getAttribute("name");
    const toggleMainDoc = document.getElementById(`block_${blockId}`) ;
    target.classList.toggle("on");
    toggleMainDoc?.classList.toggle("on");
    
  };


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
  },[block,setLoaderTargetBlock,setOpenLoader]);
  
  const ListSub = ()=>{
    const blockContentsRef= useRef<HTMLDivElement>(null);
    const getListMarker=(subBlock:Block)=>{
      let listmarker :string ="";
      const listSubBlocksId = block.subBlocksId;

      if(listSubBlocksId !==null){
        const listSubBlocks = listSubBlocksId.map((id:string)=> findBlock(page, id).BLOCK);
       // const alphabetArr = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 65));
        const numberArr = Array.from({length:9}, (v,i)=>i+1); 
        const subBlockIndex= listSubBlocksId.indexOf(subBlock.id) as number; 
        if(subBlockIndex === 0){
          listmarker="1";
        }else{
          const previousSubBlock = listSubBlocks[subBlockIndex -1] ;
          if(previousSubBlock.type==="numberList"){
            const slicedSubBlocks = listSubBlocks.slice(0, subBlockIndex); // 0~ previousblock 까지
            const filteredSubBlocks =slicedSubBlocks.filter((block:Block)=> block.type="numberList");
            listmarker  = numberArr[filteredSubBlocks.length].toString();
          }else{
            listmarker = "1"
          }
        }

      };
      return listmarker;
    };
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
          subBlocks[0]!==undefined &&
          subBlocks.map((block:Block)=>(
          <div className='listItem'>
          <div 
            className='mainBlock'
            key={`listItem_${subBlocks.indexOf(block)}`}
            onMouseOver={(event)=>onMouseOverToMoveBlock(event, block)}
            onMouseLeave={(event)=>onMouseLeaveToMoveBlock(event)}
          >
            <div className='mainBlock_block'>
            <div 
              id ={`block_${block.id}`}
              className= "blockContents"
              ref={blockContentsRef}
              style={listStyle(block)}
              >
              {block.type.includes("List")&&
              <div 
                className='listItem_marker'
              >
                {block.type.includes("number")? 
                `${getListMarker(block)}.`
                :
                <GoPrimitiveDot/> 
                }
              </div>
              }
              <BlockComponent 
                block={block} 
                page={page}
                pages={pages}
                pagesId={pagesId}
                addBlock={addBlock}
                editBlock={editBlock}
                changeToSub={changeToSub}
                raiseBlock={raiseBlock}
                deleteBlock={deleteBlock}
                command={command}
                setCommand={setCommand}
                setOpenComment={setOpenComment}
                setTargetPageId={setTargetPageId}
                setOpenLoader={setOpenLoader}
                setLoaderTargetBlock={setLoaderTargetBlock}
                closeMenu={closeMenu}
                templateHtml={templateHtml}
                setSelection={setSelection}
                openMobileMenu={openMobileMenu}
                setOpenMM={setOpenMM}
                setMobileMenuBlock={setMobileMenuBlock}
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
          {block.subBlocksId!==null &&
          <div className='subBlocks'>
            {block.subBlocksId.map((id:string)=> findBlock(page,id).BLOCK).map((sub:Block)=>
              <EditableBlock
              key ={block.subBlocksId?.indexOf(sub.id)} 
              pages={pages}
              pagesId={pagesId}
              page={page}
              block={sub}
              addBlock={addBlock}
              editBlock={editBlock}
              changeToSub={changeToSub}
              raiseBlock={raiseBlock}
              deleteBlock={deleteBlock}
              fontSize={fontSize}
              moveBlock={moveBlock}
              setMoveTargetBlock={setMoveTargetBlock}
              pointBlockToMoveBlock={pointBlockToMoveBlock}
              command={command}
              setCommand={setCommand}
              openComment={openComment}
              setOpenComment={setOpenComment}
              setCommentBlock={setCommentBlock}
              setTargetPageId={setTargetPageId}
              setOpenLoader={setOpenLoader}
              setLoaderTargetBlock={setLoaderTargetBlock}
              closeMenu={closeMenu}
              templateHtml={templateHtml}
              setSelection={setSelection}
              setOpenMM={setOpenMM}
              openMobileMenu={openMobileMenu}
              setMobileMenuBlock={setMobileMenuBlock}
              />
            )}
          </div>
          }
          </div>
        ))
        }
      </>
    )
  };
  return(
      <div 
        className="editableBlock"
      >
        <div className='editableBlockInner'>
          <div 
            id={`block_${block.id}`}
            className={className} 
            style={changeFontSizeBySmallText(block ,fontSize)}
          > 

            {block.type.includes("ListArry") ?
              <ListSub/>
            :
            <>
            <div 
              className="mainBlock"
              onMouseOver={(event)=>onMouseOverToMoveBlock(event, block)}
              onMouseLeave={onMouseLeaveToMoveBlock}
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
              >
                <BlockComponent
                pages={pages}
                pagesId={pagesId}
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
                setTargetPageId={setTargetPageId}
                setOpenComment={setOpenComment}
                setOpenLoader={setOpenLoader}
                setLoaderTargetBlock={setLoaderTargetBlock}
                closeMenu={closeMenu}
                templateHtml= {templateHtml}
                setSelection={setSelection}
                openMobileMenu={openMobileMenu}
                setOpenMM={setOpenMM}
                setMobileMenuBlock={setMobileMenuBlock}
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
            {subBlocks!==undefined&&
              subBlocks[0] !==undefined &&
              <div 
                className='subBlocks'
              >
                {subBlocks.map((subBlock :Block)=> 
                  <EditableBlock
                    key ={subBlocks.indexOf(subBlock)} 
                    pages={pages}
                    pagesId={pagesId}
                    page={page}
                    block={subBlock}
                    addBlock={addBlock}
                    editBlock={editBlock}
                    changeToSub={changeToSub}
                    raiseBlock={raiseBlock}
                    deleteBlock={deleteBlock}
                    fontSize={fontSize}
                    moveBlock={moveBlock}
                    setMoveTargetBlock={setMoveTargetBlock}
                    pointBlockToMoveBlock={pointBlockToMoveBlock}
                    command={command}
                    setCommand={setCommand}
                    openComment={openComment}
                    setOpenComment={setOpenComment}
                    setCommentBlock={setCommentBlock}
                    setTargetPageId={setTargetPageId}
                    setOpenLoader={setOpenLoader}
                    setLoaderTargetBlock={setLoaderTargetBlock}
                    closeMenu={closeMenu}
                    templateHtml={templateHtml}
                    setSelection={setSelection}
                    setOpenMM={setOpenMM}
                    openMobileMenu={openMobileMenu}
                    setMobileMenuBlock={setMobileMenuBlock}
                  />
                )
                }
              </div>
            }
            </>
            }
          </div>
        </div>

      </div>
  )
};

export default EditableBlock ;