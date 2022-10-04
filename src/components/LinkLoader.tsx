import React , {useState, ChangeEvent, Dispatch ,SetStateAction, useEffect} from 'react';
import { BsArrowUpRight, BsLink45Deg } from 'react-icons/bs';
import { CSSProperties } from 'styled-components';
import { makePagePath, makeRoutePath } from '../containers/NotionRouter';
import { Block, findPage, listItem, Page } from '../modules/notion';
import { selectionType } from './Frame';
import PageIcon from './PageIcon';

type LinkLoaderProps={
  recentPagesId:string[]|null,
  pages:Page[],
  pagesId:string[],
  page:Page,
  block:Block,
  editBlock: (pageId: string, block: Block) => void,
  setOpenLink: Dispatch<SetStateAction<boolean>>,
  blockStylerStyle:CSSProperties|undefined,
  setSelection: Dispatch<SetStateAction<selectionType | null>>,
}
const LinkLoader=({recentPagesId, pages,page,pagesId, block,editBlock, setOpenLink, blockStylerStyle,setSelection}:LinkLoaderProps)=>{
  const selectedHtml =document.querySelector(".selected");
  const recentPages = recentPagesId!==null? 
                      (recentPagesId.length>3 ?  
                        recentPagesId?.slice(0.4).map((id:string)=> findPage(pagesId,pages,id)) as Page[]
                        : 
                        recentPagesId.map((id:string)=> findPage(pagesId,pages,id))  as Page[]
                      )
                      :null; 
  const notTemplatePages =pages.filter((p:Page)=> p.type==="page");                   
  const pageList = recentPages!==null?  
                recentPages
                :
                (notTemplatePages.length> 3? 
                  notTemplatePages.slice(0.4)
                  :
                  notTemplatePages
                ); 

  const topDomain =[".com",".net",".org",".edu",".gov",".mil",".int",".biz",".info",".name",".aero",".cat",".coop",".lobs",".mobl",".museum",".pro",".travel", 
  ".ac",".ad",".ae",".af",".ag",".al",".ai",".am",".an",".ao","aq",".ar",".as",".at",".au",".aw",".ax",".az",
  ".ba",".bb",".bb",".be",".bf",".bg",".bh",".bi",".bj",".bm",".bn",".bo",".br",".bs",".bt",".bw",".by",".bz",
  ".ca",".cc",".cd",".cf",".cg",".ch",".ci",".ck",".cl",".cm",".cn",".co",".cr",".cu",".cv",".cx",".cy",".cz",
  ".de",".dj",".dk",".dm",".do",".dz",
  ".ec",".ee",".eg",".er",".es",".et",".eu",
  ".fi",".fj",".fk",".fm",".fo",".fr",
  ".ga",".gd",".ge",".gf",".gg",".gh",".gi",".gm",".gn",".gp",".gq",".gr",".gs",".gt",".gu",".gw",".gy",
  ".hk",".hm",".hn",".hr",".ht",".hu",
  ".id",".ie",".il",".im",".in",".io",".iq",".ir",".is",".it",
  ".je",".jm",".jo",".jp",
  ".ke",".kg",".kh",".ki",".km",".kn",".kp",".kr",".kw",".ky",".kz",
  ".la",".lb",".lc",".li",".lk",".lr",".ls",".lt",".lu",".lv",".ly",
  ".ma",".mc",".md",".me",".mg",".mh",".mk",".ml",".mm",".mn",".mo",".mp",".mq",".mr",".ms",".mt",".mu",".mv",".mw",".mx",".my",".mz",
  ".na",".nc",".ne",".nf",".ng",".ni",".nl",".no",".np",".nr",".nu",".nz",
  ".om",
  ".pa",".pe",".pf",".pg",".ph",".pk",".pl",".pn",".pr",".ps",".pt",".pw",".py",
  ".qa",
  ".re",".ro",".rs",".ru",".rw",
  ".sa",".sb",".sc",".sd",".se",".sg",".sh",".si",".sk",".sl",".sm",".sn",".so",".sr",".st",".su",".sv",".sy",".sz",
  ".tc",".td",".tf",".tg",".th",".tj",".tk",".tl",".tm",".tn",".to",".tr",".tt",".tv",".tw",".tz",
  ".ua",".ug",".uk",".us",".uy",".uz",
  ".va",".vc",".ve",".vg",".vi",".vn",".vu",
  ".wf",".ws",
  ".ye",
  ".za",".zm",".zw"
  ];
  /**
   * 이미 link 되어 있는 지 여부 
   */
  const [linked, setLinked]=useState<boolean>(false);
  const [linkElement, setLinkElement]=useState<HTMLAnchorElement|NodeListOf<HTMLAnchorElement>|null>(null);
  const [linkLoaderStyle, setLinkLoaderStyle]=useState<CSSProperties|undefined>(undefined);
  const blockStyler =document.getElementById("blockStyler");
  const [searchValue, setSearchValue]= useState<string|null>(null);
  const [candidates, setCandidates]=useState<Page[]|null>(null);
  const [webLink, setWebLink]=useState<boolean>(false);
  const onChagneSearch=(event: ChangeEvent<HTMLInputElement>)=>{
    const value = event.target.value;
    if(value ===""){
      setSearchValue(null);
      setCandidates(null);
      setWebLink(false);
    }else{
      setSearchValue(value);
      const isWebLink = topDomain.map((d:string)=> value.includes(d)).includes(true);
      if(isWebLink){
        setWebLink(true);
        setCandidates(null);
      }else{
        setWebLink(false);
        const candidateArry = notTemplatePages.filter((page:Page)=> page.header.title.includes(value));
        candidateArry[0]!==undefined ? setCandidates(candidateArry): setCandidates(null);
      };
    };
  };
  /**
   * dom에 변경이 읽을 때,  block의 내용을 담고 있는 element의 innerHTML을 읽어와서, 변경된 내용을 state에 업데이트하는 함수 
   */
  const getBlockContents =()=>{
    const targetBlockContentHtml= document.getElementById(`${block.id}_contents`)?.querySelector(".contentEditable");
  if(targetBlockContentHtml!==null && targetBlockContentHtml!==undefined){
    const innerHtml =targetBlockContentHtml.innerHTML;
    const newBlock:Block ={
      ...block,
      contents:innerHtml,
      editTime:JSON.stringify(Date.now())
    };
    editBlock(page.id, newBlock);
    setSelection({block:newBlock});
  };
  };
  /**
   * HTMLAnchorElement의 href 를 변경하는 함수 
   * @param element 
   * @param link 
   */
  const changeHref =(element:HTMLAnchorElement, link:string)=>{
    if(webLink){
      element.setAttribute("href",link);
    }else{
      //page link
      const originLocation =window.location.origin;
      const path =`${originLocation}/#/${link}`;
      element.setAttribute("href",`${path}`);
  };
  }
  /**
   * 새로운  HTMLAnchorElement를 만드는 함수 
   * @param innerHTML 새로운  HTMLAnchorElement 의 innerHTML의 value
   * @param link   HTMLAnchorElement 의 href의 value
   */
  const makeNewAnchorElement =(innerHTML:string, link:string)=>{
    const newSelectedHtml =document.createElement("a");
    newSelectedHtml.className="selected link";
    newSelectedHtml.setAttribute("target","_blank");
    newSelectedHtml.innerHTML= innerHTML;
    changeHref(newSelectedHtml,link);
    selectedHtml?.parentNode?.replaceChild(newSelectedHtml,selectedHtml);
    getBlockContents();
  };

  const addLink=(link:string)=>{
    if(selectedHtml!==null){
      if(linked){
        if(linkElement === selectedHtml){
          //href 만 변경 
          changeHref(selectedHtml as HTMLAnchorElement, link);
          getBlockContents();
        }else{
          //기존 link 삭제 후 새로운 link 
          const selectedHtmlParent = selectedHtml.parentElement;
          if(linkElement === selectedHtmlParent){
            changeHref(selectedHtmlParent as HTMLAnchorElement, link);
            getBlockContents();
          }else{
            // 배열 
            const linkElements =linkElement as NodeListOf<HTMLAnchorElement>; 
            linkElements.forEach((e:HTMLAnchorElement)=>{
              console.log("e", e);
              e.outerHTML =e.innerHTML;
            });
            const newSelectedHtml = document.querySelector(
              ".selected"
            );
            console.log("newselectedHtml", newSelectedHtml);
            newSelectedHtml!==null &&
            makeNewAnchorElement(newSelectedHtml.innerHTML, link);
          }
        }
      }else{
        
        makeNewAnchorElement(selectedHtml.innerHTML, link)
      }
    };
    setOpenLink(false);
  };
  const removeLink =()=>{

  };

  useEffect(()=>{
    if(blockStyler !==null && blockStylerStyle !==undefined){
      const blockStylerTop =blockStylerStyle.top as string;
      const blockStylerTopValue = Number(blockStylerTop.slice(0,blockStylerTop.indexOf("px"))) ;
      const top = blockStylerTopValue + blockStyler.clientHeight;
      const left =blockStylerStyle.left as string;
      setLinkLoaderStyle({
        top:`${top + 10 }px`,
        left:left
      })
    }
  },[ blockStylerStyle,blockStyler]);
  useEffect(()=>{
    if(selectedHtml!==null){
      const selectedHtmlParent =selectedHtml.parentElement;
      console.log("sp", selectedHtmlParent, selectedHtmlParent?.tagName);
      const parentLink = selectedHtmlParent?.tagName ==="A" && selectedHtmlParent?.classList.contains("link");
      const selectedLink = selectedHtml.tagName ==="A" && selectedHtml.classList.contains("link");
      const haveLinkElement = selectedHtml.querySelector(".link");
      if(selectedLink|| parentLink||haveLinkElement){
        setLinked(true);
        selectedLink && setLinkElement(selectedHtml as HTMLAnchorElement);
        parentLink && setLinkElement(selectedHtmlParent as HTMLAnchorElement);
        haveLinkElement && setLinkElement(selectedHtml.querySelectorAll('.link') as NodeListOf<HTMLAnchorElement>);
      };
    }
  },[selectedHtml])
  type PageItemProps={
    page:Page
  };
  const PageItem=({page}:PageItemProps)=>{
    const pagePath = makeRoutePath(page, pagesId,pages).slice(1);
    return(
      <button 
        className='page_inner'
        onClick={()=>addLink(pagePath)}
      >
          <PageIcon
            icon={page.header.icon}
            iconType={page.header.iconType}
            style={undefined}
          />
          <div className='pageInform'>
            <span className='pageTitle'>
                {page.header.title}
            </span>
            { page.parentsId!==null&&
            <span className='pagePath'>
              {pagePath}
            </span>
            }
          </div>
      </button>
    )
  };
  return(
    <div 
      id='linkLoader'
      style={linkLoaderStyle}
    >
      <div className="inner">
        <input
          className='search'
          placeholder='Past link or search pages'
          onChange={onChagneSearch}
        />
        <div className="pages">
          <header>
            LINK TO BLOCK
          </header>
          <div className='pageList'>
            {(searchValue==null&& candidates==null)?
              pageList.map((p:Page)=>
              <PageItem
                page={p}/>
              )
              :
              candidates?.map((p:Page)=>
              <PageItem
                page={p}
              />
              )
            }
          </div>
        </div>
        {webLink && searchValue!==null &&
          <button  
            className='linkToWebPage'
            onClick={()=>addLink(searchValue)}
          >
            <BsLink45Deg/>
            Link to web page
          </button>
        }
        {searchValue !==null &&
        <button 
          className='result'
          onClick={()=>addLink(searchValue)}
        >
          <BsArrowUpRight/>
          <span>
            New "{searchValue}" page in....
          </span>
        </button>
        }
        {linked &&
        <div id="linked">
          <button>
            <span>Copy link</span>
          </button>
          <button 
            id="removeLinkBtn"
            onClick={removeLink}
          >
            <span>Remove link</span>
          </button>
        </div>}
      </div>
    </div>
  )
};

export default React.memo(LinkLoader)