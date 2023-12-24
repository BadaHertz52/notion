import React, {
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";

import { FixedSizeList } from "react-window";
import { CSSProperties } from "styled-components";

import { BsArrowUpRight, BsLink45Deg } from "react-icons/bs";
import { IoMdCopy } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";

import { ActionContext } from "../../contexts";
import { Block, Page } from "../../types";
import { findPage } from "../../utils";
import { ScreenOnly, PageItem } from "../index";

import "../../assets/linkLoader.scss";

type LinkLoaderProps = {
  recentPagesId: string[] | null;
  pages: Page[];
  pagesId: string[];
  page: Page;
  block: Block;
  closeLink?: () => void;
};

const LinkLoader = ({
  recentPagesId,
  pages,
  page,
  pagesId,
  block,
  closeLink,
}: LinkLoaderProps) => {
  const selectedHtml = document.querySelector(".selected");
  const recentPages = recentPagesId
    ? recentPagesId.length > 3
      ? (recentPagesId
          ?.slice(0.4)
          .map((id: string) => findPage(pagesId, pages, id)) as Page[])
      : (recentPagesId.map((id: string) =>
          findPage(pagesId, pages, id)
        ) as Page[])
    : null;
  const notTemplatePages = pages.filter((p: Page) => p.type === "page");
  const pageList = recentPages
    ? recentPages
    : notTemplatePages.length > 3
    ? notTemplatePages.slice(0.4)
    : notTemplatePages;

  const TOP_DOMAIN = useMemo(
    () => [
      ".com",
      ".net",
      ".org",
      ".edu",
      ".gov",
      ".mil",
      ".int",
      ".biz",
      ".info",
      ".name",
      ".aero",
      ".cat",
      ".coop",
      ".lobs",
      ".mobl",
      ".museum",
      ".pro",
      ".travel",
      ".ac",
      ".ad",
      ".ae",
      ".af",
      ".ag",
      ".al",
      ".ai",
      ".am",
      ".an",
      ".ao",
      "aq",
      ".ar",
      ".as",
      ".at",
      ".au",
      ".aw",
      ".ax",
      ".az",
      ".ba",
      ".bb",
      ".bb",
      ".be",
      ".bf",
      ".bg",
      ".bh",
      ".bi",
      ".bj",
      ".bm",
      ".bn",
      ".bo",
      ".br",
      ".bs",
      ".bt",
      ".bw",
      ".by",
      ".bz",
      ".ca",
      ".cc",
      ".cd",
      ".cf",
      ".cg",
      ".ch",
      ".ci",
      ".ck",
      ".cl",
      ".cm",
      ".cn",
      ".co",
      ".cr",
      ".cu",
      ".cv",
      ".cx",
      ".cy",
      ".cz",
      ".de",
      ".dj",
      ".dk",
      ".dm",
      ".do",
      ".dz",
      ".ec",
      ".ee",
      ".eg",
      ".er",
      ".es",
      ".et",
      ".eu",
      ".fi",
      ".fj",
      ".fk",
      ".fm",
      ".fo",
      ".fr",
      ".ga",
      ".gd",
      ".ge",
      ".gf",
      ".gg",
      ".gh",
      ".gi",
      ".gm",
      ".gn",
      ".gp",
      ".gq",
      ".gr",
      ".gs",
      ".gt",
      ".gu",
      ".gw",
      ".gy",
      ".hk",
      ".hm",
      ".hn",
      ".hr",
      ".ht",
      ".hu",
      ".id",
      ".ie",
      ".il",
      ".im",
      ".in",
      ".io",
      ".iq",
      ".ir",
      ".is",
      ".it",
      ".je",
      ".jm",
      ".jo",
      ".jp",
      ".ke",
      ".kg",
      ".kh",
      ".ki",
      ".km",
      ".kn",
      ".kp",
      ".kr",
      ".kw",
      ".ky",
      ".kz",
      ".la",
      ".lb",
      ".lc",
      ".li",
      ".lk",
      ".lr",
      ".ls",
      ".lt",
      ".lu",
      ".lv",
      ".ly",
      ".ma",
      ".mc",
      ".md",
      ".me",
      ".mg",
      ".mh",
      ".mk",
      ".ml",
      ".mm",
      ".mn",
      ".mo",
      ".mp",
      ".mq",
      ".mr",
      ".ms",
      ".mt",
      ".mu",
      ".mv",
      ".mw",
      ".mx",
      ".my",
      ".mz",
      ".na",
      ".nc",
      ".ne",
      ".nf",
      ".ng",
      ".ni",
      ".nl",
      ".no",
      ".np",
      ".nr",
      ".nu",
      ".nz",
      ".om",
      ".pa",
      ".pe",
      ".pf",
      ".pg",
      ".ph",
      ".pk",
      ".pl",
      ".pn",
      ".pr",
      ".ps",
      ".pt",
      ".pw",
      ".py",
      ".qa",
      ".re",
      ".ro",
      ".rs",
      ".ru",
      ".rw",
      ".sa",
      ".sb",
      ".sc",
      ".sd",
      ".se",
      ".sg",
      ".sh",
      ".si",
      ".sk",
      ".sl",
      ".sm",
      ".sn",
      ".so",
      ".sr",
      ".st",
      ".su",
      ".sv",
      ".sy",
      ".sz",
      ".tc",
      ".td",
      ".tf",
      ".tg",
      ".th",
      ".tj",
      ".tk",
      ".tl",
      ".tm",
      ".tn",
      ".to",
      ".tr",
      ".tt",
      ".tv",
      ".tw",
      ".tz",
      ".ua",
      ".ug",
      ".uk",
      ".us",
      ".uy",
      ".uz",
      ".va",
      ".vc",
      ".ve",
      ".vg",
      ".vi",
      ".vn",
      ".vu",
      ".wf",
      ".ws",
      ".ye",
      ".za",
      ".zm",
      ".zw",
    ],
    []
  );
  /**
   * 이미 link 되어 있는 지 여부
   */
  const [linked, setLinked] = useState<boolean>(false);
  const [linkElements, setLinkElements] = useState<HTMLAnchorElement[] | null>(
    null
  );
  const [linkLoaderStyle, setLinkLoaderStyle] = useState<
    CSSProperties | undefined
  >(undefined);
  const blockStyler = document.getElementById("block-styler");
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Page[] | null>(null);
  const [webLink, setWebLink] = useState<boolean>(false);
  const listArray = !searchValue && !candidates ? pageList : candidates;
  const iconHeight = 18;
  const itemSize = 44;
  const itemMargin = 14;
  const totalItemSize = itemSize + itemMargin;
  const listWidth: number = 300;
  const maxHeight = totalItemSize * 4.5;
  const totalListHeight = totalItemSize * (listArray ? listArray.length : 1);
  const listHeight: number =
    totalListHeight > maxHeight ? maxHeight : totalListHeight;
  const onChangeSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value === "") {
        setSearchValue(null);
        setCandidates(null);
        setWebLink(false);
      } else {
        setSearchValue(value);
        const isWebLink = TOP_DOMAIN.map((d: string) =>
          value.includes(d)
        ).includes(true);
        if (isWebLink) {
          setWebLink(true);
          setCandidates(null);
        } else {
          setWebLink(false);
          const candidateArr = notTemplatePages.filter((page: Page) =>
            page.header.title.includes(value)
          );
          candidateArr[0] ? setCandidates(candidateArr) : setCandidates(null);
        }
      }
    },
    [notTemplatePages, TOP_DOMAIN]
  );
  /**
   * dom에 변경이 읽을 때,  block의 내용을 담고 있는 element의 innerHTML을 읽어와서, 변경된 내용을 state에 업데이트하는 함수
   */
  // const getBlockContents = useCallback(() => {
  //   const targetBlockContentHtml = document
  //     .getElementById(`${block.id}__contents`)
  //     ?.querySelector(".editable");
  //   if (targetBlockContentHtml && targetBlockContentHtml) {
  //     const innerHtml = targetBlockContentHtml.innerHTML;
  //     const newBlock: Block = {
  //       ...block,
  //       contents: innerHtml,
  //       editTime: getEditTime(),
  //     };
  //     editBlock(page.id, newBlock);
  //     setModal((prev) => ({
  //       ...prev,
  //       block: newBlock,
  //     }));
  //   }
  // }, [block, editBlock, page.id, setModal]);

  const resetLinked = useCallback(() => {
    if (linked && linkElements) {
      setLinked(false);
      setLinkElements(null);
    }
  }, [linkElements, linked]);
  /**
   * HTMLAnchorElement의 href 를 변경하는 함수
   * @param element
   * @param link
   */
  const changeHref = useCallback(
    (element: HTMLAnchorElement, link: string) => {
      if (webLink) {
        if (link.includes("https://") || link.includes("http://")) {
          element.setAttribute("href", `${link}`);
        } else {
          element.setAttribute("href", `https://${link}`);
        }
      } else {
        //page link
        const originLocation = window.location.origin;
        const location = `${originLocation}`;
        const path = `${location}/${link}`;
        element.setAttribute("href", `${path}`);
      }
    },
    [webLink]
  );
  /**
   * 새로운  HTMLAnchorElement를 만드는 함수
   * @param innerHTML 새로운  HTMLAnchorElement 의 innerHTML의 value
   * @param link   HTMLAnchorElement 의 href의 value
   */
  const makeNewAnchorElement = useCallback(
    (innerHTML: string, link: string) => {
      const newSelectedHtml = document.createElement("a");
      newSelectedHtml.className = "selected link";
      newSelectedHtml.setAttribute("target", "_blank");
      newSelectedHtml.innerHTML = innerHTML;
      changeHref(newSelectedHtml, link);
      selectedHtml?.parentNode?.replaceChild(newSelectedHtml, selectedHtml);
    },
    [changeHref, selectedHtml]
  );

  const addLink = useCallback(
    (link: string) => {
      if (selectedHtml) {
        if (linked && linkElements) {
          if (linkElements[0] === selectedHtml) {
            //href 만 변경
            changeHref(selectedHtml as HTMLAnchorElement, link);
            //getBlockContents();
          } else {
            //기존 link 삭제 후 새로운 link
            const selectedHtmlParent = selectedHtml.parentElement;
            if (linkElements[0] === selectedHtmlParent) {
              changeHref(selectedHtmlParent as HTMLAnchorElement, link);
              //getBlockContents();
            } else {
              // 배열
              linkElements.forEach((e: HTMLAnchorElement) => {
                e.outerHTML = e.innerHTML;
              });
              const newSelectedHtml = document.querySelector(".selected");
              newSelectedHtml &&
                makeNewAnchorElement(newSelectedHtml.innerHTML, link);
            }
          }
        } else {
          makeNewAnchorElement(selectedHtml.innerHTML, link);
        }
      }
      closeLink && closeLink();
      resetLinked();
    },
    [
      changeHref,
      closeLink,

      linkElements,
      linked,
      makeNewAnchorElement,
      resetLinked,
      selectedHtml,
    ]
  );
  const copyLink = useCallback(() => {
    if (linkElements) {
      const href = linkElements[0].getAttribute("href");
      if (href) {
        navigator.clipboard.writeText(href);
      }
      resetLinked();
      closeLink && closeLink();
    }
  }, [closeLink, linkElements, resetLinked]);

  const removeLink = useCallback(() => {
    if (linkElements) {
      linkElements.forEach((e: HTMLAnchorElement) => {
        e.outerHTML = e.innerHTML;
      });
      //getBlockContents();
      resetLinked();
      closeLink && closeLink();
    }
  }, [closeLink, linkElements, resetLinked]);

  useEffect(() => {
    if (selectedHtml) {
      const selectedHtmlParent = selectedHtml.parentElement;
      const parentLink =
        selectedHtmlParent?.tagName === "A" &&
        selectedHtmlParent?.classList.contains("link");
      const selectedLink =
        selectedHtml.tagName === "A" && selectedHtml.classList.contains("link");
      const haveLinkElement = selectedHtml.querySelector(".link");
      if (selectedLink || parentLink || haveLinkElement) {
        setLinked(true);
        selectedLink && setLinkElements([selectedHtml as HTMLAnchorElement]);
        parentLink &&
          setLinkElements([selectedHtmlParent as HTMLAnchorElement]);
        const linkElementArr = [
          ...(selectedHtml.querySelectorAll(
            ".link"
          ) as NodeListOf<HTMLAnchorElement>),
        ];
        haveLinkElement && setLinkElements(linkElementArr);
      }
    }
  }, [selectedHtml]);

  return (
    <div id="loader-link" style={linkLoaderStyle}>
      <div className="inner">
        <div className="search">
          <label>
            <ScreenOnly text="input loader file" />
            <input
              id="input-loader-link"
              title="input loader file"
              placeholder={
                linked
                  ? "Edit link or search pages"
                  : "Past link or search pages"
              }
              onChange={onChangeSearch}
            />
          </label>
        </div>
        {listArray && (
          <div className="page-list">
            <header>LINK TO BLOCK</header>
            <div className="page-list__item-group">
              <FixedSizeList
                height={listHeight}
                width={listWidth}
                layout="vertical"
                itemCount={listArray.length}
                itemData={listArray}
                itemKey={(index) => `page-item__${index}`}
                itemSize={itemSize}
              >
                {({ index }) => (
                  <PageItem
                    page={listArray[index]}
                    pages={pages}
                    pagesId={pagesId}
                    addLink={addLink}
                    style={{
                      width: listWidth,
                      height: itemSize,
                      marginBottom: itemMargin,
                    }}
                    iconHeight={iconHeight}
                  />
                )}
              </FixedSizeList>
            </div>
          </div>
        )}
      </div>
      {(webLink || linked || searchValue) && (
        <div id="linkLoader_moreFn">
          {webLink && searchValue && (
            <div id="btn-link-webPage">
              <button
                title="button to  link to  web page "
                onClick={() => addLink(searchValue)}
              >
                <BsLink45Deg />
                Link to web page
              </button>
            </div>
          )}
          {linked && (
            <div id="linkedFn">
              <button
                title="button to copy link"
                id="btn-copy-link"
                onClick={copyLink}
              >
                <IoMdCopy />
                <span>Copy link</span>
              </button>
              <button
                title="button to remove link"
                id="btn-remove-link"
                onClick={removeLink}
              >
                <IoTrashOutline />
                <span>Remove link</span>
              </button>
            </div>
          )}
          {searchValue && (
            <div id="linkResult">
              <button
                title="button to add link "
                onClick={() => addLink(searchValue)}
              >
                <BsArrowUpRight />
                <span>New "{searchValue}" page in....</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(LinkLoader);
