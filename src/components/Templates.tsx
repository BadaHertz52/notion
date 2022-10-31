import React, { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import { AiOutlineExpandAlt, AiOutlinePlus, AiOutlineShrink } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
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
const Templates =({ templatesId,userName, pagesId, pages, firstlist ,recentPagesId,editBlock,changeBlockToPage,changePageToBlock, addBlock,changeToSub ,raiseBlock, deleteBlock, addPage, editPage ,duplicatePage,movePageToPage , addTemplate,cancleEditTemplate, deleteTemplate, setRoutePage ,setTargetPageId,commentBlock,openComment , openTemplates ,setOpenTemplates ,setOpenComment , setCommentBlock ,showAllComments ,smallText , fullWidth  ,discardEdit,setDiscardEdit, fontStyle }:TemplatesProps)=>{
  const templates = templatesId !==null ? templatesId.map((id:string)=> findPage(pagesId, pages, id))  :null;
  const [template, setTemplate]= useState<Page|null>(templates==null? null : templates[0]);
  const [openEditAlert, setOpenEditAlert]=useState<boolean>(false);
  const [openDeleteAlert, setOpenDeleteAlert]=useState<boolean>(false);
  const [expand ,setExpand]=useState<boolean>(false);

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
          // 수정이전의 버전인 originTemplate이 있으면, 수정된 버전으로 바꿀 것인지 아닌지를 묻는 창이 뜨고, originTemplate이 없다면 templates 창을 닫음
          const item =sessionStorage.getItem('originTemplate');
            item ===null? 
            setOpenTemplates(false): 
            setOpenEditAlert(true);
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
        setOpenEditAlert(true);
      }
    }
  };
  const closeTemplate=()=>{
    template!==null&&
    sessionStorage.removeItem("originTemplate");
    setOpenEditAlert(false);
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

  const onClickDeleteTemplateBtn=()=>{
    if(template!==null && templatesId!==null && templates!==null){
      const index= templatesId?.indexOf(template.id);
      if(templatesId.length>1){
        if(index ===0){
          const nextTemplate = templates[1];
          setTemplate(nextTemplate);
        }else{
          setTemplate(templates[0]);
        }
      }else{
        setOpenTemplates(false);
      };
      deleteTemplate(template.id);
    };
    setOpenDeleteAlert(false);
  };

  return(
    <>
    <div id="templates"
      onClick={(event)=>onClickTemplate(event)}
    >
      <div className="inner">
        <div 
          id="template"
          className={expand? "expand":""}
        >

          {template!==null ?
            <>
              <div className='templateTopBar'>
                <div className='templateInform'>
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
                <div className="templateTool">
                  <button 
                    className="expandBtn"
                    aria-label={expand?"revert  the template to original size":'expand the template size'}
                    onClick={()=>setExpand(!expand)}
                  >
                    {expand?
                    <AiOutlineShrink/>
                    :
                    <AiOutlineExpandAlt/>
                    }
                    <div className='bubble'>
                    {expand?
                    "Revert to original size":
                    'Expand  size'
                    }
                    </div>
                  </button>
                  <button 
                    className='templateDelete'
                    aria-label='delete template'
                    onClick ={()=>setOpenDeleteAlert(true)}
                  >
                    <BsTrash/>
                    <div className='bubble'>
                      Delete template
                    </div>
                  </button>
                </div>
              </div>
            <Frame
              page={template}
              userName={userName}
              pagesId={pagesId}
              pages={pages}
              firstlist={firstlist}
              recentPagesId={recentPagesId}
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
              showAllComments={showAllComments}
              smallText={smallText}
              fullWidth={fullWidth}
              discardEdit={discardEdit}
              setDiscardEdit={setDiscardEdit}
              openTemplates={openTemplates}
              setOpenTemplates={setOpenTemplates}
              fontStyle={fontStyle}
            /> 
            </>
            :
            <div className='noTemplate'>
              <p>NO TEMPLATE</p>
            </div>
          }

        </div>
        <div 
          id="templates_side"
          className={expand? "off":""}
        >
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
            <div className='noTemplate'>
              <p>No template</p>
            </div>
            }
        
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
    {openEditAlert&&
    <div  className="templatesAlert">
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
    {openDeleteAlert &&
    <div className="templatesAlert">
      <div className="inner">
        <div>
          Do you want to delete this template?
        </div>
        <button 
          className='deleteTemplateBtn'
          onClick={onClickDeleteTemplateBtn}
        >
          Delete
        </button>
        <button 
          className='cancleBtn'
          onClick={()=>setOpenDeleteAlert(false)}
        >
          Cancle
        </button>
      </div>
    </div>
    }
  </>
  )
};


export default React.memo(Templates);