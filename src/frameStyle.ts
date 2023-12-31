export const frameStyleCode = `label {
  width: 100%;
}
#notion__inner .edit__inform {
  color: rgb(60, 60, 60);
}

.edit__inform {
  border-top: 1px solid #929292;
  font-size: 12px;
  text-align: left;
  margin-bottom: 0;
}
.edit__inform p {
  margin: 10px 0 0 10px;
}

div {
  box-sizing: border-box;
  pointer-events: auto;
}
div::-webkit-scrollbar {
  background: transparent;
}
div::-webkit-scrollbar-thumb {
  background: transparent;
}
div::-webkit-scrollbar-track {
  background: transparent;
}

button {
  border: none;
  background-color: transparent;
  padding: 0;
  -webkit-user-select: none;
          user-select: none;
  cursor: pointer;
  transition: background-color 20ms ease-in 0s;
  font-size: inherit;
}

ul,
ol {
  margin: 0;
  padding: 0;
  padding-left: 1rem;
}
ul li,
ol li {
  padding-left: 10px;
}

a:link,
a:active,
a:visited {
  text-decoration: none;
  color: inherit;
}
/*common*/
.editableBlock {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: min-content;
  margin-top: 18px;
  margin-bottom: 1px;
  display: flex;
  flex-direction: column;
}
.editableBlock div {
  width: inherit;
  height: inherit;
}
.editableBlock .listItem-marker,
.editableBlock .comments-bubble {
  width: -moz-fit-content;
  width: fit-content;
}

.mainBlock {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.mainBlock .mainBlock__block {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.mainBlock.on {
  border-top: 5px solid #8ae2ff;
}

.subBlock-group {
  padding: 0;
  padding-left: 20px;
}

[contenteditable] {
  outline: 0px solid transparent;
}

.editableBlock,
.block-quick-menu button {
  font-size: inherit;
  line-height: inherit;
}
.editableBlock .editable {
  width: max-content;
}

.editable {
  white-space: normal;
  word-break: break-all;
  overflow: hidden;
  -webkit-user-select: text;
          user-select: text;
  font-size: inherit;
  line-height: normal;
}

.bg_default {
  background-color: none;
}

.bg_grey {
  background-color: #e0e0e0;
}

.bg_yellow {
  background-color: #fff9c4;
}

.bg_green {
  background-color: #ebffd7;
}

.bg_blue {
  background-color: #e3f2fd;
}

.bg_pink {
  background-color: #fce4ec;
}

.color_default {
  color: rgb(40, 40, 40);
}

.color_grey {
  color: #bdbdbd;
}

.color_orange {
  color: #ffa726;
}

.color_green {
  color: #00701a;
}

.color_blue {
  color: #1565c0;
}

.color_red {
  color: #d32f2f;
}

.bold {
  font-weight: bold;
}

.italic {
  font-style: italic;
}

.underline {
  text-decoration: underline;
}

.lineThrough {
  text-decoration: line-through;
}

.editable a:link,
.editable a:visited,
.editable a:active {
  color: grey;
  text-decoration: underline;
  z-index: 5;
  cursor: pointer;
}

.h1 .mainBlock .editable,
.h2 .mainBlock .editable,
.h3 .mainBlock .editable {
  font-weight: 500;
}

.text.block {
  margin-top: 2px;
}

.left,
.block__contents,
.block-quick-menu {
  height: 18px;
}
.moving-area {
  display:flex;
}
.todo.block .left,
.todo_done.block .left,
.toggle.block .left,
.page.block .left {
  width: 18px;
  margin-right: 4px;
  font-size: 15px;
}
.todo.block svg,
.todo_done.block svg,
.toggle.block svg,
.page.block svg {
  width: inherit;
  height: inherit;
  font-size: inherit;
}

.page.block {
  padding: 5px;
}
.page.block .page__icon-outBox,
.page.block img {
  width: 18px;
  height: 18px;
}
.page.block .page__icon-outBox span {
  width: inherit;
  height: inherit;
}
.page.block .block__contents {
  display: flex;
  align-items: center;
}
.page.block .editable {
  border-bottom: 1px solid #929292;
}
.page.block:hover {
  background-color: #edece9;
}

.todo_done.block {
  -webkit-text-decoration: line-through rgb(60, 60, 60);
          text-decoration: line-through rgb(60, 60, 60);
}
.todo_done.block path {
  stroke: rgb(60, 60, 60);
}

.toggle.block button {
  display: flex;
  align-items: center;
  fill: #5a5a5a;
}
.toggle.block .subBlock-group {
  display: none;
}

.toggle.on.block .subBlock-group {
  display: block;
}

.numberList,
.bulletList {
  display: flex;
  flex-direction: column;
}

.listItem {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}
.listItem .subBlock-group .editableBlock {
  margin-top: 8px;
}
.listItem .listItem-marker {
  padding-right: 8px;
}
.listItem .listItem-marker svg {
  font-size: 11px;
}

.blockToggleBtn svg {
  transform: rotate(0deg);
}

.blockToggleBtn.on svg {
  transform: rotate(90deg);
}

.media.block .mainBlock__block {
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-box img{
  width:inherit;
  height:inherit
}
.blockComponent.on {
  padding: 5px;
  font-size: 1.2rem;
  box-shadow: 0px 0px 10px 2px rgba(151, 151, 151, 0.486);
  border-radius: 5px;
}

.media_blockComponent {
  width: 100%;
  height: 100%;
}

.block__contents {
  width: 100%;
  height: -moz-fit-content;
  height: fit-content;
  text-align: left;
  display: flex;
  align-items: flex-end;
}

.btn-addBlockFile {
  width: 100%;
  padding: 12px;
  background-color: rgb(245, 244, 243);
  color: rgb(82, 82, 82);
  cursor: pointer;
  display: flex;
  align-items: center;
}
.btn-addBlockFile:hover {
  background-color: #edece9;
}
.btn-addBlockFile span {
  margin-right: 6px;
  text-align: center;
  height: 1.2rem;
  font-size: inherit;
}
.btn-addBlockFile svg {
  font-size: 1.2rem;
}

.contents input {
  border: none;
  width: 100%;
}
.contents input:focus {
  outline: none;
}

.contents.btn-comment,
.contents .text_commentBtn {
  color: inherit;
  text-decoration: inherit;
  width: -moz-fit-content;
  width: fit-content;
  z-index: 2;
  font-size: inherit;
  font-weight: inherit;
  border-bottom: 2px solid rgba(255, 198, 11, 0.658);
}
.contents.btn-comment:hover,
.contents .text_commentBtn:hover {
  background-color: rgba(255, 198, 11, 0.658);
}

.contents.btn-comment {
  background-color: rgba(255, 196, 0, 0.347);
  padding: 4px;
}

.contents .text_commentBtn {
  background-color: rgba(255, 196, 0, 0.183);
  display: inline-block;
  position: relative;
  padding: 4px;
}

.mainBlock,
.subBlock-group {
  display: flex;
  align-items: center;
}

.subBlock-group {
  flex-direction: column;
}

.comments-bubble .btn-comment {
  display: flex;
  padding: 3px;
}
.comments-bubble .btn-comment:hover {
  background-color: #edece9;
}
.comments-bubble .btn-comment svg,
.comments-bubble .btn-comment span {
  color: #5a5a5a;
  height: 1.1rem;
  line-height: 1.1rem;
  width: -moz-fit-content;
  width: fit-content;
}
.comments-bubble .btn-comment span {
  font-size: 12px;
}

.page-link:hover {
  background-color: #edece9;
}

.comments {
  display: flex;
  margin: 8px 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #d6d6d6;
  width: 100%;
}
.comments > div {
  font-size: 14px;
}

.comment,
.comment__mainComment,
.comment__subComments,
.comments__comments-group,
.commentBlock {
  width: inherit;
}

.blockId_comments .comments {
  display: none;
}

.blockId_comments.open {
  z-index: 5;
}
.blockId_comments.open .comments {
  display: flex;
  flex-direction: column;
}
.blockId_comments.open .btn-comment.btnIcon {
  display: none;
}

.commentBlock__header,
.comment-input {
  height: 20px;
}

.commentBlock .first-letter,
.comment-input .first-letter .inner {
  display: flex;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid black;
  color: black;
  text-align: center;
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 5px;
}
.commentBlock .first-letter div,
.comment-input .first-letter .inner div {
  font-size: 14px;
  font-weight: initial;
}

.comment-input label {
  width: 100%;
}

.comment-input .first-letter {
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;
}
.comment-input .first-letter .inner {
  margin: 0;
}
.comment-input .first-letter span {
  display: inline-block;
}

.comment {
  padding: 5%;
  border-top: 1px solid #d6d6d6;
  z-index: 10;
  box-sizing: border-box;
}

.comment:first-child {
  border-top: none;
}

.page__header .comments {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(221, 221, 221, 0.799);
  padding-bottom: 10px;

}
.page__header .comments .comments__comments-group {
  width: inherit;
}
.page__header .comments .commentBlock .commentBlock__header {
  margin-bottom: 6px;
}
.page__header .comments .comment {
  padding: 0;
}

#block-comments {
  position: absolute;
  z-index: 20;
  padding-bottom: 0;
  width: 320px;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: auto;
  transform: matrix(1, 0, 0, 1, 0, 0);
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0px 0px 23px -5px #ababab;
  overflow-y: scroll;
}
#block-comments::-webkit-scrollbar {
  width: 0px;
  background-color: transparent;
}
#block-comments::-webkit-scrollbar-thumb {
  background: #d3d1cb;
}
#block-comments::-webkit-scrollbar-track {
  background: #edece9;
}
#block-comments .comments__comments-group {
  width: 100%;
  margin: 0;
  padding-bottom: 0;
}

.page__comments {
  position: relative;
}
.page__comments .commentBlock .commentBlock__header .information,
.page__comments .commentBlock .comment__contents {
  font-size: inherit;
}
.page__comments .comment-input form input {
  font-size: inherit;
}
.page__comments .comments {
  position: relative;
}
.page__comments .comments .commentBlock__mainComment {
  display: none;
}

#commentsInner {
  position: relative;
}

.comments__btn-group-type {
  border-bottom: 1px solid #d6d6d6;
  padding: 0 5%;
  display: flex;
}
.comments__btn-group-type button {
  height: 100%;
  margin: 10px 5px;
}

.commentBlock {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  width: 100%;
}
.commentBlock > div {
  font-size: 14px;
}
.commentBlock .commentBlock__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.commentBlock .commentBlock__header .information {
  display: flex;
  flex-direction: row;
  font-size: 14px;
  height: inherit;
}
.commentBlock .commentBlock__header .first-letter {
  flex-shrink: 0;
  flex-grow: 0;
}
.commentBlock .commentBlock__header .userName {
  margin: 0 5px;
  flex-shrink: 1;
  flex-grow: 1;
  font-weight: bold;
  line-height: 20px;
  text-overflow: ellipsis;
}
.commentBlock .commentBlock__header .time {
  margin: 0;
  color: #5a5a5a;
  font-size: 13px;
  display: flex;
  align-items: center;
  flex-grow: 1;
  flex-shrink: 2;
  text-overflow: ellipsis;
}
.commentBlock .commentBlock__header .comment__tool {
  display: flex;
  align-content: center;
  border: 1px solid #5a5a5a;
  border-radius: 2px;
  height: 20px;
}
.commentBlock .commentBlock__header .comment__tool button {
  width: -moz-fit-content;
  width: fit-content;
  color: #5a5a5a;
  fill: #5a5a5a;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-items: center;
  text-align: center;
  font-size: 12px;
}
.commentBlock .commentBlock__header .comment__tool button span {
  padding: 3px;
}
.commentBlock .commentBlock__header .comment__tool button svg {
  font-font-size: 1rem;
  font-weight: bolder;
}
.commentBlock .commentBlock__header .comment__tool .comment__tool-resolve {
  border-right: 1px solid #5a5a5a;
}
.commentBlock .commentBlock__mainComment,
.commentBlock .comment__contents,
.commentBlock .editComment {
  margin-left: 34px;
  margin-bottom: 14px;
  font-size: 14px;
}
.commentBlock .commentBlock__mainComment {
  height: -moz-fit-content;
  height: fit-content;
  display: flex;
  color: rgb(82, 82, 82);
}
.commentBlock .commentBlock__mainComment_line {
  width: 3px;
  border-radius: 3px;
  margin-left: 2px;
  margin-right: 8px;
  flex-shrink: 0;
  padding-bottom: 2px;
  background: rgba(255, 212, 0, 0.8);
}
.commentBlock .comment-input {
  width: calc(100% - 34px);
  box-sizing: border-box;
}
.commentBlock .comment-input input[type=text] {
  margin: 0;
}
.commentBlock .tool button:hover {
  background-color: #edece9;
  color: black;
}
.commentBlock .comment__tool-more {
  position: relative;
}

.comment-input {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 0;
}
.comment-input form {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  height: inherit;
  position: relative;
  width: calc(100% - 24px);
  box-sizing: border-box;
}
.comment-input input[type=text] {
  width: 90%;
  height: 1.5rem;
  font-size: 15px;
  padding-left: 6px;
  color: rgb(82, 82, 82);
  margin: 0 5%;
  border-radius: 5px;
  background-color: rgba(242, 241, 238, 0.6);
  border: 1px solid #929292;
  box-shadow: rgba(15, 15, 15, 0.162) 0px 0px 1px inset;
  background-color: initial;
  border: none;
  padding: 0;
  height: 100%;
  width: 90%;
  margin: 0 2.5%;
  font-size: 14px;
}
.comment-input input[type=text]::placeholder {
  color: #929292;
}
.comment-input input[type=text]:focus {
  box-sizing: border-box;
  outline: 3.5px solid rgb(169, 226, 245);
  border: none;
}
.comment-input .comment-input:focus {
  outline: none;
}

form button svg {
  font-size: 1.3rem;
  color: #5a5a5a;
  fill: #5a5a5a;
}

#tool-more {
  width: 320px;
  display: flex;
  flex-direction: column;
  background-color: white;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: auto;
  transform: matrix(1, 0, 0, 1, 0, 0);
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0px 0px 23px -5px #ababab;
  width: 200px;
  z-index: 25;
}
#tool-more::-webkit-scrollbar-thumb {
  background: #d3d1cb;
}
#tool-more::-webkit-scrollbar-track {
  background: #edece9;
}
#tool-more button {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16.8px;
  min-height: 28px;
}
#tool-more button:hover {
  background-color: #edece9;
}
#tool-more button svg {
  width: 18px;
  height: inherit;
  font-weight: lighter;
}
#tool-more button span {
  margin-left: 6px;
}
#tool-more .aboutComments {
  color: rgb(82, 82, 82);
  font-size: 13px;
  border-top: 1px solid #d6d6d6;
}
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}

body {
  line-height: 1;
}

ol, ul {
  list-style: none;
}

blockquote, q {
  quotes: none;
}

blockquote:before, blockquote:after,
q:before, q:after {
  content: "";
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

#notion__inner .blockComponent,
#notion__inner .contents,
#notion__inner .editable {
  color: inherit;
}

.frame.stop {
  overflow-y: hidden;
}

.frame {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  z-index: inherit;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
}
#notion .export__frame::-webkit-scrollbar-thumb {
  background: transparent;
}
#notion .export__frame:-webkit-scrollbar-track {
  background:transparent;
}
.frame__inner {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.frame__inner div,
.frame__inner input,
.frame__inner button {
  font-family: inherit;
}

.page__header {
  width: 100%;
}

.page__header,
.page__contents {
  margin: 0 auto;
}

.page__header_notCover,
.page__contents {
  padding-left: calc(96px + env(safe-area-inset-left));
}

.page__header .page__title,
.editableBlock,
.page__header .comments {
  padding-right: calc(96px + env(safe-area-inset-left));
}

.subBlock-group .editableBlock {
  padding-right: 0;
}

.page__comments {
  margin-top: 1rem;
}

.page__header {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-bottom: 30px;
}
.page__header .page__header__cover {
  position: relative;
  width: 100%;
  height: 30vh;
}
.page__header .page__header__cover img {
  width: 100%;
  height: 100%;
}
.page__header .page__header__cover .btn-change-cover {
  display: none;
}
.page__header .page__header__cover.on .btn-change-cover {
  font-size: 1rem;
  display: block;
  transition: display 1ms ease;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  z-index: 30;
  background-color: rgba(254, 254, 254, 0.712);
  border-radius: 10px;
  padding: 5px 10px;
}
.page__header .page__header__cover.on .btn-change-cover:hover {
  transition: background-color 0.3s ease;
  background-color: rgba(189, 189, 189, 0.744);
}
.page__header .page__header_notCover {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.page__header > div {
  position: relative;
}
.page__header .page__icon-outBox {
  width: -moz-fit-content;
  width: fit-content;
  height: -moz-fit-content;
  height: fit-content;
}
.page__header .page__icon-outBox.none {
  min-width: 100%;
  height: 20px;
}
.page__header .page__icon.iconNull {
  display: none;
}
.page__header .deco div {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 8px;
  margin-bottom: 10px;
  width: 100%;
  height: 24px;
}
.page__header .deco div button {
  width: -moz-fit-content;
  width: fit-content;
  height: 100%;
  margin-right: 5px;
  color: #929292;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-size: 14px;
}
.page__header .deco div button svg {
  padding-right: 5px;
}
.page__header .deco div span {
  font-size: 13px;
}
.page__header .page__icon {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 100ms ease-in 0s;
  opacity: 1;
  position: relative;
  pointer-events: auto;
  cursor: default;
}
.page__header .page__icon .pageStringIcon {
  text-align: center;
  width: 100%;
  height: 100%;
  font-size: 60px;
}
.page__header .page__title {
  font-size: inherit;
  font-weight: bold;
  width: 100%;
  word-break: break-all;
}

.page__firstBlock {
  position: relative;
}

.newPageFrame {
  color: #929292;
}
.newPageFrame span {
  color: #929292;
}

.empty-page__btn-group {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  font-size: 1rem;
}
.empty-page__btn-group button {
  font-size: 1rem;
  display: block;
  margin: 10px;
}
.empty-page__btn-group button svg {
  color: #5a5a5a;
  fill: #5a5a5a;
  margin-right: 10px;
}

.subFrame {
  width: 100vw;
}

#moveTargetBlock {
  opacity: 0.3;
}

@media screen and (max-width: 768px) {
  .page__header {
    margin-bottom: 5px;
  }
  .page__header .page__header__cover {
    height: 100px;
  }
  .page__header_notCover,
  .page__contents {
    padding-left: 0;
  }
  .page__header .page__title,
  .editableBlock,
  .page__header .comments {
    padding-right: 0;
  }
  .editableBlock {
    margin-top: 14px;
  }
}`;
