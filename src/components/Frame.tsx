import '../assests/frame.css';
import React, { CSSProperties, Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from 'react';
import { Block, BlockCommentType, blockSample,  findBlock, listItem, makeNewBlock, Page } from '../modules/notion';
import EditableBlock from './EditableBlock';
import IconPoup, { randomIcon } from './IconPoup';
import CommandBlock from './CommandBlock';
import { defaultFontFamily } from './TopBar';
import Comments, { CommentInput } from './Comments';

//icon
import { BiMessageDetail } from 'react-icons/bi';
import { BsFillEmojiSmileFill} from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';
import { MdInsertPhoto } from 'react-icons/md';
import { HiTemplate } from 'react-icons/hi';
import BlockFn, { detectRange } from './BlockFn';
import Loader from './Loader';
import PageIcon from './PageIcon';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import PageMenu from './PageMenu';
import { PopupType } from '../containers/EditorContainer';



export type Command ={
  boolean:boolean,
  command:string | null,
  targetBlock: Block |null
};
type FrameProps ={
  userName:string,
  page:Page,
  pages:Page[],
  pagesId:string[],
  firstlist:listItem[],
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
  duplicatePage:(targetPageId: string) => void,
  movePageToPage:(targetPageId: string, destinationPageId: string) => void,
  deletePage: (pageId: string) => void,
  commentBlock: Block | null,
  openComment :boolean, 
  setTargetPageId: React.Dispatch<React.SetStateAction<string>>,
  setOpenComment: Dispatch<SetStateAction<boolean>>,
  setCommentBlock: Dispatch<SetStateAction<Block | null>>,
  smallText: boolean, 
  fullWidth: boolean, 
  discardEdit:boolean,
};
const basicPageCover ='https://raw.githubusercontent.com/BadaHertz52/notion/master/src/assests/img/artificial-turf-g6e884a1d4_1920.jpg';;

const Frame =({ userName,page,firstBlocksId, pagesId, pages, firstlist,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,duplicatePage,movePageToPage,deletePage,commentBlock,openComment ,setTargetPageId ,setOpenComment , setCommentBlock ,smallText , fullWidth  ,discardEdit}:FrameProps)=>{
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
  const [openLoader, setOpenLoader]=useState<boolean>(false);
  const [loaderTargetBlock, setLoaderTargetBlock]=useState<Block|null>(null);
  const [iconStyle, setIconStyle]=useState<CSSProperties|undefined>(undefined);
  const [commandBlockPositon, setCBPositon]=useState<CSSProperties>();

  const [commentsStyle, setCommentsStyle]= useState<CSSProperties>();
  const [menuOpen, setMenuOpen]= useState<boolean>(false);
  const [commandTargetBlock, setCommandTargetBlock]=useState<Block|null>(null);
  const [popup, setPopup]=useState<PopupType>({
    popup:false,
    what:null
  });
  const [popupStyle, setPopupStyle]=useState<CSSProperties |undefined>(undefined); 

  const closePopup=(event: MouseEvent)=>{
    if(popup.popup){
      const popupMenu =document.getElementById("popupMenu");
      const popupMenuDomRect= popupMenu?.getClientRects()[0];
      const isInPopupMenu =detectRange(event, popupMenuDomRect);
      !isInPopupMenu && setPopup({
        popup:false,
        what:null
      });
    };
    if(openComment){
      const commentsDoc= document.getElementById("block_comments") ;
      if(commentsDoc !==null){
        const commentsDocDomRect= commentsDoc.getClientRects()[0];
        const isInComments =detectRange(event, commentsDocDomRect);
        if(!isInComments){
          setCommentBlock(null);
          setOpenComment(false); 
        }
      }
    }
  };
  inner?.addEventListener("click",(event)=>closePopup(event));

  const maxWidth = innerWidth -60
  const frameInnerStyle:CSSProperties={
    fontFamily:defaultFontFamily ,
    fontSize: smallText? "14px": "16px",
    width: fullWidth?  `${maxWidth}px`: ( innerWidth>900?  '900px' : "75%") ,
  };
  const headerStyle: CSSProperties ={
    marginTop: page.header.cover !==null? "10px": "30px" ,
    
  };
  const headerBottomStyle :CSSProperties ={
    fontSize:smallText? (innerWidth >= 768 ? "32px" : "24px"): ( innerWidth >= 768?  "40px" : "32px" )
  };
  const size = page.header.iconType=== null? (innerWidth>= 768? 72 : 48) :( innerWidth>= 768? 124: 72);
  const pageIconStyle :CSSProperties={
    width: size,
    height: size,
    marginTop: page.header.cover ==null? 0 : (
      page.header.iconType===null?
        (innerWidth >= 768?
      -39  : - 16):
      (innerWidth >= 768?  -62 : -16)
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

  function changeCommentStyle(){
    if(commentBlock !==null){
      const blockDoc = document.getElementById(`block_${commentBlock.id}`);
      const editor =document.getElementsByClassName("editor")[0] as HTMLElement;
      const editableBlock =document.getElementsByClassName("editableBlock")[0];
      const editableBlockDomRect= editableBlock.getClientRects()[0];
      const position =blockDoc?.getClientRects()[0]
      if(position !== undefined &&  editableBlock){
        const editorDomRect =editor.getClientRects()[0];
        const padding = window.getComputedStyle(editableBlock,null).getPropertyValue("padding-right");
        const pxIndex =padding.indexOf("px");
        const paddingValue =Number(padding.slice(0,pxIndex));
        const innerWidth =window.innerWidth;
        const style :CSSProperties ={
          position:"absolute",
          top: position.bottom +editor.scrollTop,
          left: innerWidth >=425? editableBlockDomRect.x - editorDomRect.x : innerWidth * 0.1 ,
          width:innerWidth>=425? editableBlock.clientWidth - paddingValue : innerWidth*0.8
        };
        setCommentsStyle(style);
      } 
    }
  };


  const onClickEmpty =()=>{
    editPage(page.id ,newPage);
  };
  const onClickPageIcon =(event:React.MouseEvent)=>{
    if(openIconPopup !==true){
      const frame =document.getElementsByClassName("frame")[0];
      const frameDomRect =frame.getClientRects()[0];
      const currentTarget =event.currentTarget ;
      if(currentTarget.firstElementChild!==null){
        const domeRect = currentTarget.firstElementChild.getClientRects()[0];
        setIconStyle({
          position: "absolute",
          top: domeRect.bottom + 24,
          left:domeRect.left - frameDomRect.left ,
        })
        setOpenIconPopup(true);
      }else{
        console.log("Can't find currentTarget")
      }

    }else{
      setOpenIconPopup(false);
    }
  };
  const onChangePageTitle =(event:ContentEditableEvent)=>{
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
        iconType:"emoji"
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
  const pageContent = document.querySelector(".pageContent") as HTMLElement|null;

  pageContent?.addEventListener("click", (event:MouseEvent)=>{onClickPageContentBottom(event)});

  const onClickPageContentBottom =(event:MouseEvent)=>{
    const clientX = event.clientX;
    const clientY = event.clientY;

    if(pageContent !== null){
      const pageContentDomRect =pageContent.getClientRects()[0];
      const pageContentPadding = getComputedStyle(pageContent, null).getPropertyValue("padding-bottom");
      const padding = Number(pageContentPadding.slice(0, pageContentPadding.indexOf(
        "px")));

      const conditionX = (clientX >= pageContentDomRect.x)&& (clientX <= pageContentDomRect.right); 

      const conditionY = (clientY >= (pageContentDomRect.bottom - padding)) && (clientY <= pageContentDomRect.bottom );
  
      const isInner =conditionX && conditionY;
      if(isInner){
        if(page.firstBlocksId){
          const lastBlockId = page.firstBlocksId[page.firstBlocksId.length -1];
          const lastBlockIndex = page.blocksId.indexOf(lastBlockId);
          const lastBlock =page.blocks[lastBlockIndex];
          const newBlock  =makeNewBlock(page, lastBlock ,""); 
          addBlock(page.id, newBlock, page.blocks.length-1, null);
        }else{
          const newBlock = makeNewBlock(page, null,"");
          addBlock(page.id, newBlock,0,null);
        }
  
      }
    } 

  }
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
  },[command.targetBlock]);

  useEffect(()=>{
    changeCommentStyle();
  },[commentBlock]);

  useEffect(()=>{
    if(commandTargetBlock!==null){
      const editor= document.getElementsByClassName("editor")[0];
      const editorDomRect= editor.getClientRects()[0];
      const blockDom = document.getElementById(`block_${commandTargetBlock.id}`);
      const blockDomRect =blockDom?.getClientRects()[0];
      if(blockDomRect!==undefined){
        const style:CSSProperties ={
          position:"absolute",
          top : blockDomRect.bottom + blockDomRect.height + editor.scrollTop,
          left :blockDomRect.left -editorDomRect.left
        };
        setPopupStyle(style);
      };
    }
  },[commandTargetBlock]);
  
  window.onresize =changeCommentStyle;


  return(
    <div 
      className={newPageFram? "newPageFrame frame" :'frame'}
    >
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
            <div className="pageHeader_notCover" style={headerBottomStyle}
            >
              <div
                onClick={onClickPageIcon}
              >
                <PageIcon
                  icon={page.header.icon}
                  iconType={page.header.iconType}
                  style={pageIconStyle}
                />
              </div>

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
                <ContentEditable
                  html={page.header.title}
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
          <div 
            className="pageContent"
          >
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
                      setOpenLoader={setOpenLoader}
                      setLoaderTargetBlock={setLoaderTargetBlock}
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
                  editBlock={editBlock}
                  changeBlockToPage={changeBlockToPage}
                  changePageToBlock={changePageToBlock}
                  command={command}
                  setCommand={setCommand}
                  setCommandTargetBlock={null}
                  setPopup={null}
                />
              </div>
          }
          {openLoader && loaderTargetBlock !==null &&
          <Loader
            block={loaderTargetBlock}
            page={page}
            editBlock={editBlock}
            setOpenLoader={setOpenLoader}
            setLoaderTargetBlock={setLoaderTargetBlock}
          />
          }
      <BlockFn
        page={page}
        pages={pages}
        pagesId={pagesId}
        firstlist={firstlist}
        userName={userName}
        addBlock={addBlock}
        editBlock={editBlock}
        changeBlockToPage={changeBlockToPage}
        changePageToBlock={changePageToBlock}
        deleteBlock={deleteBlock}
        addPage={addPage}
        editPage={editPage}
        duplicatePage={duplicatePage}
        movePageToPage={movePageToPage}
        deletePage={deletePage}
        commentBlock={commentBlock}
        setCommentBlock={setCommentBlock}
        popup={popup}
        setPopup={setPopup}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setPopupStyle={setPopupStyle}
        setTargetPageId={setTargetPageId}
      />
      {popup.popup && 
          <div 
            id="popupMenu"
            style ={popupStyle}
          >
            {popup.what==="popupMoveToPage" &&
            <PageMenu
              what="block"
              currentPage={page}
              pages={pages}
              firstlist={firstlist}
              deleteBlock={deleteBlock}
              addBlock={addBlock}
              editBlock={editBlock}
              changeBlockToPage={changeBlockToPage}
              addPage={addPage}
              movePageToPage={movePageToPage}
              setMenuOpen={setMenuOpen}
              setTargetPageId={setTargetPageId}
            /> 
            }
            {popup.what ==="popupComment" &&
                <CommentInput
                pageId={page.id}
                page={null}
                userName={userName}
                editBlock={editBlock}
                editPage={editPage}
                blockComment={null}
                subComment={null}
                commentBlock={commentBlock}
                setCommentBlock={setCommentBlock}
                setPageComments={null}
                setPopup={setPopup}
                addOrEdit="add"
                setEdit={null}
              />
            }
            {popup.what === "popupCommand" && commandTargetBlock !==null&&
              <CommandBlock
                page ={page}
                block ={commandTargetBlock}
                editBlock ={editBlock}
                changeBlockToPage ={changeBlockToPage}
                changePageToBlock ={changePageToBlock}
                setPopup ={setPopup}
                setCommandTargetBlock={setCommandTargetBlock}
                setCommand ={null}
                command ={null}
              />
            }
          </div>
      }
      {commentBlock !==null && openComment &&
      <div 
        id="block_comments"
        style={commentsStyle}
      >
        <Comments
          userName={userName}
          block={commentBlock}
          pageId={page.id}
          page={null}
          editBlock={editBlock}
          editPage={editPage}
          select={null}
          discardEdit={discardEdit}
        />  
      </div>            
      }
    </div>
  )
};
export default React.memo(Frame)