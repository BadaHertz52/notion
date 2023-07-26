import { Dispatch, SetStateAction } from "react";
import { Block, Page } from "../modules/notion/type";
import { SelectionType } from "../containers/NotionRouter";
import { isMobile } from ".";

// onSelection 이벤트 ---
/**
 * node가 contentEditable.current의 childNodes의 하위일 경우,childNodes중에  해당 node의 상위 node를 찾는 함수
 * @param node
 * @param childNodes contentEditable.current의 childNodes
 * @returns node를 하위 요소로 하는 contentEditable.current의 childNode
 */
const findNodeInChildNodes = (node: Node, childNodes: Node[]) => {
  const parentNode = node.parentNode as Node;
  let childNode: any | Node;
  if (parentNode.parentElement?.className === "contentEditable") {
    childNode = parentNode;
  } else {
    childNode = findNodeInChildNodes(parentNode, childNodes);
  }
  return childNode;
};
/**
 * block의 contents에서 반복되는 내용의 contents의 index를  보다 정확하게 찾을 수 있도록 해주는 함수
 * @param node contentEditable의 childNode
 * @param block
 * @return block.contents에서 node.textContent의 index
 */
const getAccurateIndex = (
  node: Node,
  block: Block,
  contentEditableHtml: HTMLElement | null
): { textIndex: number } => {
  let totalSentence = "";
  const children = contentEditableHtml?.childNodes as
    | NodeListOf<Node>
    | undefined;
  if (children) {
    const childrenArr = Array.from(children);
    let childNode = node;
    if (node.parentNode?.nodeName !== "DIV") {
      const CHILD = findNodeInChildNodes(node, childrenArr);
      if (CHILD) {
        childNode = CHILD;
      }
    }
    const nodeIndex = childrenArr.indexOf(childNode);
    const preNodes = childrenArr.slice(0, nodeIndex);
    const array = preNodes.map((child: Node) => {
      let value = "";
      if (child.nodeName === "SPAN") {
        const element = child as HTMLElement;
        value = element.outerHTML;
      } else {
        value = child.textContent as string;
      }
      return value;
    });
    totalSentence = array.join("");
  } else {
    console.error("Can't find contentEditable children");
  }
  const textIndex = totalSentence.length;
  return { textIndex: textIndex };
};
/**
 *  selection 이벤트로 선택된 영역의 시작 지점(selectedStartIndex)과 선택영역의 이전 부분(preChangedContent)을 반환하는 함수
 * @param startNode select된 내용의 앞부분을 포함하고 있는 contentEditable의 childNode
 * @param startOffset startNode의 offset
 * @param block
 * @returns preChangedContent:선택 영역의 앞의 부분으로, selection 메소드로 인한 변경사항이 있는 경우 변경된 값을 가짐 , selectedStartIndex: 선택된 영역의 block.contents에서의 시작하는 지점
 */
const getFromStartNode = (
  startNode: Node,
  startOffset: number,
  block: Block,
  contentEditableHtml: HTMLElement | null
): { preChangedContent: string; selectedStartIndex: number } => {
  const contents = block.contents;
  /**
   * block.contents 중에서 startNode의 앞 부분
   */
  let preAnchor: string = "";
  /**
   * 선택된 영역 앞부분
   */
  let preSelection = "";
  /**
   * block.contents 에서 startNode의 index
   */
  let anchorStartIndex: number = 0;
  /**
   * 선택된 영역이 block.contents에서의 index ,
   *  anchorStartIndex+ anchor에서 선택된 영역의 시작 index
   */
  let selectedStartIndex: number = 0;
  const nodeParent = startNode.parentElement;

  if (startNode.textContent) {
    /**
     * startNode가 span의 child 인지의 여부에 따라 preSelection 과 selectedStartIndex의 값을 변경하는 함수
     * @param spanHtml  startNode가 span의 child일 경우 span.outerHTML, 아닐 경우 null
     */
    const changeValueByAnchor = (spanHtml: null | string) => {
      const text =
        spanHtml === null ? (startNode.textContent as string) : spanHtml;
      //step 1. preAnchor, anchorStartIndex
      if (contents.indexOf(text) === contents.lastIndexOf(text)) {
        // 동일한 내용의 반복이 없는 경우
        anchorStartIndex = contents.indexOf(text);
        preAnchor = contents.slice(0, anchorStartIndex);
      } else {
        //동일한 내용이 반복되는 경우로 보다 정확한 특정이 필요함
        const parentNode = spanHtml === null ? null : startNode.parentNode;
        anchorStartIndex = parentNode
          ? getAccurateIndex(parentNode, block, contentEditableHtml).textIndex
          : getAccurateIndex(startNode, block, contentEditableHtml).textIndex;

        preAnchor = contents.slice(0, anchorStartIndex);
      }
      // step 2. preSelection , selectStartIndex
      /**
       * startNode에서 선택된  부분의 앞 부분
       */
      let preOfSelectionInAnchor = "";
      if (spanHtml) {
        /**
         * span.
         */
        const startNodeText = startNode.textContent as string;
        /**
         * startNode.textContent 내에서 선택된 부분의 앞부분
         */
        const preOfSelectionInNodeText = startNodeText.slice(0, startOffset);
        /**
         * span.outerHTML 내에서 preOfSelectionInNodeText의 index
         */
        const preOfSelectionInNodeTextIndex = spanHtml.indexOf(
          preOfSelectionInNodeText
        );

        preOfSelectionInAnchor = spanHtml.slice(
          0,
          preOfSelectionInNodeTextIndex + preOfSelectionInNodeText.length
        );

        selectedStartIndex = anchorStartIndex + preOfSelectionInAnchor.length;
      } else {
        preOfSelectionInAnchor = text.slice(0, startOffset);
        selectedStartIndex = anchorStartIndex + startOffset;
      }
      preSelection = `${preAnchor}${preOfSelectionInAnchor}`;
    };

    if (nodeParent?.nodeName === "SPAN") {
      //startNode가 contentEditable의 자식 요소이 span의  textNode 인 경우
      const spanHtml = nodeParent.outerHTML;
      changeValueByAnchor(spanHtml);
    } else {
      //startNode가 contentEditable의 textNode 인 경우
      changeValueByAnchor(null);
    }
  } else {
    console.error(` Error :${startNode}'s textContent is null`);
  }
  const preChangedContent =
    nodeParent?.nodeName === "SPAN" && startOffset > 0
      ? `${preSelection}</span>`
      : preSelection;

  return {
    preChangedContent: preChangedContent,
    selectedStartIndex: selectedStartIndex,
  };
};
/**
 * selection 이벤트로 선택 영역이 끝나는 지점(selectedEndIndex)과 그 뒷부분의 내용(afterChangedContent)을 반환하는 함수
 * @param endNode  선택된 내용이 끝 나는 지점인 text을 가진 contentEditable.current의 childNode
 * @param endOffset endNode에서 select된 내용이 끝나는 text의 index  ;
 * @param block
 * @returns afterChangedContent:선택 영역의 앞의 부분으로, selection 메소드로 인한 변경사항이 있는 경우 변경된 값을 가짐 , selectedEndIndex: 선택된 영역의 block.contents에서의 시작하는 지점
 */
const getFromEndNode = (
  endNode: Node,
  endOffset: number,
  block: Block,
  contentEditableHtml: HTMLElement | null
): { afterChangedContent: string; selectedEndIndex: number } => {
  const contents = block.contents;
  /**
   * endNode 이후의 contents 내용
   */
  let afterFocusNode: string = "";
  /**
   * block.contents에서 endNode의 index ( selected content의 끝의 index)
   */
  let focusStartIndex: number = 0;
  /**
   * 선택된 영역의 뒷부분으로  endNode에서 선택된 영역의 뒷부분 +afterFocusNode
   */
  let afterSelection: string = "";
  /**
   * block.contents에서 선택된 내용의 끝 위치, focusStartIndex + focus에서 선택된 내용의 끝 index
   */
  let selectedEndIndex: number = 0;
  const focusText = endNode.textContent as string;
  const nodeParent = endNode.parentElement;
  /**
   * focusNode의 parentNode가 span이냐에 따라 afterSelection 과 selectedEndIndex의 값을 변경하는 함수
   * @param spanHtml   endNode가 span의 child일 경우 span.outerHTML, 아닐 경우 null
   */
  const changeValueByFocus = (spanHtml: null | string) => {
    // text = nodeText or spanHtml
    const text = spanHtml === null ? focusText : spanHtml;

    //step1. afterFocus, focusStartIndex
    if (contents.indexOf(text) === contents.lastIndexOf(text)) {
      //중복x
      focusStartIndex = contents.indexOf(text);
      const focusEndIndex = focusStartIndex + text.length - 1;
      if (focusEndIndex === contents.length - 1) {
        afterFocusNode = "";
      } else {
        afterFocusNode = contents.slice(focusEndIndex + 1);
      }
    } else {
      //중복0
      const parentNode = spanHtml === null ? null : endNode.parentNode;
      const textIndex = parentNode
        ? getAccurateIndex(parentNode, block, contentEditableHtml).textIndex
        : getAccurateIndex(endNode, block, contentEditableHtml).textIndex;
      focusStartIndex = textIndex;
      const focusEndIndex = textIndex + text.length - 1;
      afterFocusNode = contents.slice(focusEndIndex + 1);
    }
    //step2. afterSelection ,selectedEndIndex
    /**
     * endNode.textContent 에서 selected 된 content의 뒷부분
     */
    let afterOfSelectedInFocus = "";
    if (endOffset === focusText.length - 1) {
      afterOfSelectedInFocus = "";
      selectedEndIndex = focusStartIndex + text.length - 1;
    } else {
      if (spanHtml) {
        /**
         * focusText에서 선택된 부분의 뒷 부분
         */
        const afterOfSelectedInFocusText = focusText.slice(endOffset + 1);
        /**
         * spanHtml에서 focusText에서 선택되지 않은 뒷 부분(=afterOfSelectedInFocusText)의 index
         */
        const afterOfSelectedInFocusTextIndex = spanHtml.indexOf(
          afterOfSelectedInFocusText
        );

        afterOfSelectedInFocus = spanHtml.slice(
          afterOfSelectedInFocusTextIndex
        );
        selectedEndIndex =
          focusStartIndex + afterOfSelectedInFocusTextIndex - 1;
      } else {
        afterOfSelectedInFocus = text.slice(endOffset + 1);
        selectedEndIndex = focusStartIndex + endOffset;
      }
    }
    afterSelection = `${afterOfSelectedInFocus}${afterFocusNode}`;
  };
  if (nodeParent?.nodeName === "SPAN") {
    const spanHtml = nodeParent.outerHTML;
    changeValueByFocus(spanHtml);
  } else {
    changeValueByFocus(null);
  }

  const afterChangedContent: string =
    nodeParent?.nodeName === "SPAN" && endOffset !== focusText.length - 1
      ? `</span><span class="${nodeParent.className}">${afterSelection}`
      : afterSelection;

  return {
    afterChangedContent: afterChangedContent,
    selectedEndIndex: selectedEndIndex,
  };
};
/**
 * parentElement가 HtmlAnchorElement이며 focusNode와 별개인 startNode의 textContent를 변경함
 * @param startOffset : startNode에서 select이 시작된 지점
 * @param startNode select이 시작된 node
 * @param startNodeText :startNode.textContent
 * @param startParentNode :startNode.parentNode
 */
function updateStartParentNode(
  startOffset: number,
  startNode: Node,
  startNodeText: string,
  startParentNode: Node
) {
  const preSelectedInStartNode = startNodeText.slice(0, startOffset);
  const selectedInStartNode = startNodeText.slice(startOffset);
  const newSpan = document.createElement("span");
  newSpan.className = "selected";
  newSpan.innerHTML = selectedInStartNode;
  const newStartNode = document.createTextNode(preSelectedInStartNode);
  startParentNode.replaceChild(newSpan, startNode);
  startParentNode.insertBefore(newStartNode, newSpan);
}
/**
 * parentElement가 HtmlAnchorElement이며 startNode와 별개인 endNode의 textContent를 변경함
 * @param endOffset : endNode에서 select이 끝난 지점
 * @param endNode select이 끝난 node
 * @param endNodeText :endNode.textContent
 * @param endParentNode :endNode.parentNode
 */
function updateEndParentNode(
  endOffset: number,
  endNode: Node,
  endNodeText: string,
  endParentNode: Node
) {
  const afterSelectedInEndNode = endNodeText.slice(endOffset + 1);
  const selectedInEndNode = endNodeText.slice(0, endOffset + 1);
  const newEndNode = document.createTextNode(afterSelectedInEndNode);
  const newSpan = document.createElement("span");
  newSpan.className = "selected";
  newSpan.innerHTML = selectedInEndNode;
  if (afterSelectedInEndNode !== "") {
    endParentNode.replaceChild(newEndNode, endNode);
    endParentNode.insertBefore(newSpan, newEndNode);
  } else {
    endParentNode.replaceChild(newSpan, endNode);
  }
}
/**
 *select가 일어날 때 anchorNode와  endNode사이의 다른 node들이 존재할 경우, 그 node들도 selected class를 가지도록 수정하는 함수
 * @param startIndex : contentEditable.current.childNodes 중에 startNode이거나 이를 자식으로 둔 Node
 * @param  endIndex : contentEditable.current.childNodes 중에 endNode이거나 이를 자식으로 둔 Node
 * @param endNode: select가 끝난 node
 * @param childNodes: contentEditable.current.childNodes
 */
function updateMiddleChildren(
  startIndex: number,
  endIndex: number,
  endNode: Node,
  childNodes: Node[],
  contentEditableHtml: HTMLElement | null
) {
  const middleChildren = childNodes.slice(startIndex, endIndex);
  const middleText = middleChildren.map((c: Node) => {
    let data = "";
    if (c.nodeName === "#text") {
      data = c.textContent as string;
    } else {
      const element = c as Element;
      data = element.outerHTML;
    }
    return data;
  });
  const newSpan = document.createElement("span");
  newSpan.className = "selected";
  newSpan.innerHTML = middleText.join();
  middleChildren.forEach((c: Node) => contentEditableHtml?.removeChild(c));
  contentEditableHtml?.insertBefore(newSpan, endNode);
}
export const selectContent = (
  SELECTION: Selection | null,
  targetBlock: Block,
  contentEditableHtml: HTMLElement | null,
  editBlock: ((pageId: string, block: Block) => void) | null,
  page: Page,
  setSelection: Dispatch<SetStateAction<SelectionType | null>> | null
) => {
  const notSelect =
    SELECTION?.anchorNode === SELECTION?.focusNode &&
    SELECTION?.anchorOffset === SELECTION?.focusOffset;
  if (SELECTION && !notSelect) {
    const anchorNode = SELECTION.anchorNode;
    const anchorOffset = SELECTION.anchorOffset;
    const focusNode = SELECTION.focusNode;
    const focusOffset = SELECTION.focusOffset;
    const contents = targetBlock.contents;
    if (anchorNode && focusNode && contentEditableHtml) {
      const contentEditableChild =
        contentEditableHtml.childNodes as NodeListOf<Node>;
      const childNodes = Array.from(contentEditableChild);
      let anchorIndex = 0;
      let focusIndex = 0;
      if (anchorNode.parentNode?.nodeName !== "DIV") {
        const childNode = findNodeInChildNodes(anchorNode, childNodes) as Node;
        anchorIndex = childNodes.indexOf(childNode);
      } else {
        anchorIndex = childNodes.indexOf(anchorNode);
      }
      if (focusNode.parentNode?.nodeName !== "DIV") {
        const childNode = findNodeInChildNodes(focusNode, childNodes) as Node;
        focusIndex = childNodes.indexOf(childNode);
      } else {
        focusIndex = childNodes.indexOf(focusNode);
      }
      const sameNode = anchorNode === focusNode;
      /**
       * select 된 내용의 시작점이 위치한 node
       */
      const startNode = anchorIndex < focusIndex ? anchorNode : focusNode;
      const startIndex = startNode === anchorNode ? anchorIndex : focusIndex;
      /**
       * select된 내용이 끝나는 지점이 위치한 node
       */
      const endNode = anchorIndex <= focusIndex ? focusNode : anchorNode;
      const endIndex = endNode === focusNode ? focusIndex : anchorIndex;
      /**
       * startNode에서 select된 내용의 시작점의 index
       */
      const startOffset = sameNode
        ? anchorOffset < focusOffset
          ? anchorOffset
          : focusOffset
        : startNode === anchorNode
        ? anchorOffset
        : focusOffset;
      /**
       * endNode에서 select된 내용이 끝나는 지점의 index  ,
       */
      const endOffset =
        startOffset === anchorOffset ? focusOffset - 1 : anchorOffset - 1;
      const startNodeText = startNode.textContent as string;
      const endNodeText = endNode.textContent as string;

      if (
        anchorNode.parentElement?.tagName !== "A" &&
        focusNode.parentElement?.tagName !== "A"
      ) {
        const { preChangedContent, selectedStartIndex } = getFromStartNode(
          startNode,
          startOffset,
          targetBlock,
          contentEditableHtml
        );
        const { afterChangedContent, selectedEndIndex } = getFromEndNode(
          endNode,
          endOffset,
          targetBlock,
          contentEditableHtml
        );
        const newSelected = contents.slice(
          selectedStartIndex,
          selectedEndIndex + 1
        );
        const newContents = `${preChangedContent}<span class="selected">${newSelected}</span>${afterChangedContent}`;
        contentEditableHtml.innerHTML = newContents;
        editBlock &&
          editBlock(page.id, {
            ...targetBlock,
            contents: newContents,
          });
      } else {
        const startParentIsA = startNode.parentElement?.tagName === "A";
        const endParentIsA = endNode.parentElement?.tagName === "A";
        const startParentNode = startNode.parentNode;
        const endParentNode = endNode.parentNode;
        if (startParentIsA && endParentIsA && startNode === endNode) {
          const innerHtml = startNodeText.slice(startOffset, endOffset + 1);
          const preText = startNodeText.slice(0, startOffset);
          const afterText = startNodeText.slice(endOffset + 1);
          const newSpan = document.createElement("span");
          newSpan.innerHTML = innerHtml;
          newSpan.className = "selected";

          if (afterText !== "") {
            const afterNode = document.createTextNode(afterText);
            startNode.parentNode?.insertBefore(newSpan, startNode);
            startNode.parentNode?.replaceChild(afterNode, startNode);
          } else {
            startNode.parentNode?.replaceChild(newSpan, startNode);
          }
          if (preText !== "") {
            const preNode = document.createTextNode(preText);
            startNode.parentNode?.insertBefore(preNode, newSpan);
          }
        } else {
          if (endOffset > startOffset + 1) {
            updateMiddleChildren(
              startIndex,
              endIndex,
              endNode,
              childNodes,
              contentEditableHtml
            );
          }
          startParentNode &&
            updateStartParentNode(
              startOffset,
              startNode,
              startNodeText,
              startParentNode
            );
          endParentNode &&
            updateEndParentNode(endOffset, endNode, endNodeText, endParentNode);
        }
        const newContents = document.getElementById(
          `${targetBlock.id}__contents`
        )?.firstElementChild?.innerHTML;
        if (newContents) {
          const editedBlock: Block = {
            ...targetBlock,
            contents: newContents,
            editTime: JSON.stringify(Date.now()),
          };
          editBlock && editBlock(page.id, editedBlock);
        }
      }
      if (!isMobile()) {
        setSelection &&
          setSelection({
            block: targetBlock,
            change: false,
          });
      }
    }
  }
};

//-- onSelection 이벤트

// select 취소 변경  -----
/**
 *  select 하거나, 이를 취소한 경우, 변경된 블럭의 contents를 가져오는  함수로 만약 BlockStyler로 스타일을 변경하다면, 스타일 변경 후에 해당 함수를 사용해야 한다.
 * @param block
 * @returns
 */
export const getContent = (block: Block): Block => {
  const contentEditableHtml = document.getElementById(
    `${block.id}__contents`
  )?.firstElementChild;
  let newBlock = block;
  if (contentEditableHtml) {
    const children = contentEditableHtml.childNodes;
    let contentsArr: string[] = [];
    children.forEach((c: Node) => {
      if (c.nodeType === 3) {
        c.nodeValue && contentsArr.push(c.nodeValue);
      }
      //span
      if (c.nodeType === 1) {
        const element = c as Element;
        contentsArr.push(element.outerHTML);
      }
    });
    const newBlockContents = contentsArr.join("");
    newBlock = {
      ...block,
      contents: newBlockContents,
      editTime: JSON.stringify(Date.now()),
    };
  }
  return newBlock;
};

/**
 * block의 content에서 selected class를 삭제하는 함수
 */
export function removeSelected(
  frameHtml: HTMLElement | null,
  block: Block,
  editBlock: (pageId: string, block: Block) => void,
  page: Page,
  setSelection: Dispatch<SetStateAction<SelectionType | null>> | null
) {
  // 변경된 내용이 있고, selected 만 제거하면 되는 경우
  const blockContentHtml = frameHtml?.querySelector(`#${block.id}__contents`);
  const listOfSelected = blockContentHtml?.querySelectorAll(".selected");
  if (listOfSelected && listOfSelected[0]) {
    listOfSelected.forEach((selectedHtml: Element) => {
      if (selectedHtml.classList.length > 1) {
        selectedHtml?.classList.remove("selected");
      } else {
        selectedHtml.outerHTML = selectedHtml.innerHTML;
      }
    });
  } else {
    const spanElements = blockContentHtml?.querySelectorAll("span");
    if (spanElements) {
      spanElements.forEach((element: HTMLSpanElement) => {
        if (element.className === "") {
          element.outerHTML = element.innerHTML;
        }
      });
    }
  }
  const editedBlock = getContent(block);
  editBlock(page.id, editedBlock);
  setSelection && setSelection(null);
}

// ----  select 취소 변경
