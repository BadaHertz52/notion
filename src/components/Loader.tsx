import React, { ChangeEvent, Dispatch, FormEvent,  SetStateAction,  useEffect,  useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, Page } from '../modules/notion';
import { setTemplateItem } from './BlockComponent';
import { detectRange } from './BlockFn';
type LoaderProps={
  block:Block,
  page:Page,
  editBlock :(pageId:string, block:Block)=>void,
  setOpenLoader :Dispatch<SetStateAction<boolean>>,
  setLoaderTargetBlock :Dispatch<SetStateAction<Block|null>>,
}
const Loader =({block, page, editBlock ,setOpenLoader ,setLoaderTargetBlock}:LoaderProps)=>{
  const inner =document.getElementById("inner");
  const loaderHtml =document.getElementById("loader");
  const [loaderStyle, setLoaderStyle]=useState<CSSProperties>();
  const onChangeImgFile =(event:ChangeEvent<HTMLInputElement>)=>{
    const file =event.target.files?.[0];
    if(file!==undefined){
      const reader = new FileReader();
      reader.onload= function(){
        const result = reader.result as string;
        const editedBlock :Block ={
          ...block,
          type:"image media",
          contents:result,
          editTime:JSON.stringify(Date.now(),)
        };
        const templateHtml =document.getElementById("template");
        setTemplateItem(templateHtml,page);
        editBlock(page.id,editedBlock);
        closeLoader();
      };
      reader.readAsDataURL(file);
    }else{
      console.log("can't find image file")
    }
  };
  function closeLoader(){
    setOpenLoader(false);
    setLoaderTargetBlock(null);
  }
  inner?.addEventListener("click", (event)=>{
    const loaderDomRect= loaderHtml?.getClientRects()[0];
    if(loaderDomRect !==undefined){
        const isInnerLoader = detectRange(event,loaderDomRect);
        !isInnerLoader && closeLoader();
    }
  })
  function changeLoaderStyle(){
    const blockDom = document.getElementById(`block_${block.id}`);
    const blockDomRect = blockDom?.getClientRects()[0];
    const frame =document.getElementsByClassName("frame")[0];
    const frameDomRect =frame.getClientRects()[0];
    const frameInner =document.querySelector(".frame_inner");
    console.log("blocdonw",blockDom)
    if(blockDomRect!==undefined && frameDomRect!==undefined  &&  
    frameInner !==null ){
        const style:CSSProperties={
        position:"absolute",
        top:blockDomRect.bottom - frameDomRect.top + blockDomRect.height +10 ,
        left: blockDomRect.x -frameDomRect.x +((frameDomRect.width -frameInner.clientWidth) *0.5) ,
        width: blockDomRect.width
      };
      setLoaderStyle(style);
    };
  }
  useEffect(()=>{
    changeLoaderStyle();
  },[]);

  window.onresize=()=>{
    changeLoaderStyle();
  }
  return (
  <div 
    id="loader"
    style={loaderStyle}
  >
    <div className="inner">
        <div className='imgLoader'>
          <div className='menu'>
            <div className=' innerPadding'>
              <button>
                Upload
              </button>
              {/* <button>
                Embed link
              </button> */}
            </div>
          </div>
          <div className='loaderForm innerPadding'>
              <label htmlFor="imgLoader">
                Or upload file
              </label>
              <input
                type="file"
                accept='image/jpg , image/jpeg, imgae/png'
                name="imgLoader"
                id="imgLoader"
                onChange={onChangeImgFile}
              />
          </div>
        </div>
    </div>
  </div>
  )
};

export default React.memo(Loader)