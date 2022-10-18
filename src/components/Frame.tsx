import '../assests/frame.css';
import React, { CSSProperties, Dispatch,  MouseEvent,  SetStateAction, useEffect, useRef, useState } from 'react';
import { Block, MainCommentType, blockSample,  findBlock, findParentBlock, listItem, Page,  makeNewBlock, findPage } from '../modules/notion';
import EditableBlock, { changeFontSizeBySmallText } from './EditableBlock';
import IconPoup, { randomIcon } from './IconPoup';
import CommandBlock from './CommandBlock';
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
import { setTemplateItem } from './BlockComponent';
import { fontStyleType } from '../containers/NotionRouter';
import BlockStyler from './BlockStyler';

export type Command ={
  boolean:boolean,
  command:string | null,
  targetBlock: Block |null
};
export type Template_Frame_SAME_Props ={
  userName:string,
  pages:Page[],
  pagesId:string[],
  firstlist:listItem[],
  recentPagesId:string[]|null,
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
  setTargetPageId: React.Dispatch<React.SetStateAction<string>>,
  setRoutePage: React.Dispatch<React.SetStateAction<Page | null>>,
  commentBlock: Block | null,
  openComment :boolean, 
  setOpenComment: Dispatch<SetStateAction<boolean>>,
  openTemplates:boolean,
  setOpenTemplates: React.Dispatch<React.SetStateAction<boolean>>
  setCommentBlock: Dispatch<SetStateAction<Block | null>>,
  showAllComments:boolean,
  smallText: boolean, 
  fullWidth: boolean, 
  discardEdit:boolean,
  setDiscardEdit:Dispatch<SetStateAction<boolean>>,
  fontStyle: fontStyleType
};
export type FrameProps = Template_Frame_SAME_Props &{
  page:Page,

};
export type selectionType={
  /**
   * origin block data (수정이전에 block data)
   */
  block:Block
}
const basicPageCover ='https://raw.githubusercontent.com/BadaHertz52/notion/master/src/assests/img/artificial-turf-g6e884a1d4_1920.jpg';;
/**
 * mouse drag로 위치를 변경시킬 블록의 내용을 보여주는 component 
 * @param param0 
 * @returns 
 */
const MoveTargetBlock=({ page, block , editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock ,smallText, moveBlock  ,setMoveTargetBlock, pointBlockToMoveBlock ,command, setCommand ,setTargetPageId  ,openComment ,setOpenComment ,setCommentBlock ,setOpenLoader, setLoaderTargetBlock, closeMenu,templateHtml ,setSelection
}:EditableBlockProps)=>{
  return(
    <div 
      id="moveTargetBlock" 
    >
      {(block.type.includes("List")&& !block.firstBlock)?
      (<div className='eidtableBlock'>
          <div className='editableBlockInner'>
            <div 
            id={`moveTarget_block_${block.id}`}
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
        templateHtml={templateHtml}
        setSelection={setSelection}
      />
      }
    </div>
  )
}

const Frame =({ userName,page, pagesId, pages, firstlist ,recentPagesId,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,duplicatePage,movePageToPage,commentBlock,openComment, setRoutePage ,setTargetPageId ,setOpenComment , setCommentBlock ,
  showAllComments ,smallText , fullWidth  ,discardEdit,setDiscardEdit , openTemplates,  setOpenTemplates, fontStyle}:FrameProps)=>{
  const innerWidth =window.innerWidth; 
  const inner =document.getElementById("inner");
  const frameRef= useRef<HTMLDivElement>(null);
  const frameHtml =frameRef.current;
  const [templateHtml,setTemplateHtml]=useState<HTMLElement|null>(null);
  const editTime =JSON.stringify(Date.now());
  const [firstBlocksId, setFirstBlocksId]=useState<string[]|null>(page.firstBlocksId);
  const [newPageFram, setNewPageFrame]=useState<boolean>(false);
  const [decoOpen ,setdecoOpen] =useState<boolean>(false);
  const [command, setCommand]=useState<Command>({
    boolean:false, 
    command:null,
    targetBlock:null
  });
  const [openIconPopup, setOpenIconPopup]=useState<boolean>(false);
  const [openPageCommentInput, setOpenPageCommentInput]=useState<boolean>(false);
  const [openLoader, setOpenLoader]=useState<boolean>(false);
  const [loaderTargetBlock, setLoaderTargetBlock]=useState<Block|null>(null);
  const [iconStyle, setIconStyle]=useState<CSSProperties|undefined>(undefined);
  const [commandBlockPositon, setCBPositon]=useState<CSSProperties>();
  const [commandBlockStyle, setCommandBlockStyle]=useState<CSSProperties|undefined>(undefined);
  const [menuOpen, setOpenMenu]= useState<boolean>(false);
  const [popup, setPopup]=useState<PopupType>({
    popup:false,
    what:null
  });
  const [popupStyle, setPopupStyle]=useState<CSSProperties |undefined>(undefined); 
  const [moveTargetBlock, setMoveTargetBlock]=useState<Block|null>(null);
  const moveBlock =useRef<boolean>(false);
  const pointBlockToMoveBlock =useRef<Block|null>(null);
  const [selection, setSelection]=useState<selectionType|null>(null);
  const maxWidth = innerWidth -60
  const frameInnerStyle:CSSProperties={
    fontFamily:fontStyle ,
    fontSize: openTemplates? "14px": ( smallText? "14px": "16px"),
    width: openTemplates? "100%": (fullWidth?  `${maxWidth}px`: ( innerWidth>900?  '900px' : "75%") ) ,
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
  };
  const onMouseMoveOnPH =()=>{
    if((page.header.icon ===null|| page.header.cover===null || page.header.comments==null) && !decoOpen){
      setdecoOpen(true);
    }
  };
  const onMouseLeaveFromPH=()=>{
    decoOpen && setdecoOpen(false);
  };
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

  const closeMenu =(event:globalThis.MouseEvent| MouseEvent)=>{
    const mainMenu =document.getElementById("mainMenu");
    const sideMenu =document.getElementById("sideMenu")?.firstElementChild;
    const mainMenuArea =mainMenu?.getClientRects()[0] ;
    const sideMenuArea =sideMenu?.getClientRects()[0] ;

    const isInrMain = detectRange(event, mainMenuArea);
    const isInSide =detectRange(event, sideMenuArea );

    if(sideMenuArea !==undefined){
      (isInrMain || isInSide) ? setOpenMenu(true) :setOpenMenu(false);
    }else{
      isInrMain ? setOpenMenu(true) : setOpenMenu(false);
    }
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
        if(!isInComments &&!isInCommentsBtn){
          setCommentBlock(null);
          setOpenComment(false); 
        }
      }
    }
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
    setTemplateItem(templateHtml,page);
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
    setTemplateItem(templateHtml,page);
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
    setTemplateItem(templateHtml,page);
    editPage(page.id, editedPage)
  };
  const onMouseMoveToMoveBlock=()=>{
    if(moveTargetBlock!==null){
        moveBlock.current=true
    };
  };
  /**
   * 마우스 드래그로 블록의 위치를 변경하고, 변경된 위치에 따라 page의 data도 변경하는 함수 
   */
  const changeBlockPosition =()=>{
    if(pointBlockToMoveBlock.current!==null && moveTargetBlock!==null && page.blocksId!== null && page.blocks!==null){
      setTemplateItem(templateHtml,page);
      //editblock
        const editTime =JSON.stringify(Date.now());
        const blocksId =[...page.blocksId];
        const blocks=[...page.blocks];
        const pointBlock =pointBlockToMoveBlock.current;
        const targetBlockIsList =moveTargetBlock.type === "numberList" || moveTargetBlock.type ==="bulletList"; 
        const newBlock =makeNewBlock(page, null,"" );
        const newParentBlockOfList :Block ={
          ...newBlock,
          firstBlock:pointBlock.firstBlock,
          type: moveTargetBlock.type=== "numberList"? 'numberListArry': 'bulletListArry' ,
          subBlocksId:[moveTargetBlock.id],
          parentBlocksId: pointBlock.parentBlocksId
        };
        const targetBlock:Block= targetBlockIsList ? 
        {
          ...moveTargetBlock,
          firstBlock:false,
          parentBlocksId: newParentBlockOfList.parentBlocksId !==null? newParentBlockOfList.parentBlocksId.concat(newParentBlockOfList.id) : [newParentBlockOfList.id],
          editTime:editTime
        }
        :
        {
          ...moveTargetBlock,
          firstBlock:pointBlock.firstBlock,
          parentBlocksId:pointBlock.parentBlocksId,
          editTime:editTime
        };

        /**
         * targetBlock의 subBlock가 존재할 경우, subBlock들의 parentBlocksId에서 특정 id를 제거하거나 다른 id로 변경하는 함수 
         * @param targetBlock parentBlocksId를 변경할 subBlock 들의 parentBlock
         * @param parentBlockId subBlocks 들의 parentBlocksId에서 제거해야할 id
         * @param newParentBlockId  subBlocks 들의 parentBlocksId에서 parentBlockId(parameter)와 변경되어야할 새로운 parentBlockId
         */
        const deleteParentBlocksIdFromSubBlock =(targetBlock:Block, parentBlockId:string , newParentBlockId:string|null)=>{
          if(targetBlock.subBlocksId!==null){
            targetBlock.subBlocksId.forEach((id:string)=>{
              const subBlocksIndex= blocksId.indexOf(id);
              const subBlock = blocks[subBlocksIndex];
              const parentBlocksId =[...subBlock.parentBlocksId as string[]] ;
              const parentBlockIndex= parentBlocksId.indexOf(parentBlockId);
              if(targetBlockIsList && newParentBlockId!==null){
                parentBlocksId.splice(parentBlockIndex,1, newParentBlockId)
              }else{
                parentBlocksId.splice(parentBlockIndex,1);
              }
              const editedSubBlock:Block ={
                ...subBlock,
                parentBlocksId: parentBlockId[0]!==undefined ? parentBlocksId:null,
                editTime:editTime
              };
              editBlock(page.id, editedSubBlock);
              subBlock.subBlocksId!==null && deleteParentBlocksIdFromSubBlock(subBlock, parentBlockId ,newParentBlockId);
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
            //edit targetBlock's  origin parentBlock
            const {parentBlock} = findParentBlock(page, moveTargetBlock);
            if(parentBlock.subBlocksId!==null){
              const editedParentBlock:Block ={
                ...parentBlock,
                subBlocksId: parentBlock.subBlocksId.filter((id:string)=> id !== targetBlock.id),
                editTime:editTime,
              };
              editBlock(page.id, editedParentBlock);
            };
            // edit targetBlock.subBlocksId 
            if(targetBlock.subBlocksId!==null){
              deleteParentBlocksIdFromSubBlock(targetBlock, parentBlock.id , targetBlockIsList? newParentBlockOfList.id:null);
            };
            //add firtstBlocks
            if(firstBlocksId!==null){
              if(targetBlockIsList && page.firstBlocksId!==null ){
                const preBlockId = page.firstBlocksId[pointBlock_firstBlockIndex-1];
                const preBlockIndexInBlocksId =page.blocksId.indexOf(preBlockId);
                addBlock(page.id, newParentBlockOfList, preBlockIndexInBlocksId+1 ,preBlockId );
              }else{
                firstBlocksId.splice(pointBlock_firstBlockIndex,0, targetBlock.id);
              }
            };
            editBlock(page.id, targetBlock);
        }
      };
       //case2. pointBlock is subBlock : pointBlock의 parentBlock의 subBlock 으로 이동 
      if(!pointBlock.firstBlock){
        const parentBlockOfPointBlock=findParentBlock(page,pointBlock).parentBlock;
        //STEP1. targetBlock이 firstBlock일 경우 page의 firstBlocksId에서 삭제, 아닐 경우 targetBlock의 parentBlock을 수정 
        if(targetBlock.firstBlock && firstBlocksId!==null){
          const firstBlocksIdIndex= firstBlocksId?.indexOf(targetBlock.id);
          firstBlocksId.splice(firstBlocksIdIndex,1);
        }else{
          /**
           * moveTargetBlock의 parentBlock 으로 , targetBlock은 블록의 이동에 따라  moveTargetBlock에서 data를 변경한 것이기 때문에 targetBlock의 parent가 아닌 moveTargetBlock의 parent여야함  
           */
          const moveTargetBlockParent:Block = findParentBlock(page, moveTargetBlock).parentBlock;
          if(moveTargetBlockParent.id !== parentBlockOfPointBlock.id){
            const subBlocksId =moveTargetBlockParent.subBlocksId;
            if(subBlocksId!==null){
              const subBlockIndex= subBlocksId.indexOf(targetBlock.id);
              subBlocksId.splice(subBlockIndex,1);
              const newTargetBlockParent :Block ={
                ...moveTargetBlockParent,
                subBlocksId: subBlocksId,
                editTime:editTime
              };
              editBlock(page.id, newTargetBlockParent);
            }
          }else{
            // step2-2에서 실행 
          }
      };

        //STEP2. edit parentBlock of pointBlock : 위치 변경에 따라 targetBlock or newParentBlockOfTargetBlock을 parentBlockOfPoint 의 subBlocksId 에 추가 , targetBlockIsList 일 경우 , newParentBlockOfTargetBlock을 페이지에 생성

      // step2-1 : targetBlockIsList 일때, newParentBlockOfTargetBlock을 페이지에 추가 
      if(targetBlockIsList && parentBlockOfPointBlock.subBlocksId!==null){
        const pointBlockIndex= blocksId.indexOf(pointBlock.id);
        const pointBlockIndexAsSub = parentBlockOfPointBlock.subBlocksId.indexOf(pointBlock.id);
        console.log("poinBlockIndex," ,pointBlockIndex, "pointblockindexAsSub", pointBlockIndexAsSub);
        if(pointBlockIndexAsSub===0){
          addBlock(page.id, newParentBlockOfList, pointBlockIndex-1, null);
        }else{
          const previousBlockId =parentBlockOfPointBlock.subBlocksId[pointBlockIndexAsSub-1];
          addBlock(page.id, newParentBlockOfList, pointBlockIndex-1, previousBlockId );
        }
      };
      //step2-2 : targetBlock을 subBlocksId에 추가 
      if(!targetBlockIsList && parentBlockOfPointBlock.subBlocksId!==null){
        const parentBlockSubBlocksId =[...parentBlockOfPointBlock.subBlocksId];
        if(parentBlockSubBlocksId.includes(targetBlock.id)){
          // 이미 targetBlock 이fparentBlockOfPointBlock 에 있는 경우, parentBlock에서 targetBlock을 삭제
          const targetBlockSubIndex= parentBlockSubBlocksId.indexOf(targetBlock.id);
          parentBlockSubBlocksId.splice(targetBlockSubIndex,1);
        };
        const subBlockIndex= parentBlockSubBlocksId.indexOf(pointBlock.id);
        parentBlockSubBlocksId.splice(subBlockIndex, 0, targetBlock.id);
        const newParentBlock:Block ={
          ...parentBlockOfPointBlock,
          subBlocksId:parentBlockSubBlocksId,
          editTime:editTime
        };
        editBlock(page.id ,newParentBlock);
      };
        //STEP3.targetBlock의 subBlocks의 parentBlocksId 수정 
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
        
        if(targetBlock.subBlocksId!==null && targetBlock.parentBlocksId!==null){
          if(moveTargetBlock.parentBlocksId!==null){
            moveTargetBlock.parentBlocksId[moveTargetBlock.parentBlocksId.length-1] !== targetBlock.parentBlocksId[targetBlock.parentBlocksId.length-1] && addParentBlockToSubBlock(targetBlock);
          }else{
            addParentBlockToSubBlock(targetBlock);
          }
        };
        //STEP4. targetBlock 수정 
        editBlock(page.id, targetBlock);
      };
        const editedPage = findPage(pagesId, pages, page.id); 
        const newPage :Page ={
          ...editedPage,
          firstBlocksId:firstBlocksId
        };
        setTemplateItem(templateHtml,page);
        editPage(page.id, newPage);
    };
  };
  
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
  const onClickPageContentBottom =(event:MouseEvent)=>{
    const pageContent =event.currentTarget
    const clientX = event.clientX;
    const clientY = event.clientY;

    if(pageContent !== null){
      const pageContentDomRect =pageContent.getClientRects()[0];
      const pageContentPadding = getComputedStyle(pageContent, null).getPropertyValue("padding-bottom");
      const padding = Number(pageContentPadding.slice(0, pageContentPadding.indexOf(
        "px")));

      const conditionX = (clientX >= pageContentDomRect.x)&& (clientX <= pageContentDomRect.right); 

      const conditionY = (clientY >= (pageContentDomRect.bottom - padding)) && (clientY <= pageContentDomRect.bottom );
      /**
       * mouseEevent가  pageContent의 아래 부분에서 일어났는지에 대한 객체, event가 아래 부분에서 일어났으면 true, 밖의 영역에서 일어났으면 false
       */
      const isInner =conditionX && conditionY;
      if(isInner){
        const newBlock:Block={
          ...blockSample,
          firstBlock:true
        };

        if(page.firstBlocksId){
          page.blocks !==null &&
          addBlock(page.id, newBlock, page.blocks.length, null);
        }else{
          addBlock(page.id, newBlock,0,null);
        };
        setTemplateItem(templateHtml,page);
      }
    } 

  };
  //new Frame
  const newPage :Page ={
    ...page,
    header:{
      ...page.header,
    },
    blocks:[blockSample],
    blocksId:[blockSample.id],
    firstBlocksId:[blockSample.id],
    editTime:editTime
  };
  const onClickEmptyWithIconBtn=()=>{
    const icon =randomIcon();
    const newPageWithIcon:Page ={
      ...newPage,
      header:{
        ...page.header,
        icon: icon ,
        iconType:"emoji"
      }
    };
    setTemplateItem(templateHtml,page);
    editPage(page.id, newPageWithIcon);
    setRoutePage(newPageWithIcon);
  };
  const onClickEmpty =()=>{
    setTemplateItem(templateHtml,page);
    editPage(page.id ,newPage);
    setRoutePage(newPage);
  };

  const onClickTemplateBtn=()=>{
    setOpenTemplates(true);
    sessionStorage.setItem("targetPageId",page.id);
  };
  // edit block using sessionstorage
  const updateBlock=()=>{
    const item = sessionStorage.getItem("itemsTobeEdited");
    const cursorElement =document.getSelection()?.anchorNode?.parentElement;
    const className =cursorElement?.className ;
    if(item!==null){
      const  itemObjet= JSON.parse(item);
      const targetBlock =itemObjet.block;
      const pageId = itemObjet.pageId;
      const condition = className ==="contentEditable" && cursorElement!==undefined && cursorElement!==null && cursorElement.parentElement?.id ===`${targetBlock.id}_contents`;
        if(!condition ){
          editBlock(pageId, targetBlock);
          sessionStorage.removeItem("itemsTobeEdited");
        }
    }
  };
  /**
   * commandBlockPosition (type:CSSProperties)의 값을 변경하는 함수 
   */
  const changeCBSposition =()=>{
    if(command.boolean && command.targetBlock!==null){
      const frameDomRect= frameHtml?.getClientRects()[0];
      const blockStyler =document.getElementById("blockStyler");
      if(blockStyler!==null){
        //blockStyler
        const blockStylerDomRect = blockStyler.getClientRects()[0];
        if(frameDomRect!==undefined ){
          const top = blockStylerDomRect.top + blockStylerDomRect.height;
          const left =`${blockStylerDomRect.left - frameDomRect.left}px`; 
          const remainHeight = frameDomRect.height - top ;
          const toDown = remainHeight >150;
          const bottom= frameDomRect.height - blockStylerDomRect.top + blockStylerDomRect.height +16 ;
          const maxHeight= toDown? remainHeight : blockStylerDomRect.top - frameDomRect.top -50 ; 
          const style :CSSProperties = toDown?
          {
            top:`${top}px`,
            left: left,
          }
          :{
            bottom: `${bottom}px`,
            left: left,
          };
          setCBPositon(style);
          const commandBlock_style:CSSProperties ={
            maxHeight:`${maxHeight}px`,
          };
          setCommandBlockStyle(commandBlock_style);
        }
      }else{
        //typing 으로 type 변경 시 
        const commandInput =document.getElementById("commandInput");
        const commandInputDomRect = commandInput?.getClientRects()[0];
        if(frameDomRect!==undefined &&commandInputDomRect !==undefined){
          const top =commandInputDomRect.top + commandInputDomRect.height  + 14 ;
          const left = `${commandInputDomRect.left -frameDomRect.left}px` ; 
          const remainingHeight = frameDomRect.height - top ; 
          const toDown = remainingHeight > 150 ;
          const bottom = frameDomRect.height - commandInputDomRect.top +commandInputDomRect.height ;
          const maxHeight = toDown? remainingHeight : frameDomRect.top - bottom -50
          const style :CSSProperties = toDown? {
            top: `${top}px` ,
            left:  left,
          }:{
            bottom: `${bottom}px`,
            left: left,
          };
          setCBPositon(style);
          const commandBlock_style:CSSProperties ={
            maxHeight:`${maxHeight}px`,
          };
          setCommandBlockStyle(commandBlock_style);
        }
      }

    }
  };
  window.onresize = ()=>{
    changeCBSposition();
  };
  inner?.addEventListener("keyup",updateBlock);
  inner?.addEventListener("click",(event:globalThis.MouseEvent)=>{
    updateBlock();
    menuOpen &&closeMenu(event);
    popup.popup && closePopup(event);
    openComment && commentBlock!==null && closeComments(event);
    if(command.boolean){
      const block_commandBlock =document.getElementById("block_commandBlock");
      const commandDomRect =block_commandBlock?.getClientRects()[0];
      const commandInputHtml =document.getElementById("commandInput");
      if(commandDomRect !==undefined 
        && commandInputHtml!==null){
        const isInnnerCommand = detectRange(event,commandDomRect); 
        (!isInnnerCommand&& (event.target !== commandInputHtml)) && setCommand({
          boolean:false,
          command:null,
          targetBlock:null
        }) 
      }
    }
  });
  useEffect(()=>{
    openTemplates?
    setTemplateHtml(document.getElementById("template")):
    setTemplateHtml(null);
  },[openTemplates]);

  useEffect(()=>{
    console.log("page", page.firstBlocksId);
    setFirstBlocksId(page.firstBlocksId); 
  },[page.firstBlocksId]);

  useEffect(()=>{
    firstBlocksId?.[0] ===undefined?
    setNewPageFrame(true):
    setNewPageFrame(false);
  },[firstBlocksId]);

  useEffect(()=>{
    if(!newPageFram && firstBlocksId?.[0]!==undefined){
      const newFirstBlockHtml = document.getElementById(`${firstBlocksId[0]}_contents`);
      const contenteditableHtml =newFirstBlockHtml?.firstElementChild as HTMLElement|null|undefined ;
      if(contenteditableHtml!==null && contenteditableHtml!==undefined){
        contenteditableHtml.focus();
      }
    } 
  },[newPageFram, firstBlocksId]);
  useEffect(()=>{
    changeCBSposition();
  },[command.boolean ,command.targetBlock, openTemplates]);

  //window.onresize =changeCommentStyle;
  useEffect(()=>{
    // stop srcoll when something open
    if(popup.popup ||command.command|| openLoader|| openComment|| moveTargetBlock||selection){
      !frameRef.current?.classList.contains("stop") &&
      frameRef.current?.classList.add("stop");
    }else{
      frameRef.current?.classList.contains("stop") &&
      frameRef.current?.classList.remove("stop");
    }
  },[popup.popup, command.command, openLoader, openComment, moveTargetBlock,selection])

  return(
    <div 
      className={newPageFram? "newPageFrame frame" :'frame'}
      ref={frameRef}
    >
      <div 
        className='frame_inner'
        style={frameInnerStyle}
        onMouseMove={showMoveTargetBlock}
      >
        <div 
          className='pageHeader'
          style={headerStyle}
          onMouseMove={onMouseMoveOnPH}
          onMouseLeave={onMouseLeaveFromPH}
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
            <div 
              className='pageComment'
              style={frameInnerStyle}
            >
              {page.header.comments!==null ?
                page.header.comments.map((comment:MainCommentType)=>
              <Comments 
                key={`pageComment_${comment.id}`}
                block={null}
                page={page}
                pageId={page.id}
                userName={userName}
                editBlock={editBlock}
                editPage={editPage}
                frameHtml={frameHtml}
                discardEdit={discardEdit}
                setDiscardEdit={setDiscardEdit}
                select={null}
                openComment={false}
                showAllComments={showAllComments}
                />
                )
              :
                (openPageCommentInput ?
                <CommentInput
                  page={page}
                  pageId={page.id}
                  userName={userName}
                  mainComment={null}
                  subComment={null}
                  editBlock={editBlock}
                  editPage={editPage}
                  commentBlock={null}
                  allComments={page.header.comments}
                  setAllComments ={null}
                  setPopup={null}
                  addOrEdit={"add"}
                  setEdit={setOpenPageCommentInput}
                  templateHtml={templateHtml}
                />
                :
                newPageFram &&
                <div 
                >
                  Press Enter to continue with an empty page or pick a templage
                </div>
                )
            }
            </div>
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
          onClick={onClickPageContentBottom}
        >
          {!newPageFram?
          <div 
            className='pageContent_inner'
            onMouseMove={onMouseMoveToMoveBlock}
            onMouseUp={onMouseUpToMoveBlock}
            >
            {page.firstBlocksId!==null &&
              firstBlocksId?.map((id:string)=> findBlock(page,id).BLOCK)
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
                    templateHtml={templateHtml}
                    setSelection={setSelection}
                  />
                )
              }
            )
            }
          </div>
          :
          <div className='pageContent_inner'>
            <button
              onClick={onClickEmptyWithIconBtn}
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
            <button
              onClick={onClickTemplateBtn}
            >
              <HiTemplate/>
              <span>Templates</span>
            </button>
          </div>
          }
        </div>
        
      </div>
      {command.boolean &&
      command.targetBlock !==null &&
        <div 
          id="block_commandBlock"
          style={commandBlockPositon}
        >
            <CommandBlock 
            style={commandBlockStyle}
            key={`${command.targetBlock.id}_command`}
            page={page}
            block={command.targetBlock}
            addBlock={addBlock}
            editBlock={editBlock}
            changeBlockToPage={changeBlockToPage}
            changePageToBlock={changePageToBlock}
            editPage={editPage}
            command={command}
            setCommand={setCommand}
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
        frameHtml={frameHtml}
        commentBlock={commentBlock}
        setCommentBlock={setCommentBlock}
        moveTargetBlock={moveTargetBlock}
        setMoveTargetBlock={setMoveTargetBlock}
        popup={popup}
        setPopup={setPopup}
        menuOpen={menuOpen}
        setOpenMenu={setOpenMenu}
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
              changeBlockToPage={changeBlockToPage}
              movePageToPage={movePageToPage}
              setOpenMenu={setOpenMenu}
              setTargetPageId={setTargetPageId}
            /> 
            }
            {popup.what ==="popupComment" && commentBlock !==null &&
                <CommentInput
                pageId={page.id}
                page={page}
                userName={userName}
                editBlock={editBlock}
                editPage={editPage}
                mainComment={null}
                subComment={null}
                commentBlock={commentBlock}
                allComments={commentBlock.comments}
                setAllComments={null}
                setPopup={setPopup}
                addOrEdit="add"
                setEdit={null}
                templateHtml={templateHtml}
              />
            }
          </div>
      }
      {commentBlock !==null && openComment &&
        <Comments
          userName={userName}
          block={commentBlock}
          pageId={page.id}
          page={page}
          editBlock={editBlock}
          editPage={editPage}
          frameHtml={frameHtml}
          openComment={openComment}
          select={null}
          discardEdit={discardEdit}
          setDiscardEdit={setDiscardEdit}
          showAllComments={showAllComments}
        />           
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
          templateHtml={templateHtml}
          setSelection={setSelection}
        />
      }
      {selection !==null &&
        <BlockStyler
          pages={pages}
          pagesId={pagesId}
          firstlist={firstlist}
          userName={userName}
          page={page}
          recentPagesId={recentPagesId}
          block={selection.block}
          addBlock={addBlock}
          editBlock={editBlock}
          changeBlockToPage={changeBlockToPage}
          changePageToBlock={changePageToBlock}
          deleteBlock={deleteBlock}
          editPage={editPage}
          duplicatePage={duplicatePage}
          movePageToPage={movePageToPage}
          popup={popup}
          setPopup={setPopup}
          setPopupStyle={setPopupStyle}
          command={command}
          setCommand={setCommand}
          setCommentBlock={setCommentBlock}
          setTargetPageId={setTargetPageId}
          selection={selection}
          setSelection={setSelection}
          frameHtml={frameHtml}
        />
      }
    </div>
  )
};
export default React.memo(Frame)