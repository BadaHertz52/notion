import React, { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";
import { SideAppear } from "../modules/side/reducer";
import { RootState } from "../modules";

export type SideBarContainerProp = {
  sideAppear: SideAppear;
  setOpenQF: Dispatch<SetStateAction<boolean>>;
  setOpenTemplates: Dispatch<SetStateAction<boolean>>;
  showAllComments: boolean;
};
const SideBarContainer = ({
  sideAppear,
  setOpenQF,
  setOpenTemplates,
  showAllComments,
}: SideBarContainerProp) => {
  const notion = useSelector((state: RootState) => state.notion);

  const user = useSelector((state: RootState) => state.user);

  return (
    <SideBar
      notion={notion}
      user={user}
      sideAppear={sideAppear}
      setOpenQF={setOpenQF}
      setOpenTemplates={setOpenTemplates}
      showAllComments={showAllComments}
    />
  );
};

export default React.memo(SideBarContainer);
