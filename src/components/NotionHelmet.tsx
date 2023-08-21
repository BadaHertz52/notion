import React, { useEffect, useState } from "react";
import { PageHeader } from "../modules/notion/type";
import { Helmet } from "react-helmet-async";
import { Emoji, getEmojiUrl } from "../modules/notion/emojiData";
import { pageSample } from "../modules/notion/reducer";
import BASIC_MEAT_TAG_IMG_URL from "../assets/img/default.webp";
import { changeImgToJpeg } from "../fn/imgLoad";

type MetaTagProps = {
  pageId?: string;
  pageHeader?: PageHeader;
};

const NotionHelmet = ({ pageHeader, pageId }: MetaTagProps) => {
  const { icon, iconType, title } = pageHeader
    ? pageHeader
    : { icon: null, iconType: null, title: "none-page" };
  const BASIC_FAVICON_HREF = "./favicon.ico";
  const BASIC_META_TAG_TITLE =
    "Notion (clone coding project) – The all-in-one workspace for your notes, tasks, wikis, and databases.";
  const webPAble = localStorage.getItem("webP_able") === "true";
  const [emojiUrl, setEmojiUrl] = useState<string>();
  const [basicImgUrl, setBasicImgUrl] = useState<string>(
    BASIC_MEAT_TAG_IMG_URL
  );
  const getFaviconHref = () => {
    switch (iconType) {
      case null:
        return BASIC_FAVICON_HREF;
      case "emoji":
        return emojiUrl as string;
      case "img":
        return icon as string;
      default:
        return BASIC_FAVICON_HREF;
    }
  };
  const faviconHref: string = getFaviconHref();

  const pageUrl = `${window.location.protocol}//${
    window.location.host
  }/notion/${pageId ? pageId : ""}`;

  const imgUrl: string =
    !iconType || !icon ? basicImgUrl : (emojiUrl as string);

  const metaTagTitle =
    title === pageSample.header.title
      ? BASIC_META_TAG_TITLE
      : `${title}- Notion clone coding project`;

  const description = `${title} is  page of project that cloned the Notion site.`;
  useEffect(() => {
    if (!webPAble) {
      changeImgToJpeg(BASIC_MEAT_TAG_IMG_URL, (url) => setBasicImgUrl(url));
    }
  }, [webPAble]);
  useEffect(() => {
    if (iconType === "emoji" && icon) {
      getEmojiUrl(icon as Emoji, setEmojiUrl);
    }
  }, [iconType, icon]);
  return (
    <Helmet>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTagTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:image" content={imgUrl} />
      <meta property="og:site_name" content={metaTagTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={metaTagTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imgUrl} />
      <meta name="description " content={description} />
      <title>{title}</title>
      <link rel="shortcut icon" type="image/x-icon" href={faviconHref} />
    </Helmet>
  );
};

export default React.memo(NotionHelmet);
