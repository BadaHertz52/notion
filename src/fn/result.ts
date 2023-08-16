import { resultType } from "../components/Result";
import { Page } from "../modules/notion/type";
import { findPage } from ".";
function makePath(
  parentsId: string[],
  pagesId: string[],
  pages: Page[],
  trashPagesId: string[] | null,
  trashPages: Page[] | null
): string {
  const pathArray = parentsId.map((id: string) => {
    const title = pagesId.includes(id)
      ? findPage(pagesId, pages, id).header.title
      : trashPages && trashPagesId
      ? findPage(trashPagesId, trashPages, id).header.title
      : "";
    console.log("title", title);
    return title;
  });
  console.log("path", pathArray.join("/"));
  return pathArray.join("/");
}
export function makeResultType(
  page: Page,
  pagesId: string[],
  pages: Page[],
  trashPagesId: string[] | null,
  trashPages: Page[] | null
): resultType {
  return {
    id: page.id,
    title: page.header.title,
    icon: page.header.icon,
    iconType: page.header.iconType,
    createTime: page.createTime,
    editTime: page.editTime,
    path: page.parentsId
      ? makePath(page.parentsId, pagesId, pages, trashPagesId, trashPages) +
        "/" +
        page.header.title
      : null,
  };
}
