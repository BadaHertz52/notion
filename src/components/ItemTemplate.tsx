import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useCallback,
} from "react";
import { ListItem } from "../modules/notion/type";
import { SideAppear } from "../modules/side/reducer";
import { CSSProperties } from "styled-components";
import ScreenOnly from "./ScreenOnly";
import { MdPlayArrow } from "react-icons/md";
import PageIcon from "./PageIcon";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { makeRoutePath } from "../fn";

type ItemTemplateProp = {
  item: ListItem;
  onClickMoreBtn: (item: ListItem, target: HTMLElement) => void;
  addNewSubPage: (item: ListItem) => void;
  changeSide: (appear: SideAppear) => void;
  handleImgLoad?: () => void;
};

const ItemTemplate = ({
  item,
  onClickMoreBtn,
  addNewSubPage,
  changeSide,
  handleImgLoad,
}: ItemTemplateProp) => {
  const [toggleStyle, setToggleStyle] = useState<CSSProperties>({
    transform: "rotate(0deg)",
  });
  const sideBarPageFn = useRef<HTMLDivElement>(null);
  const onToggleSubPage = useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const toggleSubPage = (subPageElement: null | undefined | Element) => {
      if (subPageElement) {
        subPageElement.classList.toggle("on");
        subPageElement.classList.contains("on")
          ? setToggleStyle({
              transform: "rotate(90deg)",
            })
          : setToggleStyle({
              transform: "rotate(0deg)",
            });
      }
    };
    let subPageElement = null;
    switch (target.tagName.toLocaleLowerCase()) {
      case "path":
        subPageElement =
          target.parentElement?.parentElement?.parentElement?.parentElement
            ?.parentElement?.nextElementSibling;

        break;
      case "svg":
        subPageElement =
          target.parentElement?.parentElement?.parentElement?.parentElement
            ?.nextElementSibling;

        break;
      case "button":
        subPageElement =
          target.parentElement?.parentElement?.parentElement
            ?.nextElementSibling;
        break;

      default:
        break;
    }
    toggleSubPage(subPageElement);
  }, []);
  const showPageFn = useCallback(() => {
    if (sideBarPageFn.current) {
      sideBarPageFn.current.classList.toggle("on");
    }
  }, []);
  const removeOn = useCallback(() => {
    if (sideBarPageFn.current) {
      sideBarPageFn.current.classList.contains("on") &&
        sideBarPageFn.current.classList.remove("on");
    }
  }, []);
  const onClickPageName = useCallback(() => {
    if (window.innerWidth <= 768) {
      changeSide("close");
    }
  }, [changeSide]);
  return (
    <div
      className="item__inner page-link"
      onMouseOver={showPageFn}
      onMouseOut={removeOn}
    >
      <div className="pageItem">
        <button
          title="button to toggle page"
          className="toggleBtn"
          onClick={onToggleSubPage}
          style={toggleStyle}
        >
          <ScreenOnly text="button to toggle page" />
          <MdPlayArrow />
        </button>
        <Link
          className="pageName"
          to={makeRoutePath(item.id)}
          onClick={onClickPageName}
        >
          <PageIcon
            icon={item.icon}
            iconType={item.iconType}
            style={undefined}
            handleImgLoad={handleImgLoad}
          />
          <div>{item.title}</div>
        </Link>
      </div>
      <div className="sideBarPageFn" ref={sideBarPageFn}>
        <button
          className="moreBtn"
          title="button to open menu to delete, duplicate or for more"
          onClick={() => {
            sideBarPageFn.current &&
              onClickMoreBtn(item, sideBarPageFn.current);
          }}
        >
          <ScreenOnly text="button to open menu to delete, duplicate or for more" />
          <BsThreeDots />
        </button>
        <button
          className="btn-addPage"
          title="button to quickly add a page inside"
          onClick={() => {
            addNewSubPage(item);
          }}
        >
          <ScreenOnly text="button to quickly add a page inside" />
          <AiOutlinePlus />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ItemTemplate);
