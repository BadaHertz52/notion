"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.findPage = exports.findParentBlock = exports.findBlock = exports.clean_trash = exports.restore_page = exports.delete_page = exports.move_page_to_page = exports.edit_page = exports.duplicate_page = exports.add_page = exports.raise_block = exports.change_to_sub = exports.delete_block = exports.change_page_to_block = exports.change_block_to_page = exports.edit_block = exports.add_block = exports.pageSample = exports.makeNewBlock = exports.blockSample = exports.basicBlockStyle = exports.bg_pink = exports.bg_blue = exports.bg_green = exports.bg_yellow = exports.bg_grey = exports.bg_default = exports.red = exports.blue = exports.green = exports.orange = exports.grey = exports.defaultColor = exports.blockTypes = exports.bulletList = exports.numberList = exports.bookmark = exports.image = exports.page = exports.h3 = exports.h2 = exports.h1 = exports.todo_done = exports.todo = exports.toggle = exports.text = void 0;
var michael_sum_LEpfefQf4rU_unsplash_jpg_1 = require("../assests/img/michael-sum-LEpfefQf4rU-unsplash.jpg");
var roses_gfcb7dbdd4_640_jpg_1 = require("../assests/img/roses-gfcb7dbdd4_640.jpg");
//TYPE 
exports.text = "text";
exports.toggle = "toggle";
exports.todo = "todo";
exports.todo_done = "todo done";
exports.h1 = "h1";
exports.h2 = "h2";
exports.h3 = "h3";
exports.page = "page";
exports.image = "image media";
exports.bookmark = "bookmark media";
exports.numberList = "numberList";
exports.bulletList = "bulletList";
exports.blockTypes = [exports.text, exports.toggle, exports.todo, exports.todo_done, exports.image, exports.bookmark, exports.h1, exports.h2, exports.page, exports.numberList, exports.bulletList];
exports.defaultColor = "initial";
exports.grey = "#bdbdbd";
exports.orange = "#ffa726";
exports.green = "#00701a";
exports.blue = "#1565c0";
exports.red = "#d32f2f";
exports.bg_default = "initial";
exports.bg_grey = "#e0e0e0";
exports.bg_yellow = "#fff9c4";
exports.bg_green = "#ebffd7";
exports.bg_blue = "#e3f2fd";
exports.bg_pink = "#fce4ec";
exports.basicBlockStyle = {
    color: exports.defaultColor,
    bgColor: exports.bg_default,
    fontWeight: "initial",
    fontStyle: "initial",
    textDeco: "none",
    width: undefined,
    height: undefined
};
var userName = "amet";
var editTime = JSON.stringify(Date.now());
var img = "img";
var string = "string";
exports.blockSample = {
    id: "blockSample_" + editTime,
    contents: "",
    firstBlock: true,
    subBlocksId: null,
    parentBlocksId: null,
    type: exports.text,
    iconType: null,
    icon: null,
    editTime: editTime,
    createTime: JSON.stringify(Date.now()),
    style: exports.basicBlockStyle,
    comments: null
};
function makeNewBlock(page, targetBlock, newBlockContents) {
    var number = page.blocksId.length.toString();
    var editTime = JSON.stringify(Date.now());
    var newBlock = {
        id: page.id + "_" + number + "_" + editTime,
        editTime: editTime,
        createTime: editTime,
        type: "text",
        contents: newBlockContents === "<br>" ? "" : newBlockContents,
        firstBlock: targetBlock !== null ? targetBlock.firstBlock : true,
        subBlocksId: targetBlock !== null ? targetBlock.subBlocksId : null,
        parentBlocksId: targetBlock !== null ? targetBlock.parentBlocksId : null,
        iconType: null,
        icon: null,
        style: exports.basicBlockStyle,
        comments: null
    };
    return newBlock;
}
exports.makeNewBlock = makeNewBlock;
exports.pageSample = {
    id: editTime,
    header: {
        title: "untitle",
        iconType: null,
        icon: null,
        cover: null,
        comments: null
    },
    firstBlocksId: null,
    blocks: [exports.blockSample],
    blocksId: [],
    subPagesId: null,
    parentsId: null,
    editTime: editTime,
    createTime: editTime
};
//action
var ADD_BLOCK = "notion/ADD_BLOCK";
var EDIT_BLOCK = "notion/EDIT_BLOCK";
var CHANGE_BLOCK_TO_PAGE = "notion/CHANGE_BLOCK_TO_PAGE";
var CHANGE_PAGE_TO_BLOCK = "notion/CHANGE_PAGE_TO_BLOCK";
var DELETE_BLOCK = "notion/DELETE_BLOCK";
var CHANGE_TO_SUB_BLOCK = "notion/CHANGE_TO_SUB_BLOCK";
var RAISE_BLOCK = "notion/RAISE_BLOCK"; //cancle tab
var ADD_PAGE = "notion/ADD_PAGE";
var DUPLICATE_PAGE = "notion/DUPLICATE_PAGE";
var EDIT_PAGE = "notion/EDIT_PAGE";
var MOVE_PAGE_TO_PAGE = "notion/MOVE_PAGE_TO_PAGE";
var DELETE_PAGE = "notion/DELETE_PAGE";
var RESTORE_PAGE = "notion/RESTORE_PAGE";
var CLEAN_TRASH = "notion/CLEAN_TRASH";
exports.add_block = function (pageId, block, newBlockIndex, previousBlockId) { return ({
    type: ADD_BLOCK,
    pageId: pageId,
    block: block,
    newBlockIndex: newBlockIndex,
    previousBlockId: previousBlockId // enter시에 기준이 된 block이 subBlock 일 경우 넣어주기 , subBlock 으로 추가시 첫번째 sub 으로 되는지, 다음 sub 인지 결정 
}); };
exports.edit_block = function (pageId, block) { return ({
    type: EDIT_BLOCK,
    pageId: pageId,
    block: block
}); };
exports.change_block_to_page = function (currentPageId, block) { return ({
    type: CHANGE_BLOCK_TO_PAGE,
    pageId: currentPageId,
    block: block
}); };
exports.change_page_to_block = function (currentPageId, block) { return ({
    type: CHANGE_PAGE_TO_BLOCK,
    pageId: currentPageId,
    block: block
}); };
exports.delete_block = function (pageId, block, isInMenu) { return ({
    type: DELETE_BLOCK,
    pageId: pageId,
    block: block,
    isInMenu: isInMenu
}); };
exports.change_to_sub = function (pageId, block, newParentBlockId) { return ({
    type: CHANGE_TO_SUB_BLOCK,
    pageId: pageId,
    block: block,
    newParentBlockId: newParentBlockId
}); };
exports.raise_block = function (pageId, block) { return ({
    type: RAISE_BLOCK,
    pageId: pageId,
    block: block
}); };
exports.add_page = function (newPage) { return ({
    type: ADD_PAGE,
    pageId: "0",
    newPage: newPage,
    block: null
}); };
exports.duplicate_page = function (targetPageId) { return ({
    type: DUPLICATE_PAGE,
    pageId: targetPageId,
    block: null
}); };
exports.edit_page = function (pageId, newPage) { return ({
    type: EDIT_PAGE,
    pageId: pageId,
    newPage: newPage,
    block: null
}); };
exports.move_page_to_page = function (targetPageId, destinationPageId) { return ({
    type: MOVE_PAGE_TO_PAGE,
    pageId: targetPageId,
    destinationPageId: destinationPageId,
    block: null
}); };
exports.delete_page = function (pageId) { return ({
    type: DELETE_PAGE,
    pageId: pageId,
    block: null
}); };
exports.restore_page = function (pageId) { return ({
    type: RESTORE_PAGE,
    pageId: pageId,
    block: null
}); };
exports.clean_trash = function (pageId) { return ({
    type: CLEAN_TRASH,
    pageId: pageId,
    block: null
}); };
//reducer
var initialState = {
    pagesId: ['12345', 'page1', 'page2', '1234', '123'],
    firstPagesId: ['12345', '1234', '123'],
    pages: [
        {
            id: '12345',
            header: {
                title: "welcome notion 🐱",
                iconType: "img",
                icon: michael_sum_LEpfefQf4rU_unsplash_jpg_1["default"],
                cover: null,
                comments: [{
                        id: "comment_1",
                        userName: userName,
                        type: "open",
                        content: "this is page comment",
                        editTime: Date.parse("2021-5-20-12:00")
                            .toString(),
                        createTime: Date.parse("2021-5-20-12:00").toString(),
                        subComments: null,
                        subCommentsId: null
                    }]
            },
            firstBlocksId: ["text", 'img', 'toggle', 'todo', 'todo done', 'h1', 'h2', 'h3', 'page1', 'page2', "numberList", "bulletList"],
            blocks: [{
                    id: "text",
                    contents: "안녕",
                    firstBlock: true,
                    subBlocksId: ["sub1_1", "sub1_2"],
                    parentBlocksId: null,
                    type: exports.text,
                    iconType: null,
                    icon: null,
                    editTime: Date.parse("2021-5-18-15:00").toString(),
                    createTime: Date.parse("2021-5-18-1:00").toString(),
                    style: __assign(__assign({}, exports.basicBlockStyle), { color: exports.blue, bgColor: exports.bg_default, fontWeight: "bold" }),
                    comments: [{
                            id: "comment_text1",
                            userName: userName,
                            type: "open",
                            content: "hi! ☺️",
                            editTime: (1654086822451).toString(),
                            createTime: (Date.parse("2021-5-20-15:00")).toString(),
                            subComments: null,
                            subCommentsId: null
                        },]
                }, {
                    id: "img",
                    contents: roses_gfcb7dbdd4_640_jpg_1["default"],
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: exports.image,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-18-16:00")).toString(),
                    createTime: (Date.parse("2021-5-18-2:00")).toString(),
                    style: exports.basicBlockStyle,
                    comments: null
                },
                {
                    id: "toggle",
                    contents: "toggle toggle ",
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: exports.toggle,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-18-16:00")).toString(),
                    createTime: (Date.parse("2021-5-18-2:00")).toString(),
                    style: exports.basicBlockStyle,
                    comments: null
                }, {
                    id: "todo",
                    contents: "todo",
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: exports.todo,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-18-16:01:00")).toString(),
                    createTime: (Date.parse("2021-5-18-3:00")).toString(),
                    style: __assign(__assign({}, exports.basicBlockStyle), { bgColor: exports.bg_yellow, textDeco: "underline" }),
                    comments: [{
                            id: "comment_todo1",
                            userName: userName,
                            type: "open",
                            content: "todo comments",
                            editTime: (Date.parse("2021-5-18-16:01:30")).toString(),
                            createTime: (Date.parse("2021-5-21-14:00")).toString(),
                            subComments: null,
                            subCommentsId: null
                        },]
                }, {
                    id: "todo done",
                    contents: "todo done",
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: exports.todo_done,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-19-11:30")).toString(),
                    createTime: (Date.parse("2021-5-18-5:00")).toString(),
                    style: exports.basicBlockStyle,
                    comments: null
                }, {
                    id: "h1",
                    contents: "header1",
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: exports.h1,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-19-12:00")).toString(),
                    createTime: (Date.parse("2021-5-18-15:00")).toString(),
                    style: exports.basicBlockStyle,
                    comments: null
                }, {
                    id: "h2",
                    contents: "header2",
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: exports.h2,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-18-20:00")).toString(),
                    createTime: (Date.parse("2021-5-18-15:00")).toString(),
                    style: exports.basicBlockStyle,
                    comments: null
                }, {
                    id: "h3",
                    contents: "header3",
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: exports.h3,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-19-19:20")).toString(),
                    createTime: (Date.parse("2021-5-18-15:00")).toString(),
                    style: exports.basicBlockStyle,
                    comments: null
                }, {
                    id: "page1",
                    contents: "page page page",
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: exports.page,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-20-21:00")).toString(),
                    createTime: (Date.parse("2021-5-19-15:00")).toString(),
                    style: exports.basicBlockStyle,
                    comments: null
                },
                {
                    id: "page2",
                    contents: "page2",
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: exports.page,
                    iconType: "string",
                    icon: "🌈",
                    editTime: (Date.parse("2021-5-20-9:00")).toString(),
                    createTime: (Date.parse("2021-5-19-20:00")).toString(),
                    style: exports.basicBlockStyle,
                    comments: null
                }, { id: "sub1_1",
                    contents: "sub1_1",
                    firstBlock: false,
                    subBlocksId: ["sub2_1"],
                    parentBlocksId: ["text"],
                    type: exports.text,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-6-1-1:00")).toString(),
                    createTime: (Date.parse("2021-5-30-15:00")).toString(), style: __assign({}, exports.basicBlockStyle), comments: null },
                {
                    id: "sub1_2",
                    contents: "sub1_2",
                    firstBlock: false,
                    subBlocksId: null,
                    parentBlocksId: ["text"],
                    type: exports.text,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-12-09:00")).toString(),
                    createTime: (Date.parse("2021-5-12-08:50")).toString(),
                    style: __assign({}, exports.basicBlockStyle),
                    comments: [{
                            id: "comment_sub1_2_1",
                            userName: userName,
                            type: "open",
                            content: "subBlock comments",
                            editTime: (Date.parse("2021-5-18-8:00")).toString(),
                            createTime: (Date.parse("2021-5-18-8:00")).toString(),
                            subComments: null,
                            subCommentsId: null
                        },]
                },
                {
                    id: "sub2_1",
                    contents: "sub2_1",
                    firstBlock: false,
                    subBlocksId: null,
                    parentBlocksId: ["text", "sub1_1"],
                    type: exports.text,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-5-27-7:00")).toString(),
                    createTime: (Date.parse("2021-5-27-7:00")).toString(),
                    style: __assign({}, exports.basicBlockStyle),
                    comments: null
                },
                {
                    id: "numlist",
                    contents: "",
                    firstBlock: true,
                    subBlocksId: ["num1", "num2", "num3"],
                    parentBlocksId: null,
                    type: exports.numberList,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-6-1-18:45")).toString(),
                    createTime: (Date.parse("2021-6-1-18:45")).toString(),
                    style: __assign({}, exports.basicBlockStyle),
                    comments: null
                },
                {
                    id: "num1",
                    contents: "n1",
                    firstBlock: false,
                    subBlocksId: null,
                    parentBlocksId: [exports.numberList],
                    type: exports.numberList,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-6-1-19:03")).toString(),
                    createTime: (Date.parse("2021-6-1-19:03")).toString(),
                    style: __assign(__assign({}, exports.basicBlockStyle), { bgColor: exports.bg_green }),
                    comments: null
                },
                {
                    id: "num2",
                    contents: "n2",
                    firstBlock: false,
                    subBlocksId: null,
                    parentBlocksId: [exports.numberList],
                    type: exports.numberList,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-6-1-19:03:50")).toString(),
                    createTime: (Date.parse("2021-6-1-19:03:50")).toString(),
                    style: __assign({}, exports.basicBlockStyle),
                    comments: [{
                            id: "comment_n2",
                            userName: userName,
                            type: "open",
                            content: "comment n2",
                            editTime: (1654086822451).toString(),
                            createTime: (1654086822451).toString(),
                            subComments: null,
                            subCommentsId: null
                        },]
                },
                {
                    id: "num3",
                    contents: "n3",
                    firstBlock: false,
                    subBlocksId: null,
                    parentBlocksId: [exports.numberList],
                    type: exports.numberList,
                    iconType: null,
                    icon: null,
                    editTime: Date.parse("2021-6-1-19:12:13").toString(),
                    createTime: Date.parse("2021-6-1-19:12:13").toString(),
                    style: __assign({}, exports.basicBlockStyle),
                    comments: null
                },
                {
                    id: "bulletList",
                    contents: "",
                    firstBlock: true,
                    subBlocksId: ["b1", "b2"],
                    parentBlocksId: null,
                    type: exports.bulletList,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-6-1-19:13:45")).toString(),
                    createTime: (Date.parse("2021-6-1-19:13:45")).toString(),
                    style: __assign({}, exports.basicBlockStyle),
                    comments: null
                },
                {
                    id: "b1",
                    contents: "b1",
                    firstBlock: false,
                    subBlocksId: null,
                    parentBlocksId: [exports.bulletList],
                    type: exports.bulletList,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-6-1-19:23")).toString(),
                    createTime: (Date.parse("2021-6-1-19:23")).toString(),
                    style: __assign({}, exports.basicBlockStyle),
                    comments: null
                },
                {
                    id: "b2",
                    contents: "b2",
                    firstBlock: false,
                    subBlocksId: null,
                    parentBlocksId: [exports.bulletList],
                    type: exports.bulletList,
                    iconType: null,
                    icon: null,
                    editTime: (Date.parse("2021-6-1-20:12")).toString(),
                    createTime: (Date.parse("2021-6-1-20:12")).toString(),
                    style: __assign({}, exports.basicBlockStyle),
                    comments: null
                },
            ],
            blocksId: ["text", 'img', 'toggle', 'todo', 'todo done', 'h1', 'h2', 'h3', 'page1', 'page2', 'sub1_1', 'sub1_2', 'sub2_1', "numberList", "num1", "num2", "num3", "bulletList", "b1", "b2"],
            subPagesId: ['page1', 'page2'],
            parentsId: null,
            editTime: (Date.parse("2021-5-16-15:00")).toString(),
            createTime: (Date.parse("2021-5-16-15:00")).toString()
        },
        __assign(__assign({}, exports.pageSample), { id: "page1", header: __assign(__assign({}, exports.pageSample.header), { title: "page page page" }), editTime: (Date.parse("2021-5-20-21:00")).toString(), createTime: (Date.parse("2021-5-20-21:00")).toString(), parentsId: ['12345'] }),
        __assign(__assign({}, exports.pageSample), { id: "page2", header: __assign(__assign({}, exports.pageSample.header), { iconType: "string", icon: "🌈", title: "page2" }), editTime: JSON.stringify(Date.parse("2021-5-20-9:00")), createTime: JSON.stringify(Date.parse("2021-5-20-9:00")), parentsId: ['12345'] }),
        {
            id: '1234',
            header: {
                title: "notion2",
                iconType: "string",
                icon: '👋',
                cover: null,
                comments: null
            },
            firstBlocksId: null,
            blocks: [exports.blockSample],
            blocksId: [exports.blockSample.id],
            subPagesId: null,
            parentsId: null,
            editTime: JSON.stringify(Date.parse("2021-5-18-19:00")),
            createTime: JSON.stringify(Date.parse("2021-5-18-19:00"))
        },
        {
            id: '123',
            header: {
                title: "notion3",
                iconType: "string",
                icon: '🌞',
                cover: null,
                comments: null
            },
            firstBlocksId: null,
            blocks: [exports.blockSample],
            blocksId: [exports.blockSample.id],
            subPagesId: null,
            parentsId: null,
            editTime: JSON.stringify(Date.parse("2021-5-13-15:00")),
            createTime: JSON.stringify(Date.parse("2021-5-13-15:00"))
        }
    ],
    trash: {
        pagesId: null,
        pages: null
    }
};
function findBlock(page, blockId) {
    var index = page.blocksId.indexOf(blockId);
    var block = page.blocks[index];
    return {
        index: index,
        BLOCK: block
    };
}
exports.findBlock = findBlock;
;
function findParentBlock(page, subBlock) {
    var parentBlocksId = subBlock.parentBlocksId;
    var last = parentBlocksId.length - 1;
    var parentBlockId = parentBlocksId[last];
    var _a = findBlock(page, parentBlockId), index = _a.index, BLOCK = _a.BLOCK;
    return {
        parentBlockIndex: index,
        parentBlock: BLOCK
    };
}
exports.findParentBlock = findParentBlock;
;
exports.findPage = function (pagesId, pages, pageId) {
    var index = pagesId.indexOf(pageId);
    var PAGE = pages[index];
    return PAGE;
};
function notion(state, action) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (state === void 0) { state = initialState; }
    var pagesId = __spreadArrays(state.pagesId);
    var firstPagesId = __spreadArrays(state.firstPagesId);
    var pages = __spreadArrays(state.pages);
    var trash = {
        pagesId: state.trash.pagesId ? __spreadArrays(state.trash.pagesId) : null,
        pages: state.trash.pages ? __spreadArrays(state.trash.pages) : null
    };
    var pageIndex = action.type !== RESTORE_PAGE ?
        pagesId.indexOf(action.pageId) :
        (_a = trash.pagesId) === null || _a === void 0 ? void 0 : _a.indexOf(action.pageId);
    var targetPage = action.type !== RESTORE_PAGE ?
        pages[pageIndex] :
        trash.pages !== null ?
            trash.pages[pageIndex] : __assign(__assign({}, exports.pageSample), { subPages: null });
    var blockIndex = action.block !== null ? ((_b = pages[pageIndex]) === null || _b === void 0 ? void 0 : _b.blocksId.indexOf(action.block.id)) : 0;
    var editBlockData = function (index, block) {
        targetPage === null || targetPage === void 0 ? void 0 : targetPage.blocks.splice(index, 1, block);
        console.log("editBlockData", block, targetPage);
    };
    //subBlock 추가 시 parentBlock update
    var updateParentBlock = function (subBlock, previousBlockId) {
        if (subBlock.parentBlocksId !== null) {
            //find parentBlock
            var _a = findParentBlock(targetPage, subBlock), parentBlockIndex = _a.parentBlockIndex, parentBlock = _a.parentBlock;
            var subBlocksId = parentBlock.subBlocksId;
            if (subBlocksId !== null) {
                var previousBlockIndex = previousBlockId === null ? -1 : subBlocksId.indexOf(previousBlockId);
                subBlocksId.splice(previousBlockIndex + 1, 0, subBlock.id);
            }
            ;
            //edit parentBlock 
            var editedParentBlock = __assign(__assign({}, parentBlock), { subBlocksId: subBlocksId !== null ? subBlocksId : [subBlock.id] });
            //update parentBlock
            targetPage.blocks.splice(parentBlockIndex, 1, editedParentBlock);
            console.log("updateparent", parentBlock, editedParentBlock);
        }
        else {
            console.log("can't find parentBlocks of this block");
        }
    };
    var findPreviousBlockInDoc = function (page, block) {
        var _a, _b;
        var editableDoc = (_b = (_a = document.getElementById("block_" + block.id)) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
        var previouseBlockElement = editableDoc.previousElementSibling;
        var findPreviousBlockId = function () {
            var _a, _b;
            var previousBlockId = "";
            if (previouseBlockElement == null && block.parentBlocksId !== null) {
                var length = block.parentBlocksId.length;
                previousBlockId = block.parentBlocksId[length - 1];
            }
            if (previouseBlockElement !== null) {
                var previousBlockDom = (_a = previouseBlockElement.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild;
                previousBlockId = (_b = previousBlockDom.getAttribute("id")) === null || _b === void 0 ? void 0 : _b.slice(6);
            }
            ;
            return previousBlockId;
        };
        var previousBlockId = findPreviousBlockId();
        var BLOCK = findBlock(page, previousBlockId).BLOCK;
        var previousBlockInDoc = (BLOCK.subBlocksId === null || (BLOCK.subBlocksId !== null && BLOCK.subBlocksId.includes(block.id))) ? BLOCK :
            findBlock(page, BLOCK.subBlocksId[BLOCK.subBlocksId.length - 1]).BLOCK;
        console.log("predoc,", previousBlockId, previousBlockInDoc.id);
        var previousBlockInDocIndex = page.blocksId.indexOf(previousBlockInDoc.id);
        return {
            previousBlockInDoc: previousBlockInDoc,
            previousBlockInDocIndex: previousBlockInDocIndex
        };
    };
    var editFirstBlocksId = function (page, block) {
        var _a;
        if (block.firstBlock !== null && page.firstBlocksId !== null) {
            var firstIndex = page.firstBlocksId.indexOf(block.id);
            if (block.subBlocksId !== null) {
                if (firstIndex === 0) {
                    page.firstBlocksId = __spreadArrays(block.subBlocksId, (_a = page.firstBlocksId) === null || _a === void 0 ? void 0 : _a.slice(1));
                }
                else {
                    var pre = page.firstBlocksId.slice(0, firstIndex);
                    if (firstIndex === page.firstBlocksId.length - 1) {
                        page.firstBlocksId = pre.concat(block.subBlocksId);
                    }
                    else {
                        var after = page.firstBlocksId.slice(firstIndex + 1);
                        page.firstBlocksId = pre.concat(block.subBlocksId).concat(after);
                    }
                }
            }
            ;
            if (block.subBlocksId == null) {
                page.firstBlocksId.splice(firstIndex, 1);
            }
            ;
        }
        ;
    };
    var raiseSubBlock = function (page, block, blockDelete) {
        if (block.subBlocksId !== null) {
            // 가정 설명 : 삭제 시 , 삭제되는 block 이 firstBlock 이면 subBlock 은 firstBlock 이 되고 아니면 화면상 이전 블록의 subBlock이 됨
            var subBlocks = block.subBlocksId.map(function (id) {
                var BLOCK = findBlock(page, id).BLOCK;
                return BLOCK;
            });
            subBlocks.forEach(function (subBlock) {
                if (subBlock.parentBlocksId !== null) {
                    var raisedSubBlock = __assign(__assign({}, subBlock), { parentBlocksId: blockDelete ? block.parentBlocksId : subBlock.parentBlocksId.slice(1), firstBlock: blockDelete ? block.firstBlock : false, editTime: editTime });
                    console.log("originblock", subBlock, "raisedblock", raisedSubBlock);
                    var index = page.blocksId.indexOf(subBlock.id);
                    editBlockData(index, raisedSubBlock);
                    subBlock.subBlocksId !== null && raiseSubBlock(page, subBlock, blockDelete);
                }
            });
            //block 삭제와 page firstBlockId 수정은 따로 (sub=sub에서도 실행하기 때문에 sub만 수정 )
        }
        ;
    };
    var updateNewParentAndFirstBlocksIdAfterRaise = function (page, block) {
        //block 삭제시subBlock이 땡겨질 경우 적용 
        var subBlocksId = block.subBlocksId;
        if (subBlocksId !== null && block.parentBlocksId !== null) {
            var _a = findParentBlock(page, block), parentBlock = _a.parentBlock, parentBlockIndex = _a.parentBlockIndex;
            var parentSubsId = parentBlock.subBlocksId;
            var index = parentSubsId.indexOf(block.id);
            if (index === 0) {
                parentSubsId = __spreadArrays(subBlocksId);
            }
            else {
                if (index === parentSubsId.length - 1) {
                    parentSubsId = parentSubsId.slice(0, index).concat(subBlocksId);
                }
                else {
                    var pre = parentSubsId.slice(0, index);
                    var after = parentSubsId.slice(index + 1);
                    parentSubsId = pre.concat(subBlocksId).concat(after);
                }
            }
            ;
            var newParentBlock = __assign(__assign({}, parentBlock), { subBlocksId: parentSubsId, editTime: editTime });
            editBlockData(parentBlockIndex, newParentBlock);
        }
        ;
        editFirstBlocksId(page, block);
    };
    var deleteBlockData = function (page, block) {
        var _a, _b, _c;
        var index = page.blocksId.indexOf(block.id);
        if (block.firstBlock && page.firstBlocksId !== null) {
            var firstIndex = page.firstBlocksId.indexOf(block.id);
            block.firstBlock && firstIndex >= 0 && ((_a = page.firstBlocksId) === null || _a === void 0 ? void 0 : _a.splice(firstIndex, 1));
        }
        ;
        (_b = page.blocks) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
        (_c = page.blocksId) === null || _c === void 0 ? void 0 : _c.splice(index, 1);
    };
    switch (action.type) {
        case ADD_BLOCK:
            if (action.newBlockIndex === 0) {
                targetPage.blocks = [action.block];
                targetPage.blocksId = [action.block.id];
            }
            else {
                (_c = targetPage.blocks) === null || _c === void 0 ? void 0 : _c.splice(action.newBlockIndex, 0, action.block);
                (_d = targetPage.blocksId) === null || _d === void 0 ? void 0 : _d.splice(action.newBlockIndex, 0, action.block.id);
            }
            if (action.block.firstBlock) {
                if (targetPage.firstBlocksId !== null) {
                    if (action.previousBlockId !== null) {
                        var firstIndex = targetPage.firstBlocksId.indexOf(action.previousBlockId);
                        targetPage.firstBlocksId.splice(firstIndex + 1, 0, action.block.id);
                    }
                    else {
                        targetPage.firstBlocksId = targetPage.firstBlocksId.concat(action.block.id);
                    }
                }
                else {
                    targetPage.firstBlocksId = [action.block.id];
                }
            }
            else {
                //subBlock 으로 만들어 졌을 때 
                if (action.block.parentBlocksId !== null) {
                    updateParentBlock(action.block, action.previousBlockId);
                }
                ;
            }
            ;
            if (action.block.subBlocksId !== null && action.previousBlockId !== null) {
                // subBlock을 가지는 블록을 기준을  그 다음 블록으로 만들어진 경우  
                var previousBlock = findBlock(targetPage, action.previousBlockId).BLOCK;
                previousBlock.subBlocksId = null;
                action.block.subBlocksId.forEach(function (id) {
                    var _a, _b;
                    var BLOCK = findBlock(targetPage, id).BLOCK;
                    var parentIndex = (_a = BLOCK.parentBlocksId) === null || _a === void 0 ? void 0 : _a.indexOf(action.previousBlockId);
                    parentIndex !== undefined && ((_b = BLOCK.parentBlocksId) === null || _b === void 0 ? void 0 : _b.splice(parentIndex, 1, action.block.id));
                });
            }
            ;
            sessionStorage.setItem("newBlock", action.block.id);
            if (action.block.type === "page") {
                var newPage_1 = __assign(__assign({}, exports.pageSample), { id: action.block.id });
                addPage(newPage_1);
                if (action.block.parentBlocksId !== null) {
                    var parentPage = exports.findPage(pagesId, pages, action.block.parentBlocksId[0]);
                    var editedParentPage = __assign(__assign({}, parentPage), { blocks: parentPage.blocks.concat(action.block), blocksId: parentPage.blocksId.concat(action.block.id), firstBlocksId: parentPage.firstBlocksId !== null ? (_e = parentPage.firstBlocksId) === null || _e === void 0 ? void 0 : _e.concat(action.block.id) : [action.block.id], subPagesId: parentPage.subPagesId == null ? __spreadArrays(exports.blockSample.id) : parentPage.subPagesId.concat([exports.blockSample.id]), editTime: editTime });
                    editPage(editedParentPage);
                }
            }
            console.log("addBlock", targetPage);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case EDIT_BLOCK:
            editBlockData(blockIndex, action.block);
            console.log("edit", action.block, targetPage.blocks);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case CHANGE_BLOCK_TO_PAGE:
            var changedTypeBlock = __assign(__assign({}, action.block), { contents: action.block.contents === "" ? "untitle" : action.block.contents, type: "page", subBlocksId: null, editTime: editTime });
            editBlockData(blockIndex, changedTypeBlock);
            var newBlocksId_1 = [exports.blockSample.id];
            var newBlocks = [exports.blockSample];
            var newFirstBlocksId = [exports.blockSample.id];
            var newSubPagesId_1 = null;
            var allSubBlocks = targetPage.blocks.filter(function (block) { var _a; return (_a = block.parentBlocksId) === null || _a === void 0 ? void 0 : _a.includes(action.block.id); });
            if (allSubBlocks[0] !== undefined) {
                newBlocks = allSubBlocks.map(function (block) {
                    var newParentBlocksId = block.parentBlocksId !== null ? block.parentBlocksId.slice(1) : null;
                    var newBlock = __assign(__assign({}, block), { parentBlocksId: newParentBlocksId !== null ? (newParentBlocksId[0] === undefined ? null : newParentBlocksId) : null, firstBlock: newParentBlocksId == null || newParentBlocksId[0] === undefined });
                    return newBlock;
                });
                newBlocksId_1 = newBlocks.map(function (block) { return block.id; });
                newFirstBlocksId = newBlocks.filter(function (block) { return block.firstBlock === true; }).map(function (block) { return block.id; });
                newSubPagesId_1 = newBlocks.filter(function (block) { return block.type === "page"; }).map(function (block) { return block.id; });
                if (newBlocks[0] !== undefined) {
                    targetPage.blocks = targetPage.blocks.filter(function (block) { return !newBlocksId_1.includes(block.id); });
                    targetPage.blocksId = targetPage.blocksId.filter(function (id) { return !newBlocksId_1.includes(id); });
                }
                if (newSubPagesId_1[0] !== undefined && targetPage.subPagesId !== null) {
                    targetPage.subPagesId = targetPage.subPagesId.filter(function (id) { return !(newSubPagesId_1 === null || newSubPagesId_1 === void 0 ? void 0 : newSubPagesId_1.includes(id)); });
                }
                ;
            }
            var newPage = {
                id: action.block.id,
                header: {
                    title: action.block.contents === "" ? "untitle" : action.block.contents,
                    iconType: action.block.iconType,
                    icon: action.block.icon,
                    cover: null,
                    comments: action.block.comments
                },
                firstBlocksId: newFirstBlocksId,
                blocksId: newBlocksId_1,
                blocks: newBlocks,
                subPagesId: newSubPagesId_1 == null ? null : (newSubPagesId_1[0] === undefined ? null : newSubPagesId_1),
                parentsId: [action.pageId],
                editTime: action.block.editTime,
                createTime: action.block.createTime
            };
            addPage(newPage);
            console.log("change block type to page", targetPage, newPage);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case CHANGE_PAGE_TO_BLOCK:
            var changedTargetPageIndex = pagesId.indexOf(action.block.id);
            var changedTargetPage = pages[changedTargetPageIndex];
            deleteTargetPageData(changedTargetPage, changedTargetPageIndex, false);
            var changedBlock = __assign(__assign({}, action.block), { subBlocksId: changedTargetPage.blocksId, editTime: editTime });
            editBlockData(blockIndex, changedBlock);
            var newSubBlocks = changedTargetPage.blocks.map(function (block) { return (__assign(__assign({}, block), { firstBlock: false, parentBlocksId: block.parentBlocksId !== null ? __spreadArrays([action.block.id], block.parentBlocksId) : [action.block.id] })); });
            targetPage.blocks.push.apply(targetPage.blocks, newSubBlocks);
            targetPage.blocksId.push.apply(targetPage.blocksId, changedTargetPage.blocksId);
            console.log("changePagetoBlock", targetPage, pages, pages[pageIndex], pagesId);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case CHANGE_TO_SUB_BLOCK:
            //1. change  action.block's new parentBlock
            var _q = findBlock(targetPage, action.newParentBlockId), BLOCK = _q.BLOCK, index = _q.index;
            var parentBlock = __assign(__assign({}, BLOCK), { subBlocksId: BLOCK.subBlocksId !== null ? BLOCK.subBlocksId.concat(action.block.id) : [action.block.id], editTime: editTime });
            var parentBlockIndex = index;
            editBlockData(parentBlockIndex, parentBlock);
            //2. change actoin.block to subBlopck : edit parentsId of action.block 
            var editedBlock = __assign(__assign({}, action.block), { firstBlock: false, parentBlocksId: parentBlock.parentBlocksId !== null ?
                    parentBlock.parentBlocksId.concat(parentBlock.id) :
                    [parentBlock.id], editTime: editTime });
            editBlockData(blockIndex, editedBlock);
            // 3. first-> sub 인 경우  
            if (action.block.firstBlock) {
                // delte  id from firstBlocksId
                var index_1 = (_f = targetPage.firstBlocksId) === null || _f === void 0 ? void 0 : _f.indexOf(action.block.id);
                (_g = targetPage.firstBlocksId) === null || _g === void 0 ? void 0 : _g.splice(index_1, 1);
            }
            ;
            // 4. action.block의 subBlock 에서 다른 subBlock 으로 변경되었을 경우 
            if (action.block.parentBlocksId !== null) {
                var previouseParentBlockId = action.block.parentBlocksId[action.block.parentBlocksId.length - 1];
                var _r = findBlock(targetPage, previouseParentBlockId), BLOCK_1 = _r.BLOCK, index_2 = _r.index;
                var edtitedPreviousParentBlock = __assign(__assign({}, BLOCK_1), { subBlocksId: BLOCK_1.subBlocksId !== null ? BLOCK_1.subBlocksId.filter(function (id) { return id !== action.block.id; }) : null, editTime: editTime });
                editBlockData(index_2, edtitedPreviousParentBlock);
            }
            ;
            console.log("CHANGE subBlock", targetPage.blocks);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case RAISE_BLOCK:
            // cursor.anchorOffset== 0 일때 backspace 를 누를때 단. targetPage의 fistBlocksId 의 첫번째 인수는 불가 
            //  1. previsouBlockInDoc 의 content 수정 
            // : actionblock 이 firstBlock 인 경우, 
            //   block 이 sub 이면서 previousblock이 같은 sub 항렬의 다른 sub 의 sub인 경우 
            // 2. action block 의 subBlock 앞으로 땡기기 
            if (targetPage.firstBlocksId !== null &&
                targetPage.firstBlocksId[0] !== action.block.id) {
                var targetBlock_1 = action.block;
                var _s = findPreviousBlockInDoc(targetPage, action.block), previousBlockInDoc_1 = _s.previousBlockInDoc, previousBlockInDocIndex_1 = _s.previousBlockInDocIndex;
                //result1. block 위치가 한단계 앞으로  :block이 subBlock인 경우 
                //ressult2. block contents가 이전 block에 합쳐지고 block아 삭제되는 경우 
                var combineContents = function () {
                    var editedPreBlockInDoc = __assign(__assign({}, previousBlockInDoc_1), { contents: "" + previousBlockInDoc_1.contents + targetBlock_1.contents, editTime: editTime });
                    editBlockData(previousBlockInDocIndex_1, editedPreBlockInDoc);
                    targetPage.blocks.splice(blockIndex, 1);
                    targetPage.blocksId.splice(blockIndex, 1);
                    //firstBlocksId는 따로 
                };
                if (targetBlock_1.parentBlocksId !== null) {
                    //targetBlock이 subBlock 이면
                    //previoust block은 targetBlock의 parentBlock이거나 다른 subBlock인 경우 밖에 없음
                    var parentBlock_1 = findParentBlock(targetPage, targetBlock_1).parentBlock;
                    var subBlocksId = parentBlock_1.subBlocksId;
                    var length = subBlocksId.length;
                    var lastSubBlockId = subBlocksId[length - 1];
                    var lastSubBlock = findBlock(targetPage, lastSubBlockId).BLOCK;
                    var conditon2 = (targetBlock_1.parentBlocksId.length === ((_h = previousBlockInDoc_1.parentBlocksId) === null || _h === void 0 ? void 0 : _h.length)) && (lastSubBlock.id === targetBlock_1.id);
                    if ((previousBlockInDoc_1.id === parentBlock_1.id) || conditon2) {
                        //block -pull 
                        raiseSubBlock(targetPage, action.block, false);
                        var editedTargetBlock = __assign(__assign({}, targetBlock_1), { parentBlocksId: parentBlock_1.parentBlocksId, firstBlock: parentBlock_1.firstBlock, editTime: editTime });
                        console.log("pull", "editarget");
                        editBlockData(blockIndex, editedTargetBlock);
                        if (parentBlock_1.firstBlock) {
                            var firstIndex = targetPage.firstBlocksId.indexOf(parentBlock_1.id);
                            targetPage.firstBlocksId.splice(firstIndex + 1, 0, targetBlock_1.id);
                            console.log("firsindex", firstIndex);
                        }
                        ;
                        if (parentBlock_1.parentBlocksId !== null) {
                            var grandParentBlockId = parentBlock_1.parentBlocksId[parentBlock_1.parentBlocksId.length - 1];
                            var _t = findBlock(targetPage, grandParentBlockId), BLOCK_2 = _t.BLOCK, index_3 = _t.index;
                            var grandParentBlock = BLOCK_2;
                            var grandParentBlockIndex = index_3;
                            if (grandParentBlock.subBlocksId !== null) {
                                var grandSubsId = __spreadArrays(grandParentBlock.subBlocksId);
                                var subIndex = grandSubsId.indexOf(parentBlock_1.id);
                                grandSubsId.splice(subIndex + 1, 0, targetBlock_1.id);
                                var newGrandParentBlock = __assign(__assign({}, grandParentBlock), { subBlocksId: grandSubsId, editTime: editTime });
                                console.log("grandParent");
                                editBlockData(grandParentBlockIndex, newGrandParentBlock);
                            }
                        }
                    }
                    else {
                        ///result2 
                        console.log("content combine - block is subBlock");
                        raiseSubBlock(targetPage, action.block, true);
                        updateNewParentAndFirstBlocksIdAfterRaise(targetPage, action.block);
                        combineContents();
                        parentBlock_1.subBlocksId = subBlocksId.filter(function (id) { return id !== targetBlock_1.id; });
                    }
                }
                if (targetBlock_1.parentBlocksId == null) {
                    console.log("content combine");
                    raiseSubBlock(targetPage, action.block, true);
                    updateNewParentAndFirstBlocksIdAfterRaise(targetPage, action.block);
                    combineContents();
                }
                ;
            }
            ;
            console.log("raiseBlock", pages[pageIndex]);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
            ;
        case DELETE_BLOCK:
            if (action.block.parentBlocksId !== null) {
                var parentBlocksId = (_j = action.block) === null || _j === void 0 ? void 0 : _j.parentBlocksId;
                var parentBlockId = parentBlocksId[parentBlocksId.length - 1];
                var parentBlockIndex_1 = targetPage.blocksId.indexOf(parentBlockId);
                var parentBlock_2 = targetPage.blocks[parentBlockIndex_1];
                var newSubBlocksId = (_k = parentBlock_2.subBlocksId) === null || _k === void 0 ? void 0 : _k.filter(function (id) { return id !== action.block.id; });
                if (newSubBlocksId[0] !== undefined) {
                    editBlockData(parentBlockIndex_1, __assign(__assign({}, parentBlock_2), { subBlocksId: newSubBlocksId }));
                }
                else {
                    if (action.block.type.includes("List")) {
                        deleteBlockData(targetPage, parentBlock_2);
                    }
                    else {
                        editBlockData(parentBlockIndex_1, __assign(__assign({}, parentBlock_2), { subBlocksId: null }));
                    }
                }
                ;
            }
            ;
            // 삭제 타깃인 block 이 subBlock을 가지는 경우 .... 
            if (action.isInMenu) {
                deleteBlockData(targetPage, action.block);
            }
            else {
                raiseSubBlock(targetPage, action.block, true);
                editFirstBlocksId(targetPage, action.block);
                targetPage.blocks.splice(blockIndex, 1);
                targetPage.blocksId.splice(blockIndex, 1);
            }
            ;
            if (action.block.type === "page") {
                deletePage(action.block.id, false);
            }
            console.log("delete", pages[pageIndex]);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case ADD_PAGE:
            function addPage(newPage) {
                pagesId.push(newPage.id);
                pages.push(newPage);
                if (newPage.parentsId == null) {
                    //firstPage 일경우
                    firstPagesId.push(newPage.id);
                }
                else {
                    var parentPage = exports.findPage(pagesId, pages, newPage.parentsId[newPage.parentsId.length - 1]);
                    var parentPageIndex = pagesId.indexOf(parentPage.id);
                    var editedParentPage = __assign(__assign({}, parentPage), { subPagesId: parentPage.subPagesId !== null ? parentPage.subPagesId.concat(newPage.id) : [newPage.id] });
                    pages.splice(parentPageIndex, 1, editedParentPage);
                }
                ;
                console.log("add new page", pages, firstPagesId);
            }
            ;
            addPage(action.newPage);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case DUPLICATE_PAGE:
            function duplicatePage() {
                var _a, _b;
                var targetPageIndex = pagesId.indexOf(targetPage.id);
                var nextPageId = pagesId[targetPageIndex + 1];
                var nextPage = exports.findPage(pagesId, pages, nextPageId);
                var number = "1";
                var stop = false;
                if (nextPage.header.title === targetPage.header.title + "(1)") {
                    var slicedPages = pages.slice(targetPageIndex + 1);
                    for (var i = 0; i < slicedPages.length && !stop; i++) {
                        var title = slicedPages[i].header.title;
                        if (title === targetPage.header.title + "(" + (i + 1) + ")") {
                            number = (i + 2).toString();
                            console.log("number", number);
                        }
                        else {
                            stop = true;
                        }
                    }
                }
                ;
                var newPage = __assign(__assign({}, targetPage), { id: targetPage.id + "_duplicate_" + number, header: __assign(__assign({}, targetPage.header), { title: targetPage.header.title + "(" + number + ")" }), editTime: editTime });
                if (targetPage.parentsId == null) {
                    var index_4 = firstPagesId.indexOf(targetPage.id);
                    firstPagesId.splice(index_4 + 1, 0, newPage.id);
                }
                else {
                    var parentPage = __assign({}, exports.findPage(pagesId, pages, targetPage.parentsId[targetPage.parentsId.length - 1]));
                    var parentPageIndex = pagesId.indexOf(parentPage.id);
                    var subPageIndex = (_a = parentPage.subPagesId) === null || _a === void 0 ? void 0 : _a.indexOf(targetPage.id);
                    (_b = parentPage.subPagesId) === null || _b === void 0 ? void 0 : _b.splice(subPageIndex, 0, newPage.id);
                    pages.splice(parentPageIndex, 0, parentPage);
                }
                ;
                pages.splice(targetPageIndex + 1, 0, newPage);
                pagesId.splice(targetPageIndex + 1, 0, newPage.id);
            }
            ;
            duplicatePage();
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case EDIT_PAGE:
            function editPage(newPage) {
                targetPage.header = newPage.header;
                var parentsId = newPage.parentsId;
                if (parentsId !== null) {
                    var parentPageId = parentsId[parentsId.length - 1];
                    var parentPage = exports.findPage(pagesId, pages, parentPageId);
                    var blockIndex_1 = parentPage.blocksId.indexOf(newPage.id);
                    var pageBlock = parentPage.blocks[blockIndex_1];
                    var editedPageBlock = __assign(__assign({}, pageBlock), { contents: newPage.header.title, icon: newPage.header.icon, editTime: editTime });
                    parentPage.blocks.splice(blockIndex_1, 1, editedPageBlock);
                }
                ;
                console.log("edit page", pages);
            }
            ;
            editPage(action.newPage);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case MOVE_PAGE_TO_PAGE:
            function movePageToPage(destinationPageId) {
                var _a, _b;
                var destinationPage = exports.findPage(pagesId, pages, destinationPageId);
                // target page 관련 변경
                if (firstPagesId.includes(targetPage.id)) {
                    var index_5 = firstPagesId.indexOf(targetPage.id);
                    firstPagesId.splice(index_5, 1);
                }
                ;
                var pageBlockStyle = exports.basicBlockStyle;
                if (targetPage.parentsId !== null) {
                    var parentPage = exports.findPage(pagesId, pages, targetPage.parentsId[targetPage.parentsId.length - 1]);
                    var blockIndex_2 = parentPage.blocksId.indexOf(action.pageId);
                    pageBlockStyle = parentPage.blocks[blockIndex_2].style;
                    var subPageIndex = (_a = parentPage.subPagesId) === null || _a === void 0 ? void 0 : _a.indexOf(action.pageId);
                    parentPage.editTime = editTime;
                    parentPage.blocks.splice(blockIndex_2, 1);
                    parentPage.blocksId.splice(blockIndex_2, 1);
                    subPageIndex !== undefined && ((_b = parentPage.subPagesId) === null || _b === void 0 ? void 0 : _b.splice(subPageIndex, 1));
                }
                ;
                targetPage.editTime = editTime;
                targetPage.parentsId = [destinationPage.id];
                //destination page 관련 변경
                var newPageBlock = {
                    id: targetPage.id,
                    contents: targetPage.header.title,
                    firstBlock: true,
                    subBlocksId: null,
                    parentBlocksId: null,
                    type: "page",
                    iconType: targetPage.header.iconType,
                    icon: targetPage.header.icon,
                    editTime: targetPage.editTime,
                    createTime: targetPage.createTime,
                    style: pageBlockStyle,
                    comments: targetPage.header.comments
                };
                destinationPage.editTime = editTime;
                destinationPage.firstBlocksId !== null ? destinationPage.firstBlocksId.push(newPageBlock.id) : destinationPage.firstBlocksId = [newPageBlock.id];
                destinationPage.blocks.push(newPageBlock);
                destinationPage.blocksId.push(targetPage.id);
                destinationPage.subPagesId = destinationPage.subPagesId !== null ?
                    destinationPage.subPagesId.concat(targetPage.id) :
                    [targetPage.id];
                console.log("move page to other page", pages, firstPagesId, destinationPage);
            }
            ;
            movePageToPage(action.destinationPageId);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case DELETE_PAGE:
            function deleteTargetPageData(deletedTargetPage, deletedTargetPageIndex, blockDelete) {
                if (deletedTargetPage.parentsId !== null) {
                    var parentPageIndex = pagesId.indexOf(deletedTargetPage.parentsId[deletedTargetPage.parentsId.length - 1]);
                    var parentPage = pages[parentPageIndex];
                    if (parentPage.subPagesId !== null) {
                        var subPageIndex = parentPage.subPagesId.indexOf(deletedTargetPage.id);
                        parentPage.subPagesId.splice(subPageIndex, 1);
                        if (blockDelete) {
                            var blockIndex_3 = parentPage.blocksId.indexOf(deletedTargetPage.id);
                            parentPage.blocks.splice(blockIndex_3, 1);
                            parentPage.blocksId.splice(blockIndex_3, 1);
                        }
                        console.log("parent", parentPage);
                    }
                }
                else {
                    //firstPage 일 경우
                    var index_6 = firstPagesId.indexOf(deletedTargetPage.id);
                    firstPagesId.splice(index_6, 1);
                }
                ;
                pages.splice(deletedTargetPageIndex, 1);
                pagesId.splice(deletedTargetPageIndex, 1);
            }
            ;
            function deletePage(pageId, blockDelete) {
                var deletedTargetPageIndex = pagesId.indexOf(pageId);
                var deletedTargetPage = pages[deletedTargetPageIndex];
                deleteTargetPageData(deletedTargetPage, deletedTargetPageIndex, blockDelete);
                var trashTargetPage = __assign(__assign({}, deletedTargetPage), { subPages: null });
                if (deletedTargetPage.subPagesId !== null) {
                    var subPages = deletedTargetPage.subPagesId.map(function (id) { return exports.findPage(pagesId, pages, id); });
                    trashTargetPage = __assign(__assign({}, deletedTargetPage), { subPages: subPages });
                    deletedTargetPage.subPagesId.forEach(function (id) {
                        var index = pagesId.indexOf(id);
                        pages.splice(index, 1);
                        pagesId.splice(index, 1);
                    });
                }
                ;
                trash = {
                    pagesId: trash.pagesId == null ?
                        [deletedTargetPage.id] :
                        trash.pagesId.concat(deletedTargetPage.id),
                    pages: trash.pages == null ? [trashTargetPage] : trash.pages.concat(trashTargetPage)
                };
                console.log("delete page", pages, trash);
            }
            deletePage(action.pageId, true);
            return {
                pages: pages,
                firstPagesId: firstPagesId,
                pagesId: pagesId,
                trash: trash
            };
        case RESTORE_PAGE:
            var trashPages = trash.pages == null ? null : __spreadArrays(trash.pages);
            var trashPagesId = trash.pagesId === null ? null : __spreadArrays(trash.pagesId);
            var restoredPage = __assign(__assign({}, targetPage), { editTime: editTime, parentsId: null });
            pages.push(restoredPage);
            pagesId.push(restoredPage.id);
            firstPagesId.push(restoredPage.id);
            if (trashPages !== null && trashPagesId !== null) {
                var trashTargetPage = exports.findPage(trashPagesId, trashPages, action.pageId);
                var trashTargetPageIndex = trashPagesId.indexOf(trashTargetPage.id);
                trashPages.splice(trashTargetPageIndex, 1);
                trashPagesId.splice(trashTargetPageIndex, 1);
                if (trashTargetPage.subPages !== null) {
                    trashTargetPage.subPages.forEach(function (sub) {
                        pages.push(sub);
                        pagesId.push(sub.id);
                    });
                }
            }
            ;
            var newNotion = {
                pages: pages,
                pagesId: pagesId,
                firstPagesId: firstPagesId,
                trash: ((trashPages === null || trashPages === void 0 ? void 0 : trashPages[0]) !== undefined && (trashPagesId === null || trashPagesId === void 0 ? void 0 : trashPagesId[0]) !== undefined)
                    ?
                        {
                            pages: trashPages,
                            pagesId: trashPagesId
                        }
                    :
                        {
                            pages: null,
                            pagesId: null
                        }
            };
            console.log("restore", newNotion);
            return newNotion;
        case CLEAN_TRASH:
            (_l = trash.pages) === null || _l === void 0 ? void 0 : _l.splice(pageIndex, 1);
            (_m = trash.pagesId) === null || _m === void 0 ? void 0 : _m.splice(pageIndex, 1);
            var cleanedTrash = {
                pages: ((_o = trash.pages) === null || _o === void 0 ? void 0 : _o[0]) !== undefined ?
                    trash.pages : null,
                pagesId: ((_p = trash.pagesId) === null || _p === void 0 ? void 0 : _p[0]) !== undefined ?
                    trash.pagesId : null
            };
            console.log("clean trash", cleanedTrash);
            return __assign(__assign({}, state), { trash: cleanedTrash });
        default:
            return state;
    }
}
exports["default"] = notion;
;
