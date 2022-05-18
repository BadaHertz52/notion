import React, { CSSProperties, useState } from 'react';
import { Block, blockSample, Page } from '../modules/notion';
import EditableBlock from './EditableBlock';

//icon
import { BiMessageDetail } from 'react-icons/bi';
import { BsFillEmojiSmileFill} from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';
import { Side } from '../modules/side';
import { MdInsertPhoto } from 'react-icons/md';
import BlockFn from './BlockFn';


type FrameProps ={
  userName : string,
  page:Page,
  side:Side,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void
};


const Frame =({ userName, page,side,  editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock }:FrameProps)=>{
  type CommentProp ={
    comment :string | null
  };

  const Comment =({comment}:CommentProp) =>{
    const firstLetter = userName.substring(0,1).toUpperCase();
    return (
      <div className='comment'>
        <div className='firstLetter'>
          <span>{firstLetter}</span>
        </div>
        <div className='commentContent'>
          {comment !==null ?
            <span>{comment}</span>
          :
            <input
            type="text"
            id="text"
            name ="text"
            placeholder='Add a comment'
          />
          }
          
        </div>
      </div>
    )
  };

  const [decoOpen ,setdecoOpen] =useState<boolean>(true);

  const headerStyle: CSSProperties ={
    marginTop: page.header.cover !==null? "10px": "30px" 
  };
  const headerBottomStyle :CSSProperties ={
    marginTop: page.header.cover !==null ? "-39px" :"0"
  };
  const firstBlocks:Block[] =page.blocks.filter((block:Block)=> block.firstBlock);

  return(
    <div className='frame'>
      {side.newPage ?
        <div className='newPageFrame frame_inner'>
          <div 
          className='pageHeader'
          style={headerStyle}
          onMouseMove={()=>{setdecoOpen(true)}}
          onMouseOut={()=>{setdecoOpen(false)}}
          >
            {decoOpen &&
              <div className='deco'>
                {page.header.icon ==null &&
                  <button className='decoIcon'>
                    <BsFillEmojiSmileFill/>
                    <span>Add Icon</span>
                  </button>
                }
                {page.header.cover == null&&        
                  <button className='decoCover'>
                    <MdInsertPhoto/>
                    <span>Add Cover</span>
                  </button>
                }
                {page.header.comment ==null &&
                <button className='decoComment'>
                  <BiMessageDetail/>
                  <span>Add Commnet</span>
                </button>
                }
            </div>
            }
            <div className='pageTitle'>
              Untitled
            </div>
            <div className='pageComment'>
              Press Enter to continue with an empty pagem or pick a templage
            </div>
          
          </div>
          <div className="pageContent">
            <div className='pageContent_inner'>
              <button>
                <GrDocumentText/>
                <span>Empty with icon</span>
              </button>
              <button>
                <GrDocument/>
                <span>Empty</span>
              </button>
              <button>
                <span>Templates</span>
              </button>
            </div>
          </div>
        </div>
      :
        <div className='frame_inner'>
          <div 
            className='pageHeader'
            style={headerStyle}
            onMouseMove={()=>{setdecoOpen(true)}}
            //onMouseOut={()=>{setdecoOpen(false)}}
          >
            <div >
              {page.header.cover !== null &&        
                <div className='pageCover'>
                  {page.header.cover}
                </div>
              }
            </div>
            <div style={headerBottomStyle}>
              {page.header.icon !==null &&
                <div 
                className='pageIcon'
                
                >
                  {page.header.icon}
                </div>
              }
              {decoOpen &&
                <div className='deco'>
                  {page.header.icon ==null &&
                    <button className='decoIcon'>
                      <BsFillEmojiSmileFill/>
                      <span>Add Icon</span>
                    </button>
                  }
                  {page.header.cover == null&&        
                    <button className='decoCover'>
                      <MdInsertPhoto/>
                      <span>Add Cover</span>
                    </button>
                  }
                  {page.header.comment ==null &&
                  <button className='decoComment'>
                    <BiMessageDetail/>
                    <span>Add Commnet</span>
                  </button>
                  }
              </div>
              }
              <div 
                className='pageTitle'
              >
                {page.header.title}
              </div>
            
              {page.header.comment !==null &&
              <div className='pageComment'>
                <Comment comment ={page.header.comment} />
                
              </div>
              }
            </div>
          </div>
          <div className="pageContent">
            <div 
              className='pageContent_inner'
              id="pageContent_inner"
              >
              {firstBlocks.map((block:Block)=>{
                  return (
                    <EditableBlock
                      key={block.id}
                      page={page}
                      block={block}
                      addBlock={addBlock}
                      editBlock={editBlock}
                      changeToSub={changeToSub}
                      raiseBlock={raiseBlock}
                      deleteBlock={deleteBlock}
                    />
                  )
                }
              )}
              <BlockFn
                page={page}
                userName={userName}
                addBlock={addBlock}
                editBlock={editBlock}
              />
            </div>
          </div>
        </div>
      }
    </div>
  )
};
export default React.memo(Frame)