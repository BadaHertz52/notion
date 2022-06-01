import React from 'react';
import { GoPrimitiveDot } from 'react-icons/go';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { IoChatboxOutline } from 'react-icons/io5';
import { MdPlayArrow } from 'react-icons/md';
import {  CSSProperties} from 'styled-components';
import { Block,Page } from '../modules/notion';
import EditableBlock from './EditableBlock';
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
  commentOpen: boolean,
};


const BlockComponent=({ userName,block,subBlocks, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock ,addPage, editPage, deletePage, commentOpen}:BlockProp)=>{
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
      <div className='list mainBlock_block'>
        {subBlocks?.map((block:Block)=>(
          <div 
            key={`listItem_${subBlocks.indexOf(block)}`}
            id ={block.id}
            className= "blockContents"
            title={`${block.id}_contents`}
            style={listStyle(block)}
            >

            {block.comments==null? 
            <>
              <div 
                className='list_marker'
              >
                {className.includes("number")? 
                `${subBlocks.indexOf(block)+1}.`
                :
                <GoPrimitiveDot/> 
                }
              </div>
              <div 
                className="contents"
                placeholder="type '/' for commmands"
                style={blockContentsStyle(block)}
              >
                {block.contents}
              </div>
            </>
            :
            <button 
              className="contents commentBtn"
              placeholder="type '/' for commmands"
            >
              {block.contents}
            </button>
          }

          </div>
        ))}
      </div>
    )
  }

  return(
    <div 
      className={className} 
    > 

      {(block.type ==="numberList" || block.type=== "bulletList" ) ?
      <div className='mainBlock'>
        <ListSub/>
      </div>
      :
      <>
      <div 
        className={commentOpen? "mainBlock commentOpen" : "mainBlock"}
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
          {block.comments==null? 
            <div 
              className="contents"
              placeholder="type '/' for commmands"
            >
            {block.contents}
            </div>
          :
          <button 
            className="contents commentBtn"
            placeholder="type '/' for commmands"
          >
            {block.contents}
          </button>
          }

        </div>
        </div>
        {block.comments !==null &&
          <>
          {commentOpen ?
              <Comments
                userName={userName}
                block={block}
                pageId={page.id}
                editBlock={editBlock}
              />
            :
            <button className='commentBtn btnIcon'>
              <IoChatboxOutline/>
              <span className="commentLength">
                {block.comments.length}
              </span>
            </button>
            }
          </>
        }

      </div>
      </>
      }
      <div 
        className='subBlocks'
      >
        {subBlocks?.map((subBlock :Block)=> 
          <EditableBlock
            key ={block.id} 
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
