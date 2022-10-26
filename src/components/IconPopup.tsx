import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { CSSProperties } from 'styled-components';
import { Block, emojiPath, IconType, Page } from '../modules/notion';
import { setTemplateItem } from './BlockComponent';
import { detectRange } from './BlockFn';
const smileEmoji ="smile";
const heartEyesEmoji ="heart_eyes"; 
const angryEmoji = "angry";
const sobEmoji ="sob"; 
const heartEmoji="heart"; 
const purpleHeartEmoji="purple_heart";
const no_entry_signEmoji="no_entry_sign";
const warningEmoji ="warning"; 
const memoEmoji ="memo"; 
const alarmEmoji="alarm_clock";
const phoneEmoji="phone";
const gameEmoji="video_game"; 
const computerEmoji="desktop_computer";
const prayEmoji="pray";
const tadaEmoji="tada";
const giftEmoji="gift";
const popcornEmoji="popcorn";
const musicalNoteEmoji="musical_note";
const dollarEmoji="dollar";
const creditCardEmoji="credit_card";
const calendarEmoji="calendar";
const chartEmoji="chart_with_upwards_trend";
const bulbEmoji="bulb";
const shoppingTrolleyEmoji="shopping_trolley";
const bathEmoji="bath";
const friesEmoji="fries";
const cakeEmoji="cake";
const appleEmoji="apple";
const carrotEmoji="carrot";
const airplaneEmoji="airplane";
const busEmoji="bus";
const metroEmoji="metro";
const houseEmoji="house_with_garden";
const tentEmoji="tent";
const starEmoji="star";
const sunnyEmoji="sunny";
const rainbowEmoji="rainbow";
const rainEmoji="rain_cloud";
const snowmanEmoji="snowman";
const blossomEmoji="cherry_blossom";
export type Emoji=
typeof smileEmoji
|typeof heartEyesEmoji 
|typeof angryEmoji
|typeof sobEmoji 
|typeof heartEmoji 
|typeof purpleHeartEmoji
|typeof no_entry_signEmoji 
|typeof warningEmoji 
|typeof memoEmoji 
|typeof alarmEmoji
|typeof phoneEmoji 
|typeof gameEmoji 
|typeof computerEmoji 
|typeof prayEmoji 
|typeof tadaEmoji 
|typeof giftEmoji 
|typeof popcornEmoji 
|typeof musicalNoteEmoji 
|typeof dollarEmoji 
|typeof creditCardEmoji 
|typeof calendarEmoji 
|typeof chartEmoji
|typeof bulbEmoji 
|typeof shoppingTrolleyEmoji 
|typeof bathEmoji
|typeof friesEmoji 
|typeof cakeEmoji 
|typeof appleEmoji 
|typeof carrotEmoji 
|typeof airplaneEmoji 
|typeof busEmoji 
|typeof metroEmoji 
|typeof houseEmoji 
|typeof tentEmoji 
|typeof starEmoji 
|typeof sunnyEmoji
|typeof rainbowEmoji 
|typeof rainEmoji
|typeof snowmanEmoji 
|typeof blossomEmoji
;
export const emojis:Emoji[] =[smileEmoji,heartEyesEmoji , angryEmoji, sobEmoji , heartEmoji , purpleHeartEmoji, no_entry_signEmoji , warningEmoji , memoEmoji , alarmEmoji, phoneEmoji , gameEmoji , computerEmoji , prayEmoji , tadaEmoji , giftEmoji , popcornEmoji , musicalNoteEmoji , dollarEmoji , creditCardEmoji , calendarEmoji , chartEmoji, bulbEmoji , shoppingTrolleyEmoji , bathEmoji, friesEmoji , cakeEmoji , appleEmoji , carrotEmoji , airplaneEmoji , busEmoji , metroEmoji , houseEmoji , tentEmoji , starEmoji , sunnyEmoji, rainbowEmoji , rainEmoji, snowmanEmoji , blossomEmoji];

export const randomIcon =():Emoji=>{
  const index = Math.floor(Math.random() * (emojis.length,0) + 0);
  return emojis[index]
};

type IconPopupProps ={
  currentPageId:string |null,
  block:Block|null,
  page:Page,
  editBlock:(pageId: string, block: Block) => void,
  editPage: (pageId: string, newPage: Page) => void,
  style :CSSProperties |undefined,
  setOpenIconPopup :Dispatch<SetStateAction<boolean>>,
};
const IconPopup =({ currentPageId,block,page, editBlock ,editPage,style,  setOpenIconPopup} :IconPopupProps)=>{
  const emoji ="emoji";
  const image="image";
  type Category = typeof emoji | typeof image;
  const [category , setCategory] =useState<Category>(emoji);
  const changePageIcon =(icon:string|Emoji|null ,iconType:IconType)=>{
    const editTime = JSON.stringify(Date.now());
    const templateHtml =document.getElementById("template");
    setTemplateItem(templateHtml,page);
    const editedPage:Page ={
      ...page,
      header :{
        ...page.header,
        iconType:iconType,
        icon: icon
      },
      editTime:editTime
    };
    editPage(page.id, editedPage );
    if(block !==null  && currentPageId !==null){
      const editedBlock:Block ={
        ...block,
        iconType: iconType,
        icon:icon,
        editTime:editTime
      };
      editBlock(currentPageId, editedBlock)
    }
    setOpenIconPopup(false);
  };
  const removeIcon =()=>{
    changePageIcon(null , null);
  };

  const onClickRandom =()=>{
    changePageIcon(randomIcon(), "emoji");
  };

  const onChangeImgIcon=(event:ChangeEvent<HTMLInputElement>)=>{
    const file = event.target.files?.[0];
    if(file !==undefined){
      const reader = new FileReader();
      reader.onload =function(){
        const result = reader.result as string;
        changePageIcon(result, "img");
      };
      reader.readAsDataURL(file);
    }
  };

  const inner =document.getElementById("inner");
  inner?.addEventListener("click", (event:MouseEvent)=>{
    const iconPopup =document.getElementById("iconPopup");
    const iconPopupDomRect = iconPopup?.getClientRects()[0];
    const isInIconPopup =detectRange(event, iconPopupDomRect);
    const target =event.target as null|Element;
    if(target?.id !== "imageIconInput"){
      !isInIconPopup && 
      setOpenIconPopup(false);
    };

  })
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
                onClick={()=>changePageIcon(emoji, "emoji")}
              >
              <img
                alt={emoji}
                src={`${emojiPath}${emoji}.png`}
              />
              </button>
              )
        :
        <div className='imageIconBody'>
          <label
            htmlFor="imageIconInput"
            className="imageIconInputLabel"
          >
            Choose an image
          </label>
          <input
            id="imageIconInput"
            name="imageIconInput"
            type="file"
            accept='image/*'
            onChange={onChangeImgIcon}
          />
          <div>
            Recommended size 280 x 280 pixels
          </div>
        </div>
        }
        </div>

      </div>

    </div>
  )
};

export default React.memo(IconPopup)