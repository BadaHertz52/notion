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

export type Command ={
  boolean:boolean,
  command:string | null,
  targetBlock: Block |null
};

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
  setOpenComment: Dispatch<SetStateAction<boolean>>,
  setCommentBlock: Dispatch<SetStateAction<Block | null>>,
  smallText: boolean, 
};

const Frame =({ targetPage,firstBlocksId,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,setOpenComment , setCommentBlock ,smallText}:FrameProps)=>{
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
  const [commandBlockPositon, setCBPositon]=useState<CSSProperties>();
  const frameInnerStyle:CSSProperties={
    fontFamily:defaultFontFamily ,
    fontSize: smallText? "14px": "16px",
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