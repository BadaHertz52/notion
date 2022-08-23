import React, { MouseEvent, useState } from 'react';
import { findPage, Page } from '../modules/notion';
import Frame, { Template_Frame_SAME_Props } from './Frame';
import PageIcon from './PageIcon';

type TemplatesProps = Template_Frame_SAME_Props &{
  templatesId: string[]|null,
  addTemplate: (template: Page) => void,
  cancleEditTemplate: (templateId: string) => void,
  deleteTemplate: (templateId: string) => void,
};
const Templates =({ templatesId,userName, pagesId, pages, firstlist,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,duplicatePage,movePageToPage , addTemplate, cancleEditTemplate, deleteTemplate,commentBlock,openComment ,setTargetPageId , openTemplates ,setOpenComment , setCommentBlock ,smallText , fullWidth  ,discardEdit}:TemplatesProps)=>{
  const templates = templatesId !==null ? templatesId.map((id:string)=> findPage(pagesId, pages, id))  :null;
  const [template, setTemplate]= useState<Page|null>(templates==null? null : templates[0]);
  const cancleEdit =()=>{

  };
  const onClickTemplate=(event:MouseEvent<HTMLDivElement>)=>{

  };
  return(
    <div id="templates"
      onClick={(event)=>onClickTemplate(event)}
    >
      <div className="inner">
        <div id="template">

          {template!==null ?
            <>
              <div className='templateTopBar'>
                <PageIcon
                  icon={template.header.icon}
                  iconType={template.header.iconType}
                  style={undefined}
                />
                <div className='pageTitle'>
                  <span>
                      {template.header.title}
                  </span>
                </div>
              </div>
            <Frame
              page={template}
              userName={userName}
              pagesId={pagesId}
              pages={pages}
              firstlist={firstlist}
              addBlock={addBlock}
              editBlock={editBlock}
              changeBlockToPage={changeBlockToPage}
              changePageToBlock={changePageToBlock}
              changeToSub={changeToSub}
              raiseBlock={raiseBlock}
              deleteBlock={deleteBlock}
              addPage={addPage}
              editPage={editPage}
              duplicatePage={duplicatePage}
              movePageToPage={movePageToPage}
              commentBlock={commentBlock}
              openComment={openComment}
              setTargetPageId={setTargetPageId}
              setOpenComment={setOpenComment}
              openTemplates={openTemplates}
              setCommentBlock ={setCommentBlock}
              smallText={smallText}
              fullWidth={fullWidth}
              discardEdit={discardEdit}
            /> 
            </>
            :
            <div>
              No template
            </div>
          }

        </div>
        <div id="templates_side">
          <button className='useTemplateBtn'>
            Use this template
          </button>

          <div className='templateList'>
            {templates!==null ?
            templates.map((template:Page)=>
              <button className='item'>
                <PageIcon
                  icon={template.header.icon}
                  iconType={template.header.iconType}
                  style={undefined}
                />
                <div className='pageTitle'>
                  <span>
                      {template.header.title}
                  </span>
                </div>
            </button>
            )
            :
            "No template"}
        
          </div>
          <button className='makeTemplateBtn'>
            Make New Template
          </button>

        </div>
      </div>
    </div>
  )
};


export default React.memo(Templates);