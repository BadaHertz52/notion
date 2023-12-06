import { SideAppear } from "../../types";

const CHANGE_SIDE = "side/CHANGE_SIDE" as const;

export const change_side = (appear: SideAppear) => ({
  type: CHANGE_SIDE,
  appear: appear,
});
export type Side = {
  appear: SideAppear;
};
type SideAction = ReturnType<typeof change_side>;

const initialState: Side = {
  appear: "lock",
};

export default function side(
  state: Side = initialState,
  action: SideAction
): Side {
  switch (action.type) {
    case CHANGE_SIDE:
      const sideBarOutBoxEl = document.getElementById("sideBar-outBox");
      if (sideBarOutBoxEl) {
        const newClassName = `sideBar-${action.appear}`;
        sideBarOutBoxEl.className = newClassName;
      }
      return { appear: action.appear };
    default:
      return state;
  }
}
