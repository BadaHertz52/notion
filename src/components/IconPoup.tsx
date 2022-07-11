import React, { Dispatch, SetStateAction, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { CSSProperties } from 'styled-components';
import { IconType, Page } from '../modules/notion';

export type Emoji ={
  label:string,
  symbol:string 
};
export const emojis:Emoji[] =[
  {label:"smile face", symbol:"😁"},
  {label:"smile with heart  face", symbol:"🥰"},
  {label:"angry face", symbol:"😠"},
  {label:"crying face", symbol:"😭"},
  {label:"redheart", symbol:"❤️"},
  {label:"purpleheart", symbol:"💜"},
  {label:"ban", symbol:"🚫"},
  {label:"attention", symbol:"⚠️"},
  {label:"pencile", symbol:"📝"},
  {label:"clock", symbol:"⌚"},
  {label:"phone", symbol:"📱"},
  {label:"video game", symbol:"🎮"},
  {label:"computer", symbol:"🖥️"},
  {label:"player", symbol:"🙏"},
  {label:"party", symbol:"🎉"},
  {label:"present", symbol:"🎁"},
  {label:"movie", symbol:"🎞️"},
  {label:"coin", symbol:"🪙"},
  {label:"money", symbol:"💵"},
  {label:"card", symbol:"💳"},
  {label:"calendar", symbol:"🗓️"},
  {label:"folder", symbol:"📁"},
  {label:"ligh bulb", symbol:"💡"},
  {label:"broom", symbol:"🧹"},
  {label:"unicon", symbol:"🦄"},
  {label:"french fries", symbol:"🍟"},
  {label:"cup cake", symbol:"🧁"},
  {label:"apple", symbol:"🍎"},
  {label:"ariplane", symbol:"✈️"},
  {label:"car", symbol:"🚗"},
  {label:"bus", symbol:"🚌"},
  {label:"building", symbol:"🏢"},
  {label:"home", symbol:"🏠"},
  {label:"tent", symbol:"⛺"},
  {label:"star", symbol:"⭐"},
  {label:"sun", symbol:"☀️"},
  {label:"rainbow", symbol:"🌈"},
  {label:"rain", symbol:"🌧️"},
  {label:"snowman", symbol:"☃️"},
  {label:"cherry blossoms", symbol:"🌸"},
];
export const randomIcon =():string=>{
  const icons  = emojis.map((emoji:Emoji)=> emoji.symbol);
  const index = Math.floor(Math.random() * (3));
  return icons[index]
};

type IconPoupProps ={
  page:Page,
  editPage: (pageId: string, newPage: Page) => void,
  style :CSSProperties |undefined,
  setOpenIconPopup :Dispatch<SetStateAction<boolean>>,
};
const IconPopup =({page ,editPage,style,  setOpenIconPopup} :IconPoupProps)=>{
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