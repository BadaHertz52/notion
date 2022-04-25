import React, { CSSProperties, useEffect, useState } from 'react';

import { Block,  Page } from '../modules/notion';
import BlockComponent from './BlockComponent';
//icon
import { AiOutlineClockCircle, AiOutlineMenu,  AiOutlineStar } from 'react-icons/ai';
import { BiMessageDetail } from 'react-icons/bi';
import { BsFillEmojiSmileFill, BsThreeDots } from 'react-icons/bs';
import {GrDocumentText ,GrDocument} from 'react-icons/gr';
import { FiChevronsLeft } from 'react-icons/fi';
import { Side } from '../modules/side';
import { MdInsertPhoto } from 'react-icons/md';

type EditorProps ={
  userName : string,
  page:Page,
  pagePath: string []| null
  editBlock : (pageId:string , block:Block)=> void,
  addBlock : (pageId:string , block:Block ,nextBlockIndex:number)=> void,
  deleteBlock : (pageId:string , block:Block)=> void,
  side: Side , 
  makeSubBlock : (pageId:string ,mainBlock:Block, subBlock:Block)=> void,
  lockSideBar  : ()=> void ,
  leftSideBar  : ()=> void ,
  closeSideBar  : ()=> void ,
  openNewPage  : ()=> void ,
  closeNewPage : ()=> void 
};

type CommentProp ={
  comment :string | null
}
const Editor =({ userName, page, pagePath, editBlock ,addBlock ,deleteBlock, makeSubBlock ,side,  lockSideBar, leftSideBar,closeSideBar, openNewPage, closeNewPage}:EditorProps)=>{


  const TopBar =()=>{
    const [title, setTitle]= useState<string>("");

    useEffect(()=>{
      if(side.sideState ==="left"){
        setTitle("Lock sideBar open")
      }
    },[side.sideState])
    return(
      <div className="topbar">
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

        <div className="pageFun">
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

  const Comment =({comment}:CommentProp) =>{
    const firstLetter = userName.substring(0,1).toUpperCase();
    return (
      <div className='comment'>
        <div className='firstLetter'>
          <span>{firstLetter}</span>
        </div>
        <div className='commentContent'>
          {comment !==null ?
            <span>{comment}</span>
          :
            <input
            type="text"
            id="text"
            name ="text"
            placeholder='Add a comment'
          />
          }
          
        </div>
      </div>
    )
  }
  const Frame =()=>{
    const [decoOpen ,setdecoOpen] =useState<boolean>(true);
    
    const headerStyle: CSSProperties ={
      marginTop: page.header.cover !==null? "10px": "30px" 
    };

    const headerBottomStyle :CSSProperties ={
      marginTop: page.header.cover !==null ? "-39px" :"0"
    };

    return(
      <div className='frame'>
        {side.newPage ?
          <div className='newPageFrame frame_inner'>
            <div 
            className='pageHeader'
            style={headerStyle}
            onMouseMove={()=>{setdecoOpen(true)}}
            onMouseOut={()=>{setdecoOpen(false)}}
            >
              {decoOpen &&
                <div className='deco'>
                  {page.header.icon ==null &&
                    <button className='decoIcon'>
                      <BsFillEmojiSmileFill/>
                      <span>Add Icon</span>
                    </button>
                  }
                  {page.header.cover == null&&        
                    <button className='decoCover'>
                      <MdInsertPhoto/>
                      <span>Add Cover</span>
                    </button>
                  }
                  {page.header.comment ==null &&
                  <button className='decoComment'>
                    <BiMessageDetail/>
                    <span>Add Commnet</span>
                  </button>
                  }
              </div>
              }
              <div className='pageTitle'>
                Untitled
              </div>
              <div className='pageComment'>
                Press Enter to continue with an empty pagem or pick a templage
              </div>
            
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
          <div className='frame_inner'>
            <div 
              className='pageHeader'
              style={headerStyle}
              onMouseMove={()=>{setdecoOpen(true)}}
              //onMouseOut={()=>{setdecoOpen(false)}}
            >
              <div >
                {page.header.cover !== null &&        
                  <div className='pageCover'>
                    {page.header.cover}
                  </div>
                }
              </div>
              <div style={headerBottomStyle}>
                {page.header.icon !==null &&
                  <div 
                  className='pageIcon'
                  
                  >
                    {page.header.icon}
                  </div>
                }
                {decoOpen &&
                  <div className='deco'>
                    {page.header.icon ==null &&
                      <button className='decoIcon'>
                        <BsFillEmojiSmileFill/>
                        <span>Add Icon</span>
                      </button>
                    }
                    {page.header.cover == null&&        
                      <button className='decoCover'>
                        <MdInsertPhoto/>
                        <span>Add Cover</span>
                      </button>
                    }
                    {page.header.comment ==null &&
                    <button className='decoComment'>
                      <BiMessageDetail/>
                      <span>Add Commnet</span>
                    </button>
                    }
                </div>
                }
                <div 
                  className='pageTitle'
                >
                  {page.header.title}
                </div>
              
                {page.header.comment !==null &&
                <div className='pageComment'>
                  <Comment comment ={page.header.comment} />
                  
                </div>
                }
              </div>
            </div>
            <div className="pageContent">
              <div className='pageContent_inner'>
                {page.blocks.map((block:Block)=>
                <BlockComponent 
                  key={block.id}
                  page ={page}
                  block={block}
                  editBlock={editBlock}
                  addBlock ={addBlock}
                  deleteBlock={deleteBlock}
                  makeSubBlock={makeSubBlock}
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