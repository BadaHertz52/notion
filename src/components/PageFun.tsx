import React, { Dispatch, SetStateAction } from "react";
import { AiFillStar, AiOutlineClockCircle, AiOutlineStar } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { Page } from "../modules/notion";

type PageFunProps={
  favorites:string[]|null,
  page:Page,
  removeFavorites: (itemId: string) => void,
  addFavorites: (itemId: string) => void
  setShowAllComments:Dispatch<SetStateAction<boolean>>,
}
const PageFun =({favorites,page, removeFavorites,addFavorites,setShowAllComments, }:PageFunProps)=>{
  const pageInFavorites = favorites?.includes(page.id); 
  const addOrRemoveFavorite=()=>{
    pageInFavorites ?
    removeFavorites(page.id):
    addFavorites(page.id);
  }
  const onClickViewAllComments=()=>{
    setShowAllComments(true)
  };

  return(
    <div className="pageFun">
    <button
      title='Share or publish to the web'
    >
      Share
    </button>
    <button
      title='View all comments'
      onClick={onClickViewAllComments}
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
      className={pageInFavorites?"favoriteBtn on" : "favoriteBtn"}
      onClick={addOrRemoveFavorite}
    >
      {pageInFavorites ?
      <AiFillStar/>
      :
      <AiOutlineStar/>
      }
      
    </button>
    <button
      title=" Style, export, and more"
    >
      <BsThreeDots/>
    </button>
  </div>
  )
};

export default React.memo(PageFun)