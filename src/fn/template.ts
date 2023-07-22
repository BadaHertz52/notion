import { Page } from "../modules/notion/type";

/**
 * template 수정 시에 수정 이전 버전을 session storage에 저장하는 함수 (page의 내용을 변경하는 모든 함수에서 사용됨)
 * @param templateHtml #template 인 element로 template이 열린 경우에만 함수가 동작하도록 하기 위한 조건을 사용됨
 * @param page  현재 페이지
 */
export const setTemplateItem = (
  templateHtml: HTMLElement | null,
  page: Page
) => {
  if (templateHtml) {
    const templateItem = sessionStorage.getItem("originTemplate");
    if (templateItem === null) {
      const originTemplate = JSON.stringify(page);
      sessionStorage.setItem("originTemplate", originTemplate);
    }
  }
};
