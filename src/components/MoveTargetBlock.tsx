import React from'react';
import EditableBlock, { changeFontSizeBySmallText, EditableBlockProps } from './EditableBlock';

const MoveTargetBlock=({ pages,pagesId,page, block , editBlock, addBlock,changeToSub ,raiseBlock, deleteBlock ,fontSize, moveBlock  ,setMoveTargetBlock, pointBlockToMoveBlock ,command, setCommand ,setTargetPageId  ,openComment ,setOpenComment ,setCommentBlock ,setOpenLoader, setLoaderTargetBlock, closeMenu,templateHtml ,setSelection , setOpenMM ,openMobileMenu ,setMobileMenuBlock
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
            style={changeFontSizeBySmallText(block, fontSize)}
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
        pages={pages}
        pagesId={pagesId}
        page={page}
        block={block}
        addBlock={addBlock}
        editBlock={editBlock}
        changeToSub={changeToSub}
        raiseBlock={raiseBlock}
        deleteBlock={deleteBlock}
        fontSize={fontSize}
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
        setOpenMM={setOpenMM}
        openMobileMenu={openMobileMenu}
        setMobileMenuBlock={setMobileMenuBlock}
      />
      }
    </div>
  )
};

export default React.memo(MoveTargetBlock);