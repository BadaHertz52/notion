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
  findPage,
  findParentBlock,
  getBlockDomRect,
  getBlockSample,
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
function MovingBlockModal({ ...props }: MovingBlockModalProps) {
  const { addBlock, editBlock, editPage } = useContext(ActionContext).actions;
  const { pages, pagesId, page, block } = props;
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
    [editBlock, page.id]
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
      const FIRST_BLOCKS_ID = [...page.firstBlocksId];
      setTemplateItem(props.templateHtml, page);
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
      if (block.parentBlocksId) {
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

            const firstIndex = FIRST_BLOCKS_ID.indexOf(parentBlock.id);
            if (firstIndex) FIRST_BLOCKS_ID.splice(firstIndex, 1);
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

      //
      if (pointBlock.firstBlock) {
        if (targetBlock.firstBlock) {
          const firstBlockIndex = FIRST_BLOCKS_ID.indexOf(targetBlock.id);
          FIRST_BLOCKS_ID.splice(firstBlockIndex, 1);

          const pointBlock_firstBlockIndex = FIRST_BLOCKS_ID?.indexOf(
            pointBlock.id
          ) as number;

          FIRST_BLOCKS_ID.splice(pointBlock_firstBlockIndex, 0, targetBlock.id);
        } else {
          //add first Blocks
          if (isListType) {
            const pointBlock_firstBlockIndex = FIRST_BLOCKS_ID?.indexOf(
              pointBlock.id
            ) as number;

            FIRST_BLOCKS_ID.splice(
              pointBlock_firstBlockIndex,
              0,
              newParentBlockOfList.id
            );
            blocks.push(newParentBlockOfList);
            blocksId.push(newParentBlockOfList.id);
          }
        }
      }

      //case2. pointBlock is subBlock : pointBlock의 parentBlock의 subBlock 으로 이동
      if (!pointBlock.firstBlock) {
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
        //STEP1. targetBlock이 firstBlock일 경우 page의 firstBlocksId에서 삭제, 아닐 경우 targetBlock의 parentBlock을 수정
        if (block.firstBlock) {
          const firstBlocksIdIndex = FIRST_BLOCKS_ID.indexOf(block.id);
          FIRST_BLOCKS_ID.splice(firstBlocksIdIndex, 1);
        }
      }
      const newPage: Page = {
        ...page,
        blocks: blocks,
        blocksId: blocksId,
        editTime: editTime,
        firstBlocksId: FIRST_BLOCKS_ID,
      };
      setTemplateItem(props.templateHtml, page);
      editPage(page.id, newPage);
    }
  }, [
    editPage,
    block,
    page,
    props.templateHtml,
    deleteParentBlocksIdFromSubBlock,
    findPointBlock,
  ]);

  /**
   * [isMoved] block의 위치를 변경 시키는 것이 끝났을 때 (mouseUp | touchEnd) , 사용자가 지정한 위치대로 state를 변경하고 블록의 위치 변동을 위해 설정한 모든 것을 원래대로 되돌리는 함수
   */
  const stopMoving = useCallback(() => {
    if (props.isOpen) {
      changeBlockPosition();
      const mainBlockOn = document.querySelector(".mainBlock.on");
      mainBlockOn?.classList.remove("on");
      const editableBlockOn = document.querySelector(".editableBlock.on");
      editableBlockOn?.classList.remove("on");
      props.closeModal();
    }
  }, [changeBlockPosition, props]);

  useEffect(() => {
    if (props.isOpen) {
      window.addEventListener("mouseup", stopMoving);
      window.addEventListener("touchend", stopMoving);
      window.addEventListener("mousemove", (event) =>
        moveBlock(event.clientX, event.clientY)
      );
      window.addEventListener("touchmove", moveBlockInMobile);
    }
    return () => {
      window.removeEventListener("mouseup", stopMoving);
      window.removeEventListener("touchend", stopMoving);
      window.removeEventListener("mousemove", (event) =>
        moveBlock(event.clientX, event.clientY)
      );
      window.removeEventListener("touchmove", moveBlockInMobile);
    };
  }, [props.isOpen, moveBlock, moveBlockInMobile, stopMoving]);

  return (
    <ModalPortal id="modal-movingBlock" isOpen={props.isOpen}>
      {props.isOpen && props.block && (
        <MovingTargetBlock
          {...props}
          block={props.block}
          style={movingBlockStyle}
        />
      )}
    </ModalPortal>
  );
}

export default MovingBlockModal;
