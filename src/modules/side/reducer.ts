const lock = "lock" as const;
const float = "float" as const;
const floatHide = "floatHide" as const;
const close = "close" as const;
export type SideAppear =
  | typeof lock
  | typeof float
  | typeof floatHide
  | typeof close;

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
  appear: lock,
};

export default function side(
  state: Side = initialState,
  action: SideAction
): Side {
  switch (action.type) {
    case CHANGE_SIDE:
      const sideBar = document.getElementById("inner");
      if (sideBar) {
        const classList = sideBar.classList;
        const newClassName = `sideBar-${action.appear}`;
        sideBar.classList.replace(classList[0], newClassName);
      }
      return { appear: action.appear };
    default:
      return state;
  }
}
