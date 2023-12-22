# modal

## sidebar

[x] openQuick
[] template
[x] trash

## frame

[x] blockStyler

- 수정 사항
  [x] commandMenu 닫힐때ㅡ blockStyler 닫히도록 (셀렉트 삭제 후 저장)
  [x] 링크 변경 후 저장 안되는 오류
  [x] 링크 클릭 시, contents의 onClick 이벤트와 충돌 해 링크가 열리지 않는 오류 수정
  [x] 사이드 메뉴 클릭 시, 사이드 메뉴 닫히는 오류

[x] comments
[x] comments more menu
[x] loader
[ ] mobileMenu
[x] command
[x] moveTargetBlock

## IconModal

-기존 IconModal을 ModalPortal을 사용하는 것으로 수정

## topBar

[] allComments
[] moreMenu
[] export

# notion

[x] discard

# notion 리팩토링에 따른 수정

## Block

block 구조화 하기

main block
-props : key, onMouseOver, onMouseLeave, marker(블록 타입에 따라),
subBlockGroup
