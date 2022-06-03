import React, { Dispatch, SetStateAction } from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { IoChatboxOutline } from 'react-icons/io5';
import { MdPlayArrow } from 'react-icons/md';
import {  CSSProperties} from 'styled-components';
import { Block,Page } from '../modules/notion';
import EditableBlock, { CommentOpenType } from './EditableBlock';
import Comments from './Comments';

type BlockProp ={
  userName:string,
  block:Block,
  subBlocks :Block[]|null,
  page:Page,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage : (pageId:string , newPage:Page, block:null)=>void,
  editPage : (pageId:string , newPage:Page, block:null)=>void,
  deletePage : (pageId:string , block:null)=>void,
};
type BlockCommentProps ={
  block:Block,
  userName:string,
  pageId:string,
  editBlock: (pageId: string, block: Block) => void,
}
const BlockComment =({block, pageId, userName, editBlock,}:BlockCommentProps)=>{
  return (
      <div 
        id={`${block.id}_comments`}
        className="blockId_comments"
        >
          <Comments
            userName={userName}
            block={block}
            pageId={pageId}
            editBlock={editBlock}
          />
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
const BlockContent =({block}:{block:Block})=>{
  return(
    <>
    {block.comments ==null ?
    <div 
      className="contents"
      placeholder="type '/' for commmands"
    >
      {block.contents}
    </div>
    :
    <button 
      className="contents commentBtn"
      name={block.id}
      placeholder="type '/' for commmands"
    >
      {block.contents}
    </button>
    }
  </>
  )
}
const BlockComponent=({ userName,block,subBlocks, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock ,addPage, editPage, deletePage,}:BlockProp)=>{
  const className = block.type !== "toggle" ?
                    `${block.type} block ` :
                    `${block.type} block ${block.subBlocksId!==null?'on' : ""}`;

  const blockContentsStyle =(block:Block):CSSProperties =>{
    return ({
      color: block.style.color,
      backgroundColor :block.style.bgColor,
      fontWeight: block.style.fontWeight ,
      fontStyle: block.style.fontStyle,
      textDecoration: block.style.textDeco,
    })
  };
  const ListSub = ()=>{
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
        {subBlocks?.map((block:Block)=>(
          <div 
            className='list mainBlock'
            key={`listItem_${subBlocks.indexOf(block)}`}
          >
            <div className='mainBlock_block'>
            <div 
              id ={block.id}
              className= "blockContents"
              title={`${block.id}_contents`}
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
              />
            </div>
            </div>
          {block.comments !==null &&
            <BlockComment
            block={block}
            pageId={page.id}
            userName={userName}
            editBlock={editBlock}
            />
          }
          </div>
        ))
        }
      </>
    )
  }

  return(
    <div 
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
            className='checkbox left blockBtn'
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
          title={`${block.id}_contents`}
          style={blockContentsStyle(block)}
        >
        <BlockContent
          block={block}
        />
        </div>
        </div>
        {block.comments !==null &&
        <BlockComment
          block={block}
          pageId={page.id}
          userName={userName}
          editBlock={editBlock}
        />
        }
      </div>
      </>
      }
      <div 
        className='subBlocks'
      >
        {subBlocks?.map((subBlock :Block)=> 
          <EditableBlock
            key ={subBlock.id} 
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
          />
        )
        }
      </div>

    </div>
  )
};

export default React.memo (BlockComponent);
