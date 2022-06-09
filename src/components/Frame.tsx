import React, { CSSProperties, Dispatch, SetStateAction, useState } from 'react';
import { Block, CommentType, listItem, Page } from '../modules/notion';
import EditableBlock from './EditableBlock';

//icon
import { BiMessageDetail } from 'react-icons/bi';
import { BsFillEmojiSmileFill} from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';
import { Side } from '../modules/side';
import { MdInsertPhoto } from 'react-icons/md';
import BlockFn from './BlockFn';
import Comments, { ToolMore } from './Comments';


type FrameProps ={
  pages:Page[],
  firstlist:listItem[],
  userName : string,
  page:Page,
  side:Side,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, nextBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage :(newPage:Page ,block:null)=>void;
  editPage :(pageId:string,newPage:Page ,block:null)=>void;
  deletePage :(pageId:string,block:null)=>void;
  setTargetPageId:Dispatch<SetStateAction<string>>
};


const Frame =({ pages, firstlist,userName, page,side,  editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage,editPage, deletePage ,setTargetPageId}:FrameProps)=>{
  const [decoOpen ,setdecoOpen] =useState<boolean>(true);
  const [commentBlock, setCommentBlock]=useState<Block|null>(null);
  const [moreOpen, setMoreOpen]= useState<boolean>(false);
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
                {page.header.comments==null &&
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
                  {page.header.comments==null &&
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
            
              {page.header.comments!==null &&
              <div className='pageComment'>
                {/* {page.header.comments.map((comment:CommentType)=>
                <Comment 
                  key={`pageComment_${page.header.comments?.indexOf(comment)}`}
                  comment={comment} 
                  />
                )} */}
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
                      userName={userName}
                      page={page}
                      block={block}
                      addBlock={addBlock}
                      editBlock={editBlock}
                      changeToSub={changeToSub}
                      raiseBlock={raiseBlock}
                      deleteBlock={deleteBlock}
                      addPage={addPage}
                      editPage={editPage}
                      deletePage={deletePage}
                      commentBlock={commentBlock}
                      setCommentBlock={setCommentBlock}
                      setTargetPageId={setTargetPageId}
                    />
                  )
                }
              )}
              <BlockFn
                page={page}
                pages={pages}
                firstlist={firstlist}
                userName={userName}
                addBlock={addBlock}
                editBlock={editBlock}
                deleteBlock={deleteBlock}
                addPage={addPage}
                editPage={editPage}
                deletePage={deletePage}
                commentBlock={commentBlock}
                setCommentBlock={setCommentBlock}
              />
              {commentBlock !==null &&
                  <Comments
                    userName={userName}
                    block={commentBlock}
                    pageId={page.id}
                    editBlock={editBlock}
                    setCommentBlock={setCommentBlock}
                    setMoreOpen={setMoreOpen}
                />              
              }
              {moreOpen &&
              <ToolMore
                pageId={page.id}
                block={commentBlock}
                editBlock={editBlock}
                setCommentBlock={setCommentBlock}
                setMoreOpen={setMoreOpen}
              />
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
};
export default React.memo(Frame)