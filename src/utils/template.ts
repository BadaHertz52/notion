import { BASIC_BLOCK_STYLE, SESSION_KEY } from "../constants";
import { BgColorType, Block, Page } from "../types";

export const isTemplates = () => !!document.querySelector("#templates");
/**
 * template 수정 시에 수정 이전 버전을 session storage에 저장하는 함수 (page의 내용을 변경하는 모든 함수에서 사용됨)

 * @param page  현재 페이지
 */
export const setOriginTemplateItem = (page: Page) => {
  if (isTemplates()) {
    const originTemplate = JSON.stringify(page);
    sessionStorage.setItem(SESSION_KEY.originTemplate, originTemplate);
  }
};
//초기 template 상태
export function returnTemplateSubBlock(day: string, index: number): Block {
  const num = index / 2;
  const TODO_LIST = [
    "6AM :🎽 running",
    "9AM:🏥physical checkup",
    "😊 Webtoon re-enactment",
    "8PM: 🛒Buying food ingredients in mart - sale",
    "6PM :🍴 dinner appointment with friend",
    "Dry cleaning at the dry cleaner",
    "house cleaning",
  ];

  const templateBlock: Block = {
    id: `templateSub_${day}`,
    contents: TODO_LIST[num],
    firstBlock: false,
    subBlocksId: null,
    parentBlocksId: [`templateBlock_${day}`],
    type: "todo",
    iconType: null,
    icon: null,
    editTime: JSON.stringify(Date.now()),
    createTime: JSON.stringify(Date.now()),
    style: BASIC_BLOCK_STYLE,
    comments: null,
  };
  return templateBlock;
}

export function returnTemplateBlock(day: string, index: number): Block {
  const BACKGROUND_COLORS: BgColorType[] = [
    "blue",
    "green",
    "yellow",
    "pink",
    "grey",
    "yellow",
    "blue",
  ];

  const templateBlock: Block = {
    id: `templateBlock_${day}`,
    contents: `${day}`,
    firstBlock: true,
    subBlocksId: [`templateSub_${day}`],
    parentBlocksId: null,
    type: "h3",
    iconType: null,
    icon: null,
    editTime: JSON.stringify(Date.now()),
    createTime: JSON.stringify(Date.now()),
    style: {
      ...BASIC_BLOCK_STYLE,
      bgColor:
        index % 2 === 0 ? "default" : BACKGROUND_COLORS[Math.floor(index / 2)],
    },
    comments: null,
  };

  return templateBlock;
}
