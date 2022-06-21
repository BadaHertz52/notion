import React, { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Block, blockSample, listItem, Page } from '../modules/notion';
import EditableBlock from './EditableBlock';

//icon
import { BiMessageDetail } from 'react-icons/bi';
import { BsFillEmojiSmileFill} from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';import { MdInsertPhoto } from 'react-icons/md';
import BlockFn from './BlockFn';
import Comments, { ToolMore } from './Comments';
import { HiTemplate } from 'react-icons/hi';


type FrameProps ={
  userName : string,
  targetPage:Page,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, first: boolean, newParentBlock: Block) => void
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block) => void,
  addPage :(newPage:Page ,)=>void,
  editPage :(pageId:string,newPage:Page ,)=>void,
  deletePage :(pageId:string,)=>void,
  setTargetPageId:Dispatch<SetStateAction<string>>,
  commentBlock: Block | null,
  setCommentBlock :Dispatch<SetStateAction<Block|null>>,
};


const Frame =({ userName, targetPage, editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage, deletePage ,setTargetPageId ,commentBlock,setCommentBlock}:FrameProps)=>{
  const [page, setPage]=useState<Page>(targetPage);
  const [newPageFram, setNewPageFrame]=useState<boolean>(false);
  const [cover, setCover]=useState<ImageData|null>(page.header.cover);
  const [icon, setIcon]=useState<string|null>(page.header.icon);
  const [title, setTitle]=useState<string>(page.header.title);
  const [decoOpen ,setdecoOpen] =useState<boolean>(false);

  const headerStyle: CSSProperties ={
    marginTop: page.header.cover !==null? "10px": "30px" 
  };
  const headerBottomStyle :CSSProperties ={
    marginTop: page.header.cover !==null ? "-39px" :"0"
  };
  const firstBlocks:Block[] =page.blocks.filter((block:Block)=> block.firstBlock);
  const newPage :Page ={
    ...page,
    header:{
      ...page.header,
    },
    blocks:[blockSample],
    blocksId:[blockSample.id],
    firstBlocksId:[blockSample.id]
  };
  const onClickEmptyWithIcon =()=>{
    const icons :string[] =["😁","🌸","🍟","⚾","📣",'🎹','📷','✉️','🖍️','📝','⌛','⌚'];
    const index = Math.floor(Math.random() * (3));
    const newPageWithIcon:Page ={
      ...newPage,
      header:{
        ...newPage.header,
        icon: icons[index]
      }
    };
    editPage(page.id, newPageWithIcon);
    setIcon(icons[index]);
    setPage(newPageWithIcon);
  };
  const onClickEmpty =()=>{
    setPage(newPage);
    editPage(page.id ,newPage);
  };
  const onChangePageHeader =(event:React.ChangeEvent<HTMLInputElement>, what:"icon"|"title")=>{
    const value =event.target.value; 
    switch (what) {
      case "icon":
          setIcon(value);
        break;
      case "title":
        setTitle(value);
        break;
      default:
        break;
    };
    editPage(page.id,{
      ...page, 
      header:{
        ...page.header,
        icon: what==="icon" ?value : page.header.icon,
        title:what==="title"? value : page.header.title
    }})
  };

  useEffect(()=>{
    page.blocksId[0] ===undefined?
    setNewPageFrame(true):
    setNewPageFrame(false);
    
  },[page]);
  return(
    <div className={newPageFram? "newPageFrame frame" :'frame'}>
        <div className='frame_inner'>
          <div 
            className='pageHeader'
            style={headerStyle}
            onMouseMove={()=>{setdecoOpen(true)}}
            onMouseLeave={()=>setdecoOpen(false)}
          >
            {page.header.cover !== null &&        
              <div className='pageCover'>
                {cover}
              </div>
            }
            <div className="pageHeader_notCover" style={headerBottomStyle}>
              {page.header.icon !==null &&
                <div 
                className='pageIcon'
                
                >
                  <input 
                    type="text" 
                    value={icon!==null ? icon : ""}
                    onChange={(event)=>onChangePageHeader(event, "icon")}
                  />
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
                <input 
                    type="text" 
                    value={title}
                    onChange={(event)=>onChangePageHeader(event, "title")}
                  />
              </div>
              {!newPageFram ?
                page.header.comments!==null &&
              <div className='pageComment'>
                {/* {page.header.comments.map((comment:CommentType)=>
                <Comment 
                  key={`pageComment_${page.header.comments?.indexOf(comment)}`}
                  comment={comment} 
                  />
                )} */}
              </div>

              :
                <div className='pageComment'>
                  Press Enter to continue with an empty pagem or pick a templage
                </div>
            }
            </div>
          </div>
          
          <div className="pageContent">
            {!newPageFram?
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

            </div>
            :
            <div className='pageContent_inner'>
              <button
                onClick={onClickEmptyWithIcon}
              >
                <GrDocumentText/>
                <span>Empty with icon</span>
              </button>
              <button
                onClick={onClickEmpty}
              >
                <GrDocument/>
                <span>Empty</span>
              </button>
              <button>
                <HiTemplate/>
                <span>Templates</span>
              </button>
            </div>
            }
          </div>
          
        </div>
    </div>
  )
};
export default React.memo(Frame)