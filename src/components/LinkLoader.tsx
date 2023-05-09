import React, {
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
} from "react";
import { BsArrowUpRight, BsLink45Deg } from "react-icons/bs";
import { IoMdCopy } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
import { CSSProperties } from "styled-components";
import {
  ActionContext,
  makePagePath,
  makeRoutePath,
  pathType,
} from "../containers/NotionRouter";
import { Block, findPage, Page } from "../modules/notion";
import { selectionType } from "../containers/NotionRouter";
import PageIcon from "./PageIcon";

type LinkLoaderProps = {
  recentPagesId: string[] | null;
  pages: Page[];
  pagesId: string[];
  page: Page;
  block: Block;
  closeLink?: () => void;
  blockStylerStyle: CSSProperties | undefined;
  setSelection: Dispatch<SetStateAction<selectionType | null>> | null;
};
const LinkLoader = ({
  recentPagesId,
  pages,
  page,
  pagesId,
  block,
  closeLink,
  blockStylerStyle,
  setSelection,
}: LinkLoaderProps) => {
  const { editBlock } = useContext(ActionContext).actions;
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

  const topDomain = [
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
  ];
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
  const blockStyler = document.getElementById("blockStyler");
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Page[] | null>(null);
  const [webLink, setWebLink] = useState<boolean>(false);
  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setSearchValue(null);
      setCandidates(null);
      setWebLink(false);
    } else {
      setSearchValue(value);
      const isWebLink = topDomain
        .map((d: string) => value.includes(d))
        .includes(true);
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
  };
  /**
   * dom에 변경이 읽을 때,  block의 내용을 담고 있는 element의 innerHTML을 읽어와서, 변경된 내용을 state에 업데이트하는 함수
   */
  const getBlockContents = () => {
    const targetBlockContentHtml = document
      .getElementById(`${block.id}__contents`)
      ?.querySelector(".contentEditable");
    if (targetBlockContentHtml && targetBlockContentHtml) {
      const innerHtml = targetBlockContentHtml.innerHTML;
      const newBlock: Block = {
        ...block,
        contents: innerHtml,
        editTime: JSON.stringify(Date.now()),
      };
      editBlock(page.id, newBlock);
      setSelection &&
        setSelection({
          block: newBlock,
          change: true,
        });
    }
  };
  const resetLinked = () => {
    if (linked && linkElements) {
      setLinked(false);
      setLinkElements(null);
    }
  };
  /**
   * HTMLAnchorElement의 href 를 변경하는 함수
   * @param element
   * @param link
   */
  const changeHref = (element: HTMLAnchorElement, link: string) => {
    if (webLink) {
      if (link.includes("https://") || link.includes("http://")) {
        element.setAttribute("href", `${link}`);
      } else {
        element.setAttribute("href", `https://${link}`);
      }
    } else {
      //page link
      const originLocation = window.location.origin;
      const location = `${originLocation}/notion`;
      const path = `${location}/#/${link}`;
      element.setAttribute("href", `${path}`);
    }
  };
  /**
   * 새로운  HTMLAnchorElement를 만드는 함수
   * @param innerHTML 새로운  HTMLAnchorElement 의 innerHTML의 value
   * @param link   HTMLAnchorElement 의 href의 value
   */
  const makeNewAnchorElement = (innerHTML: string, link: string) => {
    const newSelectedHtml = document.createElement("a");
    newSelectedHtml.className = "selected link";
    newSelectedHtml.setAttribute("target", "_blank");
    newSelectedHtml.innerHTML = innerHTML;
    changeHref(newSelectedHtml, link);
    selectedHtml?.parentNode?.replaceChild(newSelectedHtml, selectedHtml);
    getBlockContents();
  };

  const addLink = (link: string) => {
    if (selectedHtml) {
      if (linked && linkElements) {
        if (linkElements[0] === selectedHtml) {
          //href 만 변경
          changeHref(selectedHtml as HTMLAnchorElement, link);
          getBlockContents();
        } else {
          //기존 link 삭제 후 새로운 link
          const selectedHtmlParent = selectedHtml.parentElement;
          if (linkElements[0] === selectedHtmlParent) {
            changeHref(selectedHtmlParent as HTMLAnchorElement, link);
            getBlockContents();
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
  };
  const copyLink = () => {
    if (linkElements) {
      const href = linkElements[0].getAttribute("href");
      if (href) {
        navigator.clipboard.writeText(href);
      }
      resetLinked();
      closeLink && closeLink();
    }
  };

  const removeLink = () => {
    if (linkElements) {
      linkElements.forEach((e: HTMLAnchorElement) => {
        e.outerHTML = e.innerHTML;
      });
      getBlockContents();
      resetLinked();
      closeLink && closeLink();
    }
  };

  const setWidth = (lenght: number) => {
    const n = 100 / lenght;
    const style: CSSProperties = {
      maxWidth: `${n}%`,
    };
    return style;
  };
  useEffect(() => {
    if (blockStyler && blockStylerStyle) {
      const blockStylerTop = blockStylerStyle.top as string;
      const blockStylerTopValue = Number(
        blockStylerTop.slice(0, blockStylerTop.indexOf("px"))
      );
      const top = blockStylerTopValue + blockStyler.clientHeight;
      const left = blockStylerStyle.left as string;
      setLinkLoaderStyle({
        top: `${top + 10}px`,
        left: left,
      });
    }
  }, [blockStylerStyle, blockStyler]);
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
  type PageItemProps = {
    page: Page;
  };
  const PageItem = ({ page }: PageItemProps) => {
    const pagePath = makeRoutePath(page, pagesId, pages).slice(1);
    const paths = makePagePath(page, pagesId, pages);
    return (
      <button
        title="button to open page"
        className="page__inner"
        onClick={() => addLink(pagePath)}
      >
        <PageIcon
          icon={page.header.icon}
          iconType={page.header.iconType}
          style={undefined}
        />
        <div className="page__inform">
          <div className="page__title">{page.header.title}</div>
          {page.parentsId && (
            <div className="page__path-group">
              {paths?.map((path: pathType) => (
                <div className="path" style={setWidth(paths.length)}>
                  {paths.indexOf(path) !== 0 && <div className="slash">/</div>}
                  <div className="title">{path.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </button>
    );
  };
  return (
    <div id="linkLoader" style={linkLoaderStyle}>
      <div className="inner">
        <div className="search">
          <input
            id="input-loader"
            title="input loader file"
            placeholder={
              linked ? "Edit link or search pages" : "Past link or search pages"
            }
            onChange={onChangeSearch}
          />
        </div>
        <div className="page-group">
          <header>LINK TO BLOCK</header>
          <div className="page-group__list">
            {searchValue === null && candidates === null
              ? pageList.map((p: Page) => <PageItem page={p} />)
              : candidates?.map((p: Page) => <PageItem page={p} />)}
          </div>
        </div>
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
