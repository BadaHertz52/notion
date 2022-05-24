import React, { Dispatch, SetStateAction } from 'react';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { MdPlayArrow } from 'react-icons/md';
import styled, { css, CSSProperties, StyledComponent } from 'styled-components';
import { Block,BlockStyle,Page } from '../modules/notion';
import EditableBlock from './EditableBlock';

type BlockProp ={
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


const BlockComponent=({block,subBlocks, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock ,addPage, editPage, deletePage}:BlockProp)=>{
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
    return(
      <>
      {subBlocks?.map((block:Block)=>
        <li
          key={`${block.type}_${block.contents}`}
          id ={block.id}
          className= "blockContents"
          title={`${block.id}_contents`}
          style={blockContentsStyle(block)}
        >
          {block.contents}
        </li>
      )}
      </>
    )
  }
  return(
    <div 
      className={className} 
    > 

      {(block.type ==="numberList" || block.type=== "bulletList" ) ?
      <div className='mainBlock'>
        {block.type==="numberList" ? 
          <ol className="list">
            <ListSub/>
          </ol>
        :
          <ul className="list">
            <ListSub/>
          </ul>
        }
      </div>
      :
      <>
      <div 
        className='mainBlock'
      >
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
          placeholder="type '/' for commmands"
          title={`${block.id}_contents`}
          style={blockContentsStyle(block)}
        >
          {block.contents}
        </div>
      </div>
      <div 
        className='subBlocks'
      >
        {subBlocks?.map((subBlock :Block)=> 
          <EditableBlock
            key ={block.id}  
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
      </>
      }
    </div>
  )
};

export default React.memo (BlockComponent);
