import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ModalPortal from "./ModalPortal";
import { EditableBlockProps } from "../block/EditableBlock";
import MovingTargetBlock from "../block/MovingTargetBlock";
import { ActionContext } from "../../contexts";
import {
  findBlock,
  findParentBlock,
  getBlockDomRect,
  getEditTime,
  makeNewBlock,
  setTemplateItem,
} from "../../utils";
import { Block, Page } from "../../types";

type MovingBlockModalProps = Omit<EditableBlockProps, "block"> & {
  block: Block | null;
  isOpen: boolean;
  closeModal: () => void;
};
const MovingBlockModal = ({ ...props }: MovingBlockModalProps) => {
  const { editBlock, editPage } = useContext(ActionContext).actions;
  const { page, block } = props;
  const [movingBlockStyle, setMovingBlockStyle] = useState<
    CSSProperties | undefined
  >(undefined);
  // frame에 이벤트
  /**
   * [isMoved] 마우스, 터치의 이동에 따라 movingTargetBlock을 이동시키는 함수
   * @param clientX mouseEvent.clientX | touchEvent.touches[0].clientX
   * @param clientY mouseEvent.clientY | touchEvent.touches[0].clientY
   */
  const moveBlock = useCallback(
    (clientX: number, clientY: number) => {
      if (props.isOpen && props.block) {
        const blockDomRect = getBlockDomRect(props.block);
        setMovingBlockStyle({
          position: "absolute",
          top: clientY + 5,
          left: clientX + 5,
          width: blockDomRect?.width,
        });
      }
    },
    [setMovingBlockStyle, props.isOpen, props.block]
  );
  /**
   * [isMoved - mobile] 모바일 브라우저에서, movingTargetBlock의 위치를 변경시키고 movingTargetBlock의 위치에 있는 element인지 여부에 따라 pointBlock을 나타내는 클래스 변경(움직이는 볌위 내에 있으면 pointBLock 으로 클래스에 on이 추가, 그렇지 않을 경우 on 삭제 )
   * @param event
   */
  const moveBlockInMobile = useCallback(
    (event: globalThis.TouchEvent) => {
      if (props.isOpen && block) {
        const { clientX, clientY } = event.touches[0];

        const frameEl = document
          .querySelector(`#block-${block.id}`)
          ?.closest(".frame");
        frameEl?.scrollTo(0, clientY);

        document.querySelectorAll(".mainBlock").forEach((element) => {
          const domRect = element.getClientRects()[0];
          const isPointBlock =
            domRect.top <= clientY && domRect.bottom >= clientY;
          element.classList.toggle("on", isPointBlock);
        });

        moveBlock(clientX, clientY);
      }
    },
    [moveBlock, block, props.isOpen]
  );

  const findPointBlock = useCallback(() => {
    const pointBlockEl = document.querySelector(".mainBlock.on");
    const blockId = pointBlockEl?.closest(".block")?.id.replace("block-", "");

    return blockId ? findBlock(page, blockId).BLOCK : undefined;
  }, [page]);

  /**
   * targetBlock의 subBlock가 존재할 경우, subBlock들의 parentBlocksId에서 특정 id를 제거하거나 다른 id로 변경하는 함수
   * @param blocksId: block이 있는 페이지의 블럭 아이디들
   * @param blocks: block이 있는 페이지의 블럭들
   * @param targetBlock parentBlocksId를 변경할 subBlock 들의 parentBlock
   * @param isListType: block의 타입이 리스트인지
   * @param parentBlockId subBlocks 들의 parentBlocksId에서 제거해야할 id
   */
  const deleteParentBlocksIdFromSubBlock = useCallback(
    (
      blocksId: string[],
      blocks: Block[],
      isListType: boolean,
      targetBlock: Block,
      parentBlockId: string
    ) => {
      const editTime = getEditTime();

      if (targetBlock.subBlocksId) {
        targetBlock.subBlocksId.forEach((id: string) => {
          const subBlocksIndex = blocksId.indexOf(id);
          const subBlock = blocks[subBlocksIndex];
          const parentBlocksId = subBlock.parentBlocksId as string[];
          const parentBlockIndex = parentBlocksId.indexOf(parentBlockId);
          const newParentIds = parentBlocksId.slice(parentBlockIndex + 1);
          const newParentBlocksId = targetBlock.parentBlocksId
            ? targetBlock.parentBlocksId.concat(newParentIds)
            : newParentIds;
          const editedSubBlock: Block = {
            ...subBlock,
            parentBlocksId: newParentBlocksId[0] ? newParentBlocksId : null,
            editTime: editTime,
          };
          blocks.splice(subBlocksIndex, 1, editedSubBlock);
          //editBlock(page.id, editedSubBlock);
          subBlock.subBlocksId &&
            deleteParentBlocksIdFromSubBlock(
              blocksId,
              blocks,
              isListType,
              subBlock,
              parentBlockId
            );
        });
      }
    },
    []
  );

  const changeParentOfTargetBlock = useCallback(
    (
      blocksId: string[],
      blocks: Block[],
      targetBlock: Block,
      editTime: string,
      isListType: boolean,
      firstBlocksId: string[]
    ) => {
      // block의 parentBlock 수정 과 그에 따른 subBlocks의 parentIds 수정
      if (block?.parentBlocksId) {
        //edit targetBlock's  origin parentBlock
        const { parentBlock } = findParentBlock(page, block);
        const indexOfParentBlock = blocksId.indexOf(parentBlock.id);

        if (parentBlock.subBlocksId) {
          const newSubBlocksId = parentBlock.subBlocksId.filter(
            (id: string) => id !== targetBlock.id
          );
          const editedParentBlock: Block = {
            ...parentBlock,
            subBlocksId: newSubBlocksId[0] ? newSubBlocksId : null,
            editTime: editTime,
          };

          if (!editedParentBlock.subBlocksId && isListType) {
            blocks.splice(indexOfParentBlock, 1);
            blocksId.splice(indexOfParentBlock, 1);

            const firstIndex = firstBlocksId.indexOf(parentBlock.id);
            if (firstIndex) firstBlocksId.splice(firstIndex, 1);
          } else {
            blocks.splice(indexOfParentBlock, 1, editedParentBlock);
          }
        }

        if (block.subBlocksId) {
          deleteParentBlocksIdFromSubBlock(
            blocksId,
            blocks,
            isListType,
            targetBlock,
            parentBlock.id
          );
        }
      }
    },
    [deleteParentBlocksIdFromSubBlock, block, page]
  );

  const changeParentOfPointBlock = useCallback(
    (
      pointBlock: Block,
      blocks: Block[],
      blocksId: string[],
      targetBlock: Block
    ) => {
      const parentBlockOfPointBlock = findParentBlock(
        page,
        pointBlock
      ).parentBlock;
      const indexOfParentBlockOfPointBlock = blocksId.indexOf(
        parentBlockOfPointBlock.id
      );
      const newSubBlocksId = parentBlockOfPointBlock.subBlocksId as string[];
      const indexOfParentBlock = newSubBlocksId.indexOf(pointBlock.id);
      newSubBlocksId.splice(indexOfParentBlock, 0, targetBlock.id);
      const newParentBlockOfPointBlock: Block = {
        ...parentBlockOfPointBlock,
        subBlocksId: newSubBlocksId,
      };
      blocks.splice(
        indexOfParentBlockOfPointBlock,
        1,
        newParentBlockOfPointBlock
      );
    },
    [page]
  );

  const changeFirstBlocks = useCallback(
    (
      firstBlocksId: string[],
      blocks: Block[],
      blocksId: string[],
      targetBlock: Block,
      pointBlock: Block,
      isListType: boolean,
      newParentBlockOfList: Block
    ) => {
      if (block?.firstBlock) {
        const firstBlockIndex = firstBlocksId.indexOf(targetBlock.id);
        firstBlocksId.splice(firstBlockIndex, 1);
      }

      if (pointBlock.firstBlock) {
        if (targetBlock.firstBlock) {
          const pointBlock_firstBlockIndex = firstBlocksId?.indexOf(
            pointBlock.id
          ) as number;
          firstBlocksId.splice(pointBlock_firstBlockIndex, 0, targetBlock.id);
        }

        if (isListType) {
          const pointBlock_firstBlockIndex = firstBlocksId?.indexOf(
            pointBlock.id
          ) as number;

          firstBlocksId.splice(
            pointBlock_firstBlockIndex,
            0,
            newParentBlockOfList.id
          );
          blocks.push(newParentBlockOfList);
          blocksId.push(newParentBlockOfList.id);
        }
      }
    },
    [block?.firstBlock]
  );

  const changePage = useCallback(
    (
      blocks: Block[],
      blocksId: string[],
      editTime: string,
      firstBlocksId: string[]
    ) => {
      const newPage: Page = {
        ...page,
        blocks: blocks,
        blocksId: blocksId,
        editTime: editTime,
        firstBlocksId: firstBlocksId,
      };
      setTemplateItem(props.templateHtml, page);
      editPage(page.id, newPage);
    },
    [editPage, page, props.templateHtml]
  );
  /**
   * [isMoved]  블록의 위치를 변경하고, 변경된 위치에 따라 page의 data도 변경하는 함수
   */
  const changeBlockPosition = useCallback(() => {
    const pointBlock = findPointBlock();
    if (
      pointBlock &&
      block &&
      page.blocksId &&
      page.blocks &&
      page.firstBlocksId
    ) {
      const firstBlocksId = [...page.firstBlocksId];
      //edit block
      const editTime = getEditTime();
      const blocksId = [...page.blocksId];
      const blocks = [...page.blocks];
      const indexOfTargetBlocks = blocksId.indexOf(block.id);
      const isListType =
        block.type === "numberList" || block.type === "bulletList";
      const newBlock = makeNewBlock(page, null);
      const newParentBlockOfList: Block = {
        ...newBlock,
        firstBlock: pointBlock.firstBlock,
        type: block.type === "numberList" ? "numberListArr" : "bulletListArr",
        subBlocksId: [block.id],
        parentBlocksId: pointBlock.parentBlocksId,
      };
      /**
       * 이동의 타켓이 되는 block의 이동으로 인해 변경된 data를 가짐
       */
      const targetBlock: Block = {
        ...block,
        firstBlock: isListType || !pointBlock.firstBlock ? false : true,
        parentBlocksId: isListType
          ? newParentBlockOfList.parentBlocksId
            ? newParentBlockOfList.parentBlocksId.concat(
                newParentBlockOfList.id
              )
            : [newParentBlockOfList.id]
          : pointBlock.parentBlocksId,
        editTime: editTime,
      };

      blocks.splice(indexOfTargetBlocks, 1, targetBlock);

      // block의 parentBlock 수정 과 그에 따른 subBlocks의 parentIds 수정
      changeParentOfTargetBlock(
        blocksId,
        blocks,
        targetBlock,
        editTime,
        isListType,
        firstBlocksId
      );
      //firstBlocks 수정 (새로운 리스트 블록이 필요한 경우 해당 블록 추가)
      changeFirstBlocks(
        firstBlocksId,
        blocks,
        blocksId,
        targetBlock,
        pointBlock,
        isListType,
        newParentBlockOfList
      );

      //pointBlock의 parentBlock의 subBlock 으로 이동 하는 경우
      if (!pointBlock.firstBlock) {
        changeParentOfPointBlock(pointBlock, blocks, blocksId, targetBlock);
      }
      changePage(blocks, blocksId, editTime, firstBlocksId);
    }
  }, [
    changeFirstBlocks,
    changeParentOfPointBlock,
    changePage,
    changeParentOfTargetBlock,
    block,
    findPointBlock,
    page,
  ]);

  /**
   * [isMoved] block의 위치를 변경 시키는 것이 끝났을 때 (mouseUp | touchEnd) , 사용자가 지정한 위치대로 state를 변경하고 블록의 위치 변동을 위해 설정한 모든 것을 원래대로 되돌리는 함수
   */
  const stopMoving = useCallback(() => {
    if (props.isOpen) {
      changeBlockPosition();

      const blockContentsOn = document.querySelector(".block__contents.on");
      blockContentsOn?.classList.remove("on");
      const mainBlockOn = document.querySelector(".mainBlock.on");
      mainBlockOn?.classList.remove("on");

      props.closeModal();
    }
  }, [changeBlockPosition, props]);

  useEffect(() => {
    document.addEventListener("mouseup", stopMoving);
    document.addEventListener("touchend", stopMoving);
    document.addEventListener("mousemove", (event) =>
      moveBlock(event.clientX, event.clientY)
    );
    document.addEventListener("touchmove", moveBlockInMobile);

    return () => {
      document.removeEventListener("mouseup", stopMoving);
      document.removeEventListener("touchend", stopMoving);
      document.removeEventListener("mousemove", (event) =>
        moveBlock(event.clientX, event.clientY)
      );
      document.removeEventListener("touchmove", moveBlockInMobile);
    };
  }, [props.isOpen, moveBlock, moveBlockInMobile, stopMoving]);

  return (
    <ModalPortal id="modal-movingBlock" isOpen={props.isOpen}>
      {props.isOpen && props.block && movingBlockStyle && (
        <MovingTargetBlock
          {...props}
          block={props.block}
          style={movingBlockStyle}
        />
      )}
    </ModalPortal>
  );
};

export default MovingBlockModal;
