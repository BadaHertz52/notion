import React from "react";
import { useSelector } from "react-redux";

import { SideBar } from "../index";
import { SideBarProps } from "./SideBar";

import { RootState } from "../../modules";

export type SideBarContainerProp = Omit<
  SideBarProps,
  "sideAppear" | "notion" | "user"
>;

const SideBarContainer = ({ ...props }: SideBarContainerProp) => {
  const rootState = useSelector((state: RootState) => state);
  const { notion, user, side } = rootState;

  return (
    <SideBar {...props} notion={notion} user={user} sideAppear={side.appear} />
  );
};

export default React.memo(SideBarContainer);
