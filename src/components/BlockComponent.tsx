import React, { CSSProperties,useState} from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { GrCheckbox, GrCheckboxSelected, GrDocumentText } from 'react-icons/gr';
import { MdPlayArrow } from 'react-icons/md';
//icon
import { Block,Page } from '../modules/notion';
import EditableBlock from './EditableBlock';


import Menu from './Menu';
type BlockFnProp ={
  block:Block
};

const BlockFn =({block}:BlockFnProp)=>{
  
  const showMenu =()=>{

  };
  
  const makeNewBlock =()=>{

  };

  return (
    <div 
    className='blockFn'
    >
      <button 
        className='addBlock'
        onClick={makeNewBlock}
        title="Click  to add a block below"
      >
        <AiOutlinePlus/>
      </button>
      <button 
        className='menuBtn'
        onClick={showMenu}
        title ="Click to open menu"
      >
        <CgMenuGridO/>
        <Menu 
        block={block} 
        />
      </button>
  </div>
  )
}
type BlockProp ={
  block:Block,
  subBlocks :Block[]|null,
  page:Page,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void
};


const BlockComponent=({block,subBlocks, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock}:BlockProp)=>{
  const className =`${block.type} block`;
  const [toggle, setToggle] =useState<boolean>(false);
  const toggleStyle:CSSProperties={
    transform: toggle? "rotate(90deg)" : "rotate(0deg)" 
  };
  const [blockFn , setBlockFn ] =useState<boolean>(false);

  const ListSub = ()=>{
    return(
      <>
      {subBlocks?.map((block:Block)=>
        <li 
        key={`${block.type}_${block.contents}`}
        id ={block.id}
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
      onMouseEnter ={()=>setBlockFn(true)}
      onMouseLeave={()=>setBlockFn(false)}
    > 
      {blockFn &&
        <BlockFn  
          block={block}
        />
      }
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
          <button className='checkbox left'>
            <GrCheckbox />
          </button>
        }
        {block.type ==="todo done" &&
          <button className='checkbox left'>
            <GrCheckboxSelected />
          </button>
        }
        {block.type ==="toggle" &&
          <button 
            className='blockToggleBtn left' 
          >
            <MdPlayArrow/>
          </button>
        }
        {block.type ==="page" &&
          <div className='pageIcon left'>
          {block.icon == null?
            < GrDocumentText/>
          :
            block.icon
          }
          </div>
        }
        <div 
          className='blockContents' 
          placeholder="type '/' for commmands">
          {block.contents}
        </div>
      </div>
      {((block.type==="toggle" && toggle)
        ||block.type !=="toggle"
        ) && 
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
            />
          )
          }
        </div>
      }
      </>
      }
    </div>
  )
};

export default React.memo (BlockComponent);
