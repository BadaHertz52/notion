import React, { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import { findPage, Page } from '../modules/notion';
import Frame, { Template_Frame_SAME_Props } from './Frame';
import PageIcon from './PageIcon';

type TemplatesProps = Template_Frame_SAME_Props &{
  templatesId: string[]|null,
  addTemplate: (template: Page) => void,
  cancleEditTemplate: (templateId: string) => void,
  deleteTemplate: (templateId: string) => void,
  setOpenTemplates: Dispatch<SetStateAction<boolean>>
};
const Templates =({ templatesId,userName, pagesId, pages, firstlist,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,duplicatePage,movePageToPage , addTemplate,cancleEditTemplate, deleteTemplate,commentBlock,openComment ,setTargetPageId , openTemplates ,setOpenTemplates ,setOpenComment , setCommentBlock ,smallText , fullWidth  ,discardEdit}:TemplatesProps)=>{
  const templates = templatesId !==null ? templatesId.map((id:string)=> findPage(pagesId, pages, id))  :null;
  const [template, setTemplate]= useState<Page|null>(templates==null? null : templates[0]);
  const [openAlert, setOpenAlert]=useState<boolean>(false);
  const onClickTemplate=(event:MouseEvent<HTMLDivElement>)=>{
    const templateInner =event.currentTarget.firstElementChild;
    if(templateInner!==null){
      const templateInnerDomRect =templateInner.getClientRects()[0];
      const clientX = event.clientX;
      const clientY =event.clientY;
      const isInX = (clientX >= templateInnerDomRect.left)&&(clientX <= templateInnerDomRect.right);
      const isInY =(clientY >= templateInnerDomRect.top)&&(clientY<= templateInnerDomRect.bottom);
      const isInInner = isInX&& isInY;
      if(!isInInner){
        if(template!==null){
          const item =sessionStorage.getItem(`template_${template.id}`);
            item ===null? 
            setOpenTemplates(false): 
            setOpenAlert(true);
        }else{
          setOpenTemplates(false);
        }
      }
    }
  };

  const onClickUseBtn=()=>{
    if(template!==null){
      const newPage :Page ={
        ...template,
        id: JSON.stringify(Date.now())
      };
      addPage(newPage);
      setOpenTemplates(false);
    }
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
          <button 
            className='useTemplateBtn'
            onClick={onClickUseBtn}
          >
            Use this template
          </button>

          <div className='templateList'>
            {templates!==null ?
            templates.map((template:Page)=>
              <button 
                className='item'
                onClick={()=>setTemplate(template)}
              >
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
    {openAlert&&
    <div id="templatesAlert">
      <div className="inner">
        <div>
          The template has been modified. Do you want to save the edits?
        </div>
        <button 
          className='saveBtn'
          onClick={closeTemplate}
        >
          Save
        </button>
        <button 
          className='discardBtn'
          onClick={onClickDiscardBtn}
        >
          Discard edit
        </button>
      </div>
    </div>
    }
  </>
  )
};


export default React.memo(Templates);