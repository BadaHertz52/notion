import React, { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Block, blockSample, findBlock, Page } from '../modules/notion';
import EditableBlock from './EditableBlock';
import IconPoup, { randomIcon } from './IconPoup';
//icon
import { BiMessageDetail } from 'react-icons/bi';
import { BsFillEmojiSmileFill} from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';import { MdInsertPhoto } from 'react-icons/md';
import { HiTemplate } from 'react-icons/hi';
import CommandBlock from './CommandBlock';
import { defaultFontFamily } from './TopBar';


export type Command ={
  boolean:boolean,
  command:string | null,
  targetBlock: Block |null
};
type FrameProps ={
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
};

const Frame =({ page,firstBlocksId,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,setTargetPageId ,setOpenComment , setCommentBlock ,smallText , fullWidth}:FrameProps)=>{
  const [newPageFram, setNewPageFrame]=useState<boolean>(false);
  const [cover, setCover]=useState<ImageData|null>(page.header.cover);
  const [decoOpen ,setdecoOpen] =useState<boolean>(false);
  const [command, setCommand]=useState<Command>({boolean:false, 
  command:null,
  targetBlock:null
  });
  const [openIconPopup, setOpenIconPopup]=useState<boolean>(false);
  const [iconStyle, setIconStyle]=useState<CSSProperties|undefined>(undefined);
  const [commandBlockPositon, setCBPositon]=useState<CSSProperties>();
  const frameInnerStyle:CSSProperties={
    fontFamily:defaultFontFamily ,
    fontSize: smallText? "14px": "16px",
    width: fullWidth? "100%":'900px',
  };
  const headerStyle: CSSProperties ={
    marginTop: page.header.cover !==null? "10px": "30px" ,
    
  };
  const headerBottomStyle :CSSProperties ={
    marginTop: page.header.cover !==null ? "-39px" :"0",
    fontSize: smallText? "32px": "40px"
  };
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
      const currentTarget =event.currentTarget;
      const domeRect = currentTarget.getClientRects()[0];
      setIconStyle({
        position: "absolute",
        top: domeRect.bottom +10,
        left:domeRect.left ,
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
    }})
  };

  const addRandomIcon =()=>{
    const icon =randomIcon();
    const newPageWithIcon:Page ={
      ...page,
      header:{
        ...page.header,
        icon: icon
      }
    };
    editPage(page.id, newPageWithIcon);
  };

  useEffect(()=>{
    page.blocksId[0] ===undefined?
    setNewPageFrame(true):
    setNewPageFrame(false);
  },[page]);

  useEffect(()=>{
    if(command.targetBlock!==null){
      const targetBlockContent =document.getElementById(`${command.targetBlock.id}_contents`);
      const position = targetBlockContent?.getClientRects()[0];
      console.log("targetBlockContents", targetBlockContent, position);

      if(position !==undefined){
        const style :CSSProperties ={
          position:"absolute",
          top: position.bottom,
          left:position.left
        };
        setCBPositon(style);
      }
    }
  },[command.targetBlock])

  useEffect(()=>{
    console.log("fistblocksId", firstBlocksId)
  },[firstBlocksId]);

  useEffect(()=>{
    const h1Blocks= document.querySelectorAll(".h1.block");
    const h2Blocks=document.querySelectorAll(".h2.block");
    const h3Blocks=document.querySelectorAll(".h3.block");
    const baseSize = smallText? 14 :16; 
    const changeFontSizeBySmallText=(nodeList:NodeListOf<Element>, ratio:number)=>{
      nodeList[0]!==undefined&&
      nodeList.forEach((element:Element)=> element.setAttribute("style",`font-size: ${baseSize * ratio}px`));
    };
    changeFontSizeBySmallText(h1Blocks,3);
    changeFontSizeBySmallText(h2Blocks,2.5);
    changeFontSizeBySmallText(h3Blocks,2);
  },[smallText])
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
                {cover}
              </div>
            }
            <div className="pageHeader_notCover" style={headerBottomStyle}>
              { page.header.icon !==null &&
                <div 
                className='pageIcon'
                onClick={onClickPageIcon}
                >
                {page.header.iconType ==="string"?
                  page.header.icon
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
                    >
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
                    value={page.header.title}
                    onChange={onChangePageTitle}
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
          {openIconPopup &&
            <IconPoup 
              page={page}
              style={iconStyle}
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