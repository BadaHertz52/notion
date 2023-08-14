import React, {
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { ListItem, Notion, Page } from "../modules/notion/type";
import { SideAppear } from "../modules/side/reducer";
import { ActionContext } from "../route/NotionRouter";
import ItemTemplate from "./ItemTemplate";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
  WindowScroller,
} from "react-virtualized";

type ListTemplateProp = {
  notion: Notion;
  targetList: ListItem[] | null;
  onClickMoreBtn: (item: ListItem, target: HTMLElement) => void;
  addNewSubPage: (item: ListItem) => void;
  changeSide: (appear: SideAppear) => void;
};

const ListTemplate = ({
  notion,
  targetList,
  addNewSubPage,
  onClickMoreBtn,
}: ListTemplateProp) => {
  const { changeSide } = useContext(ActionContext).actions;
  const ulRef = useRef<HTMLUListElement>(null);
  const [height, setHeight] = useState<number>(
    window.innerWidth > 768 ? 32 : 36
  );
  const findSubPage = (
    id: string,
    pagesId: string[],
    pages: Page[]
  ): ListItem => {
    const index = pagesId.indexOf(id);
    const subPage: Page = pages[index];
    return {
      id: subPage.id,
      title: subPage.header.title,
      iconType: subPage.header.iconType,
      icon: subPage.header.icon,
      subPagesId: subPage.subPagesId,
      parentsId: subPage.parentsId,
      editTime: subPage.editTime,
      createTime: subPage.createTime,
    };
  };
  const makeTargetList = useCallback(
    (ids: string[], pagesId: string[], pages: Page[]): ListItem[] => {
      const listItemArr: ListItem[] = ids.map((id: string) =>
        findSubPage(id, pagesId, pages)
      );
      return listItemArr;
    },
    []
  );
  const cache = new CellMeasurerCache({
    defaultWidth: ulRef.current?.offsetWidth,
    fixedWidth: true,
  });
  const Row = ({ index, measure }: { index: number; measure: () => void }) => {
    const item = (targetList as ListItem[])[index];
    return (
      <li key={item.id}>
        <div className="mainPage">
          <ItemTemplate
            item={item}
            onClickMoreBtn={onClickMoreBtn}
            addNewSubPage={addNewSubPage}
            changeSide={changeSide}
            handleImgLoad={measure}
          />
        </div>
        {notion.pages &&
          notion.pagesId &&
          (item.subPagesId ? (
            <div className="subPage">
              <ListTemplate
                notion={notion}
                targetList={makeTargetList(
                  item.subPagesId,
                  notion.pagesId,
                  notion.pages
                )}
                onClickMoreBtn={onClickMoreBtn}
                addNewSubPage={addNewSubPage}
                changeSide={changeSide}
              />
            </div>
          ) : (
            <div className="subPage no">
              <span>No page inside</span>
            </div>
          ))}
      </li>
    );
  };
  const rowRender = (rowRenderProps: ListRowProps) => {
    const { parent, key, index } = rowRenderProps;
    return (
      <CellMeasurer
        cache={cache}
        parent={parent}
        key={key}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure }) => <Row index={index} measure={measure} />}
      </CellMeasurer>
    );
  };
  const changeHeight = () => {
    setHeight(window.innerWidth > 768 ? 32 : 36);
  };
  useEffect(() => {
    window.addEventListener("resize", changeHeight);
    return window.removeEventListener("resize", changeHeight);
  }, []);
  return (
    <ul ref={ulRef}>
      {targetList && (
        <WindowScroller>
          {() => (
            <AutoSizer style={{ height: height }}>
              {({ width, height }) => {
                <List
                  autoHeight
                  height={height}
                  width={width}
                  overscanRowCount={0}
                  rowCount={targetList.length}
                  rowHeight={cache.rowHeight}
                  rowRenderer={rowRender}
                  deferredMeasurementCache={cache}
                />;
              }}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </ul>
  );
};

export default React.memo(ListTemplate);
