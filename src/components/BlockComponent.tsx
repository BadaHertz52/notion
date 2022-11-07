import React, { ChangeEvent, Dispatch,KeyboardEvent,MouseEvent, SetStateAction, SyntheticEvent, useEffect, useRef} from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { IoChatboxOutline } from 'react-icons/io5';
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md';
import {  Block,BlockType,blockTypes,findBlock,findPage,findParentBlock,findPreviousBlockInDoc,makeNewBlock,Page, toggle } from '../modules/notion';
import { Command, selectionType } from './Frame';
import ImageContent from './ImageContent';
/**
 * template 수정 시에 수정 이전 버전을 session storage에 저장하는 함수 (page의 내용을 변경하는 모든 함수에서 사용됨)
 * @param templateHtml #template 인 element로 template이 열린 경우에만 함수가 동작하도록 하기 위한 조건을 사용됨
 * @param page  현재 페이지 
 */
export const setTemplateItem=(templateHtml:HTMLElement|null, page:Page)=>{
  if(templateHtml!==null){
    const templateItem= sessionStorage.getItem("originTemplate");
    if(templateItem==null){
      const originTemplate= JSON.stringify(page);
      sessionStorage.setItem("originTemplate", originTemplate);
    }
  };
};

type  BlockComponentProps ={
  pages:Page[],
  pagesId:string[],
  block:Block,
  page:Page,
  editBlock :(pageId: string, block: Block) => void,
  addBlock: (pageId: string, block: Block, newBlockIndex: number, previousBlockId: string | null) => void,
  changeToSub: (pageId: string, block: Block, newParentBlockId: string) => void,
  raiseBlock: (pageId: string, block: Block) => void,
  deleteBlock: (pageId: string, block: Block ,isInMenu:boolean) => void,
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

const BlockComponent=({pages,pagesId,block, page ,addBlock,editBlock,changeToSub,raiseBlock, deleteBlock ,command, setCommand  ,onClickCommentBtn ,setOpenComment ,setTargetPageId ,setOpenLoader, setLoaderTargetBlock ,closeMenu ,templateHtml, setSelection }:BlockComponentProps)=>{
  const editTime =JSON.stringify(Date.now);
  const contentEditableRef= useRef<HTMLElement>(null);
  /**
   * 키보드 방향키(위/아래)로 이동 가능한 블럭
   */
  const possibleBlocks :Block[]|null = page.blocks !== null? page.blocks.filter((block:Block)=> block.type !=="image media" && block.type !=="page") : null;
  const possibleBlocksId :string[]|null = possibleBlocks !==null? possibleBlocks.map((block:Block)=> block.id ) : null;
  /**
   * 키보드, 마우스, select 이벤트의 타켓이 되는 block를 찾아서 반환하는 함수 
   * @param event type: ContentEditableEvent|KeyboardEvent<HTMLDivElement>|MouseEvent| SyntheticEvent<HTMLDivElement>
   * @returns block 
   */
  const findTargetBlock =(event:ContentEditableEvent|KeyboardEvent<HTMLDivElement>|MouseEvent| SyntheticEvent<HTMLDivElement>):Block=>{
    const target =event.currentTarget.parentElement as HTMLElement;
    const targetId= target.id;
    const end =targetId.indexOf("_contents");
    const blockId = targetId.slice(0, end);
    const targetBlock = findBlock(page, blockId).BLOCK;
    return targetBlock;
  };
  /**
   * 마우스가 block위를 움직일 경우, 해당 block의 element 옆에 blockFn compnent를 보여주는 함수 
   * @param event mouseEvent
   */
  const showBlockFn=(event: MouseEvent)=>{
    closeMenu(event)
      const currentTarget =event.currentTarget;
      const mainBlock= currentTarget.parentElement?.parentElement?.parentElement;
      if(mainBlock!==null && mainBlock!==undefined){
        const mainBlockDomRect =mainBlock?.getClientRects()[0];
        const editor = document.getElementsByClassName("editor")[0] ;
        const blockFn =templateHtml ==null? editor.querySelector(".blockFn"): templateHtml.querySelector('.blockFn');
        blockFn?.classList.toggle("on");
        blockFn?.classList.contains("on")?
        sessionStorage.setItem("blockFnTargetBlock", JSON.stringify(block))
        :
        sessionStorage.removeItem("blockFnTargetBlock");
        if(mainBlockDomRect!==undefined){
          if(templateHtml==null){
            const editorDomRect =editor.getClientRects()[0];
            const top =mainBlockDomRect.top +editor.scrollTop ;
            const left = mainBlockDomRect.x - editorDomRect.x - 45;
            const blockFnStyle =`top:${top}px; left:${left}px`;
            blockFn?.setAttribute("style",blockFnStyle);
          }else{
            const templateDomRect =templateHtml.getClientRects()[0];
              const top = mainBlockDomRect.top - templateDomRect.top ;
              const left =mainBlockDomRect.x - templateDomRect.x -45;
              blockFn?.setAttribute("style", `top:${top}px; left:${left}px`);
          }
        }
      };
  };
  /**
   * ContentEditable에서 block 의 content을 수정하는 함수 
   * @param event ContentEditableEvent
   */
  const onChangeContents=(event:ContentEditableEvent)=>{
    if(page.blocks!==null && page.blocksId!==null){
      setTemplateItem(templateHtml, page);
      const value =event.target.value;
      const targetBlock= findTargetBlock(event);
      const targetBlockIndex= page.blocksId.indexOf(targetBlock.id);
      /**
       * value값에 따라 새로운 블록을 생성하거나 기존 block의 content를 수정하는 함수 
       */
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
          if((targetBlock.contents!== editedContents) || (targetBlock.contents==="")|| (targetBlock.subBlocksId!==null)){
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
        // 타입 변경 명령어로 commandBlock 을 엶
        setOpenComment(false);
        setCommand({
          boolean:true, 
          command:"/",
          targetBlock:targetBlock
        })
      }
    }
  };
/**
 * 유저가 누른 키보드 키(tab,backspace,arrwoup,arrowdown)에 따라 서로 다른 함수를 작동시키는 함수 
 * tab 키 : 들여쓰기 (해당 이벤트가 일어난 block을 이전 block의 subBlock으로 변경)
 * backspace키 : block 의 contents를 수정, contents가 없을 경우에는 block을 삭제
 * arrowup, arrowdown: block을 기준으로 커셔의 위치를 이동 시킴
 * @param event KeyboardEvent<HTMLDivElement>
 */
  const onKeyDownContents=(event:KeyboardEvent<HTMLDivElement>)=>{
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
        const previousBlockIdInDoc =findPreviousBlockInDoc(page,targetBlock).previousBlockInDoc.id;
        if(previousBlockIdInDoc !==undefined){
          changeToSub(page.id, targetBlock, previousBlockIdInDoc);
        }else{
          console.log(`Cant' find block in front of ${targetBlock.id}block on screen`)
        }

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

              if(possibleBlocksId?.includes(previousBlockInDoc.id)){
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
          if(possibleBlocks!==null && possibleBlocksId!==null){
            const index = possibleBlocksId.indexOf(nextBlockId);
            const nextBlock = possibleBlocks[index];
            if(nextBlock.type.includes("List")&& nextBlock.subBlocksId!==null){
              moveFocus(nextBlock.subBlocksId[0]);
            }else{
            moveFocus(nextBlockId);
            };
          };

        };
        /**
         * firstBlock== true 인 블록의 화면상의 다음 블록을 찾아 cursor를 해당 블록의 contentEditable로 옮겨줄 함수
         * @param firstBlock : 기준이 되는 블록
         */
        const findNextBlockOfFirstBlock=(firstBlock:Block)=>{
          if(possibleBlocks!==null && possibleBlocksId!==null){
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
                        if(possibleBlocksId?.includes(nextBlockId)){
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
                    if(possibleBlocksId?.includes(nextBlockId)){
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
            if(possibleBlocksId?.includes(firstSubBlockId)){
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
  //Selection - onSelection 이벤트
  /**
   * node가 contentEditable.current의 childNodes의 하위일 경우,childNodes중에  해당 node의 상위 node를 찾는 함수 
   * @param node 
   * @param childNodes contentEditable.current의 childNodes
   * @returns node를 하위 요소로 하는 contentEditable.current의 childNode
   */
  const findNodeInChilNodes=(node:Node ,childNodes:Node[])=>{
    const parentNode =node.parentNode as Node;
    let childNode : any|Node;
    if(parentNode.parentElement?.className ==="contentEditable"){
      childNode =parentNode;
    }else{
      childNode =findNodeInChilNodes(parentNode,childNodes);
    }

    // else if(parentNode.parentNode?.parentElement?.className==="contentEditable"){
    //   childNode =parentNode.parentNode;
    // }
    return childNode;
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
      let childNode =node; 
      if(node.parentNode?.nodeName!=="DIV"){
        const CHILD = findNodeInChilNodes(node, childrenArry);
        if(CHILD !==undefined ){
          childNode= CHILD;
        }
      };
      const nodeIndex= childrenArry.indexOf(childNode);
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
      totalSentence = array.join("");
    }else{
      console.log("Can't find contentEditable children")
    };
    const textIndex = totalSentence.length ;
    return {textIndex: textIndex}
  };
  /**
   *  selection 이벤트로 선택된 영역의 시작 지점(selectedStartIndex)과 선택영역의 이전 부분(preChangedContent)을 반환하는 함수 
   * @param startNode select된 내용의 앞부분을 포함하고 있는 contentEditable의 childNode 
   * @param startOffset startNode의 offset 
   * @param block 
   * @returns preChangedContent:선택 영역의 앞의 부분으로, selection 메소드로 인한 변경사항이 있는 경우 변경된 값을 가짐 , selectedStartIndex: 선택된 영역의 block.contents에서의 시작하는 지점
   */ 
  const getFromStartNode=( startNode: Node, startOffset:number , block:Block):{preChangedContent:string, selectedStartIndex:number}=>{
    const contents =block.contents;
    /**
     * block.contents 중에서 startNode의 앞 부분
     */
    let preAnchor :string="";
    /**
     * 선택된 영역 앞부분
     */
    let preSelection="";
    /**
     * block.contents 에서 startNode의 index
     */
    let anchorStartIndex :number =0;
    /**
     * 선택된 영역이 block.contents에서의 index ,
     *  anchorStartIndex+ anchor에서 선택된 영역의 시작 index
     */
    let selectedStartIndex :number =0;
    const nodeParent = startNode.parentElement;

    if(startNode.textContent!==null){
      /**
       * startNode가 span의 child 인지의 여부에 따라 preSelection 과 selectedStartIndex의 값을 변경하는 함수
       * @param spanHtml  startNode가 span의 child일 경우 span.outerHTML, 아닐 경우 null 
       */
      const changeValueByAnchor =(spanHtml:null|string)=>{
        const text = spanHtml==null? startNode.textContent as string : spanHtml;
         //step 1. preAnchor, anchorStartIndex 
      if(contents.indexOf(text) === contents.lastIndexOf(text)){
        // 동일한 내용의 반복이 없는 경우
        anchorStartIndex= contents.indexOf(text)
        preAnchor = contents.slice(0, anchorStartIndex);
      }else{
        //동일한 내용이 반복되는 경우로 보다 정확한 특정이 필요함 
        const parentNode =spanHtml ==null? null : startNode.parentNode;
        anchorStartIndex= parentNode !==null?  
                          getAccurateIndex(parentNode, block).textIndex :
                          getAccurateIndex(startNode, block).textIndex;

        preAnchor = contents.slice(0, anchorStartIndex);
      };
      // step 2. preSelection , selectStartIndex
        /**
         * startNode에서 선택된  부분의 앞 부분
         */
        let preOfSelectionInAnchor="";
        if(spanHtml !==null){
          /**
           * span.
           */
            const startNodeText= startNode.textContent as string;
            /**
             * startNode.textContent 내에서 선택된 부분의 앞부분 
             */
            const preOfSelectionInNodeText= startNodeText.slice(0, startOffset);
            /**
             * span.outerHTML 내에서 preOfSelectionInNodeText의 index
             */
            const preOfSelectionInNodeTextIndex= spanHtml.indexOf(preOfSelectionInNodeText);

            preOfSelectionInAnchor = spanHtml.slice(0,preOfSelectionInNodeTextIndex+ preOfSelectionInNodeText.length);

            selectedStartIndex = anchorStartIndex + preOfSelectionInAnchor.length; 


        }else{
          preOfSelectionInAnchor =text.slice(0, startOffset);
          selectedStartIndex = anchorStartIndex + startOffset ;
        };
        preSelection =`${preAnchor}${preOfSelectionInAnchor}`;

      };

    if(nodeParent?.nodeName==="SPAN"){
       //startNode가 contentEditable의 자식 요소이 span의  textNode 인 경우 
      const spanHtml =nodeParent.outerHTML;
      changeValueByAnchor(spanHtml)
    }else{
     //startNode가 contentEditable의 textNode 인 경우 
      changeValueByAnchor(null);
    };
    }else{
      console.log(` Error :${startNode}'s textContent is null`)
    };
    const preChangedContent= (nodeParent?.nodeName==="SPAN" && startOffset>0 )? `${preSelection}</span>`: preSelection;

    return({
      preChangedContent:preChangedContent,
      selectedStartIndex:selectedStartIndex
    })
  };
  /**
   * selection 이벤트로 선택 영역이 끝나는 지점(selectedEndIndex)과 그 뒷부분의 내용(afterChangedContent)을 반환하는 함수
   * @param endNode  선택된 내용이 끝 나는 지점인 text을 가진 contentEditable.current의 childNode
   * @param endOffset endNode에서 select된 내용이 끝나는 text의 index  ; 
   * @param block 
   * @returns afterChangedContent:선택 영역의 앞의 부분으로, selection 메소드로 인한 변경사항이 있는 경우 변경된 값을 가짐 , selectedEndIndex: 선택된 영역의 block.contents에서의 시작하는 지점
   */
  const getFromEndNode=(endNode: Node,endOffset:number, block:Block):{afterChangedContent:string, selectedEndIndex:number}=>{
    const contents =block.contents;
    /**
     * endNode 이후의 contents 내용
     */
    let afterFocusNode :string="";
    /**
     * block.contents에서 endNode의 index ( selected cotent의 끝의 index)
     */
    let focusStartIndex:number =0;
    /**
     * 선택된 영역의 뒷부분으로  endNode에서 선택된 영역의 뒷부분 +afterFocusNode
     */
    let afterSelection :string="";
    /**
     * block.contents에서 선택된 내용의 끝 위치, focusStartIndex + focus에서 선택된 내용의 끝 index
     */
    let selectedEndIndex:number=0;
    const focusText =endNode.textContent as string;
    const nodeParent = endNode.parentElement;
    /**
     * focustNode의 parentNode가 span이냐에 따라 afterSelection 과 selectedEndIndex의 값을 변경하는 함수
     * @param spanHtml   endNode가 span의 child일 경우 span.outerHTML, 아닐 경우 null 
     */
    const changeValueByFocus=(spanHtml:null|string)=>{
      // text = nodeText or spanHtml 
      const text =spanHtml ===null? focusText : spanHtml;

      //step1. afterFocus, focusStartIndex
      if(contents.indexOf(text) === contents.lastIndexOf(text)){
        //중복x 
        focusStartIndex= contents.indexOf(text);
        const focusEndIndex=  focusStartIndex + text.length-1; 
        if(focusEndIndex === contents.length-1){
          afterFocusNode ="";
        }else{
          afterFocusNode = contents.slice(focusEndIndex+1);
        }
      
      }else{
        //중복0
        const parentNode = spanHtml ==null? null : endNode.parentNode;
        const textIndex= parentNode !==null?  getAccurateIndex(parentNode, block).textIndex :getAccurateIndex(endNode, block).textIndex ;
        focusStartIndex = textIndex;
        const focusEndIndex= textIndex + text.length-1
        afterFocusNode =contents.slice(focusEndIndex+1);

      };
      //step2. afterSelection ,selectedEndIndex
        /**
         * endNode.textContent 에서 selected 된 content의 뒷부분
         */
        let afterOfSelectedInFocus="";
        if(endOffset === focusText.length-1 ){
          afterOfSelectedInFocus="";
          selectedEndIndex =focusStartIndex + text.length-1;
        }else{
          if(spanHtml!==null){
            /**
             * focusText에서 선택된 부분의 뒷 부분
             */
            const afterOfSelectedInFocusText= focusText.slice(endOffset+1);
            /**
             * spanHtml에서 focusText에서 선택되지 않은 뒷 부분(=afterOfSelectedInFocusText)의 index
             */
            const afterOfSelectedInFocusTextIndex= spanHtml.indexOf(afterOfSelectedInFocusText);
  
            afterOfSelectedInFocus =spanHtml.slice(afterOfSelectedInFocusTextIndex);
            selectedEndIndex = focusStartIndex+  afterOfSelectedInFocusTextIndex -1;

          }else{
            afterOfSelectedInFocus = text.slice(endOffset +1);
            selectedEndIndex = focusStartIndex + endOffset ; 
          }
        };
        afterSelection =`${afterOfSelectedInFocus}${afterFocusNode}`

;

    };
    if(nodeParent?.nodeName ==="SPAN"){
      const spanHtml = nodeParent.outerHTML;
      changeValueByFocus(spanHtml)
    }else{
      changeValueByFocus(null);
    };

    const afterChangedContent :string= (nodeParent?.nodeName === "SPAN" && endOffset !== focusText.length-1)? `</span><span class="${nodeParent.className}">${afterSelection}`  : afterSelection ;

    return({
      afterChangedContent:afterChangedContent,
      selectedEndIndex:selectedEndIndex
    })
  };
/**
* parentElement가 HtmlAnchorElement이며 focustNode와 별개인 startNode의 textContent를 변경함 
* @param startOffset : startNode에서 select이 시작된 지점
* @param startNode select이 시작된 node
* @param startNodeText :startNode.textContent
* @param startParentNode :startNode.parentNode
*/
function updateStartParentNode(startOffset:number,startNode:Node,startNodeText:string, startParentNode:Node){
  const preSelectedInStartNode = startNodeText.slice(0, startOffset);
  const selectedInStartNode = startNodeText.slice(startOffset);
  const newSpan = document.createElement("span");
  newSpan.className="selected";
  newSpan.innerHTML =selectedInStartNode;
  const newStartNode =document.createTextNode(preSelectedInStartNode);
  startParentNode.replaceChild(newSpan, startNode);
  startParentNode.insertBefore(newStartNode, newSpan);
};
/**
  * parentElement가 HtmlAnchorElement이며 startNode와 별개인 endNode의 textContent를 변경함 
  * @param endOffset : endNode에서 select이 끝난 지점
  * @param endNode select이 끝난 node
  * @param endNodeText :endNode.textContent
  * @param endParentNode :endNode.parentNode
  */
function updateEndParentNode(endOffset:number,endNode:Node,endNodeText:string, endParentNode:Node){
  const afterSelectedInEndNode = endNodeText.slice(endOffset+1);
  const selectedInEndNode =endNodeText.slice(0, endOffset+1);
  const newEndNode= document.createTextNode(afterSelectedInEndNode);
  const newSpan =document.createElement("span");
  newSpan.className="selected";
  newSpan.innerHTML =selectedInEndNode;
  if(afterSelectedInEndNode!==""){
    endParentNode.replaceChild(newEndNode,endNode);
    endParentNode.insertBefore(newSpan,newEndNode);
  }else{
    endParentNode.replaceChild(newSpan,endNode);
  };
};
/**
  *select가 일어날 때 anchorNode와  endNode사이의 다른 node들이 존재할 경우, 그 node들도 selected class를 가지도록 수정하는 함수
  * @param startIndex : contentEditable.current.childNodes 중에 startNode이거나 이를 자식으로 둔 Node 
  * @param  endIndex : contentEditable.current.childNodes 중에 endNode이거나 이를 자식으로 둔 Node 
  * @param endNode: select가 끝난 node
  * @param childNodes: contentEditable.current.childNodes
  */
function updateMiddleChildren(startIndex:number, endIndex:number,endNode:Node, childNodes:Node[]){
  const middleChildren =childNodes.slice(startIndex, endIndex);
  const middleText =middleChildren.map((c:Node)=>{
    let data="";
    if(c.nodeName==="#text"){
      data = c.textContent as string ;
    }else{
      const element =c as Element;
      data = element.outerHTML;
    };
    return data
  });
  const newSpan =document.createElement("span");
  newSpan.className= "selected";
  newSpan.innerHTML =middleText.join();
  middleChildren.forEach((c:Node)=>contentEditableRef.current?.removeChild(c));
  contentEditableRef.current?.insertBefore(newSpan, endNode);
 };
  /**
   *block의 content 를 마우스로 선택 시, block의 content를 선택된 부분(class 가 selected인 span element)과 아닌 부분으로 수정하는 함수
   */
  const onSelectContents =(event:SyntheticEvent<HTMLDivElement>)=>{
    const SELECTION = window.getSelection(); 
    /**
     * 마우스 드래그를 통한 select 이  아닌 경우
     */
    const notSelect = (SELECTION?.anchorNode === SELECTION?.focusNode && SELECTION?.anchorOffset === SELECTION?.focusOffset);
    if(SELECTION !==null && !notSelect ){
      const anchorNode= SELECTION.anchorNode;
      const anchorOffset =SELECTION.anchorOffset;
      const focusNode =SELECTION.focusNode;
      const focusOffset= SELECTION.focusOffset;
      const targetBlock = findTargetBlock(event);
      const contents =targetBlock.contents;

      if(anchorNode !==null && focusNode !==null && contentEditableRef.current!==null){
        const contentEditableChild = contentEditableRef.current.childNodes as NodeListOf<Node>;
        const childNodes =Array.from(contentEditableChild);

        let anchorIndex =0;
        let focusIndex=0;
        
        if(anchorNode.parentNode?.nodeName!=="DIV"){
          const childNode =findNodeInChilNodes(anchorNode, childNodes) as Node;
          anchorIndex = childNodes.indexOf(childNode);
        }else{
          anchorIndex =childNodes.indexOf(anchorNode);
        };

        if(focusNode.parentNode?.nodeName !=="DIV"){
          const childNode =findNodeInChilNodes(focusNode ,childNodes) as Node;
          focusIndex = childNodes.indexOf(childNode);
        }else{
          focusIndex =childNodes.indexOf(focusNode);
        };
        const sameNode = anchorNode ===focusNode ;               
        /**
         * select 된 내용의 시작점이 위치한 node
         */
        const startNode = anchorIndex < focusIndex? anchorNode :focusNode;
        const startIndex = startNode===anchorNode? anchorIndex : focusIndex;
        /**
         * select된 내용이 끝나는 지점이 위치한 node
         */
        const endNode =anchorIndex <= focusIndex ? focusNode :anchorNode;
        const endIndex = endNode===focusNode? focusIndex:anchorIndex;
        /**
         * startNode에서 select된 내용의 시작점의 index 
         */
        const startOffset = sameNode? 
                            (anchorOffset<focusOffset? anchorOffset : focusOffset) 
                            :
                            (startNode === anchorNode? anchorOffset : focusOffset);
        /**
         * endNode에서 select된 내용이 끝나는 지점의 index  ,
         */
        const endOffset= startOffset=== anchorOffset ? focusOffset -1: anchorOffset -1 ;

        const startNodeText =startNode.textContent as string; 
        const endNodeText =endNode.textContent as string; 

        if(anchorNode.parentElement?.tagName !=="A" && focusNode.parentElement?.tagName !=="A"){
          const {preChangedContent, selectedStartIndex} =getFromStartNode(startNode, startOffset, targetBlock);
          const { afterChangedContent,
          selectedEndIndex} =getFromEndNode(endNode,endOffset, targetBlock);
          const newSelected = contents.slice(selectedStartIndex, selectedEndIndex+1);
  
          const newContents =`${preChangedContent}<span class="selected">${newSelected}</span>${afterChangedContent}`; 
          editBlock(page.id, {
            ...targetBlock,
            contents: newContents
          });
        }else{
          const startParentIsA =startNode.parentElement?.tagName==="A";
          const endParentIsA = endNode.parentElement?.tagName==="A"
          const startParentNode =startNode.parentNode;
          const endParentNode =endNode.parentNode;

          if(startParentIsA&& endParentIsA &&(startNode=== endNode)){
            const innerHtml = startNodeText.slice(startOffset,endOffset+1);
            const preText =startNodeText.slice(0, startOffset);
            const afterText =startNodeText.slice(endOffset+1);
            const newSpan= document.createElement("span");
            newSpan.innerHTML =innerHtml;
            newSpan.className="selected";
      
            if(afterText!==""){
              const afterNode= document.createTextNode(afterText);
              startNode.parentNode?.insertBefore(newSpan, startNode);
              startNode.parentNode?.replaceChild(afterNode, startNode);
            }else{
              startNode.parentNode?.replaceChild(newSpan, startNode);
            };
            if(preText!==""){
              const preNode =document.createTextNode(preText);
              startNode.parentNode?.insertBefore(preNode,newSpan);
            };

            
          }else{
            if(endOffset > startOffset+1){
              updateMiddleChildren(startIndex,endIndex,endNode,childNodes);
            };
            startParentNode!==null && updateStartParentNode(startOffset, startNode, startNodeText, startParentNode);
            endParentNode !==null && updateEndParentNode(endOffset, endNode, endNodeText, endParentNode);

          }

          const newContents = document.getElementById(`${targetBlock.id}_contents`)?.firstElementChild?.innerHTML;
          if(newContents !==null && newContents!==undefined){
            const editedBlock:Block ={
              ...targetBlock,
              contents: newContents,
              editTime:editTime
            };
            editBlock(page.id, editedBlock);
          }
        };

        setSelection({
          block:targetBlock,
          change:false
        });
      }
    }

  };
  /**
   * BlockComponent 중 link 가 있는 element를 클릭 했을 경우 , 해당 링크를 여는 함수 
   */
  const onClickLinkInContents=(event:MouseEvent)=>{
    const target =event.target as HTMLElement;
    if(target.className==="link"){
      const href =target.getAttribute("href") ;
      const openType =target.getAttribute("target");
      href!==null&& openType!==null&&
      window.open(href,openType);
    };
  };
  /**
   * input 창을 통해 command의 값을 변경 시키는 함수 
   * @param event ChangeEvent<HTMLInputElement>
   */
  function commandChange (event:ChangeEvent<HTMLInputElement>){
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
  /**
   * enter 키를 누르면 block 의 type을 commandBlock 에서 현재 제일 위에 있는 type으로 변경하는 함수  
   * @param event KeyboardEvent<HTMLInputElement>
   */
  function commandKeyUp(event:KeyboardEvent<HTMLInputElement>){
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
  /**
   * block type이 page인 block에 대한 BlockComponent를 클릭 할 경우, 해당 page로 이동하는 함수 
   */
  const onClickBlockContents =()=>{
    block.type=== "page" &&setTargetPageId(block.id);
  };
  /**
   * image tyoe의 block에 넣은 이미지 파일을 선택하기 위한 버튼을 클릭한 경우 작동하는 함수로, Loader componenet를 엶
   */
  const onClickAddFileBtn =()=>{
    setOpenLoader(true);
    setLoaderTargetBlock(block);
  };
  const onClickContentsCommentBtn=(event:MouseEvent<HTMLButtonElement> ,block:Block)=>{
    !command.boolean && onClickCommentBtn(block);
    
  };
  
  const BlockContentEditable=()=>{
    const getPageTitle =()=>{
      const targetPage =findPage(pagesId, pages, block.id);
      const title =targetPage.header.title;
      return title
    };
    const blockContents = block.type ==="page"? getPageTitle(): block.contents;
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
          placeholder="Type '/' for commmands"
          html= {blockContents}
          innerRef={contentEditableRef}
          onChange={(event)=> onChangeContents(event )}
          onKeyDown={(event)=> onKeyDownContents(event)}
          onSelect={(event)=>onSelectContents(event)}
          onClick={(event)=>onClickLinkInContents(event)}
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
      className ={`${block.type}_blockComponent blockComponent`}
      onClick={onClickBlockContents}
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
