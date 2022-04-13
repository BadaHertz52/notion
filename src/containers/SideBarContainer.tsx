import React from 'react';
import { useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import { RootState } from '../modules';

const SideBarContainer =()=>{
  const user = useSelector((state:RootState)=> state.user);

  const list = useSelector((state:RootState)=> state.list);

  const notion =useSelector((state:RootState)=> state.notion);
  return(
    <SideBar user={user} list={list} notion={notion} />
  )
};

export default React.memo (SideBarContainer);
