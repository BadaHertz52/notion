import { resultType } from "../components/Result";
import { Page } from "../modules/notion/type";
import { findPage } from ".";
function makePath(
  parentsId: string[],
  pagesId: string[],
  pages: Page[],
  trashParentPagesId: string[] | null,
  trashParentPages: Page[] | null
): string {
  let path = "";
  parentsId.forEach((id: string) => {
    const title = parentsId.includes(id)
      ? findPage(pagesId, pages, id).header.title
      : trashParentPages && trashParentPagesId
      ? findPage(trashParentPagesId, trashParentPages, id).header.title
      : "";
    if (parentsId.indexOf(id) === 0) {
      path = title;
    } else {
      path.concat(`/${title}`);
    }
  });
  return path;
}
export function makeResultType(
  page: Page,
  pagesId: string[],
  pages: Page[],
  trashParentPagesId: string[] | null,
  trashParentPages: Page[] | null
): resultType {
  return {
    id: page.id,
    title: page.header.title,
    icon: page.header.icon,
    iconType: page.header.iconType,
    createTime: page.createTime,
    editTime: page.editTime,
    path: page.parentsId
      ? makePath(
          page.parentsId,
          pagesId,
          pages,
          trashParentPagesId,
          trashParentPages
        )
      : null,
  };
}
