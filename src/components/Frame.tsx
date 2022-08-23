import '../assests/frame.css';
import React, { CSSProperties, Dispatch,  MouseEvent,  SetStateAction, useEffect, useRef, useState } from 'react';
import { Block, BlockCommentType, blockSample,  findBlock, findParentBlock, listItem, makeNewBlock, Page } from '../modules/notion';
import EditableBlock, { changeFontSizeBySmallText } from './EditableBlock';
import IconPoup, { randomIcon } from './IconPoup';
import CommandBlock from './CommandBlock';
import { defaultFontFamily } from './TopBar';
import Comments, { CommentInput } from './Comments';
import BlockFn, { detectRange } from './BlockFn';
import Loader from './Loader';
import PageIcon from './PageIcon';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import PageMenu from './PageMenu';
import { PopupType } from '../containers/EditorContainer';
import {EditableBlockProps} from './EditableBlock';

//icon
import { BiMessageDetail } from 'react-icons/bi';
import { BsFillEmojiSmileFill} from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';
import { MdInsertPhoto } from 'react-icons/md';
import { HiTemplate } from 'react-icons/hi';

export type Command ={
  boolean:boolean,
  command:string | null,
  targetBlock: Block |null
};
export type FrameProps ={
  userName:string,
  page:Page,
  pages:Page[],
  pagesId:string[],
  firstlist:listItem[],
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

const MoveTargetBlock=({ page, block , editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock ,smallText, moveBlock  ,setMoveTargetBlock, pointBlockToMoveBlock ,command, setCommand ,setTargetPageId ,openComment ,setOpenComment ,setCommentBlock ,setOpenLoader, setLoaderTargetBlock, closeMenu
}:EditableBlockProps)=>{

  return(
    <div 
      id="moveTargetBlock" 
    >
      {(block.type.includes("List")&& !block.firstBlock)?
      (<div className='eidtableBlock'>
          <div className='editableBlockInner'>
            <div 
            id={`block_${block.id}`}
            className={`${block.type} block`}
            style={changeFontSizeBySmallText(block, smallText)}
            >
              <div  className="mainBlock">
                <div className='mainBlock_block'>
                  <div 
                    id={block.id}
                    className="blockComponent"
                  >
                    <div 
                      className={`${block.type}_blockComponent blockComponent`}
                    >
                      <div 
                        className='contentEditable'
                      >
                        {block.contents !==""? block.contents : "type '/' for commmands"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      ):
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
        moveBlock={moveBlock}
        setMoveTargetBlock={setMoveTargetBlock}
        pointBlockToMoveBlock={pointBlockToMoveBlock}
        command={command}
        setCommand={setCommand}
        setTargetPageId={setTargetPageId}
        openComment={openComment}
        setOpenComment={setOpenComment}
        setCommentBlock={setCommentBlock}
        setOpenLoader={setOpenLoader}
        setLoaderTargetBlock={setLoaderTargetBlock}
        closeMenu={closeMenu}
      />
      }
    </div>
  )
}

const Frame =({ userName,page, pagesId, pages, firstlist,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,duplicatePage,movePageToPage,commentBlock,openComment ,setTargetPageId ,setOpenComment , setCommentBlock ,smallText , fullWidth  ,discardEdit}:FrameProps)=>{
  const innerWidth =window.innerWidth; 
  const inner =document.getElementById("inner");
  const editTime =JSON.stringify(Date.now());
  const [firstBlocksId, setFirstBlocksId]=useState<string[]|null>(page.firstBlocksId);
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
  const [moveTargetBlock, setMoveTargetBlock]=useState<Block|null>(null);
  const moveBlock =useRef<boolean>(false);
  const pointBlockToMoveBlock =useRef<Block|null>(null);
  const closePopup=(event:globalThis.MouseEvent)=>{
    if(popup.popup){
      const popupMenu =document.getElementById("popupMenu");
      const popupMenuDomRect= popupMenu?.getClientRects()[0];
      const isInPopupMenu =detectRange(event, popupMenuDomRect);
      !isInPopupMenu && setPopup({
        popup:false,
        what:null
      });
    };
  };
  const closeComments=(event:globalThis.MouseEvent)=>{
    if(openComment && commentBlock!==null){
      const commentsDoc= document.getElementById("block_comments") ;
      const commentBtn =document.getElementById(`${commentBlock.id}_contents`);
      if(commentsDoc !==null && commentBtn!==null){
        const commentsDocDomRect= commentsDoc.getClientRects()[0];
        const commentBtnDomRect =commentBtn.getClientRects()[0];
        const isInComments =detectRange(event, commentsDocDomRect);
        const isInCommentsBtn =detectRange(event, commentBtnDomRect);
        console.log("clse comment", isInComments , isInCommentsBtn);
        if(!isInComments &&!isInCommentsBtn){
          setCommentBlock(null);
          setOpenComment(false); 
        }
      }
    }
  }
  const closeMenu =(event:globalThis.MouseEvent| MouseEvent)=>{
    const mainMenu =document.getElementById("mainMenu");
    const sideMenu =document.getElementById("sideMenu")?.firstElementChild;
    const mainMenuArea =mainMenu?.getClientRects()[0] ;
    const sideMenuArea =sideMenu?.getClientRects()[0] ;

    const isInrMain = detectRange(event, mainMenuArea);
    const isInSide =detectRange(event, sideMenuArea );

    if(sideMenuArea !==undefined){
      (isInrMain || isInSide) ? setMenuOpen(true) :setMenuOpen(false);
    }else{
      isInrMain ? setMenuOpen(true) : setMenuOpen(false);
    }
  };
  
  inner?.addEventListener("click", (event:globalThis.MouseEvent)=>{
    menuOpen &&closeMenu(event);
    popup.popup && closePopup(event);
    openComment && commentBlock!==null && closeComments(event);
  });


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

  pageContent?.addEventListener("click", (event:globalThis.MouseEvent)=>{onClickPageContentBottom(event)});

  const onMouseMoveToMoveBlock=()=>{
    if(moveTargetBlock!==null){
        moveBlock.current=true
    };
  };
  const changeBlockPosition =()=>{
    if(pointBlockToMoveBlock.current!==null && moveTargetBlock!==null){
      //editblock
        const editTime =JSON.stringify(Date.now());
        const blocksId =[...page.blocksId];
        const blocks=[...page.blocks];
        const pointBlock =pointBlockToMoveBlock.current;
        const targetBlock :Block ={
          ...moveTargetBlock,
          editTime:editTime,
        };
        const deleteParentBlocksIdFromSubBlock =(targetBlock:Block, parentBlockId:string)=>{
          if(targetBlock.subBlocksId!==null){
            targetBlock.subBlocksId.forEach((id:string)=>{
              const subBlocksIndex= blocksId.indexOf(id);
              const subBlock = blocks[subBlocksIndex];
              const editedSubBlock:Block ={
                ...subBlock,
                parentBlocksId: subBlock.parentBlocksId !== null ? subBlock.parentBlocksId.filter((id:string)=> id !== parentBlockId) : null,
                editTime:editTime
              };
              editBlock(page.id, editedSubBlock);
              subBlock.subBlocksId!==null && deleteParentBlocksIdFromSubBlock(subBlock, parentBlockId);
            } )
          }
      
        };
      if(pointBlock.firstBlock){
        const pointBlock_firstBlockIndex= firstBlocksId?.indexOf(pointBlock.id) as number;
        if(targetBlock.firstBlock){
          if(firstBlocksId!==null ){
            const firstBlockIndex = firstBlocksId.indexOf(targetBlock.id);
            firstBlocksId.splice(firstBlockIndex,1);
            firstBlocksId.splice(pointBlock_firstBlockIndex,0,targetBlock.id);
          };
        }else{
          const editedTargetBlock:Block ={
            ...moveTargetBlock,
            parentBlocksId:null,
            firstBlock:true,
            editTime:editTime
          };
          //edit editedTargetBlock's parentBlock
          const {parentBlock} = findParentBlock(page, moveTargetBlock);
          if(parentBlock.subBlocksId!==null){
            const editedParentBlock:Block ={
              ...parentBlock,
              subBlocksId: parentBlock.subBlocksId.filter((id:string)=> id !== editedTargetBlock.id),
              editTime:editTime,
            };
            editBlock(page.id, editedParentBlock);
          };

          if(editedTargetBlock.subBlocksId!==null){
            deleteParentBlocksIdFromSubBlock(editedTargetBlock, parentBlock.id);
          };

          editBlock(page.id, editedTargetBlock);
          //add firtstBlocks
          if(firstBlocksId!==null){
            firstBlocksId.splice(pointBlock_firstBlockIndex,0, editedTargetBlock.id);
          }
        }
      }else{
        //case2. pointBlock is subBlock
        const newTargetBlock:Block={
          ...targetBlock,
          firstBlock:false,
          parentBlocksId:pointBlock.parentBlocksId,
          editTime:editTime
        };
        //edit parent block
        const {parentBlock, parentBlockIndex} =findParentBlock(page,pointBlock);

        if(parentBlock.subBlocksId!==null){
          const parentBlockSubBlocksId =[...parentBlock.subBlocksId];
          if(parentBlockSubBlocksId.includes(newTargetBlock.id)){
            const targetBlockSubIndex= parentBlockSubBlocksId.indexOf(newTargetBlock.id);
            parentBlockSubBlocksId.splice(targetBlockSubIndex,1);
          };
          const subBlockIndex= parentBlockSubBlocksId.indexOf(pointBlock.id);
          parentBlockSubBlocksId.splice(subBlockIndex, 0, newTargetBlock.id);
          const newParentBlock:Block ={
            ...parentBlock,
            subBlocksId:parentBlockSubBlocksId,
            editTime:editTime
          };
          editBlock(page.id ,newParentBlock);
        };

        const addParentBlockToSubBlock=(targetBlock:Block)=>{ 
          if(targetBlock.subBlocksId!==null){
            targetBlock.subBlocksId.forEach((id:string)=>{
              const subBlockIndex = blocksId.indexOf(id);
              const subBlock =blocks[subBlockIndex];
              if(targetBlock.parentBlocksId !== null){
                const newSubBlock:Block ={
                  ...subBlock,
                  parentBlocksId : subBlock.parentBlocksId!==null? targetBlock.parentBlocksId.concat(targetBlock.id) : null
                };
                editBlock(page.id, newSubBlock);
              };
              subBlock.subBlocksId!==null && addParentBlockToSubBlock(subBlock);
            })
          };
        };
        
        if(newTargetBlock.subBlocksId!==null && newTargetBlock.parentBlocksId!==null){
          if(targetBlock.parentBlocksId!==null){
            targetBlock.parentBlocksId[targetBlock.parentBlocksId.length-1] !== newTargetBlock.parentBlocksId[newTargetBlock.parentBlocksId.length-1] && addParentBlockToSubBlock(newTargetBlock);
          }else{
            addParentBlockToSubBlock(newTargetBlock);
          }
        };

        if(targetBlock.firstBlock && firstBlocksId!==null){
          const firstBlocksIdIndex= firstBlocksId?.indexOf(targetBlock.id);
          firstBlocksId.splice(firstBlocksIdIndex,1);

          editBlock(page.id, newTargetBlock);

        }else{
          const targetBlockParentBlock:Block = findParentBlock(page, targetBlock).parentBlock;
          if(targetBlockParentBlock.id !== parentBlock.id){
            const subBlocksId =targetBlockParentBlock.subBlocksId;
            if(subBlocksId!==null){
              const subBlockIndex= subBlocksId.indexOf(targetBlock.id);
              subBlocksId.splice(subBlockIndex,1);
              const newTargetBlockParent :Block ={
                ...targetBlockParentBlock,
                subBlocksId: subBlocksId,
                editTime:editTime
              };
              editBlock(page.id, newTargetBlockParent);
            }
          };
      }
      };
        const newPage :Page ={
          ...page,
          firstBlocksId:firstBlocksId,
          editTime:editTime
        };
        editPage(page.id, newPage);
        setFirstBlocksId(firstBlocksId);
    };
  }
  const onMouseUpToMoveBlock=()=>{
    if(moveBlock){
      changeBlockPosition();
      moveBlock.current=false;
      setMoveTargetBlock(null);
      pointBlockToMoveBlock.current =null;
      const mainBlockOn =document.querySelector(".mainBlock.on");
      mainBlockOn?.classList.remove("on");
      const editableBlockOn =document.querySelector(".editabelBlock.on");
      editableBlockOn?.classList.remove("on");
    }
  };

  const showMoveTargetBlock=(event:MouseEvent<HTMLDivElement>)=>{
    if(moveTargetBlock!==null && moveBlock.current ){
      const editor =document.querySelector(".editor");
      const x =event.clientX;
      const y =event.clientY;
      const moveTargetBlockHtml =document.getElementById("moveTargetBlock");
      if(moveTargetBlockHtml!==null && editor !==null){
        moveTargetBlockHtml.setAttribute(
          "style",`position:absolute; top:${y + editor.scrollTop + 5}px; left:${x+ 5}px`
        )
      }
    };
  };
  const onClickPageContentBottom =(event:globalThis.MouseEvent)=>{
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
          onMouseMove={showMoveTargetBlock}
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
              onMouseMove={onMouseMoveToMoveBlock}
              onMouseUp={onMouseUpToMoveBlock}
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
                      moveBlock={moveBlock}
                      setMoveTargetBlock={setMoveTargetBlock}
                      pointBlockToMoveBlock={pointBlockToMoveBlock}
                      command={command}
                      setCommand={setCommand}
                      setTargetPageId={setTargetPageId}
                      openComment={openComment}
                      setOpenComment={setOpenComment}
                      setCommentBlock={setCommentBlock}
                      setOpenLoader={setOpenLoader}
                      setLoaderTargetBlock={setLoaderTargetBlock}
                      closeMenu={closeMenu}
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
        commentBlock={commentBlock}
        setCommentBlock={setCommentBlock}
        moveTargetBlock={moveTargetBlock}
        setMoveTargetBlock={setMoveTargetBlock}
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
      {moveTargetBlock!==null &&
        <MoveTargetBlock
          key={moveTargetBlock.id}
          page={page}
          block={moveTargetBlock}
          addBlock={addBlock}
          editBlock={editBlock}
          changeToSub={changeToSub}
          raiseBlock={raiseBlock}
          deleteBlock={deleteBlock}
          smallText={smallText}
          moveBlock={moveBlock}
          setMoveTargetBlock={setMoveTargetBlock}
          pointBlockToMoveBlock={pointBlockToMoveBlock}
          command={command}
          setCommand={setCommand}
          setTargetPageId={setTargetPageId}
          openComment={openComment}
          setOpenComment={setOpenComment}
          setCommentBlock={setCommentBlock}
          setOpenLoader={setOpenLoader}
          setLoaderTargetBlock={setLoaderTargetBlock}
          closeMenu={closeMenu}

        />
      }
    </div>
  )
};
export default React.memo(Frame)