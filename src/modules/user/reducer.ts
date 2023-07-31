import { initialNotionState } from "../notion/reducer";

const ADD_FAVORITES = "user/ADD_FAVORITES" as const;
const REMOVE_FAVORITES = "user/REMOVE_FAVORITES" as const;
const ADD_RECENT_PAGE = "user/ADD_RECENT_PAGE" as const;
const DELETE_RECENT_PAGE = "user/DELETE_RECENT_PAGE" as const;
const CLEAN_RECENT_PAGE = "user/CLEAN_RECENT_PAGE" as const;
export const recentPagesSessionKey = "recent_pages";
export const add_favorites = (itemId: string) => ({
  type: ADD_FAVORITES,
  itemId: itemId,
});
export const remove_favorites = (itemId: string) => ({
  type: REMOVE_FAVORITES,
  itemId: itemId,
});
export const add_recent_page = (itemId: string) => ({
  type: ADD_RECENT_PAGE,
  itemId: itemId,
});
export const delete_recent_page = (itemId: string) => ({
  type: DELETE_RECENT_PAGE,
  itemId: itemId,
});
export const clean_recent_page = () => ({
  type: CLEAN_RECENT_PAGE,
});

export type UserState = {
  userName: string;
  userEmail: string;
  favorites: string[] | null;
  recentPagesId: string[] | null;
};
type UserAction =
  | ReturnType<typeof add_favorites>
  | ReturnType<typeof remove_favorites>
  | ReturnType<typeof add_recent_page>
  | ReturnType<typeof delete_recent_page>
  | ReturnType<typeof clean_recent_page>;

const recentPagesSessionItem = sessionStorage.getItem(recentPagesSessionKey);
const item = recentPagesSessionItem
  ? (JSON.parse(recentPagesSessionItem) as string[])
  : null;
const recentPagesId =
  item && initialNotionState.pagesId
    ? item.filter((i) => initialNotionState.pagesId?.includes(i))
    : null;
// 새로고침 시, state가 초기화 되기 때문에 최근 페이지에 initialNotionState.pagesId에 없는 페이지는 세션에서 삭제
if (recentPagesId !== item) {
  sessionStorage.setItem(recentPagesSessionKey, JSON.stringify(item));
}
const initialState: UserState = {
  userName: "badahertz52",
  userEmail: "badahertz52@notion.com",
  favorites: ["12345"],
  recentPagesId: recentPagesId,
};

export default function user(
  state: UserState = initialState,
  action: UserAction
): UserState {
  switch (action.type) {
    case ADD_FAVORITES:
      const favorites =
        state.favorites !== null
          ? state.favorites.concat(action.itemId)
          : [action.itemId];
      return {
        ...state,
        favorites: favorites,
      };
    case REMOVE_FAVORITES:
      const newFavorites = state.favorites?.filter(
        (id: string) => id !== action.itemId
      );

      return {
        ...state,
        favorites:
          newFavorites !== undefined
            ? newFavorites[0] !== undefined
              ? newFavorites
              : null
            : null,
      };
    case ADD_RECENT_PAGE:
      let recentPagesId;
      if (!state.recentPagesId) {
        recentPagesId = [action.itemId];
      } else {
        recentPagesId = [...state.recentPagesId];
        if (state.recentPagesId.includes(action.itemId)) {
          recentPagesId = recentPagesId.filter(
            (id: string) => id !== action.itemId
          );
        }
        recentPagesId.splice(0, 0, action.itemId);
      }
      // session storage 에 추가
      sessionStorage.setItem(
        recentPagesSessionKey,
        JSON.stringify(recentPagesId)
      );
      return {
        ...state,
        recentPagesId: recentPagesId,
      };
    case DELETE_RECENT_PAGE:
      const newRecentPagesId = state.recentPagesId
        ? [...state.recentPagesId]
        : null;
      if (newRecentPagesId) {
        const index = newRecentPagesId.indexOf(action.itemId);
        newRecentPagesId.splice(index, 1);
      }
      return {
        ...state,
        recentPagesId: newRecentPagesId,
      };
    case CLEAN_RECENT_PAGE:
      return {
        ...state,
        recentPagesId: null,
      };
    default:
      return state;
  }
}
