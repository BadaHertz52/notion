import React, { Dispatch, MouseEvent, SetStateAction, useRef} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { IoChatboxOutline } from 'react-icons/io5';
import { MdOutlineCollectionsBookmark, MdOutlinePhotoSizeSelectActual } from 'react-icons/md';
import {  Block,BlockType,blockTypes,findBlock,findParentBlock,findPreviousBlockInDoc,makeNewBlock,Page, toggle } from '../modules/notion';
import { Command } from './Frame';
import ImageContent from './ImageContent';
export   const setTemplateItem=(templateHtml:HTMLElement|null, page:Page)=>{
  if(templateHtml!==null){
    const templateItem= sessionStorage.getItem("origintTemplate");
    if(!templateItem){
      const originTemplate= JSON.stringify(page);
      sessionStorage.setItem("originTemplate", originTemplate);
    }
  };
};
type  BlockProps ={
  block:Block,
  page:Page,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
  blockComments:boolean,
  command :Command,
  setCommand:Dispatch<SetStateAction<Command>>,
  onClickCommentBtn: (block: Block) => void,
  setOpenComment :Dispatch<SetStateAction<boolean>>,
  setTargetPageId: React.Dispatch<React.SetStateAction<string>>,
  setOpenLoader:Dispatch<SetStateAction<boolean>>,
  setLoaderTargetBlock : Dispatch<SetStateAction<Block | null>>,
  closeMenu: (event: globalThis.MouseEvent| MouseEvent) => void,
  templateHtml:HTMLElement|null,
};
type BlockCommentProps={
  block:Block,
  onClickCommentBtn: (block: Block) => void
}
export type itemType ={
  block:Block,
  blockIndex:number ,
};
export const BlockComment =({block , onClickCommentBtn}:BlockCommentProps)=>{
  return (
      <div 
        id={`${block.id}_comments`}
        className="commentsBubble"
        >
        <button 
          className='commentBtn btnIcon'
          name={block.id}
          onClick={()=>onClickCommentBtn(block)}
        >
          <IoChatboxOutline/>
          <span className="commentLength">
            {block.comments?.length}
          </span>
        </button>
      </div>

  )
};

const BlockComponent=({block, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock ,blockComments , command, setCommand  ,onClickCommentBtn ,setOpenComment ,setTargetPageId ,setOpenLoader, setLoaderTargetBlock ,closeMenu ,templateHtml }:BlockProps)=>{
  const editTime =JSON.stringify(Date.now);
  const contentEditableRef= useRef<HTMLElement>(null);
  const possibleBlocks = page.blocks.filter((block:Block)=> block.type !=="image media" && block.type !=="page");
  const possibleBlocksId = possibleBlocks.map((block:Block)=> block.id );
  const findTargetBlock =(event:ContentEditableEvent|React.KeyboardEvent<HTMLDivElement>|MouseEvent):Block=>{
    const target =event.currentTarget.parentElement as HTMLElement;
    const targetId= target.id;
    const end =targetId.indexOf("_contents");
    const blockId = targetId.slice(0, end);
    const targetBlock = findBlock(page, blockId).BLOCK;
    return targetBlock;
  };

  const showBlockFn=(event: MouseEvent)=>{
    closeMenu(event)
    const blockHtml =document.getElementById(`block_${block.id}`) as HTMLElement;
    const mainBlock= blockHtml.querySelector('.mainBlock');
    const domRect =mainBlock?.getClientRects()[0];
    const editor = document.getElementsByClassName("editor")[0] ;
    const blockFn =templateHtml ==null? editor.querySelector(".blockFn"): templateHtml.querySelector('.blockFn');
    blockFn?.classList.toggle("on");
    blockFn?.classList.contains("on")?
    sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block))
    :
    sessionStorage.removeItem("blockFnTargetBlock");
    if(domRect!==undefined){
      if(templateHtml==null){
        const editorDomRect =editor.getClientRects()[0];
        const top =domRect.top +editor.scrollTop ;
        const left = domRect.x - editorDomRect.x - 45;
        const blockFnStyle =`top:${top}px; left:${left}px`;
        blockFn?.setAttribute("style",blockFnStyle);
      }else{
        const templateDomRect =templateHtml.getClientRects()[0];
          const top = domRect.top - templateDomRect.top ;
          const left =domRect.x - templateDomRect.x -45;
          blockFn?.setAttribute("style", `top:${top}px; left:${left}px`);
      }

    }
  };

  const onChangeContents=(event:ContentEditableEvent)=>{
    setTemplateItem(templateHtml, page);
    const value =event.target.value;
    const targetBlock= findTargetBlock(event);
    const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
    const changeBlockContent =()=>{
      if(value.includes("<div>")){
        //enter 시에 새로운 블록 생성 
        const start = value.indexOf("<div>");
        const end =value.indexOf("</div>");
        const editedContents =value.slice(0, start);
        const newBlockContents= value.slice(start+5,end );
        const newBlock:Block ={
          ...makeNewBlock(page, targetBlock, newBlockContents),
          firstBlock: targetBlock.firstBlock,
          subBlocksId: targetBlock.subBlocksId,
          parentBlocksId:targetBlock.parentBlocksId
        } ;
        if((targetBlock.contents!== editedContents) || (targetBlock.subBlocksId!==null)){
          const editedBlock:Block ={
            ...targetBlock,
            contents:block.contents!== editedContents ?editedContents : targetBlock.contents,
            subBlocksId: targetBlock.subBlocksId !==null ? null : targetBlock.subBlocksId,
            editTime:editTime,
          };
          editBlock(page.id, editedBlock);
        }
        if(block.type ===toggle){
          const newSubToggleBlock :Block ={
            ...newBlock,
            parentBlocksId:[targetBlock.id],
            firstBlock:false,
          };
          addBlock(page.id, newSubToggleBlock, targetBlockIndex+1, targetBlock.id);
  
        }else{
          addBlock(page.id, newBlock,targetBlockIndex+1, targetBlock.id);
        };
      }else{
        // edite targetBlock 
        const cursor = document.getSelection();
        const offset =cursor?.anchorOffset;
        if(!(targetBlock.contents==="" && offset===0&& value ==="")){
          const editedBlock :Block ={
            ...targetBlock,
            contents: value,
            editTime:editTime,
          };
          if(targetBlock.contents !== value){
            const item={
              pageId: page.id,
              block: editedBlock
            };
            sessionStorage.setItem("itemsTobeEdited", JSON.stringify(item));
          }
        };
      };
    }
    if(!value.startsWith("/")){
      changeBlockContent();
    }else{
      setOpenComment(false);
      setCommand({
        boolean:true, 
        command:"/",
        targetBlock:targetBlock
      })
    }
  };
  const onKeyDownContents=(event:React.KeyboardEvent<HTMLDivElement>)=>{
    const code =event.code.toLowerCase();
    const targetBlock= findTargetBlock(event);
    /**
     * focus를 화면 상의 다음 블록의 contentEditable 에 옮기는 함수 
     * @param nextBlockId 화면상의 다음 블록의 아이디 
     */
    const moveFocus=(nextBlockId:string)=>{
        const contentsHtml = document.getElementById(`${nextBlockId}_contents`);
        if(contentsHtml!==null){
          const focusTargetHtml = contentsHtml.firstElementChild as HTMLElement;
          focusTargetHtml.focus();
        }else{
          console.log(`Can't find .${targetBlock.id}_contents html`);
        };
    };
    console.log("code", code);
    switch (code) {
      case "tab":
        event.preventDefault();
        setTemplateItem(templateHtml, page);
          const targetEditableDoc = document.getElementById(`block_${targetBlock.id}`)?.parentElement?.parentElement as HTMLElement ;
          const previousEditableDoc = targetEditableDoc.previousElementSibling as HTMLElement ;  
          const previousBlockDoc= previousEditableDoc.firstChild?.firstChild as HTMLElement;
          const previousBlockId = previousBlockDoc.id.slice(6);
          changeToSub(page.id, targetBlock,previousBlockId );
        break;
      case "backspace":
        setTemplateItem(templateHtml, page);
        const text =event.currentTarget.innerText;
        const cursor = document.getSelection();
        const offset =cursor?.anchorOffset;
        if(offset===0 && text===""){
          deleteBlock(page.id, targetBlock, false);
        }
        if(offset===0 && text!==""){
          raiseBlock(page.id, targetBlock )
        }

        break;
      case "arrowup":
          if(page.firstBlocksId!==null && page.firstBlocksId[0]!== targetBlock.id){
            let doing:boolean = true;
            let referenceBlock:Block = targetBlock;
            while (doing) {
              let previousBlockInDoc = findPreviousBlockInDoc(page, referenceBlock).previousBlockInDoc;
              if(previousBlockInDoc.type.includes("List")&& previousBlockInDoc.subBlocksId?.[0]===referenceBlock.id){
                previousBlockInDoc =findPreviousBlockInDoc(page, previousBlockInDoc).previousBlockInDoc;
              };
              if(possibleBlocksId.includes(previousBlockInDoc.id)){
                if(previousBlockInDoc.type.includes("List")&& previousBlockInDoc.subBlocksId!==null){
                  moveFocus(previousBlockInDoc.subBlocksId[previousBlockInDoc.subBlocksId.length-1]);
                }else{
                  moveFocus(previousBlockInDoc.id);
                }
                doing= false;
              }else{
                referenceBlock = previousBlockInDoc;
              }
          };
          }

        break;
      case "arrowdown":
        /**
         * cursor이동이 가능한 다음 블록의 type에 따라 어디로 cursor를 이동할 지 결정하는 함수
         * @param nextBlockId : 다음에 이동할 블록의 id
         */
        const setNextHtmlId =(nextBlockId:string)=>{
          const index = possibleBlocksId.indexOf(nextBlockId);
          const nextBlock = possibleBlocks[index];
          if(nextBlock.type.includes("List")&& nextBlock.subBlocksId!==null){
            moveFocus(nextBlock.subBlocksId[0]);
          }else{
          moveFocus(nextBlockId);
          };
        };
        /**
         * firstBlock== true 인 블록의 화면상의 다음 블록을 찾아 cursor를 해당 블록의 contentEditable로 옮겨줄 함수
         * @param firstBlock : 기준이 되는 블록
         */
        const findNextBlockOfFirstBlock=(firstBlock:Block)=>{
          console.log("find next of firstblock");
          if(page.firstBlocksId!==null){
            if(firstBlock.subBlocksId===null){
              const blockIndexAsFirstBlock = page.firstBlocksId.indexOf(firstBlock.id);
              if(blockIndexAsFirstBlock < page.firstBlocksId.length-1){
                for (let i = 1; i < page.firstBlocksId.length-blockIndexAsFirstBlock; i++) {
                  let 
                  nextBlockId =page.firstBlocksId[blockIndexAsFirstBlock+i];
                  if(possibleBlocksId.includes(nextBlockId)){
                    setNextHtmlId(nextBlockId);
                    i =page.firstBlocksId.length;
                  };
                }
              }
            }else{
              for (let i = 0; i < firstBlock.subBlocksId.length;  i++) {
                const firstSubBlockId = firstBlock.subBlocksId[i];
                if(possibleBlocksId.includes(firstSubBlockId)){
                  setNextHtmlId(firstSubBlockId);
                  i =firstBlock.subBlocksId.length;
                }
              }
            }

          }
        };
        /**
         *  어떤 블록의 subBlock인 블록의 화면상의 다음 블록을 찾아 cursor를 해당 블록의 contentEditable로 옮겨줄 함수
         * @param subBlock :  다음 블록을 찾을 기준이 되는 블록 
         */
        const findNextBlockOfSubBlock =(subBlock:Block)=>{
          if(subBlock.subBlocksId==null){
            const findNextBlockByParent=(block:Block)=>{
              const parentBlock = findParentBlock(page,block).parentBlock;
              if(parentBlock.subBlocksId!==null){
                const blockIndexAsSubBlock = parentBlock.subBlocksId.indexOf(block.id);
                if(blockIndexAsSubBlock === parentBlock.subBlocksId.length-1){
                  console.log("lastsubblock", parentBlock.firstBlock);
                  if(parentBlock.firstBlock && page.firstBlocksId !==null){
                    const parentBlockIndexAsFirst = page.firstBlocksId.indexOf(parentBlock.id);
                    if(parentBlockIndexAsFirst < page.firstBlocksId.length){
                      for (let i =1 ; i < page.firstBlocksId.length - parentBlockIndexAsFirst; i++) {
                        const nextBlockId = page.firstBlocksId[parentBlockIndexAsFirst +i];
                        console.log("possible", nextBlockId, possibleBlocksId.includes(nextBlockId))
                        if(possibleBlocksId.includes(nextBlockId)){
                          setNextHtmlId(nextBlockId);
                          i= page.firstBlocksId.length-1;
                        };
                      }
                    };
                  }else{
                    console.log("grand parent");
                    findNextBlockByParent(parentBlock);
                  }
                }else{
                  for (let i = 1; i < parentBlock.subBlocksId.length-blockIndexAsSubBlock; i++) {
                    const nextBlockId = parentBlock.subBlocksId[blockIndexAsSubBlock+i];
                    console.log("possible",possibleBlocksId.includes(nextBlockId) , nextBlockId, i);
                    if(possibleBlocksId.includes(nextBlockId)){
                      setNextHtmlId(nextBlockId);
                      i =parentBlock.subBlocksId.length;
                      
                    };
                  }
                }
              };
            };

            findNextBlockByParent(subBlock);
          }else{
            const firstSubBlockId= subBlock.subBlocksId[0];
            if(possibleBlocksId.includes(firstSubBlockId)){
              moveFocus(firstSubBlockId);
            };
          }

        };
        if(targetBlock.firstBlock ){
          findNextBlockOfFirstBlock(targetBlock);
        }else{
          findNextBlockOfSubBlock(targetBlock);
          };

        break;
        default:
        break;
    };
  };
  function commandChange (event:React.ChangeEvent<HTMLInputElement>){
    setTemplateItem(templateHtml, page);
    const value = event.target.value;
    const trueOrFale = value.startsWith("/");
    if(trueOrFale){
      setCommand({
        boolean: true , 
        command: value.toLowerCase(),
        targetBlock:command.targetBlock
      });
    }else {
      setCommand({
        boolean:false,
        command:null,
        targetBlock:null
      })
    };

  };
  function commandKeyUp(event:React.KeyboardEvent<HTMLInputElement>){
    const code= event.code;
    const firstOn =document.querySelector(".command_btn.on.first");
    if(code ==="Enter" && command.targetBlock!==null  ){
      const name = firstOn?.getAttribute("name") as string ;
      const blockType:BlockType = blockTypes.filter((type)=> name.includes(type))[0];
      const newBlock:Block={
        ...command.targetBlock,
        type: blockType,
        editTime:editTime
      };
      editBlock(page.id, newBlock);
      setCommand({
        boolean:false, 
        command:null 
        ,targetBlock:null});
        setTemplateItem(templateHtml, page);
    }
  };
  const onClickBlockContents =()=>{
    block.type=== "page" &&setTargetPageId(block.id);
  };
  const onClickAddFileBtn =()=>{
    setOpenLoader(true);
    setLoaderTargetBlock(block);
  };
  const onClickContentsCommentBtn=(event:MouseEvent<HTMLButtonElement> ,block:Block)=>{
    !command.boolean && onClickCommentBtn(block);
    
  };

  const BlockContentEditable=()=>{
    return(
      <>
      {!command.command || (command.targetBlock !==null && command.targetBlock.id !== block.id) ? 
        <ContentEditable
          className='contentEditable'
          placeholder="type '/' for commmands"
          html= {block.contents}
          innerRef={contentEditableRef}
          onChange={(event)=> onChangeContents(event )}
          onKeyDown={(event)=> onKeyDownContents(event)}
        /> 
        :
          <input
            type="text"
            tabIndex={-1}
            value={command.command}
            className='contentEditable'
            onChange={commandChange}
            onKeyUp={commandKeyUp}
          />
        }
      </>
    )
  };

  return(
    <div
      onClick={onClickBlockContents}
      className ={`${block.type}_blockComponent blockComponent`}
      onMouseOver={showBlockFn}
    >
      {!blockComments ?
      ( block.type==="page"?
        <button 
          className="contents pageTitle"
          id={`${block.id}_contents`}
        >
          <BlockContentEditable/>
        </button>
        :
        (block.type.includes("media") ?
        (block.contents===""?
          <button 
            className='addBlockFile'
            onClick={onClickAddFileBtn}
          >
            <span
              className="addBlockFileIcon"
            >
              {block.type ==="image media" &&
                <MdOutlinePhotoSizeSelectActual/>
              }
              {block.type ==="bookmark media" &&
                <MdOutlineCollectionsBookmark/>
              }
            </span>
            <span>
              Add a {block.type.slice(0, block.type.indexOf("media"))}
            </span>
            
          </button>
          :
          <>
            {block.type==="image media" &&
            <ImageContent
              page={page}
              block={block}
              editBlock={editBlock}
            />
            }
          </>
        )
        :
        <div 
          id={`${block.id}_contents`}
          className="contents"
        >
          <BlockContentEditable/>
        </div>
        )
      )
      :
      <button 
        id={`${block.id}_contents`}
        className="contents commentBtn"
        onClick={(event)=>onClickContentsCommentBtn(event, block)}
      >
        <BlockContentEditable/>
      </button>
      }
    </div>
  )
};

export default React.memo (BlockComponent);
