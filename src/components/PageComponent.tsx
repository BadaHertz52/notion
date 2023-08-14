import React, { memo } from "react";
import PageHeader, { PageHeaderProps } from "./PageHeader";
import PageContent, { PageContentProps } from "./PageContent";

type PageComponentProps = PageHeaderProps & PageContentProps;
const PageComponent = (props: PageComponentProps) => {
  return (
    <div className="page">
      <PageHeader
        userName={props.userName}
        page={props.page}
        frameHtml={props.frameHtml}
        fontSize={props.fontSize}
        openTemplates={props.openTemplates}
        templateHtml={props.templateHtml}
        discardEdit={props.discardEdit}
        setDiscardEdit={props.setDiscardEdit}
        showAllComments={props.showAllComments}
        newPageFrame={props.newPageFrame}
      />
      <PageContent
        pages={props.pages}
        pagesId={props.pagesId}
        page={props.page}
        templateHtml={props.templateHtml}
        newPageFrame={props.newPageFrame}
        firstBlocks={props.firstBlocks}
        fontSize={props.fontSize}
        isMoved={props.isMoved}
        pointBlockToMoveBlock={props.pointBlockToMoveBlock}
        makeMoveBlockTrue={props.makeMoveBlockTrue}
        setMoveTargetBlock={props.setMobileMenuTargetBlock}
        command={props.command}
        setCommand={props.setCommand}
        openComment={props.openComment}
        setOpenComment={props.setOpenComment}
        setCommentBlock={props.setCommentBlock}
        setOpenLoader={props.setOpenLoader}
        setLoaderTargetBlock={props.setLoaderTargetBlock}
        closeMenu={props.closeMenu}
        setSelection={props.setSelection}
        setMobileMenuTargetBlock={props.setMobileMenuTargetBlock}
        mobileMenuTargetBlock={props.mobileMenuTargetBlock}
        setOpenTemplates={props.setOpenTemplates}
      />
    </div>
  );
};

export default memo(PageComponent);
