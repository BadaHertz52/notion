import React, { CSSProperties, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Block, blockSample, findBlock, Page } from '../modules/notion';
import EditableBlock from './EditableBlock';

//icon
import { BiMessageDetail } from 'react-icons/bi';
import { BsFillEmojiSmileFill} from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';import { MdInsertPhoto } from 'react-icons/md';
import { HiTemplate } from 'react-icons/hi';
import CommandBlock from './CommandBlock';
import { defaultFontFamily } from './TopBar';
import IconPoup from './IconPoup';

export type Command ={
  boolean:boolean,
  command:string | null,
  targetBlock: Block |null
};
export type Emoji ={
  label:string,
  symbol:string 
}
type FrameProps ={
  targetPage:Page,
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

const Frame =({ targetPage,firstBlocksId,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,setTargetPageId ,setOpenComment , setCommentBlock ,smallText , fullWidth}:FrameProps)=>{
  const [page, setPage]=useState<Page>(targetPage);
  const [newPageFram, setNewPageFrame]=useState<boolean>(false);
  const [cover, setCover]=useState<ImageData|null>(page.header.cover);
  const [icon, setIcon]=useState<string|null>(page.header.icon);
  const [title, setTitle]=useState<string>(page.header.title);
  const [decoOpen ,setdecoOpen] =useState<boolean>(false);
  const [command, setCommand]=useState<Command>({boolean:false, 
  command:null,
  targetBlock:null
  });
  const [openIcon, setOpenIcon]=useState<boolean>(false);
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


  const emojis:Emoji[] =[
    {label:"smile face", symbol:"😁"},
    {label:"smile with heart  face", symbol:"🥰"},
    {label:"angry face", symbol:"😠"},
    {label:"crying face", symbol:"😭"},
    {label:"redheart", symbol:"❤️"},
    {label:"purpleheart", symbol:"💜"},
    {label:"ban", symbol:"🚫"},
    {label:"attention", symbol:"⚠️"},
    {label:"pencile", symbol:"📝"},
    {label:"clock", symbol:"⌚"},
    {label:"phone", symbol:"📱"},
    {label:"video game", symbol:"🎮"},
    {label:"computer", symbol:"🖥️"},
    {label:"player", symbol:"🙏"},
    {label:"party", symbol:"🎉"},
    {label:"present", symbol:"🎁"},
    {label:"movie", symbol:"🎞️"},
    {label:"coin", symbol:"🪙"},
    {label:"money", symbol:"💵"},
    {label:"card", symbol:"💳"},
    {label:"calendar", symbol:"🗓️"},
    {label:"folder", symbol:"📁"},
    {label:"ligh bulb", symbol:"💡"},
    {label:"broom", symbol:"🧹"},
    {label:"unicon", symbol:"🦄"},
    {label:"french fries", symbol:"🍟"},
    {label:"cup cake", symbol:"🧁"},
    {label:"apple", symbol:"🍎"},
    {label:"ariplane", symbol:"✈️"},
    {label:"car", symbol:"🚗"},
    {label:"bus", symbol:"🚌"},
    {label:"building", symbol:"🏢"},
    {label:"home", symbol:"🏠"},
    {label:"tent", symbol:"⛺"},
    {label:"star", symbol:"⭐"},
    {label:"sun", symbol:"☀️"},
    {label:"rainbow", symbol:"🌈"},
    {label:"rain", symbol:"🌧️"},
    {label:"snowman", symbol:"☃️"},
    {label:"cherry blossoms", symbol:"🌸"},
  ];
  const randomIcon =():string=>{
    const icons  = emojis.map((emoji:Emoji)=> emoji.symbol);
    const index = Math.floor(Math.random() * (3));
    return icons[index]
  };
  const addRandomIcon =()=>{
    const icon =randomIcon();
    const newPageWithIcon:Page ={
      ...newPage,
      header:{
        ...newPage.header,
        icon: icon
      }
    };
    editPage(page.id, newPageWithIcon);
    setIcon(icon);
    setPage(newPageWithIcon);
  };
  const onClickEmpty =()=>{
    setPage(newPage);
    editPage(page.id ,newPage);
  };
  const onClickPageIcon =(event:React.MouseEvent)=>{
    if(openIcon !==true){
      const currentTarget =event.currentTarget;
      const domeRect = currentTarget.getClientRects()[0];
      setIconStyle({
        position: "absolute",
        top: domeRect.bottom +10,
        left:domeRect.left ,
      })
      setOpenIcon(true);
    }else{
      setOpenIcon(false);
    }
  };
  const onChangePageTitle =(event:React.ChangeEvent<HTMLInputElement>)=>{
    const value =event.target.value; 
    setTitle(value);
    editPage(page.id,{
      ...page, 
      header:{
        ...page.header,
        title:value 
    }})
  };
  const changePageIcon =(icon:string)=>{
    setIcon(icon);
    editPage(page.id, {
      ...page,
      header :{
        ...page.header,
        icon: icon
      }
    });
    setOpenIcon(false);
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
              {page.header.icon !==null &&
                <div 
                className='pageIcon'
                onClick={onClickPageIcon}
                >
                  {icon}
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
                    value={title}
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
          {openIcon &&
            <IconPoup 
              page={page}
              style={iconStyle}
              emojis={emojis}
              changePageIcon={changePageIcon}
              randomIcon ={randomIcon}
              editPage={editPage}
            />
          }
          <div className="pageContent">
            {!newPageFram?
            <div 
              className='pageContent_inner'
              id="pageContent_inner"
              >
              {firstBlocksId!==null &&
                firstBlocksId.map((id:string)=> findBlock(targetPage,id).BLOCK)
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