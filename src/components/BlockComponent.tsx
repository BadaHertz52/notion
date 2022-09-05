import React, { Dispatch, DragEvent, MouseEvent, SetStateAction, SyntheticEvent, useEffect, useRef, useState} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { IoChatboxOutline } from 'react-icons/io5';
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md';
import {  Block,BlockType,blockTypes,findBlock,findParentBlock,findPreviousBlockInDoc,makeNewBlock,Page, toggle } from '../modules/notion';
import { getContent } from './BlockStyler';
import { Command, selectionType } from './Frame';
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
type  BlockComponentProps ={
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
  setSelection:Dispatch<SetStateAction<selectionType|null>>
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

const BlockComponent=({block, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock ,blockComments , command, setCommand  ,onClickCommentBtn ,setOpenComment ,setTargetPageId ,setOpenLoader, setLoaderTargetBlock ,closeMenu ,templateHtml, setSelection }:BlockComponentProps)=>{
  const editTime =JSON.stringify(Date.now);
  const contentEditableRef= useRef<HTMLElement>(null);
  const possibleBlocks = page.blocks.filter((block:Block)=> block.type !=="image media" && block.type !=="page");
  const possibleBlocksId = possibleBlocks.map((block:Block)=> block.id );
  const findTargetBlock =(event:ContentEditableEvent|React.KeyboardEvent<HTMLDivElement>|MouseEvent| SyntheticEvent<HTMLDivElement>):Block=>{
    const target =event.currentTarget.parentElement as HTMLElement;
    const targetId= target.id;
    const end =targetId.indexOf("_contents");
    const blockId = targetId.slice(0, end);
    const targetBlock = findBlock(page, blockId).BLOCK;
    return targetBlock;
  };

  const showBlockFn=(event: MouseEvent)=>{
    closeMenu(event)
    const blockHtml =document.getElementById(`block_${block.id}`);
    if(blockHtml!==null){
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
                  if(parentBlock.firstBlock && page.firstBlocksId !==null){
                    const parentBlockIndexAsFirst = page.firstBlocksId.indexOf(parentBlock.id);
                    if(parentBlockIndexAsFirst < page.firstBlocksId.length){
                      for (let i =1 ; i < page.firstBlocksId.length - parentBlockIndexAsFirst; i++) {
                        const nextBlockId = page.firstBlocksId[parentBlockIndexAsFirst +i];
                        if(possibleBlocksId.includes(nextBlockId)){
                          setNextHtmlId(nextBlockId);
                          i= page.firstBlocksId.length-1;
                        };
                      }
                    };
                  }else{
                    findNextBlockByParent(parentBlock);
                  }
                }else{
                  for (let i = 1; i < parentBlock.subBlocksId.length-blockIndexAsSubBlock; i++) {
                    const nextBlockId = parentBlock.subBlocksId[blockIndexAsSubBlock+i];
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
  /**
   * block의 contents에서 반복되는 내용의 contents의 index를  보다 정확하게 찾을 수 있도록 해주는 함수 
   * @param node contentEditable의 childNode
   * @param block 
   * @return block.contents에서 node.textContent의 index
   */
  const getAccurateIndex=(node:Node, block:Block):{textIndex:number}=>{
    let totalSentence ="";
    const children = contentEditableRef.current?.childNodes as NodeListOf<Node> | undefined;
    if(children !==undefined){
      const childrenArry =Array.from(children);
      const nodeIndex= childrenArry.indexOf(node);
      console.log("node", node, childrenArry, nodeIndex )
      const preNodes =childrenArry.slice(0, nodeIndex);
      const array = preNodes.map((child:Node)=> {
        let value ="";
        if(child.nodeName==="SPAN"){
          const element =child as HTMLElement;
          value = element.outerHTML;
        }else{
          value = child.textContent as string;
        };
          return value;
      });
      console.log("array", array);
      totalSentence = array.join("");
      console.log("totalsentence", totalSentence)
    }else{
      console.log("Can't find contentEditable children")
    };
    const textIndex = totalSentence.length ;
    return {textIndex: textIndex}
  };
  /**
   * selection.anchorNode를 이용해 selection 이벤트로 선택된 영역의 시작 지점(selectedStartIndex)과 선택영역의 이전 부분(preChangedContent)을 반환하는 함수 
   * @param anchorNode 
   * @param block 
   * @returns preChangedContent:선택 영역의 앞의 부분으로, selection 메소드로 인한 변경사항이 있는 경우 변경된 값을 가짐 , selectedStartIndex: 선택된 영역의 block.contents에서의 시작하는 지점
   */ 
  const getFromAnchorNode=( anchorNode: Node, block:Block, selection:Selection):{preChangedContent:string, selectedStartIndex:number}=>{
    const contents =block.contents;
    /**
     * block.contents 중에서 anchorNode의 앞 부분
     */
    let preAnchor :string="";
    /**
     * 선택된 영역 앞부분
     */
    let preSelection="";
    /**
     * block.contents 에서 anchorNode의 index
     */
    let anchorStartIndex :number =0;
    /**
     * 선택된 영역이 block.contents에서의 index ,
     *  anchorStartIndex+ anchor에서 선택된 영역의 시작 index
     */
    let selectedStartIndex :number =0;
    const nodeParent = anchorNode.parentElement;
    if(anchorNode.textContent!==null){
      /**
       * anchorNode가 span의 child 인지의 여부에 따라 preSelection 과 selectedStartIndex의 값을 변경하는 함수
       * @param spanHtml  anchorNode가 span의 child일 경우 span.outerHTML, 아닐 경우 null 
       */
      const changeValueByAnchor =(spanHtml:null|string)=>{
        const text = spanHtml==null? anchorNode.textContent as string : spanHtml;
         //step 1. preAnchor, anchorStartIndex 
      if(contents.indexOf(text) === contents.lastIndexOf(text)){
        // 동일한 내용의 반복이 없는 경우
        anchorStartIndex= contents.indexOf(text)
        preAnchor = contents.slice(0, anchorStartIndex);
      }else{
        //동일한 내용이 반복되는 경우로 보다 정확한 특정이 필요함 
        const parentNode =spanHtml ==null? null : anchorNode.parentNode;
        anchorStartIndex= parentNode !==null?  
                          getAccurateIndex(parentNode, block).textIndex :
                          getAccurateIndex(anchorNode, block).textIndex;

        preAnchor = contents.slice(0, anchorStartIndex);
      };
      // step 2. preSelection , selectStartIndex
        /**
         * anchorNode에서 선택된 영역의 index
         */
        const anchorOffset = selection.anchorOffset;
        /**
         * anchorNode에서 선택된  부분의 앞 부분
         */
        const preSelectionInAnchor =text.slice(0, anchorOffset);
        preSelection =`${preAnchor}${preSelectionInAnchor}`;
        selectedStartIndex = anchorStartIndex + anchorOffset ;
      };

    if(nodeParent?.nodeName==="SPAN"){
       //anchorNode가 contentEditable의 자식 요소이 span의  textNode 인 경우 
      const spanHtml =nodeParent.outerHTML;
      changeValueByAnchor(spanHtml)
    }else{
     //anchorNode가 contentEditable의 textNode 인 경우 
      changeValueByAnchor(null);
    };
    }else{
      console.log(` Error :${anchorNode}'s textContent is null`)
    };
    const preChangedContent= nodeParent?.nodeName==="SPAN"? `${preSelection}</span>`: preSelection;
    return({
      preChangedContent:preChangedContent,
      selectedStartIndex:selectedStartIndex
    })
  };

  const getFromFouseNode=(focusNode: Node, block:Block, selection:Selection):{afterChangedContent:string, selectedEndIndex:number}=>{
    const contents =block.contents;
    /**
     * focusNode 이후의 contents 내용
     */
    let afterFocusNode :string="";
    /**
     * block.contents에서 focusNode의 index ( selected cotent의 끝의 index)
     */
    let focusStartIndex:number =0;
    /**
     * 선택된 영역의 뒷부분으로  focusNode에서 선택된 영역의 뒷부분 +afterFocusNode
     */
    let afterSelection :string="";
    /**
     * block.contents에서 선택된 내용의 끝 위치, focusStartIndex + focus에서 선택된 내용의 끝 index
     */
    let selectedEndIndex:number=0;

    const nodeParent = focusNode.parentElement;
    const nodeText = focusNode.textContent as string;
    /**
     * focustNode의 parentNode가 span이냐에 따라 afterSelection 과 selectedEndIndex의 값을 변경하는 함수
     * @param spanHtml   focusNode가 span의 child일 경우 span.outerHTML, 아닐 경우 null 
     */
    const changeValueByFocus=(spanHtml:null|string)=>{
      // text = nodeText or spanHtml 
      const text =spanHtml ===null? focusNode.textContent as string : spanHtml;
      //step1. afterFocus, focusStartIndex
      if(contents.indexOf(text) === contents.lastIndexOf(text)){
        //중복x 
        focusStartIndex= contents.indexOf(text);
        const focusEndIndex=  focusStartIndex + text.length-1; 
        afterFocusNode = contents.slice(focusEndIndex+1);
      }else{
        //중복0
        const parentNode = spanHtml !==null? null : focusNode.parentNode;
        const textIndex= parentNode !==null?  getAccurateIndex(parentNode, block).textIndex :getAccurateIndex(focusNode, block).textIndex ;
        focusStartIndex = textIndex;
        const focusEndIndex= textIndex + text.length-1
        afterFocusNode =contents.slice(focusEndIndex+1);
      };
      //step2. afterSelection ,selectedEndIndx 
        /**
         * focusNode 에서 selected 된 content가 끝나는 index
         */
        const endIndexInFocus= selection.focusOffset -1;
  
        selectedEndIndex = focusStartIndex + endIndexInFocus; 
        /**
         * span 에서 selected 된 content의 뒷부분
         */
        const afterFocusInSpan = text.slice(endIndexInFocus+1);
  
        afterSelection =`${afterFocusInSpan}${afterFocusNode}`;

    };
    if(nodeParent?.nodeName ==="SPAN"){
      const spanHtml = nodeParent.outerHTML;
      changeValueByFocus(spanHtml)
    }else{
      changeValueByFocus(null);
    };

    const afterChangedContent :string= nodeParent?.nodeName === "SPAN"? `<span class=${nodeParent?.className}>${afterSelection}`  : afterSelection ;
    console.log("afterselection", afterSelection, "endindex", selectedEndIndex ,contents[selectedEndIndex]);
    return({
      afterChangedContent:afterChangedContent,
      selectedEndIndex:selectedEndIndex
    })
  };

  const onSelectContents =(event:SyntheticEvent<HTMLDivElement>)=>{
    const targetBlock = findTargetBlock(event);
    let originBlock = targetBlock;
    const selectedHtml =document.querySelector(".selected");
    let newContents ="";
    console.log("selection", window.getSelection());
    if(selectedHtml!==null){
      selectedHtml.classList.remove("selected");
      originBlock = getContent(targetBlock);
    };
    const contents =originBlock.contents;
    const selection = window.getSelection();
    const selectedContent =window.getSelection()?.getRangeAt(0).toString();
    const changedContent= `<span class="selected">${selectedContent}</span>`;

    // 수정 ver2 node 수정
    if(selection !==null){
      const anchorNode= selection.anchorNode;
      const focusNode =selection.focusNode;
      if(anchorNode !==null && focusNode !==null){
        const {preChangedContent, selectedStartIndex} =getFromAnchorNode(anchorNode, originBlock, selection);
        const { afterChangedContent,
        selectedEndIndex} =getFromFouseNode(focusNode, originBlock, selection);
        
        const newSelected = contents.slice(selectedStartIndex, selectedEndIndex+1);

        const newContents =`${preChangedContent}<span class="selected">${newSelected}</span>${afterChangedContent}`; 

        editBlock(page.id, {
          ...originBlock,
          contents: newContents
        });
        setSelection({
          block:targetBlock
        });
      }
    }

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

    useEffect(()=>{
      if(command.boolean){
        const commentInputHtml =document.getElementById("commandInput");
        if(commentInputHtml!==null){
          commentInputHtml.focus();
        }
      }
    },[]);
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
          onSelect={(event)=>onSelectContents(event)}
        /> 
        :
          <input
            type="text"
            tabIndex={-1}
            value={command.command}
            id="commandInput"
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
      {block.type === "page" ?
        <button 
          className="contents pageTitle"
          id={`${block.id}_contents`}
        >
        <BlockContentEditable/>
        </button>
      :
        (!block.comments ?
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
        :
        <button 
        id={`${block.id}_contents`}
        className="contents commentBtn"
        onClick={(event)=>onClickContentsCommentBtn(event, block)}
      >
        <BlockContentEditable/>
      </button>
        )
      }
    </div>
  )
};

export default React.memo (BlockComponent);
