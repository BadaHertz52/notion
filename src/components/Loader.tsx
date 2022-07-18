import React, { ChangeEvent, Dispatch, FormEvent,  SetStateAction,  useEffect,  useState } from 'react';
import { CSSProperties } from 'styled-components';
import { Block, Page } from '../modules/notion';
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
  const imgFile ="imgFile";
  const embedLink ="embedLink";
  type imgLoaderType =typeof imgFile| typeof embedLink;
  const [loaderStyle, setLoaderStyle]=useState<CSSProperties>();
  const loader=block.type.slice(0, block.type.indexOf("media")-1);
  const [imgLoader, setImgLoader]=useState<imgLoaderType>(imgFile);
  const onChangeImgFile =(event:ChangeEvent<HTMLInputElement>)=>{
    const file =event.target.files?.[0];
    if(file!==undefined){
      const url = URL.createObjectURL(file);
      const editedBlock :Block ={
        ...block,
        type:"image media",
        contents:url,
        editTime:JSON.stringify(Date.now(),)
      };
      editBlock(page.id,editedBlock);
      closeLoader();
    }else{
      console.log("can't find image file")
    }
  };
  const onChangeEmbedLink =(event:ChangeEvent<HTMLInputElement>)=>{

  };
  const onSubmitEmbedLink =(event:FormEvent<HTMLFormElement>)=>{

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
  useEffect(()=>{
    const blockDom = document.getElementById(`block_${block.id}`);
    const editableBlockInner =blockDom?.parentElement;
    const editabelBlockInnerDomRect =editableBlockInner?.getClientRects()[0];
    const blockDomRect = blockDom?.getClientRects()[0];
    const frame =document.getElementsByClassName("frame")[0];
    const frameDomRect =frame.getClientRects()[0];
    if(blockDomRect!==undefined && editabelBlockInnerDomRect!==undefined){
      const style:CSSProperties={
        position:"absolute",
        top:blockDomRect.bottom - frameDomRect.top + blockDomRect.height +20,
        left: blockDomRect.left -frameDomRect.left -20,
      };
      setLoaderStyle(style);
    };
    
  },[])
  return (
  <div 
    id="loader"
    style={loaderStyle}
  >
    <div className="inner">
      {loader ==="image" &&
        <div className='imgLoader'>
          <div className='menu'>
            <div className=' innerPadding'>
              <button>
                Upload
              </button>
              <button>
                Embed link
              </button>
            </div>
          </div>
          <div className='loaderForm innerPadding'>
            {imgLoader === imgFile ?
            <>
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

            </>
          :
            <form className='embedLink' onSubmit={onSubmitEmbedLink}> 
              <input
                type="text"
                placeholder='Paste the image link....'
                onChange={onChangeEmbedLink}
              />
              <input
                type="submit"
                value="Embed image"
              />
            </form>
          }
          </div>
        </div>
      }
    </div>
  </div>
  )
};

export default React.memo(Loader)