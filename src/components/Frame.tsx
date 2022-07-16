import React, { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Block, BlockCommentType, blockSample,  findBlock, Page } from '../modules/notion';
import EditableBlock from './EditableBlock';
import IconPoup, { randomIcon } from './IconPoup';
import CommandBlock from './CommandBlock';
import { defaultFontFamily } from './TopBar';
import Comments, { CommentInput } from './Comments';
import basicPageCover from '../assests/img/artificial-turf-g6e884a1d4_1920.jpg';
//icon
import { BiMessageDetail } from 'react-icons/bi';
import { BsFillEmojiSmileFill} from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';
import { MdInsertPhoto } from 'react-icons/md';
import { HiTemplate } from 'react-icons/hi';
import { detectRange } from './BlockFn';



export type Command ={
  boolean:boolean,
  command:string | null,
  targetBlock: Block |null
};
type FrameProps ={
  userName:string,
  page:Page,
  firstBlocksId:string[]|null,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeBlockToPage: (currentPageId: string, block: Block) => void,
  changePageToBlock:(currentPageId: string, block: Block) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  addPage :(newPage:Page ,)=>void,
  editPage :(pageId:string,newPage:Page ,)=>void,
  setTargetPageId: React.Dispatch<React.SetStateAction<string>>,
  setOpenComment: Dispatch<SetStateAction<boolean>>,
  setCommentBlock: Dispatch<SetStateAction<Block | null>>,
  smallText: boolean, 
  fullWidth: boolean, 
  discardEdit:boolean,
};

const Frame =({ userName,page,firstBlocksId,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,setTargetPageId ,setOpenComment , setCommentBlock ,smallText , fullWidth  ,discardEdit}:FrameProps)=>{
  const innerWidth =window.innerWidth; 
  const inner =document.getElementById("inner");
  const editTime =JSON.stringify(Date.now());
  const [newPageFram, setNewPageFrame]=useState<boolean>(false);
  const [decoOpen ,setdecoOpen] =useState<boolean>(false);
  const [command, setCommand]=useState<Command>({boolean:false, 
  command:null,
  targetBlock:null
  });
  const [openIconPopup, setOpenIconPopup]=useState<boolean>(false);
  const [openPageCommentInput, setOpenPageCommentInput]=useState<boolean>(false);
  const [iconStyle, setIconStyle]=useState<CSSProperties|undefined>(undefined);
  const [commandBlockPositon, setCBPositon]=useState<CSSProperties>();
  const frameInnerStyle:CSSProperties={
    fontFamily:defaultFontFamily ,
    fontSize: smallText? "14px": "16px",
    width: innerWidth >900?  fullWidth? "100%":'900px' : "100%",
  };
  const headerStyle: CSSProperties ={
    marginTop: page.header.cover !==null? "10px": "30px" ,
    
  };
  const headerBottomStyle :CSSProperties ={
    fontSize: smallText? "32px": "40px"
  };
  const pageIconStyle :CSSProperties={
    width: page.header.iconType=== "img"? 124 : 78,
    height: page.header.iconType=== "img"? 124 : 78,
    marginTop: page.header.cover ==null? 0 : (
      page.header.iconType==="img"?
      -62:
      -39
    )
  }
  const newPage :Page ={
    ...page,
    header:{
      ...page.header,
    },
    blocks:[blockSample],
    blocksId:[blockSample.id],
    firstBlocksId:[blockSample.id]
  };



  const onClickEmpty =()=>{
    editPage(page.id ,newPage);
  };
  const onClickPageIcon =(event:React.MouseEvent)=>{
    if(openIconPopup !==true){
      const frame =document.getElementsByClassName("frame")[0];
      const frameDomRect =frame.getClientRects()[0];
      const currentTarget =event.currentTarget;
      const domeRect = currentTarget.getClientRects()[0];
      setIconStyle({
        position: "absolute",
        top: domeRect.bottom + 24,
        left:domeRect.left - frameDomRect.left ,
      })
      setOpenIconPopup(true);
    }else{
      setOpenIconPopup(false);
    }
  };
  const onChangePageTitle =(event:React.ChangeEvent<HTMLInputElement>)=>{
    const value =event.target.value; 
    editPage(page.id,{
      ...page, 
      header:{
        ...page.header,
        title:value 
    },
    editTime:editTime
  })
  };

  const addRandomIcon =()=>{
    const icon =randomIcon();
    const newPageWithIcon:Page ={
      ...page,
      header:{
        ...page.header,
        icon: icon ,
        iconType:"string"
      },
      editTime:editTime
    };
    editPage(page.id, newPageWithIcon);
  };

  const onClickAddCover =()=>{
    const editedPage:Page={
      ...page,
      header:{
        ...page.header,
        cover:basicPageCover
      },
      editTime:editTime
    };
    editPage(page.id, editedPage)
  };
  inner?.addEventListener("click",(event)=>{
    
    if(command.boolean){
      const block_commandBlock =document.getElementById("block_commandBlock");
      const commandDomRect =block_commandBlock?.getClientRects()[0];
      if(commandDomRect !==undefined){
        const isInnnerCommand = detectRange(event,commandDomRect); 
        !isInnnerCommand && setCommand({
          boolean:false,
          command:null,
          targetBlock:null
        }) 
      }
    }
  })
  useEffect(()=>{
    page.blocksId[0] ===undefined?
    setNewPageFrame(true):
    setNewPageFrame(false);
  },[page]);

  useEffect(()=>{
    if(command.targetBlock!==null){
      const frame = document.getElementsByClassName("frame")[0];
      const targetBlockContent =document.getElementById(`block_${command.targetBlock.id}`);
      const frameDomRect= frame.getClientRects()[0];
      const position = targetBlockContent?.getClientRects()[0];
      if(position !==undefined){
        const heading =["h1", "h2" , "h3"]; 
        const plus = !heading.includes(command.targetBlock.type) ? 24 : 0 
        const style :CSSProperties ={
          position:"absolute",
          top: position.bottom -frameDomRect.top + position.height + plus ,
          left:position.left
        };
        setCBPositon(style);
      }
    }
  },[command.targetBlock])

  return(
    <div className={newPageFram? "newPageFrame frame" :'frame'}>
        <div 
          className='frame_inner'
          style={frameInnerStyle}
        >
          <div 
            className='pageHeader'
            style={headerStyle}
            onMouseMove={()=>{setdecoOpen(true)}}
            onMouseLeave={()=>setdecoOpen(false)}
          >
            {page.header.cover !== null &&        
              <div className='pageCover'>
                <img src={page.header.cover} alt="page cover " />
              </div>
            }
            <div className="pageHeader_notCover" style={headerBottomStyle}>
              { page.header.icon !==null &&
                <div 
                className='pageIcon'
                onClick={onClickPageIcon}
                style={pageIconStyle}
                >
                {page.header.iconType ==="string"?
                <div className='pageStringIcon'>
                  {page.header.icon}
                </div >
                :
                  <img
                    className='pageImgIcon'
                    alt="pageImgIcon"
                    src={page.header.icon}
                  />
                }
                </div>
              }
              {decoOpen &&
                <div className='deco'>
                  {page.header.icon ==null &&
                    <button 
                      className='decoIcon'
                      onClick={addRandomIcon}
                    >
                      <BsFillEmojiSmileFill/>
                      <span>Add Icon</span>
                    </button>
                  }
                  {page.header.cover == null&&        
                    <button 
                      className='decoCover'
                      onClick={onClickAddCover}
                    >
                      <MdInsertPhoto/>
                      <span>Add Cover</span>
                    </button>
                  }
                  {page.header.comments==null &&
                  <button 
                    className='decoComment'
                    onClick={()=>setOpenPageCommentInput(true)}
                  >
                    <BiMessageDetail/>
                    <span>Add Comment</span>
                  </button>
                  }
              </div>
              }
              <div 
                className='pageTitle'
              >
                <input 
                    type="text" 
                    value={page.header.title}
                    onChange={onChangePageTitle}
                  />
              </div>
              {!newPageFram ? 
              <div 
                className='pageComment'
                style={frameInnerStyle}
              >
                {page.header.comments!==null ?
                  page.header.comments.map((comment:BlockCommentType)=>
                <Comments 
                  key={`pageComment_${comment.id}`}
                  block={null}
                  page={page}
                  pageId={page.id}
                  userName={userName}
                  editBlock={editBlock}
                  editPage={editPage}
                  discardEdit={discardEdit}
                  select={null}
                  />
                  )
                :
                  openPageCommentInput &&
                  <CommentInput
                    page={page}
                    pageId={page.id}
                    userName={userName}
                    blockComment={null}
                    subComment={null}
                    editBlock={editBlock}
                    editPage={editPage}
                    commentBlock={null}
                    setCommentBlock={null}
                    setPageComments ={null}
                    setPopup={null}
                    addOrEdit={"add"}
                    setEdit={setOpenPageCommentInput}
                  />
              }
              </div>

              :
                <div 
                  className='pageComment'
                  style={frameInnerStyle}
                >
                  Press Enter to continue with an empty page or pick a templage
                </div>
            }
            </div>
          </div>
          {openIconPopup &&
            <IconPoup 
              currentPageId={page.id}
              block={null}
              page={page}
              style={iconStyle}
              editBlock={editBlock}
              editPage={editPage}
              setOpenIconPopup={setOpenIconPopup}
            />
          }
          <div className="pageContent">
            {!newPageFram?
            <div 
              className='pageContent_inner'
              id="pageContent_inner"
              >
              {firstBlocksId!==null &&
                firstBlocksId.map((id:string)=> findBlock(page,id).BLOCK)
                .map((block:Block)=>{
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
                      smallText={smallText}
                      command={command}
                      setCommand={setCommand}
                      setTargetPageId={setTargetPageId}
                      setOpenComment={setOpenComment}
                      setCommentBlock={setCommentBlock}
                    />
                  )
                }
              )
              }
            </div>
            :
            <div className='pageContent_inner'>
              <button
                onClick={addRandomIcon}
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
        {command.command !==null && command.targetBlock !==null &&
              <div 
                id="block_commandBlock"
                style={commandBlockPositon}
              >
                  <CommandBlock 
                  key={`${command.targetBlock.id}_command`}
                  page={page}
                  block={command.targetBlock}
                  editTime={JSON.stringify(Date.now())}
                  editBlock={editBlock}
                  changeBlockToPage={changeBlockToPage}
                  changePageToBlock={changePageToBlock}
                  command={command}
                  setCommand={setCommand}
                  addPage={addPage}
                />
              </div>
              }
    </div>
  )
};
export default React.memo(Frame)