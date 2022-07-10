import React, { Dispatch, SetStateAction, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { CSSProperties } from 'styled-components';
import { IconType, Page } from '../modules/notion';
import { Emoji } from './Frame';
type IconPoupProps ={
  page:Page,
  editPage: (pageId: string, newPage: Page) => void,
  emojis: Emoji[],
  style :CSSProperties |undefined,
  changePageIcon: (icon: string | null, iconType:IconType) => void, 
  randomIcon:()=>string,
}
const IconPopup =({page ,editPage,style, emojis,changePageIcon,randomIcon} :IconPoupProps)=>{
  const emoji ="emoji";
  const image="image";
  type Category = typeof emoji | typeof image;
  const [category , setCategory] =useState<Category>(emoji);
  const [imgSrc, setImgSrc]=useState<string|null>(null);
  const removeIcon =()=>{
    changePageIcon(null , null);
  };

  const onClickRandom =()=>{
    changePageIcon(randomIcon(), "string");
  };

  const onChangeImgIcon=(event:React.ChangeEvent<HTMLInputElement>)=>{
    const file = event.target.files?.[0];
    if(file !==undefined){
      const url = URL.createObjectURL(file);
      changePageIcon(url, "img");
    }
  }
  return(
    <div 
      id="iconPopup"
      style={style}
    >
      <div className='inner'>
        <div className='header'>
          <div className='category'>
            <div
              className="categoryBtn"
            >
              <button
                onClick={()=>setCategory(emoji)}
              >
                Emoji
              </button>
              {category===emoji &&
              <span className='bottomLine'></span>
              }
            </div>
            <div
              className="categoryBtn"
            >
              <button
                onClick={()=>setCategory(image)}
              >
                Upload image
              </button>
              {category===image &&
              <span className='bottomLine'></span>
              }
            </div>
          </div>
          <div>
            <button
              onClick={onClickRandom}
            >
              <BsEmojiSmile/>
              Random
            </button>
            <button
              onClick={removeIcon}
            >
              Remove
            </button>
          </div>
        </div>

        <div className='body'>
          {category === emoji ?
            emojis.map((emoji:Emoji)=>
              <button
                className='emojiBtn'
                onClick={()=>changePageIcon(emoji.symbol, "string")}
              >
              <span
                className="emoji"
                aria-label={emoji.label ? emoji.label : ""}
                aria-hidden={emoji.label ? "false" : "true"}
              >
                {emoji.symbol}
              </span>
              </button>
              )
        :
        <div
            className='imageIcon'
        >
          <label
            htmlFor="imageIconInput"
          >
            Choose an image
          </label>
          <input
            id="imageIconInput"
            name="imageIcon"
            type="file"
            accept='image/*'
            onChange={onChangeImgIcon}
          />
          {imgSrc!==null &&
          <img
            src={imgSrc}
            alt="imgIcon"
          />
          }
        </div>
        }
        </div>

      </div>

    </div>
  )
};

export default React.memo(IconPopup)