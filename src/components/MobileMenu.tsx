import React,{SetStateAction,Dispatch} from 'react';
import { AiOutlinePlusSquare, AiOutlineUnorderedList } from 'react-icons/ai';
import { BiSearchAlt2 } from 'react-icons/bi';
import { Page, pageSample } from '../modules/notion';
import { SideAppear } from '../modules/side';

type MobliMenuProps ={
  sideAppear :SideAppear,
  changeSide: (appear: SideAppear) => void,
  addPage: (newPage: Page) => void,
  openQF :boolean,
  setOpenQF: Dispatch<SetStateAction<boolean>>
};                       

const MobileMenu =({sideAppear,changeSide, addPage,openQF,setOpenQF}:MobliMenuProps)=>{
  const onClickOpenSideBarBtn =()=>{
    sideAppear ==="lock" ? 
    changeSide("close"): 
    changeSide("lock");
  };
  const onClickQFBtn =()=>{
    setOpenQF(!openQF)
  };
  const onClickAddNewPageBtn =()=>{
    const newPage :Page ={
      ...pageSample,
      id: `${JSON.stringify(Date.now())}_${Math.floor(Math.random() * 11)}`
    };
    addPage(newPage);
  };
  return (
    <div
      className='mobileMenu'
    >
      <button
        name='mobileMenu_openSideBarBtn'
        className='mobileMenu_openSideBarBtn'
        onClick={onClickOpenSideBarBtn}
      >
        <AiOutlineUnorderedList/>
      </button>
      <button
        name="mobileMenu_quickfindBtn"
        className="mobileMenu_quickfindBtn"
        onClick={onClickQFBtn}
      >
        <BiSearchAlt2/>
      </button>
      <button
        name="mobileMenu_addNewPageBtn"
        className="mobileMenu_addNewPageBtn"
        onClick={onClickAddNewPageBtn}
      >
        <AiOutlinePlusSquare/>
      </button>
    </div>
  )
};


export default React.memo(MobileMenu)