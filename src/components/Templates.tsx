import React, { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { findPage, Page, pageSample } from '../modules/notion';
import Frame, { Template_Frame_SAME_Props } from './Frame';
import PageIcon from './PageIcon';

type TemplatesProps = Template_Frame_SAME_Props &{
  templatesId: string[]|null,
  addTemplate: (template: Page) => void,
  cancleEditTemplate: (templateId: string) => void,
  deleteTemplate: (templateId: string) => void,
  setRoutePage:Dispatch<SetStateAction<Page|null>>,
  setOpenTemplates: Dispatch<SetStateAction<boolean>>
};
const Templates =({ templatesId,userName, pagesId, pages, firstlist,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,duplicatePage,movePageToPage , addTemplate,cancleEditTemplate, deleteTemplate, setRoutePage ,setTargetPageId,commentBlock,openComment , openTemplates ,setOpenTemplates ,setOpenComment , setCommentBlock ,smallText , fullWidth  ,discardEdit }:TemplatesProps)=>{
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
          const item =sessionStorage.getItem('originTemplate');
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
    const targetPageId =sessionStorage.getItem("targetPageId");
    if(template!==null){
      const newPage :Page ={
        ...template,
        id: JSON.stringify(Date.now())
      };
      if(targetPageId==null){
        addPage(newPage);
      }else{
        const editedPage:Page ={
          ...template ,
          id: targetPageId,
          editTime:JSON.stringify(Date.now())
        };
        sessionStorage.removeItem("targetPageId");
        editPage(targetPageId, editedPage);
        setRoutePage(editedPage)
      };
      setOpenTemplates(false);
    }
  };
  const showOtherTemplate=(otherTemplate:Page)=>{
    if(template!==null){
      const item =sessionStorage.getItem("originTemplate");
      if(item==null){
        setTemplate(otherTemplate);
      }else{
        setOpenAlert(true);
      }
    }
  };
  const closeTemplate=()=>{
    template!==null&&
    sessionStorage.removeItem("originTemplate");
    setOpenAlert(false);
    setOpenTemplates(false);
  };
  const onClickDiscardBtn=()=>{
    if(template!==null){
      const item =sessionStorage.getItem("originTemplate");
      if(item !==null){
        cancleEditTemplate(template.id);
        closeTemplate();
      }};
  };

  const onClickMakeTemplateBtn=()=>{
    const newTemplate:Page={
      ...pageSample,
      header: {
        ...pageSample.header,
        title:"new template"
      },
      type:"template"
    };
    addTemplate(newTemplate);
    setOpenTemplates(false);
    setRoutePage(newTemplate);
  };
  return(
    <>
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
              setRoutePage={setRoutePage}
              setOpenComment={setOpenComment}
              setCommentBlock ={setCommentBlock}
              smallText={smallText}
              fullWidth={fullWidth}
              discardEdit={discardEdit}
              openTemplates={openTemplates}
              setOpenTemplates={setOpenTemplates}
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
                onClick={()=>showOtherTemplate(template)}
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
          <button     
            className='makeTemplateBtn'
            onClick={onClickMakeTemplateBtn}
          >
            <AiOutlinePlus/>
            <span>Make New Template</span>
          </button>

        </div>
      </div>
    </div>
    <div id="templatesAlert">
      <div className="inner">
        <div>
          The template has been modified. <br/> 
          Do you want to save the edits?
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