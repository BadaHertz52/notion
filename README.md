# Notion

해당 프로젝트는 [Notion](https://www.notion.so/)을 react를 사용하여 직접 레이아웃과 기능들을 분석하 클론 코딩한 프로젝트입니다.

## [노션 프로젝트 바로가기](https://badahertz52.github.io/notion)

## Index

#### <a href="#builtWith">1.Tech skill & Built with</a>

#### <a href="#start">2. Getting start</a>

#### <a href="#description">3. Description</a>

- <a href="#layout">1) Layout</a>

- <a href="#data">2) Data</a>

- <a href="#function">3) Function</a>

#### <a href="#update">4. Update </a>

---

## <div id="builtWith">1. Tech skill & Built with </div>

### 1) Tech skill

- HTML
- Type script , Java Script
- SCSS , styled-components
- React
- Redux

### 2) Built with

- sass
- node-html-markdown
- react-contenteditable
- react-icons
- react-redux, redux
- react-router-dom
- styled-component
- react-helmet-async

---

## <div id="start"> 2. Getting start </div>

### 1) Install

```bash
 npm i
```

### 2) Start

```
npm run start
```

---

## <div id="description"> 3.Description </div>

## <div id="layout">1) Layout</div>

- Main
  - Sidebar
  - Editor
    - Topbar
    - Frame
      - Page header
      - Page content

<img src="./image/readMeFile/layout.jpg"  width="450px" height="auto">

- Template

<img src="./image/readMeFile/template.png" width="450px" height="auto">
<br/>

- Responsible web - Mobile 화면 (sideMenu)
  <br/>

  <img 
    height="400px"
    width="auto"
    src="./image/readMeFile/mobile_side.gif"
    alt="mobile web simulation"/>

## <div id="data"> 2) Data </div>

## A. State

### a. Notion

    Notion state는 사이트에서 생성되는 page,block,comment들 에 대한 데이터를 가집니다.

    * Notion state 가 담고 있는 data
      * page : 유저가 생성한 페이지
      * trash : 삭제된 페이지
      * template : 페이지의 템플릿들

### b. User

    User state 는 해당 Notion을 사용하는 user에 대한 데이터를 가집니다.

- User state 가 담고 있는 data
  - user name
  - user email
  - 즐겨 찾기 목록
  - 최근 방문한 페이지 목록

### c. Side

    Side state는 side bar의 형태에 대한 것입니다.

    * side bar 형태
      * lock : 왼쪽에 고정됨
      * close : 왼쪽에 고정되었던 side bar가 화면상에서 사라짐
      * float , floatHide : 버튼에 마우스를 되면 side bar가 나타나고 (float) 마우스를 떼면 사라지는(floatHide) 형태

[🔗 State에서 사용된 type들에 대한 wiki 페이지로 이동](https://github.com/BadaHertz52/notion/wiki/Type)

## B. Component

[🔗 Component에 대한 wiki 페이지로 이동](https://github.com/BadaHertz52/notion/wiki/Component)

## <div id="function"> 3) Function </div>

레이아웃을 기준으로 notion에서 사용할 수 있는 기능들 입니다.

### A. Sidebar

#### Sidebar simulation

<img 
    width="50%"
    src="https://user-images.githubusercontent.com/69838872/209685169-45d452ab-54d5-461b-927e-13ee3c5964f6.gif"
  />

- 사이드바 모양 변경(왼쪽에 고정, 감추기, 띄우기)
- Quick Find: 페이지 찾기
- 페이지옆에 생성되는 메뉴버튼: 페이지 생성,삭제,페이지 타이틀이나 아이콘 변경, 다른 페이지로 이동, 즐겨찾기에 추가 또는 삭제
- 휴지통 : 삭제된 페이지 영구 삭제 또는 복구

### B. Templates

#### 📼 Templates simulation

<img 
    width="50%"
    src="https://user-images.githubusercontent.com/69838872/209685278-9f897fc7-e176-4e37-8e71-d135479a693a.gif"
  />

- template 열기
- template 수정
- template 생성
- template 삭제
- template 이용
  - use template 버튼을 누르면 현재 오픈된 페이지의 내용이 template의 내용으로 교체됨

### C. Editor

#### 📼 Export page to PDF or Html or Markdown simulation

<img 
    width="50%"
    src="https://user-images.githubusercontent.com/69838872/209685375-979f13b7-2617-425a-bdba-23f2ef21278a.gif"
  />

### <div id="topBar_function"> a. Topbar </div>

#### 📼 Topbar simulation

<img 
    width="50%"
    src="https://user-images.githubusercontent.com/69838872/209687505-9ab35431-a35c-4024-af93-6838335751f6.gif"
    />

- 페이지 경로 표시, 다른 페이지로 이동
- 현재 페이지내 모든 코멘트 보기
- 즐겨찾기 추가, 삭제
- 페이지 스타일 변경: 글자크기,글자 스타일, 페이지 너비
- 페이지 삭제
- 현재 페이지를 다른 페이지로 이동
- 현재 페이지를 pdf,html,markdown 형태로 저장 (현재 페이지 내의 이미지 파일 포함여부와 현재 페이지 내의 다른 페이지도 저장하는 지 여부 선택할 수 있음)

### b. Frame

### a) PageHeader

- 현재 page의 타이틀, 아이콘, 커버, comment 추가/변경/삭제 가능

#### 📼 pageHeader simulation

<img 
    width="50%"
    src="https://user-images.githubusercontent.com/69838872/209689304-6b513038-aacc-4024-a926-cd80d4a374e2.gif"
  />

### b) PageContent

- 새로운 페이지 작성 시 옵션 선택
  - 옵션
    - 페이지 아이콘 추가
    - 페이지 아이콘을 랜덤으로 추가
    - 템플릿 이용
- 페이지 내 글 (block)에 대한 기능
  - block생성
    - 페이지 하단 클릭 시 새로운 블록 생성
    - 작성 중인 block에서 enter 키 누르면, 끝에서 누를 경우는 내용이 빈 블록이 생성되고 block의 내용 중간에서 enter키 누르면 커서 뒷 부분의 내용을 가진 블록이 생성
    - 블럭 옆에 생성된 "+" 버튼을 눌러서 새로운 블록 생성
- block 복제
- block 내용 수정
- image 타입의 block의 경우 image의 사이즈를 수정 가능
- block 타입 수정
  - 빈 블록에서 "/" 입력으로 블록 타입을 수정할 수 있는 command 창을 열어서 블록 타입을 수정
  - 메뉴(Menu), 블럭 내 내용 선택(BlockStyler)을 통해서 타입 수정
- block 스타일 변경
  - block 전체 스타일 변경 (Menu)
  - block 내 일부 스타일 변경 가능 (BlockStyler)
- block에 링크 추가
- block에 대한 comment 생성,comment 속성(open,resolve)변경, 삭제
- block 삭제
  - 내용이 빈 블록에서 backspace를 누르면 해당 블록 삭제
  - 메뉴에서 해당 블록 삭제 가능
- page 내 block 위치 변경
  - 마우스 드래그를 통해 block 의 위치를 변경
  - 변경된 위치에 따라 block의 부모 block과 subBlock(자식 block), page.firstBlocksId 에 변동 사항이 생길 수 있음
- tab 키와 backspace 키를 통해 block 들여쓰기 내여쓰기 가능
- 키보드 방향키를 통한 블록간의 커서 이동
- 블럭을 다른 페이지로 이동

#### 📼 PageContent simulation

- block 생성 및 타입 변경

<img 
    alt="make newBlock and change block type"
    width="50%"
    src="https://user-images.githubusercontent.com/69838872/209687777-fb568d78-b367-4437-9e0a-03c909882a70.gif"
  />

- image 타입 블럭 생성 및 image 사이즈 변경

<img 
    alt="imgBlock"
    width="50%"
    src="https://user-images.githubusercontent.com/69838872/209687927-d5d5ea4b-2865-4ddb-ab30-b8020c0597dc.gif"
  />

- comment

<img ait="comment" width="50%" src="./image/readMeFile/m_comment.gif" />

<br/>

- blockStyler - web browser

<img 
    alt="blockStyler_web"
    width="50%"
    src="https://user-images.githubusercontent.com/69838872/209688273-bc6bd45b-bf0b-48be-aa1d-1020963f193d.gif"
  />

- blockStyler - mobile browser

<img alt="blockStyler_mobile" width="40%" src="./image/readMeFile/m_b%20.gif"/>

<br/>

- 다른 페이지로 블록 이동

<img ait="changePosition"
width="50%"
src="https://user-images.githubusercontent.com/69838872/209688434-5db37fcc-7987-460b-80a7-43db53d410c3.gif">

- 블록 위치 변경

<img
  ait="changePosition"
  width="50%"
  src="https://user-images.githubusercontent.com/69838872/209688434-5db37fcc-7987-460b-80a7-43db53d410c3.gif"/>
<br/>

- 블록 위치 변경 - mobile browser

<img 
    ait="changePosition"
    width="40%"
    src="./image/readMeFile/moveBlock_mobile.gif"
/>

- 기타: 키보드를 통한 조작, 블럭 삭제, 블럭 내용 선택등등

<img 
    width="50%"
    alt="etc function"
    src="https://user-images.githubusercontent.com/69838872/209688197-d6aacef5-a7af-438c-8543-e9e40d16a8bb.gif"
/>

- menu - mobile browser

<img 
  width="40%" 
  alt="menu in mobile" 
  src="./image/readMeFile/mobile_m.gif"
/>

- sideMenu of menu - mobile browser

<img 
  width="40%" 
  alt="sideMenu of menu in mobile" 
  src="./image/readMeFile/m_mm.gif"
/>

---

## <div id="update">4. Update </div>

- 2022.12 업데이트
  - sideBar,allComment 변경,<span style="text-decoration:line-through"> Mobile Menu 추가 </span>, 모바일에서도 ImageContent 사이즈 변경가능하도록 수정
    <br/>
- 2023.3 업데이트 및 수정

  - 모바일 브라우저에서 사용될 block 에 대한 메뉴와 그 사이드 메뉴를 담당하는 MobileBlockMenu, MobileSideMenu 추가

  - 모바일 브라우저에서도 block의 contents 중 특정 글자를 선택할 때 해당 글자에 대한 BlockStyler 의 기능을 사용 가능

  - block 전체 뿐만 아니라 일부 내용에 대해서도 comment 추가 할 수 있음

  - 모바일 브라우저에서 블럭간 이동이 안되는 오류 수정
<br/>
- 2023.7 업데이트 및 수정
  - 이미지 크기 조절 버튼 오류 수정
  - react, 이미지 최적화 완료
  - 찾는 페이지가 없거나, 페이지 자체가 없을때 보이는 화면 오류 수정
  - 모바일 브라우저의 스크롤 오류 수정
  - HashRouter 에서 BrowserRouter 변경
  - react-helmet-async과 robots.txt를 활용한 SEO 개선

---

- 🔎 [Notion 프로젝트 후기 보러가기](https://velog.io/@badahertz52/Notion-프로젝트-후기)
