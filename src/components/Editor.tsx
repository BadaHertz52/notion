import React, { Dispatch, ReactComponentElement, SetStateAction, useEffect, useRef, useState } from 'react';

import { Block, Page } from '../modules/notion';
import BlockComponent from './BlockComponent';
//icon
import { AiOutlineClockCircle, AiOutlineMenu, AiOutlineStar } from 'react-icons/ai';
import { BiMessageDetail } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';
import { FiChevronsLeft } from 'react-icons/fi';
import { Side } from '../modules/side';

type EditorProps ={
  page:Page,
  pagePath: string []| null
  editBlock : (pageId:string , block:Block)=> void,
  side: Side ,
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void 
}

const Editor =({ page, pagePath, editBlock ,side,  lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage}:EditorProps)=>{

  const TopBar =()=>{
    const [title, setTitle]= useState<string>("");

    useEffect(()=>{
      if(side.sideState ==="left"){
        setTitle("Lock sideBar open")
      }
    },[side.sideState])
    return(
      <div className="topbar">
        <div className='topbarLeft'>
          <button 
          className='sideBarBtn'
          onMouseMove={leftSideBar}
          onMouseOut={closeSideBar}
          onClick={lockSideBar}
          title ={title}
          aria-label ={title}
          >
            {side.sideState ==="close" && 
            <AiOutlineMenu/>}
            {side.sideState ==="left" &&
            <FiChevronsLeft/>}
          </button>
          <div className="pagePathes">
            {pagePath == null ? 
              <div className="pagePath">
                <span>{page.header}</span>
              </div>
            :
              pagePath.map((path:string )=>
              <div className="pagePath" key={pagePath.indexOf(path)}>
                <span>/</span> 
                <span className='pageLink'><a href='path'>{path}</a></span>
              </div>
              )
            }
          </div>
        </div>
        <div className="topbarRight">
          <button
            title='Share or publish to the web'
          >
            Share
          </button>
          <button
            title='View all comments'
          >
            <BiMessageDetail/>
          </button>
          <button
            title="View all updates"
          >
            <AiOutlineClockCircle/>
          </button>
          <button
            title="Pin this page in your sidebar"
          >
            <AiOutlineStar/>
          </button>
          <button
            title=" Style, export, and more"
          >
            <BsThreeDots/>
          </button>
        </div>
      </div>
    )
  };

  const Frame =()=>{
    return(
      <div className='frame'>
        {side.newPage ?
          <div className='newPageFrame framInner'>
            <div className='pageHeader'>
              <div className='pageTitle'>
                Untitled
              </div>

              {page.header.comment !==null &&
              <div className='pageComment'>
                Press Enter to continue with an empty pagem or pick a templage
              </div>
            }
            </div>
            <div className="pageContent">
              <div className='pageContent_inner'>
                <button>
                  <GrDocumentText/>
                  <span>Empty with icon</span>
                </button>
                <button>
                  <GrDocument/>
                  <span>Empty</span>
                </button>
                <button>
                  <span>Templates</span>
                </button>
              </div>
            </div>
          </div>
        :
          <div className='framInner'>
            <div className='pageHeader'>
              {page.header.cover !== null &&        
                <div className='pageCover'>
                  {page.header.cover}
                </div>
              }
              {page.header.icon !==null &&
                <div className='pageIcon'>
                  {page.header.icon}
                </div>
              }
              <div className='pageTitle'>
                {page.header.title}
              </div>
            
              {page.header.comment !==null &&
              <div className='pageComment'>
                {page.header.comment}
              </div>
            }
            </div>
            <div className="pageContent">
              <div className='pageContent_inner'>
                {page.blocks.map((block:Block)=>
                <BlockComponent 
                  key={block.id}
                  page ={page}
                  block={block}
                  editBlock={editBlock}
                />)}
              </div>
            </div>
          </div>
        }

      </div>
    )
  };


  return(
    <div className='editor'>
      <TopBar/>
      <Frame/>
    </div>
  )
}

export default React.memo(Editor)